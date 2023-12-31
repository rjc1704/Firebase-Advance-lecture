import styled from "styled-components";
import { useSelector } from "react-redux";
import LetterCard from "./LetterCard";
import { useQuery } from "@tanstack/react-query";
import { getLetters } from "api/queryFns";
import { toast } from "react-toastify";

export default function LetterList() {
  const activeMember = useSelector((state) => state.member);
  const { data: letters, isLoading } = useQuery({
    queryKey: ["letters", activeMember],
    queryFn: getLetters,
    throwOnError: (err) => {
      console.log("err", err);
      toast.error(err.message);
    },
  });

  if (isLoading) {
    return <p>로딩중...</p>;
  }

  return (
    <ListWrapper>
      {letters.length === 0 ? (
        <p>
          {activeMember}에게 남겨진 팬레터가 없습니다. 첫 번째 팬레터의 주인공이
          되보세요!
        </p>
      ) : (
        letters.map((letter) => <LetterCard key={letter.id} letter={letter} />)
      )}
    </ListWrapper>
  );
}

const ListWrapper = styled.ul`
  background-color: black;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 500px;
  border-radius: 12px;
  padding: 12px;
  color: white;
`;
