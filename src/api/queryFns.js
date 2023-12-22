import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "firebaseApp";

export const getLetters = async ({ queryKey }) => {
  const [, activeMember] = queryKey;
  const letterRef = collection(db, "fanLetters");
  const q = query(
    letterRef,
    where("writedTo", "==", activeMember),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  const lettersForActiveMember = [];
  snapshot.forEach((doc) => {
    lettersForActiveMember.push({ id: doc.id, ...doc.data() });
  });
  return lettersForActiveMember;
};

export const getLetter = async ({ queryKey }) => {
  const [, id] = queryKey;
  const ref = doc(db, "fanLetters", id);
  const letter = await getDoc(ref);
  return { id: letter.id, ...letter.data() };
};

export const getComments = async ({ queryKey }) => {
  const [, id] = queryKey;
  const commentsRef = collection(db, "fanLetters", id, "comments");
  const commentsQuery = query(commentsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(commentsQuery);
  const commentList = [];
  snapshot.forEach((comment) => {
    commentList.push({ id: comment.id, ...comment.data() });
  });
  return commentList;
};
