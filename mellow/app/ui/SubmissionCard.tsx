import React, { useState } from 'react';
import { useUser } from "@auth0/nextjs-auth0/client";
import ReactCardFlip from 'react-card-flip';
import Picker from "emoji-picker-react";
import Modal from "react-modal";
import ToggleButton from '@mui/material/ToggleButton';
import axios from 'axios';

export default function SubmissionCard() {
  const { user, isLoading } = useUser();
  const [flip, setFlip] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#FECBC4');
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [selectedPublic, setSelectedPublic] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    AuthorId: "",
    Title: "",
    EntryText: "",
    Emoji: "",
    Color: "#FECBC4",
    Public: false
  });
  const handleColorChange = (color) => {
    setSelectedColor(color);
    setFormData((prevData) => ({
      ...prevData,
      ["color"]: color,
    }));
  };

  const onEmojiClick = (emojiObject, event) => {
    console.log("printing emoji");
    console.log(event);
    console.log(emojiObject);
    // console.log(event.explicitOriginalTarget.src);
    setSelectedEmoji(emojiObject.imageUrl);
    setFormData((prevData) => ({
      ...prevData,
      ["Emoji"]: emojiObject.emoji,
    }));
    closeModal();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can perform actions with formData here

    axios.post("http://localhost:8080/user", {
      identifier: user?.email
    }).then(res => {
      console.log(res);
      axios.post("http://localhost:8080/journals", {
        EntryText: formData.EntryText,
        Title: formData.Title,
        AuthorId: res.data._id, // Assuming this references an Author collection
        Emoji: formData.Emoji, // Optional: include if you want to allow users to associate an emoji with the entry
        Public: formData.Public, // Default to public if not specified
        Color: formData.Color
      }).then(res => console.log("Form submitted with data:", res))
    })
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
    height: '600px',
    //backgroundColor: '#e6e6e6',
    borderRadius: '8px',
  };

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',  // Center horizontally
    justifyContent: 'center',  // Center vertically
    backgroundColor: selectedColor,
    color: "#000000",
    width: "80%",
    height: "80%",
    margin: 'auto',  // Center horizontally
  };

  const modalStyles = {
    content: {
      width: "fit-content",
      maxWidth: "80%",
      margin: "auto",
      top: "50%",
      left: "13%",
      transform: "translate(-50%, -50%)",
    },
  };

  return (
    <>
      <div className="flex items-center justify-center flex-row p-4 py-32">
        {/* Color picker */}
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className="rounded-full w-28 h-28"/>

        <ReactCardFlip isFlipped={flip} flipDirection="vertical" containerStyle={containerStyle}>
          {/* Front side */}
          <div className="front-card m-4 p-4 rounded-md text-center shadow-xl shadow-black/60" style={cardStyle}>
            <p className="text-4xl font-bold mb-4"></p>

            <div className="picker-container flex items-center justify-center p-4 h-full">
              <button className="flex items-center justify-center" onClick={openModal}>
                {selectedEmoji && <img className="selected-emoji w-12 h-12" src={selectedEmoji} alt="Selected Emoji"/>}
                {!selectedEmoji &&
                    <span className="rounded-full p-10 border border-black bg-transparent text-5xl focus:outline-none">Pick an emote</span>}
              </button>
              <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Emoji Picker Modal"
                style={modalStyles}
              >
                <div>
                  <Picker onEmojiClick={onEmojiClick}/>
                  <button onClick={closeModal}>Close Modal</button>
                </div>
              </Modal>
            </div>
            <button
              className="w-full px-4 py-2 text-s font-bold bg-purple-200 rounded-md mt-4 mt-auto"
              onClick={() => setFlip(!flip)}
            >
              Flip
            </button>
          </div>

          {/* Back side */}
          <div className="back-card m-4 p-4 rounded-md text-center shadow-xl shadow-black/60" style={cardStyle}>
            <p className="text-4xl font-bold mb-4"></p>

            <div className="grid gap-10">
              <input
                name="Title"
                className="border rounded-md p-2 text-4xl" // Adjust text-base or other size classes as needed
                placeholder="Name your journal entry..."
                value={formData.Title}
                onChange={handleChange}
                type="text"/>
              <textarea
                name="EntryText"
                className="border rounded-md p-2 text-2xl h-44 resize-none" // Adjust text-base or other size classes as needed
                placeholder="Describe your day..."
                value={formData.EntryText}
                onChange={handleChange}/>
            </div>
            <button
              className="w-full px-4 py-2 text-s font-bold bg-purple-200 rounded-md mt-4 mt-auto"
              onClick={() => setFlip(!flip)}
            >
              Flip
            </button>
          </div>
        </ReactCardFlip>


        <ToggleButton
          value=""
          onChange={() => {
            setSelectedPublic(!selectedPublic);
            setFormData((prevData) => ({
              ...prevData,
              ["Public"]: !selectedPublic,
            }));
          }}
        >
          {selectedPublic ? "Public" : "Private"}
        </ToggleButton>

      </div>
      {/* Submit button */}
      <div className="flex flex-col items-center">
        <button className="w-40 px-4 py-2 text-xl font-bold bg-purple-200 rounded-md" type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </>

  );
}
