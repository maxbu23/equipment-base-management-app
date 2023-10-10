import React from "react"
import { Button, Table } from "react-bootstrap"
import { Equipment } from "../../model/Models"
import axios from "axios";
import useLocalState from "../../util/useLocalStorage";
import UpdateEquipment from "../update/UpdateEquipment";

type FunctionType = () => void;


interface Props {
    equipments?: Equipment[];
    refreshData: FunctionType;
}

const EquipmentList: React.FC<Props> = ({equipments, refreshData}) => {

        const [jwt, setJwt] = useLocalState("", "jwt")

        function deleteEquipment(id?: number) {
            console.log("ID: " + id)
            axios.delete(
                `api/v1/admin/equipments/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        Accept: "application/json"
                    }
                }
            ).then((respone) => {
                if (respone.status === 200) {
                    alert("Equipment deleted successfully");
                }
                refreshData()
            })
        }
        
        function updateEquipment(equipment: Equipment) {
            setModalShow(true);
        }

        const [modalShow, setModalShow] = React.useState(false);

        return(
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Brand</th>
                        <th style={{border:"none"}}></th>
                        <th style={{border:"none"}}></th>
                    </tr>
                </thead>
                <tbody>
                {equipments ? equipments.map((equipment) =>
                    
                        <tr key={equipment.id}>
                            <td>{equipment.equipmentType}</td>
                            <td>{equipment.name}</td>
                            <td>{equipment.brand}</td>
                            <td>
                                <button className="update-button" onClick={() => updateEquipment(equipment)}>Update</button>
                            </td>
                            <td>
                                <button className="delete-button" onClick={() => deleteEquipment(equipment.id)}>Delete</button>
                            </td>
                            <UpdateEquipment
                            equipment={equipment}
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                            />
                        </tr>
                ): <></>} 
                </tbody>
                <Button variant="primary" onClick={() => setModalShow(true)}>
        Launch vertically centered modal
      </Button>
               
            </Table>
    
    )
}

export default EquipmentList;