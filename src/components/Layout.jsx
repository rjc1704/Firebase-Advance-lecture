import { AuthContext } from "context/AuthContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "firebaseApp";
import { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";

export default function Layout() {
  const provider = new GoogleAuthProvider();
  const { isAuth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
  const handleAuth = async (event) => {
    event.preventDefault();
    if (isAuth) {
      // 로그아웃 처리
      // 클라이언트 로그아웃 처리 후 Auth 서버 로그아웃 처리
      navigate("/");
      logout();
    } else {
      // 로그인 처리
      loginByGoogle();
    }
  };
  return (
    <>
      <Header>
        <Link to="/">Home</Link>
        <div>
          {isAuth && <Link to="/profile">내 프로필</Link>}
          <Link onClick={handleAuth}>
            {auth.currentUser ? "로그아웃" : "로그인"}
          </Link>
        </div>
      </Header>
      <Outlet />
    </>
  );
}

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 30px;
  height: 30px;
  background-color: gray;
  user-select: none;
  & a {
    text-decoration: none;
    color: inherit;
    &:hover {
      color: white;
    }
  }
  & div a:nth-child(2) {
    margin-left: 30px;
  }
`;
