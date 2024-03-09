import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import Picker from "emoji-picker-react";
import Modal from "react-modal";

export default function SubmissionCard() {
  const [flip, setFlip] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#FECBC4');
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  //const [showPicker, setShowPicker] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    author: "",
    title: "",
    content: "",
    emote: "",
  });
  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const onEmojiClick = (event, emojiObject) => {
    console.log("printing emoji");
    console.log(emojiObject.explicitOriginalTarget.src);
    setSelectedEmoji(emojiObject.explicitOriginalTarget.src);
    setFormData((prevData) => ({
      ...prevData,
      ["emote"]: emojiObject.explicitOriginalTarget.src,
    }));
    closeModal();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can perform actions with formData here
    console.log("Form submitted with data:", formData);
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
    width: '60%',  // Customize the width as needed
    height: '600px', // Customize the height as needed
    backgroundColor: '#e6e6e6', // Customize the background color
    borderRadius: '8px', // Customize the border radius
    //boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', // Customize the box shadow
    // Add more styles as needed
  };

  const cardStyle = {
    backgroundColor: selectedColor,
    textColor: "#000000",
  };

  const modalStyles = {
    content: {
      width: "fit-content",
      maxWidth: "80%", // Adjust as needed
      margin: "auto",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
  };

  return (
    <div className="flex items-center justify-center h-screen">

        {/* Color picker */}
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => handleColorChange(e.target.value)}
        />

      <ReactCardFlip isFlipped={flip} flipDirection="vertical" containerStyle={containerStyle}>
        {/* Front side */}
        <div className="m-4 p-4 rounded-md text-center drop-shadow-lg" style={cardStyle}>
          <p className="text-4xl font-bold mb-4">Front</p>

          <div className="picker-container flex items-center justify-center">
            <button className="flex items-center rounded-full p-2 text-white focus:outline-none" onClick={openModal}>
              {selectedEmoji && <img className="selected-emoji w-12 h-12" src={selectedEmoji} alt="Selected Emoji" />}
              {!selectedEmoji && <span>Pick an emote</span>}
            </button>
            <Modal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              contentLabel="Emoji Picker Modal"
              style={modalStyles}
            >
              <div>
                <Picker onEmojiClick={onEmojiClick} />
                <button onClick={closeModal}>Close Modal</button>
              </div>
            </Modal>
          </div>
          <button
            className="w-40 px-4 py-2 text-xl font-bold bg-purple-200 rounded-md"
            onClick={() => setFlip(!flip)}
          >
            Flip
          </button>

        </div>

        {/* Back side */}
        <div className="m-4 p-4 rounded-md text-center drop-shadow-lg" style={cardStyle}>
          <p className="text-4xl font-bold mb-4">Back</p>

          <div className="grid gap-2">
            <input name="title" className="border rounded-md p-2 text-sm" placeholder="Enter your text here..." value={formData.title} onChange={handleChange} type="text" />
            <textarea name="content" className="border rounded-md p-2 text-sm" placeholder="Enter your text here..." value={formData.content} onChange={handleChange}/>
          </div>

          <button
            className="w-40 px-4 py-2 text-xl font-bold bg-purple-200 rounded-md"
            onClick={() => setFlip(!flip)}
          >
            Flip
          </button>
        </div>
      </ReactCardFlip>
      <button type="submit" onClick={handleSubmit}>Submit</button>
    </div>

  );
};
