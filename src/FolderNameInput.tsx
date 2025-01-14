import { FC, useRef } from 'react';
import { open } from '@tauri-apps/plugin-dialog';

interface FolderNameInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
export const FolderNameInput: FC<FolderNameInputProps> = ({ value, onChange, placeholder }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const openDialog = async () => {
    const path = await open({ directory: true });
    if (path) {
      onChange(path);
      if (inputRef.current) inputRef.current.value = path;
    }
  };
  return (
    <div className="join w-full">
      <input className="input input-bordered join-item w-full" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} ref={inputRef} />
      <button className="btn join-item rounded-md btn-primary" onClick={openDialog}>
        Browse
      </button>
    </div>
  );
};
