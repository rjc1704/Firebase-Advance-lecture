import { onAuthStateChanged } from "firebase/auth";
import { auth } from "firebaseApp";
import { createContext, useCallback, useEffect, useState } from "react";

export const AuthContext = createContext(null);

function AuthContextProvider({ children }) {
  const [init, setInit] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuth, setIsAuth] = useState(!!auth.currentUser);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAuth(false);
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
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
