import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "api/mutationFns";
import { getComments } from "api/queryFns";
import { toast } from "react-toastify";
import styled from "styled-components";
import CommentCard from "./CommentCard";

export default function CommentList({ id }) {
  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", id],
    queryFn: getComments,
  });
  const queryClient = useQueryClient();
  const { mutate: mutateToDelete } = useMutation({
    mutationFn: deleteComment,
    onSuccess: async () => {
      toast.success("댓글 삭제 완료");
      await queryClient.invalidateQueries(["comments", id]);
    },
  });

  if (isLoading) {
    <p>로딩중...</p>;
  }

  return (
    <Container>
      {comments?.length === 0 ? (
        <p>남겨진 댓글이 없습니다.</p>
      ) : (
        comments?.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            letterId={id}
            onDelete={mutateToDelete}
          />
        ))
      )}
    </Container>
  );
}

const Container = styled.ul`
  background-color: gray;
  width: 700px;
  padding: 12px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 12px;
  li {
    padding: 12px;
    background-color: black;
    div {
      width: 100%;
      display: flex;
      justify-content: space-between;
      color: white;
      span {
        font-weight: 500;
        color: yellow;
        margin-bottom: 12px;
        display: block;
      }
      p {
        width: auto;
        text-decoration-line: underline;
        cursor: pointer;
      }
    }
    p {
      width: 100%;
    }
  }
`;
