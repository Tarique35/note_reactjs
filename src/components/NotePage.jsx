import React, { useContext, useEffect, useRef, useState } from "react";
import "../style/NotePage.css";
import axios from "axios";
import NoteContext from "../NoteContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../Small Components/Functions";
import DeleteModal from "../Small Components/DeleteModal";

const NotePage = () => {
  const { loca, tokenName } = useContext(NoteContext);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const navigate = useNavigate();
  const [noteData, setNoteData] = useState();
  const [isDataLoaded, setisDataLoaded] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const debounceRef = useRef(null);
  const titleRef = useRef(title);
  const noteTextRef = useRef(noteText);
  const lastSavedRef = useRef({ title: "", content: "" });
  const [isPinned, setIspinned] = useState(false);
  const [date, setDate] = useState();
  const [showModal, setShowModal] = useState(false);

  const noteToken = localStorage.getItem(tokenName);

  const handleDeleteModal = () => {
    setShowModal(true);
  };

  const deleteNote = async () => {
    const body = {
      id: id,
    };
    try {
      const response = await axios.post(loca + "/deletenote", body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${noteToken}`,
        },
      });
      console.log("response", response.data);
    } catch (error) {
      console.log("axios error at delete: ", error);
    }
  };
  const handleConfirm = () => {
    deleteNote();
    setShowModal(false);
    navigate("/", { replace: true });
    window.location.reload(); //this will refresh the page so that our getallnotes record got updated.
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handlePinned = () => {
    setIspinned(!isPinned);
    bookmark();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      setTitle(value);
    } else if (name === "content") {
      setNoteText(value);
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const current = {
        title: value === title ? title : titleRef.current,
        content: value === noteText ? noteText : noteTextRef.current,
      };

      const last = lastSavedRef.current;

      // Push to undo stack only if it’s not the same as the last saved state
      if (current.title !== last.title || current.content !== last.content) {
        setUndoStack((prev) => [...prev, { title, content: noteText }]);
        setRedoStack([]);
        lastSavedRef.current = { title, content: noteText };
      }

      titleRef.current = title;
      noteTextRef.current = noteText;
    }, 500);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;

    const lastState = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));

    // Only push current state to redo if it's different
    if (title !== lastState.title || noteText !== lastState.content) {
      setRedoStack((prev) => [...prev, { title, content: noteText }]);
    }

    setTitle(lastState.title);
    setNoteText(lastState.content);
    lastSavedRef.current = {
      title: lastState.title,
      content: lastState.content,
    };
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;

    const nextState = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));

    setUndoStack((prev) => [...prev, { title: title, content: noteText }]);

    setTitle(nextState.title);
    setNoteText(nextState.content);
    lastSavedRef.current = nextState;
  };

  const query = new URLSearchParams(useLocation().search);
  const id = query.get("id"); // Get the "id" from the URL
  console.log("id", id);

  const addNote = () => {
    if (noteText.trim() === "") return;
    setNotes([...notes, noteText]);
    setNoteText("");
  };
  console.log("array: ", notes);

  // const deleteNote = (index) => {
  //   const updatedNotes = notes.filter((_, i) => i !== index);
  //   setNotes(updatedNotes);
  // };

  const saveNote = () => {
    const body = {
      title: title,
      content: noteText,
    };
    console.log("body", body);

    axios
      .post(loca + "/save/note", body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${noteToken}`,
        },
      })
      .then((resp) => {
        console.log(resp.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSelectedNote = async () => {
    const body = {
      id: id,
    };
    try {
      const response = await axios.post(
        `${loca}/selected/note`,
        body, // Removed the extra object wrapping
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${noteToken}`,
          },
        }
      );
      console.log("selected note: ", response.data);
      setNoteData(response.data || "");
      setTitle(response.data.title || "");
      setNoteText(response.data.content);
      console.log("noteText", response.data.content);
      setisDataLoaded(true);
      const isBookmark = response.data.bookmarked;
      setIspinned(isBookmark);
      setDate(response.data.updatedAt);
    } catch (error) {
      console.error("Error fetching the selected note:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getSelectedNote();
    }
  }, [id]);

  const updateNote = async () => {
    const body = {
      id: id,
      title: title,
      content: noteText,
    };
    try {
      const response = await axios.post(`${loca}/update/existingnote`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${noteToken}`,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error updating the note:", error);
    }
  };

  const bookmark = async () => {
    const body = {
      id: id,
    };
    try {
      const response = await axios.post(`${loca}/bookmark`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${noteToken}`,
        },
      });
      console.log("data: ", response.data);

      const isBookmark = response.data.bookmarked;
      setIspinned(isBookmark);
    } catch (error) {
      console.error("Error bookmarking the note:", error);
    }
  };
  // const handleChange = (e) => {
  //   const { name, value } = e.target;

  //   if (name == "title") {
  //     setTitle(value);
  //   } else if (name == "content") {
  //     setNoteText(value);
  //   }
  //   // if (id) {
  //   //   updateNote();
  //   // }
  // };

  useEffect(() => {
    if (id && isDataLoaded) {
      updateNote();
    }
  }, [title, noteText]);
  return (
    <>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header Row */}
        <div className="flex justify-between items-center mb-6">
          <div>
            {date && (
              <p className="text-sm text-gray-400">
                Last edited • {formatDate(date)}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-5">
            <i
              className="fa fa-trash text-gray-500 hover:text-red-500 cursor-pointer text-lg"
              onClick={handleDeleteModal}
            ></i>
            <i
              className={`${
                isPinned ? "fas" : "far"
              } fa-bookmark text-yellow-500 cursor-pointer text-xl`}
              onClick={handlePinned}
            ></i>
          </div>
        </div>

        {/* Note Editor */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          {/* Title */}
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title..."
            className="w-full text-2xl font-semibold border-b border-gray-300 focus:border-blue-500 focus:outline-none py-2 mb-6"
          />

          {/* Content */}
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Content
          </label>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write your note here..."
            className="w-full min-h-[60vh] p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-base leading-relaxed"
          ></textarea>
        </div>

        {/* Delete Modal */}
        <DeleteModal
          show={showModal}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </div>
    </>
  );
};

export default NotePage;
