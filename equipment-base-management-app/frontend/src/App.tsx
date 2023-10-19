import useLocalState from "./util/useLocalStorage";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/dashboards/AdminDashboardComponent";
import LoginComponent from "./components/LoginComponent";
import { PrivateRoute, AdminRoute } from "./util/Routes";
import UserDashboardComponent from "./components/dashboards/UserDashboardComponent";
import RegistrationComponent from "./components/AddNewUserComponent";
import AddNewUserComponent from "./components/AddNewEquipmentComponent";
import "./style/Buttons.css"

function App() {
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
      <Route path="/registration-form" element={
        <AdminRoute>
          <RegistrationComponent />
        </AdminRoute>
      }/>
      <Route path="add-new-equipment" element={
        <AdminRoute>
            <AddNewUserComponent />
        </AdminRoute>
      }/> 
      <Route path="/" element={<LoginComponent />}/>
      <Route path="/login" element={<LoginComponent />}/>   
    </Routes>
  )
}

export default App;