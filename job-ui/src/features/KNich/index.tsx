import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { NicheData } from "./types/NicheData";
import KNichDashboard from "./dashboard";
import AppLoader from "@/shared/components/Loader";
import { supabase } from "@/integrations/supabase/client";

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

  async function getNichesByTopic(topic: string): Promise<NicheData> {
    // 1. Get current Supabase session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError)
      throw new Error(`Error getting session: ${sessionError.message}`);
    if (!session) throw new Error("No active session. User must be logged in.");

    const token = session.access_token;

    // 2. Call your backend API
    const response = await fetch(
      `${"https://localhost:7296"}/idea-analysis/niches`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // attach Supabase JWT
        },
        body: JSON.stringify({ topic }),
      }
    );

    if (!response.ok) {
      const errMsg = await response.text();
      throw new Error(`Backend error: ${response.status} ${errMsg}`);
    }

    // 3. Parse backend response as NicheData
    const data = await response.json();
    return data as NicheData;
  }

  const handleBrainstorm = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const res = await getNichesByTopic(input);
      setNicheData(res);
      setCurrentPage("dashboard");
    } catch (err) {
      console.error("Streaming error:", err);
      setLoading(false);
    }
  };

  return (
    <>
      {currentPage === "landing" ? (
        <>
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
              {/* {loading && (
                <div className="mt-6">
                  <AppLoader />
                  <p className="mt-2 text-gray-500">Finding your niche...</p>
                </div>
              )} */}
              <div className="mt-16 text-sm text-gray-500">
                <p>
                  ✨ AI-powered niche discovery • 🌳 Visual tree mapping • 📊
                  Competitive analysis
                </p>
              </div>
            </div>
          </div>
        </>
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
    </>
  );
};
