import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [messages, setMessages] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;


  // 🔹 Fetch all past logs on mount
  useEffect(() => {
    // fetch("http://localhost:3000/api/tasks")
    fetch(`${API_URL}/api/tasks`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error fetching logs:", err));
  }, []);

  // 🔹 Handle new user message
  const handleSend = async () => {
    if (!task.trim()) return;

    const newMsg = { task };
    setMessages((prev) => [...prev, { task, result: "Thinking..." }]); // temporary placeholder

    try {
      const res = await fetch("http://localhost:3000/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });

      setTimeout(async () => {
        const data = await res.json();
        setMessages((prev) => [...prev.slice(0, -1), data]); // replace last message with real response
        setTask("");
      }, 1000);
    } catch (err) {
      console.error("Error sending task:", err);
    }
  };

  return (
    <div className="relative h-screen flex flex-col justify-between">
      <div className="py-10 lg:py-14 overflow-y-auto px-4 sm:px-6 lg:px-8 max-h-[80vh]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl ">
            Welcome to AI Assistant
          </h1>
          <p className="mt-3 text-gray-600 ">
            Your AI-powered assistant for all your questions.
          </p>
        </div>

        <ul className="mt-10 space-y-6 max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages yet...</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="space-y-4">
                {/* User message */}
                <li className="flex gap-x-3">
                  <span className="shrink-0 inline-flex items-center justify-center size-9.5 rounded-full bg-gray-600">
                    <span className="text-sm font-medium text-white">You</span>
                  </span>
                  <p className="bg-gray-100  p-3 rounded-lg text-gray-800 ">
                    {msg.task}
                  </p>
                </li>

                {/* AI response */}
                <li className="flex gap-x-3">
                  <span className="shrink-0 inline-flex items-center justify-center size-9.5 rounded-full bg-blue-600">
                    <span className="text-sm font-medium text-white">AI</span>
                  </span>
                  <p className="bg-blue-50 p-3 rounded-lg text-gray-800 ">
                    {msg.result || "Thinking..."}
                  </p>
                </li>
              </div>
            ))
          )}
        </ul>
      </div>

      {/* Input section */}
      <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 pt-2 pb-3 ">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Ask me anything..."
              className="p-4 mb-4 resize-none block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 outline-0 focus:ring-blue-500 "
              rows="3"
            ></textarea>

            <div className="absolute bottom-2 right-2">
              <button
                onClick={handleSend}
                type="button"
                className="inline-flex justify-center items-center px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:outline-none"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                </svg>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
