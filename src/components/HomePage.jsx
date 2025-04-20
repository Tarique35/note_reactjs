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

  const data = [
    {
      id: 1,
      title: "The Beauty of Nature",
      description:
        "Nature has an incredible ability to captivate us with its beauty. From the vibrant colors of blooming flowers in spring to the serene landscapes covered in snow during winter, each season brings its own charm. The gentle rustling of leaves in the breeze, the sound of birds singing, and the sight of a sunset painting the sky in hues of orange and pink can evoke feelings of peace and wonder. Engaging with nature can be a soothing escape from the hustle and bustle of daily life, allowing us to recharge and reflect. Moreover, the intricate ecosystems that flourish around us remind us of the delicate balance required for life. Observing the behaviors of animals in their natural habitats can deepen our appreciation for biodiversity and the interconnectedness of all living things.",
    },
    {
      id: 2,
      title: "The Wonders of Technology",
      description:
        "In today’s fast-paced world, technology has transformed our lives in ways we could never have imagined. From smartphones that keep us connected to artificial intelligence that enhances our productivity, the innovations of the digital age are remarkable. Technology has streamlined tasks, enabled instant communication, and opened up vast sources of information at our fingertips. However, while technology offers numerous benefits, it also presents challenges, including privacy concerns and the need for digital literacy. Understanding both the advantages and the drawbacks is essential as we navigate this ever-evolving landscape. The rapid pace of technological advancement forces us to adapt continually, pushing the boundaries of what we thought was possible. As we embrace new tools, it's crucial to consider the ethical implications of our choices and strive for a balance between innovation and responsibility.",
    },
    {
      id: 3,
      title: "The Power of Music",
      description:
        "Music is a universal language that transcends cultural and linguistic barriers. It has the unique ability to evoke emotions, tell stories, and bring people together. Whether it’s the soothing sound of classical melodies, the upbeat rhythm of pop songs, or the powerful lyrics of rock anthems, music can influence our mood and inspire us. Throughout history, music has played a significant role in rituals, celebrations, and social movements, serving as a voice for the oppressed and a source of joy for many. The diverse genres and styles reflect the richness of human experience, showcasing our creativity and resilience. Engaging with music—whether through listening, playing an instrument, or singing—can foster a sense of belonging and community. Moreover, music therapy has been shown to aid emotional healing, illustrating the profound impact that melodies can have on our mental well-being and interpersonal connections.",
    },
    {
      id: 4,
      title: "Exploring the Universe",
      description:
        "The universe is an expansive and mysterious realm that has fascinated humanity for centuries. From the twinkling stars in the night sky to the intricate patterns of galaxies, exploring the cosmos is both a scientific and philosophical endeavor. Astronomers use powerful telescopes to peer into the depths of space, uncovering secrets about black holes, supernovae, and the possibility of extraterrestrial life. The sheer scale of the universe challenges our understanding of existence and our place within it. Each discovery prompts more questions, inviting us to ponder the nature of reality and the limits of human knowledge. As we delve deeper into the mysteries of the cosmos, we find ourselves confronting profound questions about time, space, and the potential for life beyond Earth. This exploration inspires a sense of wonder and humility, reminding us of our small yet significant role in the grand tapestry of the universe.",
    },
    {
      id: 5,
      title: "The Importance of Mental Health",
      description:
        "Mental health is a crucial aspect of overall well-being that often goes overlooked. Just as we prioritize physical health, nurturing our mental health is essential for leading a fulfilling life. Conditions such as anxiety and depression can affect anyone, regardless of age or background. Promoting mental health awareness and reducing stigma are vital steps toward creating supportive environments. Practicing self-care, seeking professional help when needed, and fostering open conversations about mental health can significantly improve individual and community resilience. It’s important to recognize that everyone’s mental health journey is unique and requires compassion and understanding. By creating a culture that encourages dialogue about mental well-being, we can empower individuals to seek help and build healthier relationships with themselves and others. Acknowledging the challenges and triumphs in mental health can foster a more inclusive society that values emotional well-being as much as physical health.",
    },
    {
      id: 6,
      title: "Traveling the World",
      description:
        "Traveling is one of the most enriching experiences one can undertake. It allows individuals to step outside their comfort zones, explore new cultures, and broaden their perspectives. Each destination offers a unique blend of history, art, cuisine, and landscapes that can leave a lasting impression. Whether wandering through the ancient ruins of Rome, relaxing on a pristine beach in the Maldives, or trekking in the lush jungles of Costa Rica, travel fosters personal growth and adaptability. Moreover, meeting new people and sharing experiences can lead to friendships that transcend borders, creating a sense of global community. Traveling encourages us to appreciate the diversity of the world and challenges our assumptions. It also allows us to reflect on our own lives and values in the context of different cultures. Each journey becomes a story to tell, rich with lessons learned and memories made, ultimately shaping who we are.",
    },
    {
      id: 7,
      title: "The Art of Cooking",
      description:
        "Cooking is both a practical skill and a creative outlet that brings joy to many. It’s an art form that combines flavors, textures, and techniques to create delicious dishes. From the simplicity of a home-cooked meal to the complexity of gourmet cuisine, the process of cooking can be both therapeutic and rewarding. Sharing meals with family and friends fosters connections and creates lasting memories. Additionally, exploring various cuisines around the world can enhance our culinary repertoire and deepen our appreciation for cultural diversity. The kitchen is often seen as the heart of the home, where love is expressed through food. Beyond nourishment, cooking can be a way to express creativity, experiment with ingredients, and discover new culinary traditions. It encourages us to be mindful of what we eat and where our food comes from, promoting sustainability and health. Ultimately, the joy of cooking lies not only in the food itself but in the experience of creating and sharing it.",
    },
    {
      id: 8,
      title: "The Journey of Self-Discovery",
      description:
        "Self-discovery is a lifelong journey that involves exploring one’s values, beliefs, and passions. It’s about understanding who we are, what we want, and how we relate to the world around us. This process can be both enlightening and challenging, as it often requires confronting fears and embracing change. Engaging in self-reflection, journaling, and seeking new experiences can facilitate personal growth and lead to greater fulfillment. The journey of self-discovery is unique for everyone, shaped by individual experiences and insights. Ultimately, it empowers us to live authentically and make choices that align with our true selves. This journey may also involve redefining our goals and aspirations as we learn more about ourselves and our potential. The insights gained along the way can help us build deeper connections with others and foster a sense of belonging in a world that often feels overwhelming.",
    },
    {
      id: 9,
      title: "Environmental Conservation",
      description:
        "Environmental conservation is vital for preserving our planet for future generations. As human activities continue to impact ecosystems and biodiversity, it’s essential to advocate for sustainable practices. This includes reducing waste, protecting natural habitats, and supporting renewable energy initiatives. Education and awareness play crucial roles in fostering a culture of conservation. By understanding the importance of preserving our environment, we can make informed choices that contribute to ecological balance. Every small action counts, whether it’s recycling, planting trees, or advocating for policies that protect wildlife. Together, we can create a sustainable future for our planet. Furthermore, engaging in community efforts to restore and protect local environments can create a sense of purpose and connection to nature. The fight for conservation is a collective responsibility that requires active participation from individuals, communities, and governments alike. Through concerted efforts, we can ensure that our natural resources are preserved for generations to come.",
    },
    {
      id: 10,
      title: "The Magic of Literature",
      description:
        "Literature has the power to transport us to different worlds, allowing us to experience lives beyond our own. Through the pages of a book, we can explore diverse cultures, historical events, and the depths of human emotion. Great literature challenges our perspectives and ignites our imagination. It fosters empathy, as we connect with characters and their struggles, joys, and triumphs. From timeless classics to contemporary novels, literature reflects the complexities of the human experience. Reading not only enhances our knowledge but also provides an escape and a source of comfort. The magic of literature lies in its ability to resonate across time and space, uniting readers in shared experiences. Additionally, literature can serve as a powerful tool for social change, giving voice to the marginalized and inspiring action. As we immerse ourselves in stories, we enrich our lives and cultivate a deeper understanding of the world and its myriad stories.",
    },
  ];

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
  };

  useEffect(() => {
    getAllNotes();
  }, []);

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
          <div
            className={activeButtons === "important" ? "active" : ""}
            onClick={() => handleButtons("important")}
          >
            Important
          </div>
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
                {console.log("checkbook", datas[index])}
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
