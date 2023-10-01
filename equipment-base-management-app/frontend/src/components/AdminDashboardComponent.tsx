import React, { useEffect, useState } from "react";
import useLocalState from "../util/useLocalStorage";
import axios from "axios";

const AdminDashboardComponent = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [equipments, setEquipments] = useState(Array<String>)

    // useEffect()
    
    const config = {
        headers:{
            Authorization: `Bearer ${jwt}`,
        }
      };

    return(
        <div 
            style={{
                margin: "2em" 
            }}
        >
            <h1>Admin dashboard</h1>
                Equipments: {equipments}
           <button className="submit-button" onClick={() => {
        
          axios.get('/api/v1/admin/equipments', config)
            .then(res => console.log(res.data))
            .catch(err => console.error(err));
    }}>Submit New Assignment</button>
        </div>
    );
}

export default AdminDashboardComponent;

