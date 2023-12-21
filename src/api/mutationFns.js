import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "firebaseApp";

export const addLetter = (newLetter) =>
  addDoc(collection(db, "fanLetters"), newLetter);

export const deleteLetter = (id) => deleteDoc(doc(db, "fanLetters", id));

export const editLetter = ({ id, editingText }) =>
  updateDoc(doc(db, "fanLetters", id), { content: editingText });
