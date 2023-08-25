import React, {ChangeEvent} from 'react';
import ReactDOM  from 'react-dom';
import axios from 'axios';

type RegistrationState = {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
}

type RegistrationProps = {

}

class RegistrationForm extends React.Component<RegistrationProps, RegistrationState> {
    

    constructor(props: RegistrationProps) {
        super(props);

        this.state = {
            firstName: "",
            lastName: "",
            password: "",
            email: ""
        }
    }

    setFirstName = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            "firstName": event.target.value
        })
    }

    setLastName = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            "lastName": event.target.value
        })
    }

    setEmail = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            "email": event.target.value
        })
    }
    
    setPassword = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            "password": event.target.value
        })
    }

    submit = (event: any) => {
        event.preventDefault()
        const url = "http://localhost:8080/api/v1/users"
        alert("Sending: \n Firstname: " + this.state.firstName + "\n Lastname: " + this.state.lastName + "\n Email: " + this.state.email + "\n Password: " + this.state.password)
        axios.post(url, this.state)
    }

    render() {
        return(
        <div>
            <form onSubmit={this.submit}>
                <div>
                    <p>First name: </p> 
                    <input type="text" onChange={this.setFirstName}></input>
                </div>
                <div>
                    <label>Last name: </label> 
                    <input type="text" onChange={this.setLastName}></input>
                </div>
                <div>
                    <label>Email: </label> 
                    <input type="text" onChange={this.setEmail}></input>
                </div>
                <div>
                    <label>Password: </label> 
                    <input type="password"  onChange={this.setPassword}></input>
                </div>
                <button>Register</button>
            </form>
        </div>
        )
    }
}

export default RegistrationForm;