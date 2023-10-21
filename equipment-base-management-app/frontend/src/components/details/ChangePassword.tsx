import { Form, Modal, Table } from "react-bootstrap";
import useLocalState from "../../util/useLocalStorage";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

type FunctionType = () => void;


interface Props {
    onHide: FunctionType;
    show: boolean;
}

interface ChnagePasswordRequest {
    userId: string,
    currentPassword: string,
    newPassword: string
}

const ChangePassword = (props: Props) => {

    const [jwt, setJwt] = useLocalState("", "jwt");
    const [id, setId] = useLocalState(-1, "id")
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [equalsPasswordMessage, setEqualsPasswordMessage] = useState("")

    useEffect(() => {
        if (newPassword !== confirmedPassword && newPassword !== "") {
            setEqualsPasswordMessage("Password are not identical!")
        } else {
            setEqualsPasswordMessage("");
        }
    }, [confirmedPassword, newPassword])

    function sendChangePasswordRequest() {
        if (isNewPasswordValid()) {
            const request: ChnagePasswordRequest = createChnagePasswordRequest();
            axios.post(
                `/api/v1/auth/changePassword`,
                request,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        Accept: "application/json"
                    }
                }
            ).then((response) => {
                if (response.status === 200) {
                    alert("Password has been changed.")
                    props.onHide();
                }
            }).catch((error: AxiosError) => {
                if (error.response) {
                    if (error.response.status === 401) {
                        alert(error.response.data);
                    }
                } else {
                    alert(error)
                }
            })
        }
    }

    function createChnagePasswordRequest(): ChnagePasswordRequest {
        const request = {
            userId: id,
            currentPassword: currentPassword,
            newPassword: newPassword
        }

        return request;
    }

    function isNewPasswordValid(): boolean {
        if (newPassword === "" || confirmedPassword === "") {
            alert("New password cannot be empty!");
            return false;
        }

        if (newPassword !== confirmedPassword) {
            alert("New password and confirmed password are not equals!");
            return false;
        }

        return true;
    }

    return(
        <Modal
            {...props}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Change password
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <Form.Label htmlFor="inputPassword5">Current password</Form.Label>
                    <Form.Control
                        type="password"
                        onChange={(event) => setCurrentPassword(event.target.value)}
                    />
                    <Form.Label htmlFor="inputPassword5">New password</Form.Label>
                    <Form.Control
                        type="password"
                        onChange={(event) => setNewPassword(event.target.value)}
                    />
                        
                    <Form.Label htmlFor="inputPassword5">Confirm new password</Form.Label>
                    <Form.Control
                        type="password"
                        onChange={(event) => setConfirmedPassword(event.target.value)}
                    />
                    <div style={{paddingTop: "3px"}}>
                        <Form.Text id="passwordHelpBlock" muted>
                            <div style={{color: "red"}}>{equalsPasswordMessage}</div>
                        </Form.Text>
                    </div>
                    <div style={{paddingTop: "3px"}}>
                        <button onClick={() => sendChangePasswordRequest()} className="button">Chnage password</button>
                    </div>
                </div>   
            </Modal.Body>
        </Modal>
    );
}

export default ChangePassword;