import PdfView from "@/components/PdfView";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

async function ChatToFilePage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  auth().protect();
  const { userId } = await auth();
  const ref = await adminDb
    .collection("users")
    .doc(userId!)
    .collection("chats")
    .doc(id)
    .get();

  const url = ref.data()?.downloadURL;

  return (
    <div className=" grid lg:grid-cols-5 h-full overflow-hidden">
      {/* Right */}
      <div className="lg:col-span-2 overflow-y-auto">{/* chat */}</div>

      {/* Left */}

      <div className=" col-span-5 lg:col-span-3 bg-slate-100 border-r-2 lg:border-fuchsia-600 lg:-order-1 overflow-auto">{/* Pdf view */}
        <PdfView url={url} />
      </div>
    </div>
  );
}

export default ChatToFilePage;
