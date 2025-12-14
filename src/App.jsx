import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DropZone from './components/DropZone';
import CodePreview from './components/CodePreview';

function App() {
  const [file, setFile] = useState(null);
  const [settings, setSettings] = useState({
    outputType: 'react',
    styling: 'tailwind',
    responsiveness: 'mobile',
    framework: 'plain',
    components: 'single',
    darkMode: true,
    apiKey: ''
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    // Simulate processing
    // console.log("Processing file:", selectedFile.name); // Removed as per instruction
  };

  const handleReset = () => {
    setFile(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <Header onReset={handleReset} />
      <div className="flex">
        <Sidebar settings={settings} updateSetting={updateSetting} />
        <main className="flex-1 p-6 relative h-[calc(100vh-4rem)] overflow-hidden">
          <div className="max-w-5xl mx-auto h-full flex flex-col">
            {!file && (
              <div className="text-center py-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                <h2 className="text-3xl font-bold tracking-tight mb-2">Convert Screenshots to Code</h2>
                <p className="text-muted-foreground">Drag and drop your screenshot to generate production-ready code instantly.</p>
              </div>
            )}

            <div className="flex-1 flex items-center justify-center min-h-0 pb-8">
              {file ? (
                <CodePreview image={file} apiKey={settings.apiKey} />
              ) : (
                <DropZone onFileSelect={handleFileSelect} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
