import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { NicheData } from "./types/NicheData";
import KNichDashboard from "./dashboard";
import AppLoader from "@/shared/components/Loader";
import { z } from "zod";

const GEMINI_API_KEY = "AIzaSyC3kbeRnjbsxZEqDA9uqRUeIs87e5Bv0SA";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const FindNicheApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<"landing" | "dashboard">(
    "landing"
  );
  const [input, setInput] = useState("");
  const [nicheData, setNicheData] = useState<NicheData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBackToLanding = () => {
    setCurrentPage("landing");
  };

  const handleBrainstorm = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const prompt = `You're an AI assistant helping to discover niche market ideas for building businesses.

I want you to return structured data in the following JSON format ONLY:

{
  "nodes": [
    {
      "id": "<GUID>",
      "label": "<title>",
      "type": "idea" | "niche" | "subniche" | "micro",
      "metadata": {
        "description": "<short description>",
        "tags": ["tag1", "tag2"],
        "createdAt": "<ISO Date>",
        "updatedAt": "<ISO Date>",
        "isNew": true,
        "isDeleted": false
      },
      "snapshotVersion": 1,
      "parentId": "<GUID | null>"
    }
  ],
  "edges": [
    {
      "id": "<GUID>",
      "source": "<GUID of parent node>",
      "target": "<GUID of child node>",
      "metadata": {
        "createdAt": "<ISO Date>",
        "updatedAt": "<ISO Date>",
        "isNew": true,
        "isDeleted": false
      },
      "snapshotVersion": 1
    }
  ]
}

Use crypto.randomUUID()-like strings for ids or mock GUIDs. Build the hierarchy: idea → niche → subniche → micro-niche. Do not explain anything. Just return JSON.

User Idea: "${input}"`;

    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      const text = result.text ?? "";

      if (!text) throw new Error("No response from Gemini");

      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}") + 1;
      const rawJson = text.slice(jsonStart, jsonEnd);

      const parsed: NicheData = JSON.parse(rawJson);
      const NodeSchema = z.object({
        id: z.string(),
        label: z.string(),
        type: z.enum(["idea", "niche", "subniche", "micro"]),
        metadata: z.object({
          description: z.string(),
          tags: z.array(z.string()),
          createdAt: z.string().refine(Date.parse),
          updatedAt: z.string().refine(Date.parse),
          isNew: z.boolean(),
          isDeleted: z.boolean(),
        }),
        snapshotVersion: z.number(),
        parentId: z.string().nullable(),
      });

      const EdgeSchema = z.object({
        id: z.string(),
        source: z.string(),
        target: z.string(),
        metadata: z.object({
          createdAt: z.string().refine(Date.parse),
          updatedAt: z.string().refine(Date.parse),
          isNew: z.boolean(),
          isDeleted: z.boolean(),
        }),
        snapshotVersion: z.number(),
      });

      const NicheDataSchema = z.object({
        nodes: z.array(NodeSchema),
        edges: z.array(EdgeSchema),
      });

      const validated = NicheDataSchema.parse(parsed);
      setNicheData(validated);
      setCurrentPage("dashboard");
    } catch (err) {
      console.error("AI Error:", err);
      alert("Failed to generate niche data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {currentPage === "landing" ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-6xl font-bold mb-6">
                Where <span className="text-green-500">ideas and niching</span>
                <br />
                <span className="text-black">come together.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                Empower your creativity to niche down better and faster with
                intelligent branching
              </p>

              {/* Input Section */}
              <div className="relative max-w-3xl mx-auto w-full p-[2px] bg-gradient-to-r from-pink-500 via-yellow-500 to-purple-500 rounded-full">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleBrainstorm()}
                  placeholder="Describe your challenge or idea..."
                  className="w-full px-8 py-4 text-lg rounded-full border-none outline-none text-black shadow-md"
                />
                <button
                  onClick={handleBrainstorm}
                  disabled={!input.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 disabled:opacity-50"
                >
                  Brainstorm ✨
                </button>
              </div>

              {loading && <AppLoader />}

              <div className="mt-16 text-sm text-gray-500">
                <p>
                  ✨ AI-powered niche discovery • 🌳 Visual tree mapping • 📊
                  Competitive analysis
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {nicheData ? (
            <KNichDashboard
              initialData={nicheData}
              onBack={handleBackToLanding}
            />
          ) : (
            <>Loading...</>
          )}
        </>
      )}
    </div>
  );
};
