"use client";

import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  CheckCircleIcon,
  CircleArrowDown,
  HammerIcon,
  Loader,
  Loader2,
  RocketIcon,
  SaveIcon,
  UploadIcon,
} from "lucide-react";
import useUpload, { StatusText } from "@/hooks/useUpload";
import { useRouter } from "next/navigation";

function FileUploader() {
  const { progress, status, fileId, handleUpload } = useUpload();
  const router = useRouter();

  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Do something with the accepted files
    // console.log(acceptedFiles);

    const file = acceptedFiles[0];

    if (file) {
      await handleUpload(file);
    } else {
      // do nothing
      // toast...
    }
  }, []);

  const statusIcons: {
    [key in StatusText]: JSX.Element;
  } = {
    [StatusText.Uploading]: (
      <RocketIcon className="h-20 w-20 text-fuchsia-600" />
    ),
    [StatusText.Uploaded]: (
      <CheckCircleIcon className="h-20 w-20 text-fuchsia-600" />
    ),
    [StatusText.Saving]: <SaveIcon className="h-20 w-20 text-fuchsia-600" />,

    [StatusText.Generating]: <Loader className="h-20 w-20 text-fuchsia-600" />,
  };

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      accept: {
        "application/pdf": [".pdf"],
      },
    });

  const uploadInProgress = progress != null && progress >= 0 && progress <= 100;

  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
      {/* Loading... */}

      {uploadInProgress && (
        <div className="mt-32 flex flex-col justify-center items-center gap-5">
          <div
            className={`radial-progress bg-fuchsia-300 text-white border-fuchsia-600 border-4 ${
              progress === 100 && "hidden"
            }`}
            role="progressbar"
            style={{
              //@ts-ignore
              "--value": progress,
              "--size": "12rem",
              "--thickness": "1.3rem",
            }}
          >
            {progress} %
          </div>

          {/* Render Status Icon */}

          {
            //@ts-ignore
            statusIcons[status!]
          }

          <p className="text-fuchsia-600 animate-pulse">{status as string}</p>
        </div>
      )}

      {!uploadInProgress && (
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
              <CircleArrowDown className="h-20 w-20 animate-bounce" />
              <p>
                Drag &apos;N&apos; Drop some files here, or click to select
                files
              </p>
            </>
          )}
        </div>
      </div>)}
    </div>
  );
}

export default FileUploader;
