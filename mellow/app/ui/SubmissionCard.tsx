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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
    height: '800px',
    backgroundColor: '#e6e6e6',
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
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
  };

  return (
    <div className="flex items-center justify-center flex-col h-screen p-4">
      {/* Color picker */}
      <input
        type="color"
        value={selectedColor}
        onChange={(e) => handleColorChange(e.target.value)}
      />

      <ReactCardFlip isFlipped={flip} flipDirection="vertical" containerStyle={containerStyle}>
        {/* Front side */}
        <div className="front-card m-4 p-4 rounded-md text-center drop-shadow-lg" style={cardStyle}>
          <p className="text-4xl font-bold mb-4">Front</p>

          <div className="picker-container flex items-center justify-center p-4">
            <button className="flex items-center justify-center" onClick={openModal}>
              {selectedEmoji && <img className="selected-emoji w-12 h-12" src={selectedEmoji} alt="Selected Emoji" />}
              {!selectedEmoji && <span className="rounded-full p-2 border border-black bg-transparent text-black focus:outline-none">Pick an emote</span>}
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
            className="w-full px-4 py-2 text-s font-bold bg-purple-200 rounded-md mt-4"
            onClick={() => setFlip(!flip)}
          >
            Flip
          </button>
        </div>

        {/* Back side */}
        <div className="back-card m-4 p-4 rounded-md text-center drop-shadow-lg" style={cardStyle}>
          <p className="text-4xl font-bold mb-4">Back</p>

          <div className="grid gap-2">
            <input name="title" className="border rounded-md p-2 text-sm" placeholder="Enter your text here..." value={formData.title} onChange={handleChange} type="text" />
            <textarea
              name="content"
              className="border rounded-md p-2 text-sm max-h-32" // Adjust max-h-32 as needed
              placeholder="Enter your text here..."
              value={formData.content}
              onChange={handleChange}
            />
          </div>
          <button
            className="w-full px-4 py-2 text-s font-bold bg-purple-200 rounded-md mt-4"
            onClick={() => setFlip(!flip)}
          >
            Flip
          </button>
        </div>
      </ReactCardFlip>

      {/* Submit button */}
      <button className="w-40 px-4 py-2 text-xl font-bold bg-purple-200 rounded-md" type="submit" onClick={handleSubmit}>
        Submit
      </button>

    </div>
  );
}
