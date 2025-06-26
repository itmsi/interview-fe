import React, { useEffect, useState } from 'react'
import { apiGet, apiPost, SortableHeader } from '../Helper/Helper';
import { FaRegPenToSquare, FaRegTrashCan } from "react-icons/fa6";
import { Button, Container, FloatingLabel, Form, Offcanvas, Row } from 'react-bootstrap';
import { FiPlusCircle } from "react-icons/fi";
import { Popup } from '../Component/Popup';
import Select from 'react-select';
import { toast } from 'react-toastify';

export const Index = ({ token, setPage }) => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    useEffect(() => {
        setPage('User Management');
        apiGet('/users', token)
            .then(data => {
                setLoading(false);
                setUsers(data?.data?.data || [])
            })
            .catch(err => console.error(err));
    }, [token]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedUsers = React.useMemo(() => {
        if (!sortConfig.key) return users;
        const sorted = [...users].sort((a, b) => {
            const aValue = a.employee[sortConfig.key] ? a.employee[sortConfig.key].toString().toLowerCase() : '';
            const bValue = b.employee[sortConfig.key] ? b.employee[sortConfig.key].toString().toLowerCase() : '';
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [users, sortConfig]);
    
    // HANDLE POPUP ADD USER
    const [titleModals, setTitleModals] = useState('');
    const [titleButton, setTitleButton] = useState('');
    const [showAddUser, setShowAddUser] = useState(false);
    const handleOpen = (title) => {
        setTitleModals(title);
        setTitleButton('Add User');
        setShowAddUser(true)
    };
    const handleClose = () => setShowAddUser(false);
    
    // HANDLE FORM POPUP
    // VALIDATE ADD NEW USERS

    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [roleOptions, setRoleOptions] = useState([]);
    const [loadingEmployee, setLoadingEmployee] = useState(false);
    const [loadingRole, setLoadingRole] = useState(false);
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        employee_id: '',
        full_name: '',
        email: '',
        password: '',
        is_active: false,
        role_ids: []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInputEmail = (e) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            email: value,
            username: value
        }));
    };

    const handleEmployeeChange = (opt) => {
        setFormData(prev => ({
            ...prev,
            employee_id: opt ? opt.value : '',
            full_name: opt ? opt.label : ''
        }));
    };

    const handleRoleChange = (e) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({
            ...prev,
            role_ids: selected
        }));
    };

    const handleFormSubmit = async(e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (
            formData.employee_id &&
            formData.role_ids.length > 0 &&
            formData.email &&
            /\S+@\S+\.\S+/.test(formData.email) &&
            formData.password.length >= 6
        ) {
            setValidated(false);
            const dataToSend = { ...formData, is_active: true };
            
            try {
                const response = await apiPost('/users', token, dataToSend);
                setShowAddUser(false);
                apiGet('/users', token)
                    .then(data => setUsers(data?.data?.data || []));
                
                setFormData({
                    username: '',
                    employee_id: '',
                    full_name: '',
                    email: '',
                    password: '',
                    is_active: false,
                    role_ids: []
                });

            } catch (error) {
                toast.error(error.message, {
                    position: "top-right",
                    autoClose: 3000
                });
                console.error('Gagal menambah user:', error);
            }
        } else {
            setValidated(true);
        }
    };
    useEffect(() => {
        if (showAddUser) {
            if (employeeOptions.length === 0) {
                setLoadingEmployee(true);
                apiGet('/employees', token)
                    .then(res => {
                        const options = (res.data.data || []).map(emp => ({
                            value: emp.id,
                            label: emp.name
                        }));
                        setEmployeeOptions(options);
                    })
                    .finally(() => setLoadingEmployee(false));
            }
            if (roleOptions.length === 0) {
                setLoadingRole(true);
                apiGet('/roles', token)
                    .then(res => {
                        const options = (res.data.data || []).map(role => ({
                            value: role.id,
                            label: role.name
                        }));
                        setRoleOptions(options);
                    })
                    .finally(() => setLoadingRole(false));
            }
        }
    }, [showAddUser, token]);

    return (
        <React.Fragment>
            {loading ? (
                <div>Loading...</div>
            ) : (<>
                <Container fluid className='header-action my-2 pb-2'>
                    <Row>
                        <div className='p-0 d-flex justify-content-end'>
                            <Button onClick={() => handleOpen('Add User')}  className='btn-action' ><FiPlusCircle className='me-1'/> Add New User</Button>
                        </div>
                    </Row>
                </Container>
                <table className="table table-bordered table-hover table-sort">
                    <thead>
                        <tr>
                            <SortableHeader
                                label="Name"
                                columnKey="name"
                                sortConfig={sortConfig}
                                onSort={() => handleSort('name')}
                            />
                            <SortableHeader
                                label="Email"
                                columnKey="email"
                                sortConfig={sortConfig}
                                onSort={() => handleSort('email')}
                            />
                            <SortableHeader
                                label="Alias"
                                columnKey="alias"
                                sortConfig={sortConfig}
                                onSort={() => handleSort('alias')}
                            />
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user?.employee?.name || 'n/a'}</td>
                                <td>{user?.email || 'n/a'}</td>
                                <td>{user?.employee?.alias || 'n/a'}</td>
                                <td><div className={`p-1 status-table ${user?.employee?.status === 'active' ? 'text-bg-success' : 'text-bg-danger'} rounded-3`}>{user?.employee?.status || '-'}</div></td>
                                <td>
                                    <button className="btn btn-sm btn-transparent me-2"><FaRegPenToSquare /></button>
                                    <button className="btn btn-sm btn-transparent "><FaRegTrashCan /></button>
                                </td>
                            </tr>
                        ))}
                        {sortedUsers.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </>)}
            <Popup
                show={showAddUser}
                title={titleModals}
                size={'md'}
                onHide={handleClose}
                onConfirm={handleFormSubmit}
                titleConfirm={titleButton}
            >
                <FormModalAddUser
                    token={token}
                    showAddUser={showAddUser}
                    formData={formData}
                    validated={validated}
                    handleInputChange={handleInputChange}
                    handleEmployeeChange={handleEmployeeChange}
                    handleInputEmail={handleInputEmail}
                    employeeOptions={employeeOptions}
                    roleOptions={roleOptions}
                    loadingEmployee={loadingEmployee}
                    loadingRole={loadingRole}
                    handleRoleChange={handleRoleChange}
                />
            </Popup>
        </React.Fragment>
    )
}

