import dynamic from "next/dynamic";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import styles from "../../styles/Evernote.module.scss";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { database } from "../../firebaseConfig";

const ReactQuill = dynamic(import("react-quill"), { ssr: false });

const dbInstance = collection(database, "blogposts");

export default function Editor() {
    
    const [noteDescription, setNoteDescription] = useState("");

  const saveNoteOne= () => {
    //insert data to firestore

    addDoc(dbInstance, {
        noteDescription: noteDescription,
    }).then(() => {
        setNoteDescription('');
    })
  }


  const addDescription = (value) => {
    setNoteDescription(value);
  };

  return (
    <div className={styles.ReactQuill}>
      <ReactQuill
        theme="snow"
        placeholder="Write Post"
        onChange={addDescription}
        value={noteDescription}
      />
      <div>
      {/* <button onClick={saveNote} className={styles.saveBtn}>
          Save Post
        </button> */}
      </div>
    </div>
  );
}
