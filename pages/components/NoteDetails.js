import styles from '../../styles/Evernote.module.scss'
import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import { database } from '../../firebaseConfig'
// import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic'
import Test from './Editor'
import Editor from './Editor'


const ReactQuill = dynamic(import("react-quill"), { ssr: false });

const dbInstance = collection(database, 'blogposts')


export default function NoteDetails({ ID }) {
  const [singleNote, setSingleNote] = useState({})
  const [isEdit, setIsEdit] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDescription, setNoteDescription] = useState('');
  const getSingleNote = async () => {
      if (ID) {
          const singleNote = doc(database, 'blogposts', ID)
          const data = await getDoc(singleNote)
          setSingleNote({ ...data.data(), id: data.id })
      }
  }

  const getNotes = () => {
      getDocs(dbInstance)
          .then((data) => {
              setSingleNote(data.docs.map((item) => {
                  return { ...item.data(), id: item.id }
              })[0]);
          })
  }

  const getEditData = () => {
      setIsEdit(true);
      setNoteTitle(singleNote.noteTitle);
      setNoteDescription(singleNote.noteDescription)
  }

  useEffect(() => {
      getNotes();
  }, [])

  useEffect(() => {
      getSingleNote();
  }, [ID])

  const editNote = (id) => {
      const collectionById = doc(database, 'blogposts', id)

      updateDoc(collectionById, {
          noteTitle: noteTitle,
          noteDescription: noteDescription,
      })
          .then(() => {
              window.location.reload()
          })
  }

  const deleteNote = (id) => {
      const collectionById = doc(database, 'blogposts', id)

      deleteDoc(collectionById)
          .then(() => {
              window.location.reload()
          })
  }
  return (
      <>
          <div>
              <button
                  className={styles.editBtn}
                  onClick={getEditData}
              >Edit
              </button>
              <button
                  className={styles.deleteBtn}
                  onClick={() => deleteNote(singleNote.id)}
              >Delete
              </button>
          </div>
          {isEdit ? (
              <div className={styles.inputContainer}>
                  <input
                      className={styles.input}
                      placeholder='Enter the Title..'
                      onChange={(e) => setNoteTitle(e.target.value)}
                      value={noteTitle}
                  />
                  <div className={styles.ReactQuill}>
                      <ReactQuill
                          onChange={setNoteDescription}
                          value={noteDescription}
                      />
                  </div>
                  <button
                      onClick={() => editNote(singleNote.id)}
                      className={styles.saveBtn}>
                      Update Note
                  </button>
              </div>
          ) : (
              <></>
          )}
          <h2 className={styles.postcardText} >{singleNote.noteTitle}</h2>
          <div className={styles.postcard} dangerouslySetInnerHTML={{ __html: singleNote.noteDescription }}></div>
      </>
  )
}