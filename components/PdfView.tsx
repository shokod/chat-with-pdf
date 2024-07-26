"use client"

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Loader2, RotateCw, ZoomInIcon, ZoomOutIcon } from "lucide-react";





function PdfView( { url }: {url: string }) {
  return <div>PdfView</div>;
}

export default PdfView;
