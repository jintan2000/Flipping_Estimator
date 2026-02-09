
import { GoogleGenAI, Type } from "@google/genai";
import { PropertyDetails, EstimateCategory } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIAnalysis = async (property: PropertyDetails, categories: EstimateCategory[]) => {
  const totalCost = categories.reduce((acc, cat) => 
    acc + cat.items.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0)
  , 0);

  const prompt = `
    Analyze this property investment opportunity:
    Property: ${property.address}
    Year Built: ${property.yearBuilt}
    Type: ${property.type}
    SqFt: ${property.sqft}
    Estimated After Repair Value (ARV): ${property.estimatedARV}
    Current Estimated Renovation Cost: $${totalCost.toLocaleString()}

    Provide a concise summary including:
    1. Potential red flags for this age of property.
    2. ROI suggestion (is the renovation budget reasonable compared to ARV?).
    3. Three missing renovation items commonly needed for this property type.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return "Unable to generate AI analysis at this time. Please check your property details and try again.";
  }
};
