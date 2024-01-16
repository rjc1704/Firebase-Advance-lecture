import { auth } from "firebaseApp";

export default function CommentCard({ comment, letterId, onDelete }) {
  return (
    <li>
      <div>
        <span>{comment.nickname}</span>
        {comment.userId === auth.currentUser?.uid && (
          <p onClick={() => onDelete({ letterId, commentId: comment.id })}>
            삭제
          </p>
        )}
      </div>
      <p>{comment.content}</p>
      <p>{comment.createdAt}</p>
    </li>
  );
}
