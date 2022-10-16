import { useEffect, useState } from "react";
import styles from "../../styles/Evernote.module.scss";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { database } from "../../firebaseConfig";
import Editor from "./Editor";
// import ReactQuill from 'react-quill'
// import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";

const ReactQuill = dynamic(import("react-quill"), { ssr: false });

const dbInstance = collection(database, "blogposts");

export default function NoteOperation({ getSingleNote }) {
  const [isInputVisible, setInputVisible] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDescription, setNoteDescription] = useState("");
  const [notesArray, setNotesArray] = useState([]);
  const inputToggle = () => {
    setInputVisible(!isInputVisible);
  };

  const saveNote = () => {
    // insert data to firestore

    addDoc(dbInstance, {
      noteTitle: noteTitle,
      noteDescription: noteDescription,
    }).then(() => {
      setNoteTitle("");
      setNoteDescription("");
      getNotes();
    });
  };

  const addDescription = (value) => {
    setNoteDescription(value);
  };

  const getNotes = () => {
    getDocs(dbInstance).then((data) => {
      setNotesArray(
        data.docs.map((item) => {
          return { ...item.data(), id: item.id };
        })
      );
    });
  };

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <>
      <div>
        <button className={styles.button} onClick={inputToggle}>
          Add a New Post
        </button>
         </div>
        { isInputVisible ? (
        <div>
        <input
          className={styles.input}
          placeholder="Enter the Title"
          onChange={(e) => setNoteTitle(e.target.value)}
          value={noteTitle}
        />

         <div className={styles.ReactQuill} >  
         <ReactQuill
        theme="snow"
        placeholder="Write Post"
        onChange={addDescription}
        value={noteDescription}
      />
                </div>  
        <div></div>
        <button onClick={ event=>{
          saveNote()
        }} className={styles.saveBtn}>
          Save Post
        </button>
        </div>
        ): (
            <></>

        )}    

        <div>
          {notesArray.map((note) => {
            return (
              <div
              key={note.id}
                className={styles.notesInner}
                onClick={() => getSingleNote(note.id)}
              >
                <h4>{note.noteTitle} </h4>
              </div>
            );
          })}
        </div>
      
    </>
  );
}
