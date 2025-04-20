import React, { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import "../style/HomePage.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import NoteContext from "../NoteContext";
import { formatDate } from "../Small Components/Functions";

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

  // const formatDate = (isoString) => {
  //   const date = new Date(isoString);
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  //   const year = date.getFullYear();
  //   return `${day}-${month}-${year}`;
  // };

  return (
    <div className="mx-auto" style={{ width: "80%" }}>
      <Navbar />
      <div
        className="mx-2"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div
          className="d-flex options-margin"
          style={{ background: "hsl(210deg 40% 96.08%)", padding: "4px" }}
        >
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
        <span
          className="add-btn"
          onClick={() => {
            createNewNote();
          }}
        >
          <i class="fa-solid fa-plus" style={{ color: "white" }}></i>
          Add Note
        </span>
      </div>
      <div className="notes-card mx-2 py-3 w-100">
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
              <div
                key={index}
                className="notes-div"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "90%",
                }}
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
                <div>
                  <h3>{datas.title}</h3>
                  <p>{datas.content}</p>
                </div>
                <p style={{ fontSize: "12px", color: "#747474" }}>
                  {formatDate(datas.updatedAt)}
                </p>
              </div>
            </>
          ))}
      </div>
    </div>
  );
};

export default HomePage;
