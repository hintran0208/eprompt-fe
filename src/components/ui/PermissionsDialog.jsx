import { useEffect, useState } from 'react';
import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/plugin-shell';
import Card from './Card';
import Button from './Button';

export function PermissionsDialog() {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogData, setDialogData] = useState({
    title: "Accessibility Permissions Required",
    message: "This app requires Accessibility permissions to simulate keyboard input for global shortcuts."
  });

  useEffect(() => {
    // Listen for the accessibility permissions event from Rust
    const unlisten = listen('accessibility-permission-required', (event) => {
      const { payload } = event;
      setDialogData(currentData => ({
        title: payload.title || currentData.title,
        message: payload.message || currentData.message
      }));
      setShowDialog(true);
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, []);

  const openSystemPreferences = async () => {
    // On macOS, try to open the Accessibility preferences directly
    await open('x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility');
  };

  if (!showDialog) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">{dialogData.title}</h2>
        <p className="mb-4">
          {dialogData.message}
        </p>
        <p className="mb-4">
          Please go to System Preferences &gt; Security &amp; Privacy &gt; Privacy &gt; Accessibility
          and enable this app to allow keyboard simulation.
        </p>
        <div className="flex justify-end space-x-4">
          <Button onClick={openSystemPreferences}>
            Open System Preferences
          </Button>
          <Button onClick={() => setShowDialog(false)}>
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}
