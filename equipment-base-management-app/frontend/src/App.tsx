import { useEffect } from "react";
import useLocalState from "./util/useLocalStorage";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/DashboardComponent";
import LoginComponent from "./components/LoginComponent";
import PrivateRoute from "./util/PrivateRoute";

function App() {
const [jwt, setJwt] = useLocalState("", "jwt");



  return(
    <Routes>
      <Route path="/dashboard" element={
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
        }/>
      <Route path="/" element={<LoginComponent />}/>
      <Route path="/login" element={<LoginComponent />}/>    
    </Routes>
  )
}

export default App;

// ReactDOM.render(
//   <RegistrationComponent/>,
//   document.querySelector('#root')
// )