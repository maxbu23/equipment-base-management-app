import React, { useEffect, useMemo, useState } from "react"
import { Dropdown, Form, Pagination, Table, Tooltip } from "react-bootstrap"
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
import ChangeLocalization from "../modals/ChangeLocalization";

type FunctionType = () => void;

interface Props {
    equipments: Equipment[];
    isAdminDashboard: boolean;
    showChangeLocalization: boolean;
    refreshData: FunctionType;
}

const EquipmentList: React.FC<Props> = ({equipments, isAdminDashboard, showChangeLocalization, refreshData}) => {
        
        const [jwt, setJwt] = useLocalState("", "jwt");
        
        // modals
        const [updateEquipmentModalShow, setUpdateEquipmentModalShow] = useState(false);
        const [exportModalShow, setExportModalShow] = useState(false);
        const [assignModalShow, setAssignModalShow] = useState(false);
        const [userDetailsModalShow, setUserDetailsModalShow] = useState(false);
        const [changeLocalizationModalShow, setChangeLocalizationModalShow] = useState(false);

        const [selectedUser, setSelectedUser] = useState<User>();

        const [filterColumn, setFilterColumn] = useState("Name");
        const [filterValue, setFilterValue] = useState("");

        const [equipmentsToShow, setEquipmentsToShow] = useState<Array<Equipment>>([]);
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
        
        const [currentPage, setCurrentPage] = useState<number>(1);
        const [pageCount, setPageCount] = useState<number>(0);
        const [paginationItems, setPaginationItems] = useState<Array<React.ReactNode>>();

        useEffect(() => {
            setEquipmentsToShow(equipments?.slice(0,  10))
            setPageCount((equipments.length / 2) + 1);
        }, [equipments])

        useEffect(() => {
            let items = [];
            let start = currentPage ? currentPage : 1;
            if (start <= 5) {
                for (let i = 1; i <= start + 5 && i < pageCount; i++) {
                    items.push(
                        <Pagination.Item key={i} onClick={() => changePage(i)} active={currentPage === i}>{i}</Pagination.Item>
                    )
                }
            } else {
                for (let i = start - 5; i <= start + 5 && i < pageCount; i++) {
                    items.push(
                        <Pagination.Item key={i} onClick={() => changePage(i)} active={currentPage === i}>{i}</Pagination.Item>
                    )
                }
            }
            setPaginationItems(items);
        }, [pageCount, currentPage])

        useMemo(() => {

            equipments.sort((a, b) => {
                if ((a.equipmentState === 'ASSIGNED' || a.equipmentState === 'BROKEN' || a.equipmentState === 'IN_SERVICE') && b.equipmentState !== 'ASSIGNED') {
                    return -1;
                }
                if (a.equipmentState !== 'ASSIGNED' && b.equipmentState === 'ASSIGNED') {
                    return 1;
                }
                return 0;
            });

            // useMemo(() => {
            //     equipments.sort((a, b) => {
            //         if ((a.equipmentState === 'BROKEN' || a.equipmentState === 'IN_SERVICE') && b.equipmentState === 'ASSIGNED') {
            //             return -1;
            //         }
            //         if (a.equipmentState === 'ASSIGNED' && (b.equipmentState === 'BROKEN' || b.equipmentState === 'IN_SERVICE')) {
            //             return 1;
            //         }
            //         return 0;
            //     });

            const regex = new RegExp(filterValue, 'i');
            let filteredEquipments;
            switch (filterColumn) {
                case "Name":
                    filteredEquipments = equipments.filter(equipment => regex.test(equipment.name));
                    break;
                case "Brand":
                    filteredEquipments = equipments.filter(equipment => regex.test(equipment.brand));
                    break;
                case "SerialNumber":
                    filteredEquipments = equipments.filter(equipment => regex.test(equipment.serialNumber));
                    break;
                default:
                    filteredEquipments = [...equipments];
            }


        
            setPageCount(Math.ceil(filteredEquipments.length / 10));
            const start = (currentPage - 1) * 10;
            setEquipmentsToShow(filteredEquipments.slice(start, start + 10));
        }, [filterValue, equipments, currentPage, filterColumn]);
        
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
        
        function changeLocalization(equipment: Equipment) {
            alert("Equipment: " + equipment.name)
            setChangeLocalizationModalShow(true);
            setEquipmentToUpdate(equipment)
        }

        function showUserDetails(user: User) {
            setSelectedUser(user);
            setUserDetailsModalShow(true);
        }
        
        function changePage(page: number) {
            var pageSize = 10;
            setCurrentPage(page);
            setEquipmentsToShow(
                equipments?.slice((page - 1) * pageSize, ((page - 1) * pageSize) + pageSize)
            )
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
                            {isAdminDashboard ? 
                                <tr>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Name</th>
                                    <th>Brand</th>
                                    <th>Serial number</th>
                                    <th>Owner</th>
                                    <th>Department</th>
                                    <th>Building</th>
                                    <th>Floor</th>
                                    <th>Room</th>
                                    <th colSpan={3} style={{border:"none"}}>                
                                        <button className="button" onClick={() => exportEquipmentsToXlsxFile()}>Export to .xslx</button>
                                    </th>
                                </tr>
                                :
                                <tr>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Name</th>
                                    <th>Brand</th>
                                    <th>Serial number</th>
                                    <th>Department</th>
                                    <th>Building</th>
                                    <th>Floor</th>
                                    <th>Room</th>
                                    <th></th>
                            </tr>
                            }
                        </thead>
                        <tbody>
                            {isAdminDashboard ? 
                                <>
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
                                            <td onClick={() => showUserDetails(equipment.owner as User)}> 
                                                <OverlayTrigger
                                                    overlay={<Tooltip id="button-tooltip-2">{equipment.owner?.email}</Tooltip>}
                                                    placement="top-start"
                                                >
                                                <span>{equipment.owner?.email}</span>
                                                </OverlayTrigger>
                                         </td> 

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
                                                    </>
                                                }
                                        
                                                <td>
                                                    <button className="button" onClick={() => updateEquipment(equipment)}>Update</button>
                                                </td>
                                                <td>
                                                    <button className="button" onClick={() => deleteEquipment(equipment.id)}>Delete</button>
                                                </td>
                                            </>
                                    </tr>
                            ): <></>} </> : <>
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
                                        <td>
                                            {showChangeLocalization ? <><td><button className="button" onClick={() => changeLocalization(equipment)}>Change localization</button></td></> : <td></td>}
                                        </td>
                                    </tr>
                                ): <></>}
                            </>}
                        
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
                        <ChangeLocalization 
                            show={changeLocalizationModalShow}
                            equipment={equipmentToUpdate}
                            onHide={() => setChangeLocalizationModalShow(false)}
                        />
                        </tbody>
                    </Table>
                    <div>
                    </div>
                </div>
                <div>
                    {pageCount >10 ? <Pagination style={{display: "flex", justifyContent: "center"}}>
                        {paginationItems}
                    </Pagination> : <></>}
                </div>
                
            </>
    
    )
}

export default EquipmentList;