const FormModalAddUser = ({ 
    formData,
    validated,
    handleInputChange,
    handleEmployeeChange,
    handleInputEmail,
    employeeOptions,
    roleOptions,
    loadingEmployee,
    loadingRole,
    handleRoleChange
 }) => (
    <Form noValidate validated={validated}>
        <div className="form-floating select-filter-floating mb-3">
            <Select
                options={employeeOptions}
                value={employeeOptions.find(opt => opt.value === formData.employee_id) || null}
                onChange={handleEmployeeChange}
                isLoading={loadingEmployee}
                classNamePrefix="react-select"
                placeholder="Choose an employee..."
                isSearchable
                name="employee_id"
            />
            <label className="floating-label">Employee</label>
        </div>
        <FloatingLabel
            controlId="floatingInput"
            label="Email address"
            className="mb-3"
        >
            <Form.Control
                type="email"
                placeholder="name@example.com"
                required
                name="email"
                value={formData.email}
                onChange={handleInputEmail}
                pattern="\S+@\S+\.\S+"
            />
            <Form.Control.Feedback type="invalid">
                Please provide a valid email.
            </Form.Control.Feedback>
        </FloatingLabel>
        <FloatingLabel 
            controlId="floatingPassword" 
            label="Password"
            className="mb-3"
        >
            <Form.Control
                type="password"
                placeholder="Password"
                required
                minLength={6}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
                Please provide a password (min 6 characters).
            </Form.Control.Feedback>
        </FloatingLabel>
        <FloatingLabel 
            controlId="floatingSelect" 
            label="Role"
        >
            <Form.Select
                aria-label="role"
                required
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
                disabled={loadingRole}
            >
                <option value="" disabled>Open this select menu</option>
                {roleOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
                Please select an option.
            </Form.Control.Feedback>
        </FloatingLabel>
    </Form>
)