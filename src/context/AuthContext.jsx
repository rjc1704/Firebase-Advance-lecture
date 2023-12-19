import { onAuthStateChanged } from "firebase/auth";
import { auth } from "firebaseApp";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({
  init: false,
  isAuth: false,
  currentUser: null,
});

function AuthContextProvider({ children }) {
  const [init, setInit] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuth, setIsAuth] = useState(!!auth.currentUser);

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
    <AuthContext.Provider value={{ init, isAuth, currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
