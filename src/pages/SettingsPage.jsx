import { useState } from "react";
import useUserStore from "../store/userStore";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const SettingsPage = () => {
  const { user, theme, preferences, updateUser, toggleTheme, updatePreferences } = useUserStore();

  // Local state for form data
  const [userForm, setUserForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [preferencesForm, setPreferencesForm] = useState({
    defaultCategory: preferences.defaultCategory,
    sortBy: preferences.sortBy,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      updateUser(userForm);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesUpdate = (e) => {
    e.preventDefault();
    updatePreferences(preferencesForm);
    setSuccessMessage("Preferences updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleExportData = () => {
    // In a real app, this would export user data
    const dataStr = JSON.stringify({ user, preferences }, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "eprompt-data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (data.user) updateUser(data.user);
          if (data.preferences) updatePreferences(data.preferences);
          setSuccessMessage("Data imported successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
          alert("Invalid file format");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
      </div>

      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      <div className="space-y-8">
        {/* Profile Settings */}
        <Card
          header={
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
              <p className="text-sm text-gray-600">Update your personal information</p>
            </div>
          }
        >
          <form onSubmit={handleUserUpdate} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                placeholder="Enter your full name"
              />
              <Input
                label="Email"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Appearance Settings */}
        <Card
          header={
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
              <p className="text-sm text-gray-600">Customize how the app looks and feels</p>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Theme</label>
                <p className="text-sm text-gray-600">Choose your preferred theme</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Light</span>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    theme === "dark" ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      theme === "dark" ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-600">Dark</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Application Preferences */}
        <Card
          header={
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Application Preferences</h2>
              <p className="text-sm text-gray-600">Configure default application behavior</p>
            </div>
          }
        >
          <form onSubmit={handlePreferencesUpdate} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Category
                </label>
                <select
                  value={preferencesForm.defaultCategory}
                  onChange={(e) =>
                    setPreferencesForm({ ...preferencesForm, defaultCategory: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All</option>
                  <option value="Development">Development</option>
                  <option value="Communication">Communication</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Creative">Creative</option>
                  <option value="Analysis">Analysis</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Sort By
                </label>
                <select
                  value={preferencesForm.sortBy}
                  onChange={(e) =>
                    setPreferencesForm({ ...preferencesForm, sortBy: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="updatedAt">Last Updated</option>
                  <option value="createdAt">Date Created</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Save Preferences</Button>
            </div>
          </form>
        </Card>

        {/* Data Management */}
        <Card
          header={
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Data Management</h2>
              <p className="text-sm text-gray-600">Import and export your data</p>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Export Data</h3>
                <p className="text-sm text-gray-600">Download all your prompts and settings</p>
              </div>
              <Button variant="outline" onClick={handleExportData}>
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Import Data</h3>
                <p className="text-sm text-gray-600">Upload a previously exported data file</p>
              </div>
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                  id="import-file"
                />
                <label htmlFor="import-file">
                  <Button variant="outline" as="span">
                    Import
                  </Button>
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card
          header={
            <div>
              <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
              <p className="text-sm text-gray-600">Irreversible and destructive actions</p>
            </div>
          }
          className="border-red-200"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-red-900">Delete Account</h3>
                <p className="text-sm text-red-700">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button
                variant="danger"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete your account? This action cannot be undone."
                    )
                  ) {
                    alert("Account deletion would be handled here");
                  }
                }}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
