"use client";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Divide,
  Loader2,
  RotateCw,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PdfView({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [file, setFile] = useState<Blob | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const fetchFile = async () => {
      const response = await fetch(url);
      const file = await response.blob();

      setFile(file);
    };

    fetchFile();
  }, [url]);

  const onDocumentLoadSucess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
  };

  return (
    <div>
        {!file ? (
            <Loader2 className="animate-spin h-20 w-20 text-fuchsia-600 mt-20"/>

        ) : (
      <Document
        loading={null}
        file={file}
        rotate={rotation}
        onLoadSuccess={onDocumentLoadSucess}
        className="m-4 overflow-scroll"
      >
        <Page className="shadow-lg" scale={scale} pageNumber={pageNumber} />
        
      </Document>
        )}
    </div>
  );
}

export default PdfView;
