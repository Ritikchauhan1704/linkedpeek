"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessages([...messages, keyword]);
    console.log(keyword);
    setKeyword("");
  };

  const postToBackend = () => {
    fetch("http://localhost:8080", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="border-1"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button className="border-1">enter</button>
      </form>
      <button className="border-1" onClick={postToBackend}>
        post to backend
      </button>
    </div>
  );
}
