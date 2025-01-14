import { useState } from 'react';
import { FolderNameInput } from './FolderNameInput';
import { CloneButton } from './CloneButton';
import { FileExtensionsInput } from './FileExtensionsInput';

function App() {
  const [sourceFolder, setSourceFolder] = useState('');
  const [outputFolder, setOutputFolder] = useState('');
  const [fileExtensions, setFileExtensions] = useState<string[]>([]);
  return (
    <div className="flex flex-col gap-4 w-full">
      <FolderNameInput value={sourceFolder} onChange={setSourceFolder} placeholder="Enter the path to the folder you want to clone..." />
      <FolderNameInput value={outputFolder} onChange={setOutputFolder} placeholder="Enter the path to the folder you want to clone to..." />
      <FileExtensionsInput fileExtensions={fileExtensions} setFileExtensions={setFileExtensions} />
      <CloneButton sourceFolderPath={sourceFolder} outputFolderPath={outputFolder} fileExtensions={fileExtensions} />
    </div>
  );
}

export default App;
