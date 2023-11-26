import { ChangeEvent, useState } from "react";
import {isMobile} from 'react-device-detect';
import useLocalState from "../../util/useLocalStorage";
import "../../style/Common.css"
import { Nav } from "react-bootstrap";
import RegistrationComponent from "./RegistrationComponent";
import ForgottenPassword from "./ForgottenPassword";

const LoginComponent = () => {

    const[email, setEmail] = useState<string>("");
    const[password, setPassword] = useState<string>("");
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [id, setId] = useLocalState(-1, "id")
    const [role, setRole] = useLocalState("", "role")
    const [user, setUser] = useLocalState("", "userData")

    const [registrationModalShow, setRegistrationModalShow] = useState(false);
    const [forgottenPasswordModalShow, setForgottenPasswordModalShow] = useState(false);

    function sendLoginRequest() {
        const reqBody = {
            email: email,
            password: password
        }
      
          fetch('/api/v1/auth/authenticate',
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
                return Promise.all([response.json(), response.status]);
            } else {
                return Promise.reject("Invalid login attempt!");
            }
          })
          .then(([body, statusCode]) => {
            setJwt(body.jwtToken);
            setId(body.id);
            setRole(body.role);
            setUser({
                firstname: body.firstname,
                lastname: body.lastname,
                email: body.email
            });
            if (isMobile) {
                window.location.href = "/mobile-dashboard"
            } else {
                if (body.role === 'ADMIN' ) {
                    window.location.href = "/admin-dashboard";
                } else {
                    window.location.href = "/user-dashboard";
                }
            }
            
          }).catch((message: string) => {
            alert(message);
          });
    }

    return(
        <>
            <div className="center">
                <h1>Login</h1>
                <div className="form">
                    <div className="input-container">
                        <label htmlFor='email'>Email: </label>
                        <input 
                            type='email' 
                            id='email' 
                            value={email} 
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor='password'>Password: </label>
                        <input 
                            type='password' 
                            id='password' 
                            value={password} 
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
                        />
                    </div>
                    <div>
                        <button className="button" id="submit" type="button" onClick={() => sendLoginRequest()}>Login</button>
                    </div>
                        <Nav variant="underline">
                            <Nav.Item as="p">
                                <Nav.Link onClick={() => setForgottenPasswordModalShow(true)}>I have forgotten my password</Nav.Link>
                                <Nav.Link onClick={() => setRegistrationModalShow(true)}>Register</Nav.Link>
                            </Nav.Item>
                        </Nav>
                </div>
            </div>
            <RegistrationComponent
                show={registrationModalShow}
                onHide={() => setRegistrationModalShow(false)}
            />
            <ForgottenPassword
                show={forgottenPasswordModalShow}
                onHide={() => setForgottenPasswordModalShow(false)}
            />
        </>
    );
};

export default LoginComponent;