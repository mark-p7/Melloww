import React, { useEffect, useState } from 'react';
import { useUser } from "@auth0/nextjs-auth0/client";
import ReactCardFlip from 'react-card-flip';
import Picker from "emoji-picker-react";
import Modal from "react-modal";
import ToggleButton from '@mui/material/ToggleButton';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

export default function SubmissionCard() {
  const { user, isLoading } = useUser();
  const [flip, setFlip] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [selectedPublic, setSelectedPublic] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    AuthorId: "",
    Title: "",
    EntryText: "",
    Emoji: "",
    Color: "#FFFFFF",
    Public: false
  });
  const [newColor, setNewColor] = useState("");
  const [journalId, setJournalId] = useState("");
  const [advice, setAdvice] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (newColor === "") return;
    axios.post("http://localhost:8080/journals/changeColor", { journalId: journalId, color: newColor }).then(res => console.log(res))
  }, [newColor]);

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
    // console.log(event?.explicitOriginalTarget?.src);
    console.log(emojiObject.emoji);
    setSelectedEmoji(emojiObject.emoji);
    setFormData((prevData) => ({
      ...prevData,
      ["Emoji"]: emojiObject.emoji,
    }));
    closeModal();
  };

  const handleSubmit = (e: any) => {
    console.log("submitting")
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
        Emoji: selectedEmoji, // Optional: include if you want to allow users to associate an emoji with the entry
        Public: formData.Public, // Default to public if not specified
        Color: "#FFFFFF" // Optional: include if you want to allow users to associate a color with the entry
      }).then(res => {
        console.log(res)
        setOpen(true);
        setJournalId(res.data.journal._id);
        setNewColor(res.data.color);
        setAdvice(res.data.tip);
      })
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
    justifyContent: '',  // Center vertically
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
      <div className="w-full h-[calc(100vh - 80px)] py-11">
        <div className="flex items-center justify-center flex-row p-4">

          <ReactCardFlip isFlipped={flip} flipDirection="vertical" containerStyle={containerStyle}>
            {/* Front side */}
            <div className="front-card rounded-md text-center shadow-xl shadow-black/30 p-0" style={cardStyle}>
              <div className="picker-container flex items-center justify-center p-4 h-full">
                <button className="flex items-center justify-center" onClick={openModal}>
                  {selectedEmoji != null && <h1 className='text-5xl'>{selectedEmoji}</h1>}
                  {!selectedEmoji &&
                    <span className="rounded-full p-10 bg-transparent text-lg focus:outline-none">Click here to pick an emote that represents your mood!</span>}
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
            </div>

            {/* Back side */}
            <div className="back-card m-4 p-4 rounded-md text-center shadow-xl shadow-black/60" style={cardStyle}>
              <p className="text-4xl font-bold mb-4"></p>

              <div className="grid gap-10 w-full">
                <Input
                  name="Title"
                  className="border rounded-md p-2 text-lg w-full" // Adjust text-base or other size classes as needed
                  placeholder="Name your journal entry..."
                  value={formData.Title}
                  onChange={handleChange}
                  type="text" />
                <Textarea
                  name="EntryText"
                  className="border rounded-md p-2 text-lg h-80 resize-none" // Adjust text-base or other size classes as needed
                  placeholder="Describe your day..."
                  value={formData.EntryText}
                  onChange={handleChange} />
              </div>
            </div>
          </ReactCardFlip>


          <div className='flex flex-col gap-10'>
            <Button
              className='w-40 text-md'
              onClick={() => setFlip(!flip)}
            >
              Flip
            </Button>
            {
              selectedPublic ?
                <Button
                  className='w-40 text-md'
                  onClick={() => {
                    setSelectedPublic(false);
                    setFormData((prevData) => ({
                      ...prevData,
                      ["Public"]: false,
                    }));
                  }}
                >
                  Public
                </Button>
                :
                <Button
                  className='w-40 text-md'
                  onClick={() => {
                    setSelectedPublic(true);
                    setFormData((prevData) => ({
                      ...prevData,
                      ["Public"]: true,
                    }));
                  }}
                >
                  Private
                </Button>
            }
            <div className="flex flex-col items-center">
              <Dialog open={open}>
                <DialogTrigger asChild>
                  <Button className="w-40 text-md" onClick={handleSubmit}>
                    Submit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Advice</DialogTitle>
                    <DialogDescription>
                    {advice ? advice : "No matter how hard things get, remember that you are not alone. You are loved and you are strong."}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button onClick={() => router.push("/feed")}>Go back to Feed</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

        </div>
      </div>
    </>

  );
}
