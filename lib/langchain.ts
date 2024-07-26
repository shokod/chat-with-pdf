// Initialize the Open aI model with API key and model name

const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    apiKey: process.env.OPENAI_API_KEY,
  }
)