import React from 'react'
import { Table } from 'react-bootstrap';

export const Assigned = ({ token, data, userInfo }) => {
    if (!data?.referred || !Array.isArray(data.referred) || data.referred.length === 0) {
        return <div className="mt-4">No referred data available.</div>;
    }
    return(
        <div className="card mt-4">
            <div className="card-body">
                <div className="table-responsive">
                    <Table bordered={false} className="mb-0">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Role Alias</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.referred.map((ref, idx) => (
                                <tr key={idx}>
                                    <td>{ref.name}</td>
                                    <td>{ref.email}</td>
                                    <td>{ref.role}</td>
                                    <td>{ref.role_alias}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}