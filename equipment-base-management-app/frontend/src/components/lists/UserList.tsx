import React from "react"
import { Table } from "react-bootstrap"
import { User } from "../../model/Models"

interface MyProps {
    users?: User[];
}

const UserList: React.FC<MyProps> = ({users}) => {
    
        return(
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                {users ? users.map((user) =>
                    <tr key={user.id}>
                        <td>{user.firstname}</td>
                        <td>{user.lastname}</td>
                        <td>{user.email}</td>
                    </tr> 
                ): <></>} 
                </tbody>
            </Table>
    
    )
}

export default UserList;