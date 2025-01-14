import React, { FC, useRef } from 'react';

interface FileExtensionsInputProps {
  fileExtensions: string[];
  setFileExtensions: (fileExtensions: string[]) => void;
}
export const FileExtensionsInput: FC<FileExtensionsInputProps> = ({ fileExtensions, setFileExtensions }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const value = inputRef.current?.value;
    if (!value) return;
    const newExtensions = value
      .split(',')
      .map(ext => ext.trim().toLowerCase())
      .filter(ext => !fileExtensions.includes(ext));

    if (newExtensions.length < 1) return;

    setFileExtensions([...fileExtensions, ...newExtensions]);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <input className="input input-bordered" type="text" placeholder="Enter file extensions and press enter to save. ex - esp, txt, ini, esl, esm" onKeyDown={handleKeyPress} ref={inputRef} />
      {fileExtensions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {fileExtensions.map(ext => (
            <FileExtensionChips key={ext} extension={ext} onDelete={() => setFileExtensions(fileExtensions.filter(e => e !== ext))} />
          ))}
        </div>
      )}
    </div>
  );
};

interface FileExtensionChipProps {
  extension: string;
  onDelete: () => void;
}
const FileExtensionChips: FC<FileExtensionChipProps> = ({ extension, onDelete }) => {
  return (
    <div className="badge badge-info rounded-md" onClick={onDelete}>
      {extension}
    </div>
  );
};
