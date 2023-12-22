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

export const addComment = ({ id, comment }) => {
  const commentRef = collection(db, "fanLetters", id, "comments");

  return addDoc(commentRef, comment);
};

export const deleteComment = ({ letterId, commentId }) => {
  const commentRef = doc(db, "fanLetters", letterId, "comments", commentId);
  return deleteDoc(commentRef);
};
