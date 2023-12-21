import styled from "styled-components";
import Avatar from "components/common/Avatar";
import Button from "components/common/Button";
import { useState } from "react";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "context/AuthContext";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db, fbStorage } from "firebaseApp";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function Profile() {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const { displayName: nickname, uid: userId, photoURL: avatar } = currentUser;

  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState("");
  const [selectedImg, setSelectedImg] = useState(avatar);
  const [file, setFile] = useState(null);

  const previewImg = (event) => {
    const imgFile = event.target.files[0];
    if (imgFile.size > 1024 * 1024) {
      return toast.warn("최대 1MB까지 업로드 가능합니다.");
    }
    setFile(imgFile);
    // 프리뷰 구현
    // File -> Url 형식으로 변환
    const imgUrl = URL.createObjectURL(imgFile);
    setSelectedImg(imgUrl);
  };

  const uploadImg = async () => {
    const storageRef = ref(fbStorage, `${Date.now()}/${userId}.jpeg`);
    const { ref: imgRef } = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(imgRef);
    return downloadUrl;
  };

  const onEditDone = async () => {
    // TODO: 프로필 변경 요청
    const authEditObj = {}; // Auth DB 보낼 데이터
    const fsEditObj = {}; // Firestore DB 보낼 데이터
    if (editingText) {
      authEditObj.displayName = editingText;
      fsEditObj.nickname = editingText;
    }
    let imgUrl;
    if (selectedImg !== avatar) {
      imgUrl = await uploadImg();
      authEditObj.photoURL = imgUrl;
      fsEditObj.avatar = imgUrl;
    }
    setCurrentUser((prev) => ({
      ...prev,
      displayName: editingText,
      photoURL: imgUrl,
    }));
    await updateProfile(auth.currentUser, authEditObj);
    toast.success("프로필 변경 완료!");
    setIsEditing(false);

    // firestore 의 내 fanLetters의 avatar, nickname 필드에도 반영
    const lettersRef = collection(db, "fanLetters");
    const myLettersQuery = query(lettersRef, where("userId", "==", userId));
    const snapshot = await getDocs(myLettersQuery);
    const myRefArr = [];
    snapshot.forEach((letter) => {
      myRefArr.push(letter.ref);
    });
    for (const myRef of myRefArr) {
      await updateDoc(myRef, fsEditObj);
    }
  };

  return (
    <Container>
      <ProfileWrapper>
        <h1>프로필 관리</h1>
        <label>
          <Avatar size="large" src={selectedImg} />
          <input
            type="file"
            onChange={previewImg}
            accept="image/jpg, image/png"
          />
        </label>
        {isEditing ? (
          <input
            autoFocus
            defaultValue={nickname}
            onChange={(event) => setEditingText(event.target.value)}
          />
        ) : (
          <Nickname>{nickname}</Nickname>
        )}
        <UserId>{userId}</UserId>
        {isEditing ? (
          <div>
            <Button text="취소" onClick={() => setIsEditing(false)} />
            <Button
              onClick={onEditDone}
              text="수정완료"
              disabled={!editingText && selectedImg === avatar}
            />
          </div>
        ) : (
          <Button text="수정하기" onClick={() => setIsEditing(true)} />
        )}
      </ProfileWrapper>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileWrapper = styled.section`
  width: 500px;
  border-radius: 12px;
  background-color: lightgray;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  & > label > input {
    display: none;
  }

  & input {
    height: 24px;
    outline: none;
    padding: 6px 12px;
  }

  & h1 {
    font-size: 36px;
    font-weight: 700;
  }

  & div {
    display: flex;
    gap: 24px;
  }
`;

const Nickname = styled.span`
  font-size: 24px;
  font-weight: 700;
`;

const UserId = styled.span`
  font-size: 16px;
  color: gray;
`;
