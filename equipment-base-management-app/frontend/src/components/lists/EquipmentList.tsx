import React, { useEffect, useState } from "react"
import { Dropdown, Form, Table, Tooltip } from "react-bootstrap"
import { Equipment, EquipmentWithLocalization, EquipmentType } from "../../model/Models"
import axios from "axios";
import useLocalState from "../../util/useLocalStorage";
import UpdateEquipment from "../update/UpdateEquipment";
import ExportFile from "../export/ExportFile";
import AssignEquipment from "../update/AssignEquipment";

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

type FunctionType = () => void;

interface Props {
    equipments: Equipment[];
    showAdminActions: boolean;
    refreshData: FunctionType;
}

const EquipmentList: React.FC<Props> = ({equipments, refreshData, showAdminActions}) => {
        
        const [jwt, setJwt] = useLocalState("", "jwt");
        const [updateEquipmentModalShow, setUpdateEquipmentModalShow] = useState(false);
        const [exportModalShow, setExportModalShow] = useState(false);
        const [assignModalShow, setAssignModalShow] = useState(false);

        const [filterColumn, setFilterColumn] = useState("Name");
        const [filterValue, setFilterValue] = useState("");

        const [equipmentsToShow, setEquipmentsToShow] = useState<Array<Equipment>>();
        const [equipmentToUpdate, setEquipmentToUpdate] = useState<Equipment>(
            {   
               
                    id: "",
                    name: "",
                    brand: "",
                    serialNumber: "",
                    equipmentType: EquipmentType.PC,
                
                localization: {
                    id: "",
                    department: "",
                    building: "",
                    floor: -1,
                    roomNumber: -1
                }
            }
        );

        const [equipmentToAssign, setEquipmentToAssign] = useState<Equipment>(
            {   
                id: "",
                name: "",
                brand: "",
                serialNumber: "",
                equipmentType: EquipmentType.PC
            }
        );

        useEffect(() => {
            setEquipmentsToShow(equipments);
        }, [equipments])

        // useEffect(() => {
        //     const regex = new RegExp(filterValue, 'i');
        //     let filterdEquipments;
        //     switch (filterColumn) {
        //         case "Name":
        //             filterdEquipments = equipments.filter(equipmentWithLocation => regex.test(equipmentWithLocation.equipment.name))
        //             setEquipmentsToShow(filterdEquipments)
        //             break;
        //         case "Brand":
        //             filterdEquipments = equipments.filter(equipmentWithLocation => regex.test(equipmentWithLocation.equipment.brand))
        //             setEquipmentsToShow(filterdEquipments)
        //             break;
        //         case "SerialNumber":
        //             filterdEquipments = equipments.filter(equipmentWithLocation => regex.test(equipmentWithLocation.equipment.serialNumber))
        //             setEquipmentsToShow(filterdEquipments)
        //             break;
        //     }

        // }, [filterValue])

        function deleteEquipment(id: string) {
            axios.delete(
                `/api/v1/admin/equipments/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        Accept: "application/json"
                    }
                }
            ).then((response) => {
                if (response.status === 200) {
                    alert("Equipment deleted successfully");
                }
                setFilterValue("")
                refreshData()
            })
        }
        
        function updateEquipment(equipment: Equipment) {
            setEquipmentToUpdate(equipment)
            setUpdateEquipmentModalShow(true);
        }
        
        function exportEquipmentsToXlsxFile() {
            setExportModalShow(true);
        }

        function assignEquipment(equipment: Equipment) {
            setEquipmentToAssign(equipment);
            setAssignModalShow(true);
        }

        function unassignEquipment(equipmentId: string) {
            axios.put(
                `/api/v1/admin/equipments/remove-assignment/${equipmentId}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        Accept: "application/json"
                    }
                }
                
            ).then((response => {
                if (response.status === 200) {
                    alert("Assignment has been removed");
                }
                refreshData()            
            })).catch((error) => {
                console.log(error);
            })
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
                    <Table className="" striped borderless size="sm">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Name</th>
                                <th>Brand</th>
                                <th>Serial number</th>
                                <th>Owner</th>
                                <th>Department</th>
                                <th>Building</th>
                                <th>Floor</th>
                                <th>Room</th>
                                {showAdminActions ? 
                                <th colSpan={3} style={{border:"none"}}>                
                                    <button className="button" onClick={() => exportEquipmentsToXlsxFile()}>Export to .xslx</button>
                                </th> : <></>}
                            </tr>
                        </thead>
                        <tbody>
                        {equipmentsToShow ? equipmentsToShow.map((equipmentWithLocation) =>
                                <tr className="table-row" key={equipmentWithLocation.id}>
                                    <td>{equipmentWithLocation.equipmentType}</td>
                                    <td>
                                    <OverlayTrigger
                                        overlay={<Tooltip id="button-tooltip-2">{equipmentWithLocation.name}</Tooltip>}
                                        placement="top-start"
                                    >
                                        <span>{equipmentWithLocation.name}</span>
                                    </OverlayTrigger>
                                        
                                    </td>
                                    <td>{equipmentWithLocation.brand}</td>
                                    <td>{equipmentWithLocation.serialNumber}</td>
                                    <td> 
                                    <OverlayTrigger
                                        overlay={<Tooltip id="button-tooltip-2">{equipmentWithLocation.owner?.email}</Tooltip>}
                                        placement="top-start"
                                    >
                                        <span>{equipmentWithLocation.owner?.email}</span>
                                    </OverlayTrigger>
                                    </td>
                                    <td>
                                        {equipmentWithLocation.localization ? equipmentWithLocation.localization.department : ""}
                                    </td>
                                    <td>
                                        {equipmentWithLocation.localization ? equipmentWithLocation.localization.building : ""}
                                    </td>
                                    <td>
                                        {equipmentWithLocation.localization ? equipmentWithLocation.localization.floor : ""}
                                    </td>
                                    <td>
                                        {equipmentWithLocation.localization ? equipmentWithLocation.localization.roomNumber : ""}
                                    </td>
                                    {showAdminActions ? 
                                        <>
                                            {equipmentWithLocation.equipmentState === 'ASSIGNED' ? 
                                                <td>
                                                    <button className="button" onClick={() => unassignEquipment(equipmentWithLocation.id)}>Remove assignment</button>
                                                </td>
                                                : 
                                                <td>
                                                    <button className="button" onClick={() => assignEquipment(equipmentWithLocation)}>Assign</button>
                                                </td>
                                            }
                                            
                                            <td>
                                                <button className="button" onClick={() => updateEquipment(equipmentWithLocation)}>Update</button>
                                            </td>
                                            <td>
                                                <button className="button" onClick={() => deleteEquipment(equipmentWithLocation.id)}>Delete</button>
                                            </td>
                                        </>
                                    : <></>}   
                                </tr>
                        ): <></>} 
                        {/* <UpdateEquipment
                            equipmentWithLocalization={equipmentToUpdate}
                            show={updateEquipmentModalShow}
                            onHide={() => setUpdateEquipmentModalShow(false)}
                        /> */}
                        <AssignEquipment 
                            equipmentToAssign={equipmentToAssign}
                            show={assignModalShow}
                            onHide={() => setAssignModalShow(false)}
                        />
                        <ExportFile 
                            show={exportModalShow}
                            onHide={() => setExportModalShow(false)}
                        />
                        </tbody>
                    </Table>
                
                </div>
                
            </>
    
    )
}

export default EquipmentList;