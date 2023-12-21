import { onAuthStateChanged } from "firebase/auth";
import { auth } from "firebaseApp";
import { createContext, useCallback, useEffect, useState } from "react";

export const AuthContext = createContext({
  init: false,
  isAuth: false,
  currentUser: null,
});

function AuthContextProvider({ children }) {
  const [init, setInit] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuth, setIsAuth] = useState(!!auth.currentUser);
  console.log("currentUser in Context:", currentUser);
  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAuth(false);
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log("onAuthStateChange 실행");
      if (user) {
        setIsAuth(true);
        setCurrentUser(user);
      } else {
        setIsAuth(false);
        setCurrentUser(null);
      }
      setInit(true);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ init, isAuth, currentUser, setCurrentUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
