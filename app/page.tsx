"use client";
import {
  BookmarkFilledIcon,
  GlobeIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons";
import {
  BrainCircuit,
  CloudUpload,
  EyeIcon,
  MonitorSmartphoneIcon,
} from "lucide-react";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import "./globals.css";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    name: "Store your PDF Documents",
    description: "Securely store and access your PDFs anytime, anywhere.",
    icon: GlobeIcon,
  },
  {
    name: "Blazing Fast Responses",
    description:
      "Experience incredibly fast aswers t your quiries, ensuring you get the information you need instantly.",
    icon: LightningBoltIcon,
  },

  {
    name: "Chat Memorisation",
    description:
      "Our intelligent chatbot remembers previous interactipons, provviding a seamless and personalized experience. Be assured it will stay incontext always!",
    icon: BookmarkFilledIcon,
  },

  {
    name: "Interactive PDF Viewer",
    description:
      "Engage with your pdfs like never before using intuitive and interactive viewer.",
    icon: EyeIcon,
  },

  {
    name: "AI Powered Chatbot",
    description:
      "Our AI-powered chatbot is here to assist you with any questions or tasks you may have.",
    icon: BrainCircuit,
  },

  {
    name: "Cloud Backup",
    description:
      "Best assured knowing your documents are safely backed up on the cloud, protected form loss or damage",
    icon: CloudUpload,
  },

  {
    name: "Responsive Across Devices",
    desription:
      "Enjoy a seamless experience with optimized performance and layout on all your devices, from desktops to mobile phones.",
    MonitorSmartphoneIcon,
  },
];

export default function Home() {
  const [text] = useTypewriter({
    words: ["Engage and Convert:"],
    loop: false,
    delaySpeed: 2000,
  });

  return (
    <main className="flex-1 overflow-scroll p-2 lg:p-5 bg-gradient-to-bl from-white to-fuchsia-600">
      <div className="bg-white py-24 sm:py-32 rounded-md drop-shadow-xl">
        <div className="flex flex-col justify-center items-center mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-purple-600">
              Your Interactive Document Buddy
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-800 sm:text-6xl">
              <span>
                {text}
                <Cursor cursorColor="purple" />
              </span>{" "}
              <br /> Turn Your PDFs into Dynamic{" "}
              <span className="bg-gradient-to-r from-fuchsia-600 via-pink-500 to-orange-500 bg-clip-text text-transparent underline decoration-solid decoration-2">
                Dialogues.
              </span>
            </p>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Introducing{" "}
              <span className="font-bold text-fuchsia-600">Chat with PDF.</span>
              <br />
              <br />
              Upload your document, and your chatbot will answer questions,
              summarise content, and answer all your Qs. Ideal for everyone,{" "}
              <span className="text-fuchsia-600"> Chat wit PDF</span> turns
              static documents into {""}
              <span className="font-bold">dynamic conversations</span>,
              enhancing productivity 10x fold effortlessly.
            </p>
          </div>

          <div className="flex justify-center">
            <Button asChild className="mt-10">
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
          </div>

        <div className="relative overflow-hidden pt-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Image
              alt="App Screenshot"
              src="https://i.imgur.com/VciRSTI.jpeg"
              width={2432}
              height={1442}
              className="mb-[-0%] rounded-xl shadow-2xl ring-1 ring-slate-900/10"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
