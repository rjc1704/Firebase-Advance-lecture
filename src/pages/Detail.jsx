import Avatar from "components/common/Avatar";
import Button from "components/common/Button";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getLetter } from "api/queryFns";
import { deleteLetter, editLetter } from "api/mutationFns";
import { useContext } from "react";
import { AuthContext } from "context/AuthContext";
import CommentList from "components/comments/CommentList";
import CommentAddForm from "components/comments/CommentAddForm";

export default function Detail() {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const { data: letter, isLoading } = useQuery({
    queryKey: ["letters", id],
    queryFn: getLetter,
  });
  const queryClient = useQueryClient();
  const { mutate: mutateToDelete } = useMutation({
    mutationFn: deleteLetter,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["letters"]);
    },
  });
  const { mutate: mutateToEdit } = useMutation({
    mutationFn: editLetter,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["letters"]);
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState("");
  const navigate = useNavigate();

  const onDeleteBtn = () => {
    const answer = window.confirm("정말로 삭제하시겠습니까?");
    if (!answer) return;
    mutateToDelete(id);
    navigate("/");
  };
  const onEditDone = () => {
    if (!editingText) return alert("수정사항이 없습니다.");

    mutateToEdit({ id, editingText });

    setIsEditing(false);
    setEditingText("");
  };

  if (isLoading) {
    return <p>로딩중...</p>;
  }

  const myUserId = currentUser?.uid;
  const { avatar, nickname, createdAt, writedTo, content, userId } = letter;
  const isMine = myUserId === userId;

  return (
    <Container>
      <Link to="/">
        <HomeBtn>
          <Button text="홈으로" />
        </HomeBtn>
      </Link>

      <DetailWrapper>
        <UserInfo>
          <AvatarAndNickname>
            <Avatar src={avatar} size="large" />
            <Nickname>{nickname}</Nickname>
          </AvatarAndNickname>
          <time>{createdAt}</time>
        </UserInfo>
        <ToMember>To: {writedTo}</ToMember>
        {isEditing ? (
          <>
            <Textarea
              autoFocus
              defaultValue={content}
              onChange={(event) => setEditingText(event.target.value)}
            />
            <BtnsWrapper>
              <Button text="취소" onClick={() => setIsEditing(false)} />
              <Button text="수정완료" onClick={onEditDone} />
            </BtnsWrapper>
          </>
        ) : (
          <>
            <Content>{content}</Content>
            {isMine && (
              <BtnsWrapper>
                <Button text="수정" onClick={() => setIsEditing(true)} />
                <Button text="삭제" onClick={onDeleteBtn} />
              </BtnsWrapper>
            )}
          </>
        )}
      </DetailWrapper>
      <CommentAddForm id={id} />
      <CommentList id={id} />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const HomeBtn = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
`;

const DetailWrapper = styled.section`
  background-color: gray;
  color: white;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 700px;
  min-height: 400px;
  margin-top: 80px;
`;

const UserInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AvatarAndNickname = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Nickname = styled.span`
  font-size: 32px;
`;

const ToMember = styled.span`
  font-size: 24px;
`;

const Content = styled.p`
  font-size: 24px;
  line-height: 30px;
  padding: 12px;
  background-color: black;
  border-radius: 12px;
  height: 200px;
`;

const BtnsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Textarea = styled.textarea`
  font-size: 24px;
  line-height: 30px;
  padding: 12px;
  background-color: black;
  border-radius: 12px;
  height: 200px;
  resize: none;
  color: white;
`;
