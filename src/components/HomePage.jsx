import React, { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import "../style/HomePage.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import NoteContext from "../NoteContext";

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialButtonValue = searchParams.get("value") || "all"; // Default to "all"
  const [activeButtons, setActiveButtons] = useState(initialButtonValue);
  const [noteData, setNoteData] = useState();

  const navigate = useNavigate();

  const { loca } = useContext(NoteContext);

  useEffect(() => {
    // If there's no "value" parameter, set it to "all"
    if (!searchParams.has("value")) {
      setSearchParams({ value: "all" });
    }
    setActiveButtons(initialButtonValue);
  }, [searchParams, initialButtonValue, setSearchParams]);

  const handleButtons = (value) => {
    setActiveButtons(value);
    setSearchParams({ value }); // Update query parameter
  };

  const getAllNotes = () => {
    console.log("searchParam: ", searchParams.get("value"));
    if (searchParams.get("value") == "all") {
      axios
        .post(
          loca + "/all/notes",
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((resp) => {
          console.log("data: ", resp.data);
          setNoteData(resp.data);
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    } else if (searchParams.get("value") == "bookmark") {
      axios
        .post(
          loca + "/get/bookmarks",
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((resp) => {
          console.log("data: ", resp.data);
          setNoteData(resp.data);
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    }
  };

  useEffect(() => {
    getAllNotes();
  }, [searchParams]);

  const getSelectedNote = async (datas) => {
    try {
      const response = await axios.post(
        `${loca}/selected/note`,
        datas, // Removed the extra object wrapping
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("selected note: ", response.data);
      navigate(`/note?id=${response.data.id}`); // Assuming `id` comes back from the server in `response.data`
    } catch (error) {
      console.error("Error fetching the selected note:", error);
    }
  };

  const createNewNote = async () => {
    const body = {
      title: "",
      content: "",
    };
    try {
      const response = await axios.post(`${loca}/save/note`, body, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("new note: ", response.data);
      navigate(`/note?id=${response.data.id}`);
    } catch (error) {
      console.error("Error creating a new note:", error);
    }
  };
  return (
    <div>
      <Navbar />
      <div className="" style={{ display: "flex" }}>
        <div className="d-flex options-margin">
          <span
            className="add-btn"
            onClick={() => {
              createNewNote();
            }}
          >
            <i class="fa-solid fa-plus" style={{ color: "black" }}></i>
            Add Note
          </span>
          <div
            className={activeButtons === "all" ? "active" : ""}
            onClick={() => handleButtons("all")}
          >
            All(30)
          </div>
          <div
            className={activeButtons === "bookmark" ? "active" : ""}
            onClick={() => handleButtons("bookmark")}
          >
            Bookmarked
          </div>
          {/* <div
            className={activeButtons === "important" ? "active" : ""}
            onClick={() => handleButtons("important")}
          >
            Important
          </div> */}
        </div>
      </div>
      <div className="notes-card mx-2 py-3">
        {/* {data &&
          data.map((datas, index) => (
            <>
              <div
                key={index}
                className="notes-div"
                onClick={() => {
                  navigate(`/note?id=${index}`);
                }}
              >
                <h3>{datas.title}</h3>
                <p>{datas.description}</p>
              </div>
            </>
          ))} */}
        {noteData &&
          noteData.map((datas, index) => (
            <>
              {console.log(datas)}
              <div
                key={index}
                className="notes-div"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  getSelectedNote(datas);
                }}
              >
                {datas.bookmarked && (
                  <div style={{ position: "absolute", right: "10px" }}>
                    <i
                      class="bi bi-pin-fill"
                      style={{
                        fontSize: "25px",
                      }}
                    ></i>
                  </div>
                )}
                <h3>{datas.title}</h3>
                <p>{datas.content}</p>
              </div>
            </>
          ))}
      </div>
    </div>
  );
};

export default HomePage;
