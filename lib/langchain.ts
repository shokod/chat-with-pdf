import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "../firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

// Initialize the Open aI model with API key and model name

const model = new ChatOpenAI({
  modelName: "gpt-3.5",
  apiKey: process.env.OPENAI_API_KEY,
});

export const indexName = "delvin";

async function fetchMessagesFromDB(docId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found!");
  }

  console.log(
    "--- Fetching chat history from the the firestore database...---"
  );

  // Get the last 6 messages from the chat history
  // const LIMIT = 10;
  const chats = await adminDb
    .collection(`users`)
    .doc(userId)
    .collection("files")
    .doc(docId)
    .collection("chat")
    .orderBy("createdAt", "desc")
    //.limit(LIMIT)
    .get();

    const chatHistory = chats.docs.map((doc) =>
      doc.data().role === "human"
        ? new HumanMessage(doc.data().message)
        : new AIMessage(doc.data().message)
    );

    console.log (
      `---- fetched last ${chatHistory.length} messages successfully ---`
    );

    console.log(chatHistory.map((msg) => msg.content.toString()));

    return chatHistory;
}

export async function generateDocs(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found!");
  }

  console.log("---Fetching the download url from Firebase...---");

  const firebaseRef = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();

  const downloadUrl = firebaseRef.data()?.downloadUrl;

  if (!downloadUrl) {
    throw new Error("Download url not found!");
  }

  console.log(`---Download url fetched successfully: ${downloadUrl} ---`);

  // fetch the pdf from specified url
  const response = await fetch(downloadUrl);

  // load pdf into a pdf document object
  const data = await response.blob();

  // load pdf document from the specified path
  console.log("---Loading PDF document...----");
  const loader = new PDFLoader(data);
  const docs = await loader.load();

  // split the document inro smaller parts for pocessing
  console.log("---Splitting the document into smaller parts... ---");
  const splitter = new RecursiveCharacterTextSplitter();

  const splitDocs = await splitter.splitDocuments(docs);
  console.log(`---Document split into ${splitDocs.length} parts---`);

  return splitDocs;
}

async function namespaceExists(
  index: Index<RecordMetadata>,
  namespace: string
) {
  if (namespace === null) throw new Error("No namespace value provided.");
  const { namespaces } = await index.describeIndexStats();
  return namespaces?.[namespace] !== undefined;
}

export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found!");
  }

  let pineconeVectoreStore;

  // Generate embbeddingds  for split documents
  console.log("---Generating embeddings...---");
  const embeddings = new OpenAIEmbeddings();

  const index = await pineconeClient.index(indexName);
  const namespaceAlreadyExists = await namespaceExists(index, docId);

  if (namespaceAlreadyExists) {
    console.log(
      `--- Namespace ${docId}  already exists, using existing embeddings... ---`
    );

    pineconeVectoreStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });

    return pineconeVectoreStore;
  } else {
    // if namespace doesnt exist download pdf from the firestore via stored downlad url and generate the embeddingd and store them in the pinecone vector store

    const splitDocs = await generateDocs(docId);

    console.log(
      `--- Storing the embeddings in namespace ${docId} in the ${indexName} Pinecone vectore store...---`
    );

    pineconeVectoreStore = await PineconeStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        pineconeIndex: index,
        namespace: docId,
      }
    );

    return pineconeVectoreStore;
  }
}

const generateLangchainCompletion = async (docId: string) => {
  let pineconeVectorStore;

  pineconeVectorStore = await generateEmbeddingsInPineconeVectorStore(docId);
  if (!pineconeVectorStore) {
    throw new Error("Pinecone vector store not found!");
  }

  // create a retriever to search through the vector store

  console.log("---Creating a retriever... ---");
  const retriever = pineconeVectorStore.asRetriever();

  // Fetch the chat history from the database
  const chatHistory = await fetchMessagesFromDB(docId);

  // Define a prompt tepmte for generating search queries based on conversation history
  console.log("--- Defining a prompt template... ---");

  const historyAwarePrompt = ChatPromptTemplate.fromMessages([
    ...chatHistory, // Insert the actual chat history here
    ["user", "{input}"],
    [
      "user",
      "Given the above coversation, generate a search query to look uo in order to get information relevant to the conversation",
    ],
  ]);
};
