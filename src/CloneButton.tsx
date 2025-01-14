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
  const handleClone = async () => {
    setCloning(true);
    await exists(outputFolderPath).then(exists => {
      if (!exists) throw new Error('Output folder does not exist');
    });
    await readDir(outputFolderPath).then(files => {
      if (files.filter(file => file.name !== '.DS_Store').length > 0) throw new Error('Output folder is not empty');
    });

    (document.getElementById('my_modal_1') as HTMLDialogElement).showModal();
    await cloneDir(sourceFolderPath, outputFolderPath, new Set(fileExtensions));

    setCloning(false);
    console.log('SHOULD BE ALL DONE HERE');
  };

  const cloneDir = async (sourceFolderPath: string, outputFolderPath: string, extToClone?: Set<string>) => {
    const files = await readDir(sourceFolderPath);
    const filePromises = files.map(async file => {
      if (file.name === '.DS_Store') {
        return;
      } else if (file.isDirectory) {
        await mkdir(await join(outputFolderPath, file.name));
        await cloneDir(await join(sourceFolderPath, file.name), await join(outputFolderPath, file.name), extToClone);
      } else {
        if (!extToClone || extToClone?.has(file.name.split('.').pop() || '')) {
          await copyFile(await join(sourceFolderPath, file.name), await join(outputFolderPath, file.name));
        }
      }
    });

    await Promise.all(filePromises);
  };
  return (
    <>
      <button className="btn btn-accent" onClick={handleClone}>
        Clone
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box flex flex-col gap-12 justify-center items-center p-8">
          <h3 className="font-bold text-lg">{cloning ? 'Cloning Files...' : 'Files Cloned'}</h3>
          {cloning ? (
            <span className="loading loading-ring loading-lg"></span>
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
