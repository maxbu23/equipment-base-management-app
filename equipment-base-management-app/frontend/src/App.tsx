import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/dashboards/AdminDashboardComponent";
import LoginComponent from "./components/authorization/LoginComponent";
import { PrivateRoute, AdminRoute } from "./util/Routes";
import UserDashboardComponent from "./components/dashboards/UserDashboardComponent";
import AddNewUserComponent from "./components/AddNewEquipmentComponent";
import "./style/Buttons.css"
import ImportFile from "./components/export/ImportFile";
import { BrowserView, MobileView } from "react-device-detect";
import MobileComponent from "./components/dashboards/MobileComponent";
import Scanner from "./components/Scanner";


function App() {

  return(
    <>
    <Routes>
      <Route path="/" element={<LoginComponent />}/>
      <Route path="/login" element={<LoginComponent />}/>   
    </Routes>
    <BrowserView>
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
        <Route path="add-new-equipment" element={
          <AdminRoute>
              <AddNewUserComponent />
          </AdminRoute>
        }/> 
        <Route path="/backup-import" element={
          <AdminRoute>
              <ImportFile />
          </AdminRoute>
        }/> 
      </Routes>
    </BrowserView>
    <MobileView>
        <Routes>
          <Route path="/mobile-dashboard" element={<MobileComponent />}>
          </Route>
            <Route path="/scanner" element={<Scanner />}>
              </Route>
          
        </Routes>
        </MobileView>
    </>
  )
}

export default App;