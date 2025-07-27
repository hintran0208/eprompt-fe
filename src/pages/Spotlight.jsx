import { useState } from 'react';
import SemanticSearch from '../components/SemanticSearch';
import TemplateLibrary from '../components/TemplateLibrary';
import Playground from '../components/Playground';
import PromptVault from '../components/PromptVault';
import { usePlaygroundStore } from '../store/playgroundStore';
import { Button } from '../components/ui';
// import '../style/spotlight.css';
// import { invoke } from '@tauri-apps/api/core';

const Spotlight = () => {
  // invoke('my_custom_command');
  // const [currentView, setCurrentView] = useState('templates');

  return (
    <div className="min-h-screen bg-transparent p-100">
      {/* <SemanticSearch setCurrentView={setCurrentView} isSpotlight={true} /> */}
      <SemanticSearch setCurrentView={() => { }} isSpotlight={true} />
    </div>
  );
};

export default Spotlight;
