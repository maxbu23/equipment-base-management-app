import { useEffect } from "react";
import useLocalState from "./util/useLocalStorage";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboardComponent";
import LoginComponent from "./components/LoginComponent";
import PrivateRoute from "./util/PrivateRoute";
import UserDashboardComponent from "./components/UserDashboardComponent";

function App() {
const [jwt, setJwt] = useLocalState("", "jwt");



  return(
    <Routes>
      <Route path="/user-dashboard" element={
            <PrivateRoute>
                <UserDashboardComponent />
            </PrivateRoute>
        }/>
        <Route path="/admin-dashboard" element={
            <PrivateRoute>
                <AdminDashboard />
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