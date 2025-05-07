import { pipeline } from "@huggingface/transformers";

const API_TOKEN = "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";

export async function generateRecipe(ingredients) {
  const input = `Generate a recipe using the following ingredients: ${ingredients.join(", ")}`;

  try {
    console.log("Sending request to Hugging Face API...");
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: input }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Recipe generated successfully:", data);

    // Extract the generated text
    return data[0]?.generated_text || "No recipe generated.";
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw error;
  }
}