"use server";

import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function generateEmbeddings(docId: string) {
  auth().protect(); // Protect route from unauhtorized users

  // Turn a PDF into embeddings i.e a string of numbers [0.022454535, 0.3455353]
  await generateEmbeddingsInPineconeVectorStore(docId);

  revalidatePath("/dashbaord");

  return { completed: true };
}
