import { ChangeEvent, useEffect, useState } from "react";
import { User } from "../../model/Models";
import useLocalState from "../../util/useLocalStorage";
import { Button, Form, Modal, Nav, Table } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

type FunctionType = () => void;

interface Props {
    onHide: FunctionType;
    show: boolean; 
}

const RegistrationComponent = (props: Props) => {
    
    const [jwt, setJwt] = useLocalState("", "jwt")

    const [email, setEmail] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");

    function sendRegisterRequest() {
        if (!isEmailDomainIsValid(email)) {
            alert("Email domain is not valid! Only emails from agh.edu.pl can register!");
            return;
        }
        const reqBody = {
            firstname: firstname,
            lastname: lastname,
            email: email,
        }
      
          fetch('/api/v1/auth/register',
            {
                headers: {
                    "Content-Type": "application/json"
                },
                method: 'POST',
                body: JSON.stringify(reqBody)
            }
        )
        .then((response) =>{
            if (response.status === 200) {
                alert("You have been registered successfully. Now you can log in");
                clearState();
                props.onHide();
            } else {
                alert("Something went wrong!");
            }
        }).catch((message: string) => {
            alert(message);
        });
    }

    function clearState() {
        setEmail("");
        setFirstname("");
        setLastname("");
    }

    function isEmailDomainIsValid(email: string) {
        return email.endsWith("agh.edu.pl");
    }

    return (
        <Modal
          {...props}
          size="lg"
          centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Registration
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form">
                    <div className="input-container">
                        <label htmlFor='email'>Firstname: </label>
                        <input 
                            type='text' 
                            id='firstname' 
                            value={firstname} 
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstname(e.target.value)}
                        />
                        <div className="input-container">
                            <label htmlFor='email'>Lastname: </label>
                            <input 
                                type='text' 
                                id='lastname' 
                                value={lastname} 
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setLastname(e.target.value)}
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor='email'>Email: </label>
                            <input 
                                type='text' 
                                id='email' 
                                value={email} 
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <button className="button" id="submit" type="button" onClick={() => sendRegisterRequest()}>Register</button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
      );
}

export default RegistrationComponent;
