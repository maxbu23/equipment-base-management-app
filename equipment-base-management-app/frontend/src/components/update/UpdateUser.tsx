import { Button, Form, Modal } from "react-bootstrap";
import { Equipment, EquipmentType, User, UserAndEquipmentsIds } from "../../model/Models";
import { useEffect, useState } from "react";
import useLocalState from "../../util/useLocalStorage";
import axios, { AxiosResponse } from "axios";

type FunctionType = () => void;

interface Props {
    onHide: FunctionType;
    show: boolean;
    user: User; 
}

const UpdateUser = (props: Props) => {

    const [jwt, setJwt] = useLocalState("", "jwt")

    const [userId, setUserId] = useState(props.user.id)
    const [updatingFirstname, setUpdatigFirstname] = useState(props.user.firstname);
    const [updatingLastname, setUpdatingLastname] = useState(props.user.lastname);
    const [updatingEmail, setUpdatingEmail] = useState(props.user.email)
    const [updatingEquipmentIds, setUpdatingEquipmentIds] = useState<string[]>([]);


    // in case user to update was sent later
    useEffect(() => {
        setUserId(props.user.id);
        setUpdatigFirstname(props.user.firstname);
        setUpdatingLastname(props.user.lastname);
        setUpdatingEmail(props.user.email);
        
    }, [props])
    
    function sendUpdateUserRequest() {
        const updatedUser: UserAndEquipmentsIds = createUpdatedUser()
        axios.put(
            `/api/v1/admin/users`,
            updatedUser,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    Accept: "application/json"
                }
            }
        ).then((response) => {
            if (response.status === 200) {
                window.location.href = 'admin-dashboard'
            }
        })
    }

    function createUpdatedUser() : UserAndEquipmentsIds {
        let userAndEquipmentsIds = {
            user: {
                id: userId,
                firstname: updatingFirstname,
                lastname: updatingLastname,
                email: updatingEmail,
            },
            equipmentIds: updatingEquipmentIds

        }
        return userAndEquipmentsIds;
    }

    function addEquipment(id: string) {
        if (updatingEquipmentIds.includes(id)) {
            const newUpdatingEquipmentIds = updatingEquipmentIds.filter(_id => _id != id);
            setUpdatingEquipmentIds(newUpdatingEquipmentIds)
        } else {
            setUpdatingEquipmentIds(updatingEquipmentIds => [...updatingEquipmentIds, id])
        }
    }

    return (
        <Modal
          {...props}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Update user
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div>
            <div className='registration-form-user'>
                <Form.Label>Firstname</Form.Label>
                <Form.Control value={updatingFirstname} onChange={(event) => setUpdatigFirstname(event.target.value) }/>
                <Form.Label>Lastname</Form.Label>
                <Form.Control value={updatingLastname} onChange={(event) => setUpdatingLastname(event.target.value)}></Form.Control>
                <Form.Label>Email</Form.Label>
                <Form.Control value={updatingEmail} onChange={(event) => setUpdatingEmail(event.target.value)}></Form.Control>
                {/* <Form>
                    <Form.Label>Equipments</Form.Label>
                    {equipments ? equipments.map((equipment) => (
                        <div className="mb-3">
                            <Form.Check
                                key={equipment.id}
                                id={equipment.id}
                                label={equipment.name}
                                defaultChecked={equipment.equipmentState === "ASSIGNED" ? true : false}
                                onChange={(event) => addEquipment(event.target.id)}
                            />
                        </div>
                    )): <></>}
                </Form> */}
                <Button style={{width:"100%", marginTop: "10px"}} className='submit-button' onClick={() => sendUpdateUserRequest()}>Update</Button>
            </div>            
        </div>   
          </Modal.Body>
        </Modal>
      );
}

export default UpdateUser;