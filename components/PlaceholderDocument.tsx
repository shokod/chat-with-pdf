"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { PlusCircleIcon } from "lucide-react";

function PlaceholderDocument() {
  const router = useRouter();

  const handleClick = () => {
    // Check if user is free tier and i f they are over  the file upload limit, push to upgrade page
    router.push("/dashboard/upload");
  };
  return (
    <Button
      onClick={handleClick}
      className="flex flex-col items-center w-64 h-80 rounded-xl bg-slate-200 drop-shadow-md text-slate-400"
    >
      <PlusCircleIcon className="h-16 w-16" />
      <p>Add a document</p>
    </Button>
  );
}

export default PlaceholderDocument;
