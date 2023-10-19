import { ChangeEvent, useState } from "react";
import useLocalState from "../util/useLocalStorage";
import "../style/Common.css"

const LoginComponent = () => {

    const[email, setEmail] = useState<string>("");
    const[password, setPassword] = useState<string>("");
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [id, setId] = useLocalState(-1, "id")
    const [role, setRole] = useLocalState("", "role")
    const [user, setUser] = useLocalState("", "userData")

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
            if (body.role === 'ADMIN' ) {
                window.location.href = "/admin-dashboard";
            } else {
                window.location.href = "/user-dashboard";
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
                        <button className="submit-button" id="submit" type="button" onClick={() => sendLoginRequest()}>Login</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginComponent;