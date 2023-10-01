import React from "react";
import useLocalState from "../util/useLocalStorage";

const UserDashboardComponent = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");

    return(
        <div 
            style={{
                margin: "2em" 
            }}
        >
            <h1>User dashboard</h1>
           <button>Submit New Assignment</button>
        </div>
    );
}

export default UserDashboardComponent;

