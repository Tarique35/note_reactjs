import React, { useState, useEffect, useContext, useRef } from "react";
import Navbar from "./Navbar";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import NoteContext from "../NoteContext";
import { formatDate } from "../Small Components/Functions";
import Draggable from "react-draggable";

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialButtonValue = searchParams.get("value") || "all"; // Default to "all"
  const [activeButtons, setActiveButtons] = useState(initialButtonValue);
  const { loca, tokenName, noteToken, chatVisible, setChatVisible } =
    useContext(NoteContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [noteData, setNoteData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const nodeRef = useRef(null);
  // AI Chatbot State
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [provider, setProvider] = useState("groq"); // default to Groq

  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

  useEffect(() => {
    // Ensure the query param exists and keep local active state in sync
    if (!searchParams.has("value")) {
      setSearchParams({ value: "all" }, { replace: true });
    }
    setActiveButtons(initialButtonValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, initialButtonValue]);

  // Utility: Remove <think> ... </think> blocks
  const cleanResponse = (text) => {
    return text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
  };

  // Function for Groq Cloud
  const callGroqModel = async (currentMessages) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek-r1-distill-llama-70b",
            messages: currentMessages,
            temperature: 0.5,
            max_tokens: 1024,
            top_p: 1,
          }),
        }
      );

      const data = await response.json();
      let aiResponse = data.choices?.[0]?.message?.content || "No response";
      aiResponse = cleanResponse(aiResponse);

      setMessages((prev) => [...prev, { sender: "ai", text: "" }]);
      await streamResponse(aiResponse);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Groq API error!" },
      ]);
    } finally {
      setLoading(false);
    }
  };
  // Function for OpenRouter
  const callOpenRouterModel = async (currentMessages) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-r1-0528:free",
            messages: currentMessages,
          }),
        }
      );

      const data = await response.json();
      let aiResponse = data.choices?.[0]?.message?.content || "No response";
      aiResponse = cleanResponse(aiResponse);

      setMessages((prev) => [...prev, { sender: "ai", text: "" }]);
      await streamResponse(aiResponse);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ OpenRouter API error!" },
      ]);
    } finally {
      setLoading(false);
    }
  };
  // Send user input
  const onSend = () => {
    if (!userInput.trim()) return;

    const userMsg = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, userMsg]);

    const chatHistory = [
      ...messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })),
      { role: "user", content: userInput },
    ];

    setUserInput("");

    if (provider === "groq") {
      callGroqModel(chatHistory);
    } else {
      callOpenRouterModel(chatHistory);
    }
  };

  const handleButtons = (value) => {
    setActiveButtons(value);
    setSearchParams({ value }); // Update query parameter
  };

  const getAllNotes = async () => {
    console.log(`Bearer ${noteToken}`);

    try {
      const value = searchParams.get("value");
      if (value === "all") {
        const resp = await axios.post(
          `${loca}/all/notes`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${noteToken}`,
            },
          }
        );
        setNoteData(resp.data || []);
      } else if (value === "bookmark") {
        const resp = await axios.post(
          `${loca}/get/bookmarks`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${noteToken}`,
            },
          }
        );
        setNoteData(resp.data || []);
      }
    } catch (error) {
      console.error("error fetching notes: ", error);
      setNoteData([]);
    }
  };

  useEffect(() => {
    getAllNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const getSelectedNote = async (datas) => {
    try {
      const response = await axios.post(`${loca}/selected/note`, datas, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${noteToken}`,
        },
      });
      navigate(`/note?id=${response.data.id}`);
    } catch (error) {
      console.error("Error fetching the selected note:", error);
    }
  };

  const createNewNote = async () => {
    const body = { title: "", content: "" };
    try {
      const response = await axios.post(`${loca}/save/note`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${noteToken}`,
        },
      });
      navigate(`/note?id=${response.data.id}`);
    } catch (error) {
      console.error("Error creating a new note:", error);
    }
  };

  // Handle user input and generate AI response
  const handleUserInput = async () => {
    if (!userInput.trim()) return;

    // Add user message to chat
    const newMessage = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, newMessage]);

    const currentMessages = [
      ...messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })),
      { role: "user", content: userInput },
    ];

    setUserInput("");
    setLoading(true); // show typing animation
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization:
              "Bearer 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", // ⚠️ Don't hardcode in production
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-r1-0528:free",
            messages: currentMessages,
          }),
        }
      );

      const data = await response.json();
      const aiResponse =
        data.choices?.[0]?.message?.content || "No response from AI";

      // Add AI response to chat
      setMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Something went wrong!" },
      ]);
    } finally {
      setLoading(false); // hide typing animation
    }
  };

  // Streaming effect
  const streamResponse = async (fullText) => {
    let current = "";
    for (const char of fullText) {
      current += char;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: "ai", text: current };
        return updated;
      });
      await new Promise((r) => setTimeout(r, 15));
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 pt-10">
        {/* Top controls */}
        <div className="flex justify-between items-center mb-10">
          {/* Filter Buttons */}
          <div className="flex items-center gap-4">
            <button
              // className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
              //   activeButtons === "all"
              //     ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
              //     : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              // }`}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-main ${
                activeButtons === "all" ? "bg-90" : "bg-95"
              }`}
              onClick={() => handleButtons("all")}
            >
              <i className="fa-solid fa-layer-group"></i>
              All {activeButtons === "all" ? `(${noteData.length})` : ""}
            </button>

            <button
              // className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
              //   activeButtons === "bookmark"
              //     ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
              //     : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              // }`}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-main ${
                activeButtons === "bookmark" ? "bg-90" : "bg-95"
              }`}
              onClick={() => handleButtons("bookmark")}
            >
              <i className="fa-solid fa-bookmark"></i>
              Bookmarked
              {activeButtons === "bookmark" ? ` (${noteData.length})` : ""}
            </button>
          </div>

          {/* Add Note */}
          <button
            onClick={createNewNote}
            // className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-full shadow-lg transition-all hover:scale-105"
            className="primary rounded px-2 py-2 text-gray-50"
          >
            <i className="fa-solid fa-circle-plus"></i>
            <span className="font-medium ms-2 cursor-pointer">Add Note</span>
          </button>
        </div>

        {/* Notes list */}
        <div>
          {noteData && noteData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {noteData.map((datas, index) => (
                <div
                  key={datas.id || index}
                  onClick={() => getSelectedNote(datas)}
                  // className="relative cursor-pointer bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100"
                  className="bg-card p-6 rounded-2xl relative"
                >
                  {datas.bookmarked && (
                    <div className="absolute right-[25px] text-yellow-500">
                      <i className="fa-solid fa-thumbtack"></i>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3
                      // className="text-lg font-semibold text-gray-900 flex items-center gap-2"
                      className="title flex items-center gap-2"
                    >
                      <i className="fa-regular fa-note-sticky text-blue-500"></i>
                      {datas.title || "Untitled"}
                    </h3>
                    <p
                      // className="mt-2 text-gray-600 line-clamp-3 text-sm leading-relaxed"
                      className="sub-title"
                    >
                      {datas.content}
                    </p>
                  </div>

                  <p className="text-xs text-gray-400 flex items-center gap-1 less-text">
                    <i className="fa-regular fa-clock"></i>
                    {formatDate(datas.updatedAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-gray-500">
              <i className="fa-regular fa-clipboard text-6xl text-gray-400 mb-4"></i>
              <p className="text-lg">No notes yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Click <i className="fa-solid fa-circle-plus"></i> to add your
                first note
              </p>
            </div>
          )}
        </div>
      </div>
      {/* AI Chatbot Section */}
      {chatVisible &&
        (() => {
          return (
            <div className="fixed inset-0 z-50 pointer-events-none">
              <Draggable
                handle=".chatbot-header"
                nodeRef={nodeRef}
                bounds="parent"
                disabled={isFullScreen} // disable dragging in fullscreen
              >
                <div
                  ref={nodeRef}
                  className={`absolute ${
                    isFullScreen
                      ? "inset-0 w-full h-full"
                      : "bottom-10 right-10 w-96 h-[600px]"
                  } bg-card-withoutH p-4 rounded-lg shadow-lg flex flex-col cursor-move pointer-events-auto`}
                >
                  {/* Header with AI selection + Controls */}
                  <div className="chatbot-header flex justify-between mb-4 items-center cursor-move">
                    <select
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                      className="p-2 border rounded"
                    >
                      <option value="groq">Groq (DeepSeek Llama-70B)</option>
                      <option value="openrouter">
                        OpenRouter (DeepSeek R1 Free)
                      </option>
                    </select>

                    <div className="flex gap-3 items-center">
                      {/* Fullscreen Toggle */}
                      <button
                        onClick={() => setIsFullScreen(!isFullScreen)}
                        className="text-gray-600 hover:text-gray-800 text-xl"
                      >
                        <i
                          className={`fa-solid ${
                            isFullScreen
                              ? "fa-down-left-and-up-right-to-center"
                              : "fa-up-right-and-down-left-from-center"
                          }`}
                        ></i>
                      </button>

                      {/* Clear Chat */}
                      <button
                        onClick={() => setMessages([])}
                        className="text-gray-600 hover:text-gray-800 text-xl"
                      >
                        <i className="fa-solid fa-trash-alt"></i>
                      </button>

                      {/* Close Chat */}
                      <button
                        onClick={() => setChatVisible(false)}
                        className="text-gray-600 hover:text-gray-800 text-xl"
                      >
                        <i className="fa-solid fa-times"></i>
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-grow overflow-auto mb-4">
                    {messages.length === 0 && !loading && (
                      <div className="mb-4 text-gray-600 text-sm">
                        <div className="inline-block px-4 py-2 rounded-lg bg-gray-200 text-black">
                          <i className="fa-regular fa-smile"></i> Hello! Choose
                          an AI above and start chatting.
                        </div>
                      </div>
                    )}

                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`mb-2 ${
                          msg.sender === "user" ? "text-right" : ""
                        }`}
                      >
                        <div
                          className={`inline-block px-4 py-2 rounded-lg ${
                            msg.sender === "user"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-black"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}

                    {loading && (
                      <div className="mb-2">
                        <div className="inline-block px-4 py-2 rounded-lg bg-gray-200 text-black animate-pulse">
                          <i className="fa-solid fa-ellipsis"></i> AI is
                          typing...
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input area */}
                  <div className="flex items-center gap-2">
                    <textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          onSend();
                        }
                      }}
                      className="flex-grow p-2 border rounded-lg resize-none"
                      placeholder="Ask something..."
                      rows={1}
                    />
                    <button
                      onClick={onSend}
                      className="primary rounded px-2 py-2 text-gray-50"
                      disabled={loading}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </Draggable>
            </div>
          );
        })()}
    </div>
  );
};

export default HomePage;
