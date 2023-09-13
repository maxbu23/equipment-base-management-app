import React from "react";
import useLocalState from "../util/useLocalStorage";

const DashboardComponent = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");

    return(
        <div 
            style={{
                margin: "2em" 
            }}
        >
           <button>Submit New Assignment</button>
        </div>
    );
}

export default DashboardComponent;

