import React, { useEffect, useState } from 'react'
import { apiDelete, apiGet, apiPost, apiPut, SortableHeader } from '../Helper/Helper';
import { FaRegPenToSquare, FaRegTrashCan } from "react-icons/fa6";
import { Button, Container, FloatingLabel, Form, Offcanvas, Row } from 'react-bootstrap';
import { FiPlusCircle } from "react-icons/fi";
import { Popup } from '../Component/Popup';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { LoadingAnimation } from '../Component/Loading';
import { ErrorTemplate, ServerErrorTemplate } from '../Component/ErrorTemplate';

export const Index = ({ token, setPage }) => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setPage('User Management');
        fetchUsers();
    }, [token]);

    const fetchUsers = () => {
        setLoading(true);
        setErrors(false);
        apiGet('/users', token)
            .then(data => {
                setLoading(false);
                setUsers(data?.data || []);
            })
            .catch(err => {
                console.error('Error fetching data:', err);
                setErrors(true);
                setLoading(false);
            });
    };

    const handleRetry = () => {
        fetchUsers();
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedUsers = React.useMemo(() => {
        // First filter by search term
        let filteredData = users;
        if (searchTerm) {
            filteredData = users.filter(user => {
                const searchLower = searchTerm.toLowerCase();
                return (
                    (user.user_name || '').toLowerCase().includes(searchLower) ||
                    (user.user_email || '').toLowerCase().includes(searchLower) ||
                    (user.employee?.alias || '').toLowerCase().includes(searchLower)
                );
            });
        }
        
        // Then sort the filtered data
        if (!sortConfig.key) return filteredData;
        const sorted = [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key] ? a[sortConfig.key].toString().toLowerCase() : '';
            const bValue = b[sortConfig.key] ? b[sortConfig.key].toString().toLowerCase() : '';
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [users, sortConfig, searchTerm]);
    
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

    // FUNCTION DELETE USERS LIST
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const handleDeleteUser = (userId) => {
        setUserToDelete(userId);
        setShowDeletePopup(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await apiDelete('/users', token, { params: { id: userToDelete } });
            toast.success('User berhasil dihapus!', {
                position: "top-right",
                autoClose: 3000
            });
            setShowDeletePopup(false);
            setUserToDelete(null);                // Refresh data user
                apiGet('/users', token)
                    .then(data => setUsers(data?.data?.data || []))
                    .catch(err => {
                        console.error('Failed to refresh users:', err);
                        toast.error('Gagal memuat ulang data users', {
                            position: "top-right",
                            autoClose: 3000
                        });
                    });
        } catch (error) {
            toast.error('Gagal menghapus user: ' + error.message, {
                position: "top-right",
                autoClose: 3000
            });
            setShowDeletePopup(false);
            setUserToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeletePopup(false);
        setUserToDelete(null);
    };

    // FUNCTION EDIT USERS
    const [isEdit, setIsEdit] = useState(false);
    const [editUserId, setEditUserId] = useState(null);
    const handleEditUser = (userId) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;

        setFormData({
            username: user.username || '',
            employee_id: user.employee_id || '',
            full_name: user.employee?.name || '',
            email: user.email || '',
            password: '', // kosongkan password saat edit
            is_active: user.is_active ?? false,
            role_ids: user.roles ? user.roles.map(r => r.id) : []
        });
        setIsEdit(true);
        setEditUserId(userId);
        setTitleModals('Edit User');
        setTitleButton('Update User');
        setShowAddUser(true);
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
            (isEdit || formData.password.length >= 6) // password boleh kosong saat edit
        ) {
            setValidated(false);
            const dataToSend = { ...formData, is_active: true };

            try {
                if (isEdit && editUserId) {
                    // Edit user
                    await apiPut('/users', token, dataToSend, { params: { id: editUserId } });
                    toast.success('User berhasil diupdate!', {
                        position: "top-right",
                        autoClose: 3000
                    });
                } else {
                    // Add user
                    await apiPost('/users', token, dataToSend);
                    toast.success('User berhasil ditambahkan!', {
                        position: "top-right",
                        autoClose: 3000
                    });
                }
                setShowAddUser(false);
                setIsEdit(false);
                setEditUserId(null);
                apiGet('/users', token)
                    .then(data => setUsers(data?.data?.data || []))
                    .catch(err => {
                        console.error('Failed to refresh users after update:', err);
                        toast.error('Data berhasil diubah, tapi gagal memuat ulang tampilan', {
                            position: "top-right",
                            autoClose: 3000
                        });
                    });
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
                console.error('Gagal menyimpan user:', error);
            }
        } else {
            setValidated(true);
        }
    };
    
    return (
        <React.Fragment>
            {!errors ?
            loading ? (
                <div>Loading...</div>
            ) : (<>
                <Container fluid className='header-action my-2 pb-2'>
                    <Row>
                        <div className='col-md-6 p-0'>
                            <Form.Control
                                type="text"
                                placeholder="Search user name, email, or alias..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <div className='col-md-6 p-0 d-flex justify-content-end'>
                            <Button onClick={() => handleOpen('Add User')}  className='btn-action' ><FiPlusCircle className='me-1'/> Add New User</Button>
                        </div>
                    </Row>
                </Container>
                <table className="table table-bordered table-hover table-sort">
                    <thead>
                        <tr>
                            <SortableHeader
                                label="Name"
                                columnKey="user_name"
                                sortConfig={sortConfig}
                                onSort={() => handleSort('user_name')}
                            />
                            <SortableHeader
                                label="Email"
                                columnKey="user_email"
                                sortConfig={sortConfig}
                                onSort={() => handleSort('user_email')}
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
                            <tr key={user.user_id}>
                                <td>{user?.user_name || 'n/a'}</td>
                                <td>{user?.user_email || 'n/a'}</td>
                                <td>{user?.employee?.alias || 'n/a'}</td>
                                <td><div className={`p-1 status-table ${user?.user_status === '1' ? 'text-bg-success' : 'text-bg-danger'} rounded-3`}>{user?.user_status === '1' ? 'Active' : 'Inactive'}</div></td>
                                <td>
                                    <button 
                                        onClick={() => handleEditUser(user.id)}
                                        className="btn btn-sm btn-transparent me-2"
                                    >
                                        <FaRegPenToSquare />
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-transparent"
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        <FaRegTrashCan />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {sortedUsers.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    {searchTerm ? `No users found for "${searchTerm}"` : 'No users found.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </>)
            :<ServerErrorTemplate
                onRetry={handleRetry} 
                loading={loading}
            />}
            {/* MODALS ADD NEW USERS */}
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

            {/* MODALS REMOVE USERS LIST */}
            <Popup
                show={showDeletePopup}
                title="Konfirmasi Hapus User"
                size="md"
                onHide={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                titleConfirm="Hapus"
            >
                <div>Apakah Anda yakin ingin menghapus user ini?</div>
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
    <Form noValidate validated={validated} className='select-floating-form'>
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