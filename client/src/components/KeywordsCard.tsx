import { Message } from "@/types";
import { useState } from "react";
import { Trash2, Edit3, Save } from "lucide-react";

interface KeywordsCardProps {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

export default function KeywordsCard({ messages, setMessages }: KeywordsCardProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const handleSave = (id: string) => {
    if (editText.trim() === "") {
      setMessages(messages.filter((m) => m.id !== id));
    } else {
      setMessages(
        messages.map((message) =>
          message.id === id ? { ...message, text: editText.trim() } : message
        )
      );
    }
    setEditingId(null);
    setEditText("");
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const truncateText = (text: string, id: string) => {
    const maxLength = 7;
    return text.length > maxLength && expandedId !== id
      ? text.substring(0, maxLength)+"..."
      : text;
  };

  return (
    <div className="flex flex-wrap gap-3">
      {messages.map((message) => (
        <div
          key={message.id}
          className="relative bg-white border border-blue-200 text-gray-800 rounded-lg p-2 shadow-sm w-[18%] text-sm"
        >
          {/* Delete Icon */}
          <button
            className="absolute top-1 right-1 text-red-500 hover:text-red-700 transition"
            onClick={() => setMessages(messages.filter((m) => m.id !== message.id))}
            aria-label="Delete message"
          >
            <Trash2 size={14} />
          </button>

          {/* Edit Mode */}
          {editingId === message.id ? (
            <>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-1 border border-blue-200 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-400 text-xs text-gray-900"
                rows={2}
                placeholder="Edit message..."
              />
              <div className="flex justify-end mt-1">
                <button
                  onClick={() => handleSave(message.id)}
                  className="flex items-center gap-1 px-2 py-0.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition"
                >
                  <Save size={12} /> Save
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs leading-relaxed pr-5 break-words mb-1">
                {truncateText(message.text, message.id)}
              </p>

              {message.text.length > 7 && (
                <button
                  onClick={() => toggleExpand(message.id)}
                  className="text-[10px] text-blue-600 hover:text-blue-800 font-medium transition"
                >
                  {expandedId === message.id ? "Show less" : "Show more"}
                </button>
              )}

              <div className="flex justify-end mt-1">
                <button
                  onClick={() => handleEdit(message.id, message.text)}
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs font-medium transition"
                  aria-label="Edit message"
                >
                  <Edit3 size={12} />
                  
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
