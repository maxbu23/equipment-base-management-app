import React, { useEffect, useMemo, useState } from "react"
import { Dropdown, Form, Table, Tooltip } from "react-bootstrap"
import { Equipment, EquipmentWithLocalization, EquipmentType, User } from "../../model/Models"
import axios from "axios";
import useLocalState from "../../util/useLocalStorage";
import UpdateEquipment from "../modals/UpdateEquipment";
import ExportFile from "../export/ExportFile";
import AssignEquipment from "../modals/AssignEquipment";

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import UserDetails from "../details/UserDetails";

type FunctionType = () => void;

interface Props {
    equipments: Equipment[];
    showAdminActions: boolean;
    showOwnerEmail: boolean;
    refreshData: FunctionType;
}

const EquipmentList: React.FC<Props> = ({equipments, showOwnerEmail, refreshData, showAdminActions}) => {
        
        const [jwt, setJwt] = useLocalState("", "jwt");
        
        // modals
        const [updateEquipmentModalShow, setUpdateEquipmentModalShow] = useState(false);
        const [exportModalShow, setExportModalShow] = useState(false);
        const [assignModalShow, setAssignModalShow] = useState(false);
        const [userDetailsModalShow, setUserDetailsModalShow] = useState(false);

        const [selectedUser, setSelectedUser] = useState<User>();

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

        useMemo(() => {
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

        function showUserDetails(user: User) {
            setSelectedUser(user);
            setUserDetailsModalShow(true);
        }

        function removeAssingnment(equipmentId: string) {
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
                                <th>Status</th>
                                <th>Name</th>
                                <th>Brand</th>
                                <th>Serial number</th>
                                {showOwnerEmail ? <th>Owner</th> : <></>}
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
                        {equipmentsToShow ? equipmentsToShow.map((equipment) =>
                                <tr className="table-row" key={equipment.id}>
                                    <td>{equipment.equipmentType}</td>
                                    <td>{equipment.equipmentState}</td>
                                    <td>
                                    <OverlayTrigger
                                        overlay={<Tooltip id="button-tooltip-2">{equipment.name}</Tooltip>}
                                        placement="top-start"
                                    >
                                        <span>{equipment.name}</span>
                                    </OverlayTrigger>
                                        
                                    </td>
                                    <td>{equipment.brand}</td>
                                    <td>{equipment.serialNumber}</td>
                                    {showOwnerEmail && equipment.owner ? 
                                        <td onClick={() => showUserDetails(equipment.owner as User)}> 
                                            <OverlayTrigger
                                                overlay={<Tooltip id="button-tooltip-2">{equipment.owner?.email}</Tooltip>}
                                                placement="top-start"
                                            >
                                                <span>{equipment.owner?.email}</span>
                                            </OverlayTrigger>
                                        </td> : <td></td>
                                    }
                                    <td>
                                        {equipment.localization ? equipment.localization.department : ""}
                                    </td>
                                    <td>
                                        {equipment.localization ? equipment.localization.building : ""}
                                    </td>
                                    <td>
                                        {equipment.localization ? equipment.localization.floor : ""}
                                    </td>
                                    <td>
                                        {equipment.localization ? equipment.localization.roomNumber : ""}
                                    </td>
                                    {showAdminActions ? 
                                        <>
                                            {equipment.equipmentState === "BROKEN" || equipment.equipmentState == "IN_SERVICE" ? 
                                            <>
                                                <td>
                                                    <button disabled className="disabled-button" onClick={() => assignEquipment(equipment)}>Assign</button>
                                                </td>
                                            </> 
                                            : 
                                            <>
                                                {equipment.equipmentState === 'ASSIGNED' ? 
                                                    <td>
                                                        <button className="button" onClick={() => removeAssingnment(equipment.id)}>Remove assignment</button>
                                                    </td>
                                                    : 
                                                    <td>
                                                        <button className="button" onClick={() => assignEquipment(equipment)}>Assign</button>
                                                    </td>
                                                }
                                            
                                            </>}
                                           
                                            
                                            <td>
                                                <button className="button" onClick={() => updateEquipment(equipment)}>Update</button>
                                            </td>
                                            <td>
                                                <button className="button" onClick={() => deleteEquipment(equipment.id)}>Delete</button>
                                            </td>
                                        </>
                                    : <></>}   
                                </tr>
                        ): <></>} 
                        <UpdateEquipment
                            equipment={equipmentToUpdate}
                            show={updateEquipmentModalShow}
                            onHide={() => setUpdateEquipmentModalShow(false)}
                        />
                        <AssignEquipment 
                            equipmentToAssign={equipmentToAssign}
                            show={assignModalShow}
                            onHide={() => setAssignModalShow(false)}
                        />
                        <ExportFile 
                            show={exportModalShow}
                            onHide={() => setExportModalShow(false)}
                        />
                        <UserDetails 
                            show={userDetailsModalShow}
                            onHide={() => setUserDetailsModalShow(false)}
                            user={selectedUser as User}
                        />
                        </tbody>
                    </Table>
                
                </div>
                
            </>
    
    )
}

export default EquipmentList;