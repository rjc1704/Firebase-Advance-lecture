import { AuthContext } from "context/AuthContext";
import { useContext } from "react";
import { useState } from "react";
import Button from "../common/Button";
import { getFormattedDate } from "util/date";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { toast } from "react-toastify";
import { addComment } from "api/mutationFns";

export default function CommentAddForm({ id }) {
  const [content, setContent] = useState("");
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const { mutate: mutateToAdd } = useMutation({
    mutationFn: addComment,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["comments"]);
      toast.success("댓글이 등록되었습니다.");
      setContent("");
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!content) return toast.warn("댓글을 입력하세요.");
    const comment = {
      content,
      userId: currentUser.uid,
      nickname: currentUser.displayName,
      createdAt: getFormattedDate(Date.now()),
    };
    mutateToAdd({ id, comment });
  };
  return (
    <Form onSubmit={onSubmit}>
      {currentUser ? (
        <>
          <label>닉네임</label>
          <textarea
            placeholder="댓글은 1~100글자까지 입력가능합니다."
            maxLength={100}
            minLength={1}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button text="등록" />
        </>
      ) : (
        <p>로그인 시 댓글 등록 가능합니다.</p>
      )}
    </Form>
  );
}

const Form = styled.form`
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: gray;
  width: 700px;
  padding: 12px;
  color: white;
  label {
    display: block;
    font-weight: 700;
    font-size: 24px;
    margin-bottom: 6px;
  }
  textarea {
    width: 100%;
    height: 50px;
    padding: 6px;
    resize: none;
  }
`;
