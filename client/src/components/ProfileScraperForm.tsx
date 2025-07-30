"use client";

import { useState } from "react";

interface Profile {
  name: string;
  headline: string;
  location: string;
  connections: string;
}

export default function ProfileScraperForm() {
  const [url, setUrl] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setProfile(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/scrape?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100 mt-8">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">Scrape LinkedIn Profile</h2>
      <form onSubmit={handleScrape} className="flex gap-3 mb-4">
        <input
          type="url"
          className="flex-grow px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste LinkedIn profile URL..."
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-800"
          disabled={loading}
        >
          {loading ? "Scraping..." : "Scrape"}
        </button>
      </form>
      {error && <p className="text-red-600 text-sm">Error: {error}</p>}
      {profile && (
        <div className="mt-4 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-700 mb-2">Scraped Profile:</h3>
          <div className="space-y-1">
            <div><span className="font-medium">Name:</span> {profile.name}</div>
            <div><span className="font-medium">Headline:</span> {profile.headline}</div>
            <div><span className="font-medium">Location:</span> {profile.location}</div>
            <div><span className="font-medium">Connections:</span> {profile.connections}</div>
          </div>
        </div>
      )}
    </div>
  );
}
