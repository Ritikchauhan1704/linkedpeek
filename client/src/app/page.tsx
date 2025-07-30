import KeywordsForm from "../components/KeywordsForm";
import ProfileScraperForm from "../components/ProfileScraperForm";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 border border-blue-100">
        <h1 className="text-2xl sm:text-3xl font-semibold text-blue-800 mb-4">
          🔍 Scrape LinkedIn Posts by Keyword
        </h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Enter keywords to find recent LinkedIn posts that match. Results will be displayed below.
        </p>
        <KeywordsForm />
        <ProfileScraperForm />
      </div>
    </main>
  );
}
