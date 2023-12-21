import Loader from "components/common/Loader";
import { AuthContext } from "context/AuthContext";
import { useContext } from "react";
import Router from "shared/Router";

function App() {
  const { init } = useContext(AuthContext);
  return <>{init ? <Router /> : <Loader />}</>;
}

export default App;
