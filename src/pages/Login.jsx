import Button from "components/common/Button";
import styled from "styled-components";
import { toast } from "react-toastify";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "firebaseApp";

export default function Login() {
  const provider = new GoogleAuthProvider();

  const loginByGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        toast.success("로그인 성공");
      })
      .catch((error) => {
        // Handle Errors here.
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
  };

  return (
    <Container>
      <Div>
        <Title>구글 로그인</Title>
        <Button text="구글 로그인" size="large" onClick={loginByGoogle} />
      </Div>
    </Container>
  );
}

const Container = styled.div`
  background-color: lightgray;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Div = styled.div`
  background-color: white;
  width: 500px;
  border-radius: 12px;
  padding: 12px;
  font-size: 16px;
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 24px;
`;
