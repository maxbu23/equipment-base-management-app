import React, { useEffect, useState } from "react"
import { Button, Dropdown, Form, Table } from "react-bootstrap"
import { Equipment } from "../../model/Models"
import axios from "axios";
import useLocalState from "../../util/useLocalStorage";
import UpdateEquipment from "../update/UpdateEquipment";

type FunctionType = () => void;


interface Props {
    equipments: Equipment[];
    refreshData: FunctionType;
}

const EquipmentList: React.FC<Props> = ({equipments, refreshData}) => {

        const [jwt, setJwt] = useLocalState("", "jwt")
        const [modalShow, setModalShow] = useState(false);

        const [filterColumn, setFilterColumn] = useState("Name");
        const [filterValue, setFilterValue] = useState("");

        const [equipmentsToShow, setEquipmentsToShow] = useState<Array<Equipment>>();

        useEffect(() => {
            setEquipmentsToShow(equipments);
        }, [equipments])

        useEffect(() => {
            const regex = new RegExp(filterValue, 'i');
            let filterdEquipments;
            switch (filterColumn) {
                case "Name":
                    filterdEquipments = equipments.filter(equipment => regex.test(equipment.name))
                    setEquipmentsToShow(filterdEquipments)
                    break;
                case "Brand":
                    filterdEquipments = equipments.filter(equipment => regex.test(equipment.brand))
                    setEquipmentsToShow(filterdEquipments)
                    break;
                case "SerialNumber":
                    filterdEquipments = equipments.filter(equipment => regex.test(equipment.serialNumber))
                    setEquipmentsToShow(filterdEquipments)
                    break;
            }

        }, [filterValue])

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
        
        function updateEquipment() {
            setModalShow(true);
        }
            
        return(
            <>  
                <div style={{display: "flex", margin: "5px"}}>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {filterColumn}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item id={"Name"} onClick={(event) => setFilterColumn(event.currentTarget.id)}>Name</Dropdown.Item>
                            <Dropdown.Item id={"Brand"} onClick={(event) => setFilterColumn(event.currentTarget.id)}>Brand</Dropdown.Item>
                            <Dropdown.Item id={"SerialNumber"} onClick={(event) => setFilterColumn(event.currentTarget.id)}>Serial number</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Control 
                        type="text" 
                        placeholder={filterValue} 
                        onChange={(event) => setFilterValue(event.target.value)}
                    />
                </div>
                <div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Name</th>
                                <th>Brand</th>
                                <th>Serial number</th>
                                <th style={{border:"none"}}></th>
                                <th style={{border:"none"}}></th>
                            </tr>
                        </thead>
                        <tbody>
                        {equipmentsToShow ? equipmentsToShow.map((equipment) =>
                            
                                <tr key={equipment.id}>
                                    <td>{equipment.equipmentType}</td>
                                    <td>{equipment.name}</td>
                                    <td>{equipment.brand}</td>
                                    <td>{equipment.serialNumber}</td>
                                    <td>
                                        <button className="update-button" onClick={() => updateEquipment()}>Update</button>
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
                    </Table>
                </div>
            </>
    
    )
}

export default EquipmentList;