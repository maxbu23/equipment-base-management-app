import React, { useEffect, useState } from "react"
import { Button, Dropdown, Form, Table } from "react-bootstrap"
import { Equipment, EquipmentType } from "../../model/Models"
import axios from "axios";
import useLocalState from "../../util/useLocalStorage";
import UpdateEquipment from "../update/UpdateEquipment";

type FunctionType = () => void;

interface Props {
    equipments: Equipment[];
    showDelete: boolean;
    showUpdate: boolean;
    refreshData: FunctionType;
}

const EquipmentList: React.FC<Props> = ({equipments, refreshData, showDelete, showUpdate}) => {
        
        const [jwt, setJwt] = useLocalState("", "jwt")
        const [modalShow, setModalShow] = useState(false);

        const [filterColumn, setFilterColumn] = useState("Name");
        const [filterValue, setFilterValue] = useState("");

        const [equipmentsToShow, setEquipmentsToShow] = useState<Array<Equipment>>();
        const [equipmentToUpdate, setEquipmentToUpdate] = useState<Equipment>(
            {   
                id: "",
                name: "",
                brand: "",
                serialNumber: "",
                equipmentType: EquipmentType.PC
            }
        )

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

        function deleteEquipment(id: string) {
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
                setFilterValue("")
                refreshData()
            })
        }
        
        function updateEquipment(equipment: Equipment) {
            setEquipmentToUpdate(equipment)
            console.log("Equipment: " + equipment.name)
            setModalShow(true);
        }
            
        return(
            <>  
                <div style={{display: "flex", margin: "5px"}}>
                    <Dropdown>
                        <Dropdown.Toggle className="filter-dropdown" id="dropdown-basic">
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
                    <Table striped borderless size="sm">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Name</th>
                                <th>Brand</th>
                                <th>Serial number</th>
                                {showUpdate ? <th style={{border:"none"}}></th> : <></>}
                                {showDelete ? <th style={{border:"none"}}></th> : <></>}                                
                            </tr>
                        </thead>
                        <tbody>
                        {equipmentsToShow ? equipmentsToShow.map((equipment) =>
                            
                                <tr key={equipment.id}>
                                    <td>{equipment.equipmentType}</td>
                                    <td>{equipment.name}</td>
                                    <td>{equipment.brand}</td>
                                    <td>{equipment.serialNumber}</td>
                                    
                                    {showUpdate ? 
                                        <td>
                                            <button className="button" onClick={() => updateEquipment(equipment)}>Update</button>
                                        </td>
                                    : <></>}
                                    {showDelete ? 
                                        <td>
                                            <button className="button" onClick={() => deleteEquipment(equipment.id)}>Delete</button>
                                        </td>
                                    : <></>}   
                                </tr>
                        ): <></>} 
                        <UpdateEquipment
                            equipment={equipmentToUpdate}
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                        />
                        </tbody>
                    </Table>
                </div>
            </>
    
    )
}

export default EquipmentList;