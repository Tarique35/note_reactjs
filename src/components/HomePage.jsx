import React, { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import NoteContext from "../NoteContext";
import { formatDate } from "../Small Components/Functions";

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialButtonValue = searchParams.get("value") || "all"; // Default to "all"
  const [activeButtons, setActiveButtons] = useState(initialButtonValue);
  const [noteData, setNoteData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const { loca, tokenName } = useContext(NoteContext);

  const noteToken = localStorage.getItem(tokenName);

  useEffect(() => {
    // Ensure the query param exists and keep local active state in sync
    if (!searchParams.has("value")) {
      setSearchParams({ value: "all" }, { replace: true });
    }
    setActiveButtons(initialButtonValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, initialButtonValue]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 pt-10">
        {/* Top controls */}
        <div className="flex justify-between items-center mb-10">
          {/* Filter Buttons */}
          <div className="flex items-center gap-4">
            <button
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeButtons === "all"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => handleButtons("all")}
            >
              <i className="fa-solid fa-layer-group"></i>
              All {activeButtons === "all" ? `(${noteData.length})` : ""}
            </button>

            <button
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeButtons === "bookmark"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
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
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-full shadow-lg transition-all hover:scale-105"
          >
            <i className="fa-solid fa-circle-plus"></i>
            <span className="font-medium">Add Note</span>
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
                  className="relative cursor-pointer bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100"
                >
                  {datas.bookmarked && (
                    <div className="absolute right-4 top-4 text-yellow-500">
                      <i className="fa-solid fa-thumbtack"></i>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <i className="fa-regular fa-note-sticky text-blue-500"></i>
                      {datas.title || "Untitled"}
                    </h3>
                    <p className="mt-2 text-gray-600 line-clamp-3 text-sm leading-relaxed">
                      {datas.content}
                    </p>
                  </div>

                  <p className="text-xs text-gray-400 flex items-center gap-1">
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
    </div>
  );
};

export default HomePage;
