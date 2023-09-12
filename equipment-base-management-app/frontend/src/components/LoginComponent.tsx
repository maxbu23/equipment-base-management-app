import { ChangeEvent, useEffect, useState } from "react";
import useLocalState from "../util/useLocalStorage";

const LoginComponent = () => {

    const[email, setEmail] = useState<string>("");
    const[password, setPassword] = useState<string>("");
    const [jwt, setJwt] = useLocalState("", "jwt");

    function sendLoginRequest() {
        const reqBody = {
            email: email,
            password: password
        }
      
          fetch('http://localhost:8080/api/v1/auth/authenticate',
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
            window.location.href = "/dashboard";
          }).catch((message: string) => {
            alert(message);
          });
    }

    return(
        <>
            <div>
                <label htmlFor='email'>Email: </label>
                <input 
                    type='email' 
                    id='email' 
                    value={email} 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor='password'>Password: </label>
                <input 
                    type='password' 
                    id='password' 
                    value={password} 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
                />
            </div>
            <div>
                <button id="submit" type="button" onClick={() => sendLoginRequest()}>Login</button>
            </div>
        </>
    );
};

export default LoginComponent;