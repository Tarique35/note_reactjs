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
    <div className="mx-auto w-4/5">
      <Navbar />

      {/* Top controls */}
      <div className="flex justify-between items-center mt-6 mb-4 px-2">
        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded">
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeButtons === "all"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => handleButtons("all")}
          >
            All
            {noteData && activeButtons === "all" ? ` (${noteData.length})` : ""}
          </button>

          <button
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeButtons === "bookmark"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => handleButtons("bookmark")}
          >
            Bookmarked
            {noteData && activeButtons === "bookmark"
              ? ` (${noteData.length})`
              : ""}
          </button>

          {/* Example for future filters
          <button className="px-3 py-1 rounded-full text-sm text-gray-700 hover:bg-gray-100">Important</button>
          */}
        </div>

        <button
          onClick={createNewNote}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          <i className="fa-solid fa-plus" aria-hidden="true"></i>
          <span>Add Note</span>
        </button>
      </div>

      {/* Notes list */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        {noteData && noteData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {noteData.map((datas, index) => (
              <div
                key={datas.id || index}
                onClick={() => getSelectedNote(datas)}
                className="relative cursor-pointer bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition"
              >
                {datas.bookmarked && (
                  <div className="absolute right-3 top-3 text-gray-500">
                    <i
                      className="bi bi-pin-fill text-xl"
                      aria-hidden="true"
                    ></i>
                  </div>
                )}

                <div className="mb-3">
                  <h3 className="text-lg font-semibold">
                    {datas.title || "Untitled"}
                  </h3>
                  <p className="mt-1 text-gray-700 line-clamp-3">
                    {datas.content}
                  </p>
                </div>

                <p className="text-xs text-gray-500">
                  {formatDate(datas.updatedAt)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-gray-500">No notes found.</div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
