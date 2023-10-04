import { Navigate } from "react-router-dom";
import useLocalState from "./useLocalStorage";

export const PrivateRoute = ({children}: any) => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    
    return jwt ? children : <Navigate to="/login"/>;
}

export const AdminRoute = ({children}: any) => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [role, setRole] = useLocalState("", "role");

    return (role === "ADMIN" && jwt) ? children : <Navigate to="/user-dashboard"/>
}