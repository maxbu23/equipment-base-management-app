import React from "react"
import { Table } from "react-bootstrap"
import { Equipment } from "../../model/Equipment"

interface MyProps {
    equipments?: Equipment[];
}

const EquipmentList: React.FC<MyProps> = ({equipments}) => {
    
        return(
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Brand</th>
                    </tr>
                </thead>
                <tbody>
                {equipments ? equipments.map((equipment) =>
                    <tr key={equipment.id}>
                        <td>{equipment.equipmentType}</td>
                        <td>{equipment.name}</td>
                        <td>{equipment.brand}</td>
                    </tr> 
                ): <></>} 
                </tbody>
            </Table>
    
    )
}

export default EquipmentList;