
import { GoogleGenAI, Type } from "@google/genai";
import { LabAnalysisResult } from "../types";

export class GeminiService {
  private static ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  /**
   * Analyzes a lab report image or text using Gemini.
   * Automatically detects the type of report and validates if it's medical.
   */
  static async analyzeLabReport(
    fileData?: string, 
    mimeType?: string, 
    rawText?: string
  ): Promise<LabAnalysisResult & { isValid: boolean; detectedType?: string }> {
    
    const parts: any[] = [];
    
    if (fileData && mimeType) {
      parts.push({
        inlineData: {
          data: fileData.split(',')[1] || fileData,
          mimeType: mimeType
        }
      });
    }

    const prompt = `
      TASK: Act as a clinical lab specialist. 
      1. Analyze the provided medical document (image or text).
      2. Identify if this is a Semen Analysis, Testosterone Report, or Scrotal Ultrasound.
      3. CRITICAL: If the document is NOT a medical lab report related to these three areas, set "isValid" to false.
      4. If it IS valid, set "isValid" to true, identify the "detectedType", and extract clinical data into the required JSON structure.
      
      CONTEXT: The patient has a varicocele. Focus on markers like sperm count, motility, morphology, testosterone levels, and vein diameter (mm).
    `;

    parts.push({ text: prompt });

    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview", // Flash is excellent for multimodal extraction & speed
      contents: [{ parts }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN, description: "Whether the document is a valid medical lab report." },
            detectedType: { type: Type.STRING, description: "Type of report detected (e.g., 'Semen Analysis')." },
            riskScore: { type: Type.NUMBER, description: "Fertility risk score 1-10." },
            summary: { type: Type.STRING, description: "Plain English breakdown." },
            improvementPlan: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Clinical next steps." 
            },
            fertilityStatus: { type: Type.STRING },
            suggestions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["isValid"]
        }
      }
    });

    try {
      const result = JSON.parse(response.text || '{}');
      return result;
    } catch (e) {
      console.error("Failed to parse AI response", e);
      throw new Error("Analysis failed");
    }
  }

  /**
   * Generates a personalized diet plan.
   */
  static async generateDietPlan(userData: any): Promise<any> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a personalized diet plan for a varicocele patient. User Details: ${JSON.stringify(userData)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            breakfast: { 
              type: Type.OBJECT, 
              properties: { name: { type: Type.STRING }, calories: { type: Type.NUMBER } },
              required: ["name", "calories"]
            },
            lunch: { 
              type: Type.OBJECT, 
              properties: { name: { type: Type.STRING }, calories: { type: Type.NUMBER } },
              required: ["name", "calories"]
            },
            dinner: { 
              type: Type.OBJECT, 
              properties: { name: { type: Type.STRING }, calories: { type: Type.NUMBER } },
              required: ["name", "calories"]
            },
            snacks: { 
              type: Type.OBJECT, 
              properties: { name: { type: Type.STRING }, calories: { type: Type.NUMBER } },
              required: ["name", "calories"]
            },
            totalCalories: { type: Type.NUMBER }
          },
          required: ["breakfast", "lunch", "dinner", "snacks", "totalCalories"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  }
}
