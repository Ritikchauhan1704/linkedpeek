"use client";

import { Message } from "@/types";
import { useState } from "react";
import KeywordsCard from "./KeywordsCard";

export default function KeywordsForm() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: keyword.trim() },
    ]);
    setKeyword("");
  };

  const postToBackend = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages }),
        }
      );
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      console.log("Response from backend:", data);
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to post:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6 border border-blue-100">
        <h1 className="text-2xl font-semibold text-gray-800">LinkedIn Keyword Scraper</h1>
        <p className="text-sm text-gray-500">Enter keywords and scrape LinkedIn posts that match them.</p>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            className="flex-grow px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Type a keyword..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-800"
          >
            Add
          </button>
        </form>

        <button
          onClick={postToBackend}
          disabled={isLoading}
          className="w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-teal-400 focus:ring-2 focus:ring-teal-800"
        >
          {isLoading ? "Posting..." : "Post to Backend"}
        </button>

        {error && <p className="text-red-600 text-sm text-center">Error: {error}</p>}

        {messages.length > 0 && (
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-2">Your Keywords</h2>
            <KeywordsCard messages={messages} setMessages={setMessages} />
          </div>
        )}
      </div>
    </div>
  );
}
