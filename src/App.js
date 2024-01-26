import { Routes, Route, Navigate } from "react-router-dom";
import Login, { Authorized } from "./Routes/Login";
import Home from "./Routes/Home";
import New from "./Routes/New";
import Records from "./Routes/Records";
import Profile from "./Routes/Profile";

function App() {

  const PrivateRoute = ({ children }) => {
    return !Authorized ? <Navigate to="/" /> : children;
  };

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route exact path="/new" element={<PrivateRoute><New /></PrivateRoute>} />
        <Route exact path="/records" element={<PrivateRoute><Records /></PrivateRoute>} />
        <Route exact path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route exact path="*" element={<PrivateRoute><Login /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default App;
