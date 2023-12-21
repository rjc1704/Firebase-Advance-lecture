import { useState } from "react";
import styled from "styled-components";
import Button from "./common/Button";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addLetter } from "api/mutationFns";
import { useContext } from "react";
import { AuthContext } from "context/AuthContext";

export default function AddForm() {
  const { currentUser, isAuth } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [member, setMember] = useState("카리나");

  const queryClient = useQueryClient();
  const { mutate: mutateToAdd } = useMutation({
    mutationFn: addLetter,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["letters", member]);
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  const onAddLetter = (event) => {
    event.preventDefault();
    if (!content) return alert("내용은 필수값입니다.");

    const newLetter = {
      nickname: currentUser.displayName,
      content,
      avatar: currentUser.photoURL,
      writedTo: member,
      createdAt: new Date().toLocaleDateString("ko", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      userId: currentUser.uid,
    };

    mutateToAdd(newLetter);
    setContent("");
  };

  return (
    <Form onSubmit={onAddLetter}>
      {isAuth ? (
        <>
          <InputWrapper>
            <label>닉네임:</label>
            <p>{currentUser.displayName}</p>
          </InputWrapper>
          <InputWrapper>
            <label>내용:</label>
            <textarea
              placeholder="최대 100글자까지 작성할 수 있습니다."
              maxLength={100}
              onChange={(event) => setContent(event.target.value)}
              value={content}
            />
          </InputWrapper>
          <SelectWrapper>
            <label>누구에게 보내실 건가요?</label>
            <select onChange={(event) => setMember(event.target.value)}>
              <option>카리나</option>
              <option>윈터</option>
              <option>닝닝</option>
              <option>지젤</option>
            </select>
          </SelectWrapper>
          <Button text="팬레터 등록" />
        </>
      ) : (
        <p>로그인하면 글을 남길 수 있습니다.</p>
      )}
    </Form>
  );
}

const Form = styled.form`
  background-color: gray;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 500px;
  border-radius: 12px;
  margin: 20px 0;
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  & label {
    width: 80px;
  }
  & input,
  textarea {
    width: 100%;
    padding: 12px;
  }
  & textarea {
    resize: none;
    height: 80px;
  }
  & p {
    color: white;
    width: 100%;
  }
`;

const SelectWrapper = styled(InputWrapper)`
  justify-content: flex-start;
  & label {
    width: 170px;
  }
`;
