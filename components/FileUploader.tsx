"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  CheckCircleIcon,
  CircleArrowDown,
  HammerIcon,
  RocketIcon,
  SaveIcon,
  UploadIcon,
} from "lucide-react";

function FileUploader() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the accepted files
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
    useDropzone({
      onDrop,
    });

  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
      {/* Loading... */}
      <div
        {...getRootProps()}
        className={`p-10 border-2 border-dashed mt-10 w-[90%] border-fuchsia-300 text-fuchsia-700 rounded-lg flex items-center justify-center ${
          isFocused || isDragAccept ? "bg-fuchsia-200" : "bg-fuchsia-100"
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center">
          {isDragActive ? (
            <>
              <RocketIcon className="h-20 w-20 animate-ping" />
              <p>Drop the files here ...</p>
            </>
          ) : (
            <>
            <CircleArrowDown className="h-20 w-20 animate-bounce"/>
              <p>
                Drag &apos;N&apos; Drop some files here, or click to select
                files
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileUploader;
