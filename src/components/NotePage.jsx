import React, { useContext, useEffect, useRef, useState } from "react";
import "../style/NotePage.css";
import axios from "axios";
import NoteContext from "../NoteContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const NotePage = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const { loca } = useContext(NoteContext);
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

  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

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
        },
      });
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
      <div className="notes-app">
        <div className="note-actions mb-2">
          <button onClick={handleUndo} disabled={undoStack.length === 0}>
            Undo
          </button>
          <button onClick={handleRedo} disabled={redoStack.length === 0}>
            Redo
          </button>
        </div>
        <div className="d-flex justify-content-between">
          <div></div>
          <h1>Notes</h1>
          {isPinned ? (
            <i
              class="bi bi-pin-fill"
              style={{
                marginTop: "12px",
                fontSize: "25px",
                marginRight: "10px",
                cursor: "pointer",
              }}
              onClick={handlePinned}
            ></i>
          ) : (
            <i
              class="bi bi-pin"
              style={{
                marginTop: "12px",
                fontSize: "25px",
                marginRight: "10px",
                cursor: "pointer",
              }}
              onClick={handlePinned}
            ></i>
          )}
        </div>
        <div>
          <div>
            <input
              className="w-100 p-2 mb-2"
              type="text"
              name="title"
              placeholder="Title"
              value={title}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
          <div className="note-input">
            <textarea
              placeholder="Write a note..."
              value={noteText}
              name="content"
              onChange={(e) => {
                handleChange(e);
              }}
            />
            {/* <button onClick={addNote}>Add Note</button> */}
            {/* <button onClick={saveNote}>Add Note</button> */}
          </div>
        </div>
        <div className="notes-grid">
          {notes.map((note, index) => (
            <div className="note-card" key={index}>
              <p>{note}</p>
              <button onClick={() => deleteNote(index)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NotePage;
