import { FC, useState } from 'react';
import { copyFile, exists, mkdir, readDir } from '@tauri-apps/plugin-fs';
import { join } from '@tauri-apps/api/path';

interface CloneButtonProps {
  sourceFolderPath: string;
  outputFolderPath: string;
  fileExtensions: string[];
}

export const CloneButton: FC<CloneButtonProps> = ({ sourceFolderPath, outputFolderPath, fileExtensions }) => {
  const [cloning, setCloning] = useState(false);
  const [numCloned, setNumCloned] = useState<number>(0);
  const [error, setError] = useState('');
  const handleClone = async () => {
    setCloning(true);
    setNumCloned(0);
    await exists(outputFolderPath).then(exists => {
      if (!exists) throw new Error('Output folder does not exist');
    });
    await readDir(outputFolderPath).then(files => {
      if (files.filter(file => file.name !== '.DS_Store').length > 0) throw new Error('Output folder is not empty');
    });

    (document.getElementById('my_modal_1') as HTMLDialogElement).showModal();
    try {
      await cloneDir({ sourceFolderPath, outputFolderPath, extToClone: new Set(fileExtensions) });
    } catch (error) {
      setError((error as Error).message);
    }
    setCloning(false);
  };

  return (
    <>
      <button className="btn btn-accent" onClick={handleClone}>
        Clone
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box flex flex-col gap-12 justify-center items-center p-8">
          <h3 className="font-bold text-lg">{cloning ? 'Cloning Files...' : 'Files Cloned'}</h3>
          <div className="text-center p-4 w-full flex-1 overflow-auto font-bold">Files Cloned: {numCloned}</div>
          {cloning ? (
            <div className="flex flex-col gap-4 p-4 max-w-full items-center justify-center flex-1 max-h-full overflow-hidden">
              <span className="loading loading-ring loading-lg"></span>
              {error && <div className="text-center p-4 w-full flex-1 overflow-auto text-error">{error}</div>}
            </div>
          ) : (
            <div className="modal-action m-0">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-accent">Close</button>
              </form>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
};

const cloneDir = async ({ sourceFolderPath, outputFolderPath, extToClone, onCloneCallback }: { sourceFolderPath: string; outputFolderPath: string; extToClone?: Set<string>; onCloneCallback?: () => void }) => {
  const files = await readDir(sourceFolderPath);
  const filePromises = files.map(async file => {
    if (file.name === '.DS_Store') {
      return;
    } else if (file.isDirectory) {
      await mkdir(await join(outputFolderPath, file.name));
      await cloneDir({ sourceFolderPath: await join(sourceFolderPath, file.name), outputFolderPath: await join(outputFolderPath, file.name), extToClone });
    } else {
      if (!extToClone || extToClone?.has(file.name.split('.').pop() || '')) {
        const sourceFile = await join(sourceFolderPath, file.name);
        const outputFile = await join(outputFolderPath, file.name);
        await copyFile(sourceFile, outputFile);
        if (onCloneCallback) onCloneCallback();
      }
    }
  });

  await Promise.all(filePromises);
};
