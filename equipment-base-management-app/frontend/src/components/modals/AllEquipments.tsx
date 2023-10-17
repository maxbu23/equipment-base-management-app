import axios, { AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import { Modal, Form, Button, Table, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Equipment, User, UserAndEquipmentsIds } from "../../model/Models";
import useLocalState from "../../util/useLocalStorage";

type FunctionType = () => void;

interface Props {
    onHide: FunctionType;
    show: boolean;
    user: User; 
}

const AllEquipments = (props: Props) => {
    const [jwt, setJwt] = useLocalState("", "jwt")

    const [user, setUser] = useState(props.user);
    const [equipments, setEquipments] = useState<Equipment[]>([]);


    // in case user to update was sent later
    useEffect(() => {
       setUser(props.user);
        
    }, [props])
    
    useEffect(() => {
        fetchAndSetAllUserEquipments();
    }, [user])

    function fetchAndSetAllUserEquipments() {
        axios.get<Equipment[]>(
            `api/v1/admin/equipments/${user.id}`,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    Accept: "application/json"
                }
            }
        ).then((response: AxiosResponse<Equipment[]>) => {
            setEquipments(response.data);
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <>
            <Modal
                {...props}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Equipments assigned to {user.email}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table className="" striped borderless size="sm">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Name</th>
                                <th>Brand</th>
                                <th>Serial number</th>
                                <th>Department</th>
                                <th>Building</th>
                                <th>Floor</th>
                                <th>Room</th>
                            </tr>
                        </thead>
                        <tbody>
                        {equipments ? equipments.map((equipment) =>
                            <tr className="table-row" key={equipment.id}>
                                <td>{equipment.equipmentType}</td>
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
                            </tr>
                        ): <></>} 
                        </tbody>
            </Table>
        </Modal.Body>
        </Modal>


        </>
      );
}

export default AllEquipments;