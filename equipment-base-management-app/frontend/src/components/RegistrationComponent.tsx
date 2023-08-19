import React, {ChangeEvent} from 'react';
import ReactDOM  from 'react-dom';

type RegistrationState = {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
}

type RegistrationProps = {

}

class RegistrationComponent extends React.Component<RegistrationProps, RegistrationState> {
    

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

    submit = () => {
        alert("Sending: \n Firstname: " + this.state.firstName + "\n Lastname: " + this.state.lastName + "\n Email: " + this.state.email + "\n Password: " + this.state.password)
    }

    render() {
        return(
        <div>
            <form onSubmit={this.submit}>
                <div>
                    <label>First name: </label> 
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
            <div>{this.state.firstName}</div>
            <div>{this.state.lastName}</div>
            <div>{this.state.email}</div>
            <div>{this.state.password}</div>
        </div>
        )
    }
}

export default RegistrationComponent;