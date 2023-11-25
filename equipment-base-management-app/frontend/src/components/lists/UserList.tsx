import React, { useEffect, useState } from "react"
import { Dropdown, Form, Pagination, Table } from "react-bootstrap"
import { User } from "../../model/Models"
import axios from "axios";
import useLocalState from "../../util/useLocalStorage";
import AllEquipments from "../modals/AllEquipments";
import UpdateUser from "../update/UpdateUser";

type FunctionType = () => void;

interface MyProps {
    users: User[];
    refreshData: FunctionType;
}

const UserList: React.FC<MyProps> = ({users, refreshData}) => {

    const [jwt, setJwt] = useLocalState("", "jwt");
    
    // modals windows
    const [updateUserModalShow, setUpdateUserModalShow] = useState(false);
    const [allEquipmentModalShow, setAllEquipmentModalShow] = useState(false);

    const [filterColumn, setFilterColumn] = useState("Lastname");
    const [filterValue, setFilterValue] = useState("");

    const [usersToShow, setUsersToShow] = useState<Array<User>>();
    const [selectedUser, setSelectedUser] = useState<User>(
        {
            id: "",
            firstname: "",
            lastname: "",
            email: "",
        }
    )

    useEffect(() => {
        setUsersToShow(users);
    }, [users])

    useEffect(() => {
        const regex = new RegExp(filterValue, 'i');
        let filterdUsers;
        switch (filterColumn) {
            case "Firstname":
                filterdUsers = users.filter(user => regex.test(user.firstname))
                setUsersToShow(filterdUsers)
                break;
            case "Lastname":
                filterdUsers = users.filter(user => regex.test(user.lastname))
                setUsersToShow(filterdUsers)
                break;
            case "Email":
                filterdUsers = users.filter(user => regex.test(user.email))
                setUsersToShow(filterdUsers)
                break;
        }

    }, [filterValue])

    function deleteUser(id: string | undefined | number) {
        axios.delete(
            `api/v1/admin/users/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    Accept: "application/json"
                }
            }
        ).then((respone) => {
            if (respone.status === 200) {
                alert("Equipment deleted successfully");
            }
            refreshData()
        })
    }

    function updateUser(user: User) {
        setSelectedUser(user);
        setUpdateUserModalShow(true);
    }

    function showAllEquipments(user: User) {
        setSelectedUser(user);
        setAllEquipmentModalShow(true);
    }

    return(
        <>
            <div style={{display: "flex", margin: "5px"}}>
                <Dropdown>
                    <Dropdown.Toggle className="filter-dropdown" >
                        {filterColumn}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item id={"Firstname"} onClick={(event) => setFilterColumn(event.currentTarget.id)}>Firstname</Dropdown.Item>
                        <Dropdown.Item id={"Lastname"} onClick={(event) => setFilterColumn(event.currentTarget.id)}>Lastname</Dropdown.Item>
                        <Dropdown.Item id={"Email"} onClick={(event) => setFilterColumn(event.currentTarget.id)}>Email</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Form.Control 
                    type="text" 
                    placeholder={filterValue} 
                    onChange={(event) => setFilterValue(event.target.value)}
                />
            </div>
            <div>
                <Table striped borderless size="sm">
                    <thead>
                        <tr>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Email</th>
                            <th colSpan={3} style={{border:"none"}}></th>
                        </tr>
                    </thead>
                    <tbody>
                    {usersToShow ? usersToShow.map((user) =>
                        <tr key={user.id}>
                            <td>{user.firstname}</td>
                            <td>{user.lastname}</td>
                            <td>{user.email}</td>
                            <td>
                                <button className="button" onClick={() => showAllEquipments(user)}>All equipments</button>
                            </td>
                            <td>
                                <button className="button" onClick={() => updateUser(user)}>Update</button>
                            </td>
                            <td>
                                <button className="button" onClick={() => deleteUser(user.id)}>Delete</button>
                            </td>
                        </tr> 
                    ): <></>} 
                    </tbody>
                    
                    
                </Table>
                <UpdateUser
                    user={selectedUser}
                    show={updateUserModalShow}
                    onHide={() => setUpdateUserModalShow(false)}
                />
                <AllEquipments 
                    onHide={() => setAllEquipmentModalShow(false)} 
                    show={allEquipmentModalShow} 
                    user={selectedUser}                    
                />
            </div>
        </>
    )
}

export default UserList;