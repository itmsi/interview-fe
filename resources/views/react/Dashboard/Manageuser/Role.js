import React, { useCallback, useEffect, useState } from 'react'
import { apiDelete, apiGet, apiPost, apiPut, formatDate, SortableDateHeader, SortableHeader, sortDataByDate, Tooltips } from '../Helper/Helper';
import { FaRegPenToSquare, FaRegTrashCan, FaKey } from "react-icons/fa6";
import { Button, Container, FloatingLabel, Form, Row } from 'react-bootstrap';
import { FiPlusCircle } from "react-icons/fi";
import { Popup } from '../Component/Popup';
import { toast } from 'react-toastify';
import { ErrorTemplate } from '../Component/ErrorTemplate';
import Select from 'react-select';

export const Role = ({ token, setPage }) => {
    const [dataRole, setDataRole] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setPage('Role Management');
        fetchRoles();
    }, [token]);

    const fetchRoles = () => {
        setLoading(true);
        setErrors(false);
        apiGet('/roles', token)
            .then(data => {
                setLoading(false);
                setDataRole(data?.data || []);
            })
            .catch(err => {
                console.error('Error fetching data:', err);
                setErrors(true);
                setLoading(false);
            });
    };

    const handleRetry = () => {
        fetchRoles();
    };

    const handleSort = (key, type = 'normal') => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        if (type === 'date') {
            const sortedData = sortDataByDate(dataRole, key, direction);
            setDataRole(sortedData);
        }
    };

    const sortedDataRole = React.useMemo(() => {
        // First filter by search term
        let filteredData = dataRole;
        if (searchTerm) {
            filteredData = dataRole.filter(role => {
                const searchLower = searchTerm.toLowerCase();
                return (
                    (role.role_name || '').toLowerCase().includes(searchLower) ||
                    (role.system_name || '').toLowerCase().includes(searchLower) ||
                    (role.parent_role_name || '').toLowerCase().includes(searchLower) ||
                    formatDate(role.created_at, false, 'DD MMM YYYY').toLowerCase().includes(searchLower)
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
    }, [dataRole, sortConfig, searchTerm]);

    // HANDLE POPUP ADD USER
    const [titleModals, setTitleModals] = useState('');
    const [titleButton, setTitleButton] = useState('');
    const [showAddRole, setShowAddRole] = useState(false);
    const handleOpen = (title) => {
        setFormData({
            role_id: '',
            role_name: '',
            role_description: '',
            system_id: '',
            system_name: ''
        });
        setTitleModals(title);
        setTitleButton('Add Role');
        setShowAddRole(true);
    };
    const handleClose = () => setShowAddRole(false);

    // HANDLE FORM POPUP
    // VALIDATE ADD NEW ROLE
    const [addSystemOptions, setAddSystemOptions] = useState([]);
    const [loadingAddSystem, setLoadingAddSystem] = useState(false);

    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({
        role_id: '',
        role_name: '',
        role_description: '',
        system_id: '',
        system_name: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSystemChange = (opt) => {
        setFormData(prev => ({
            ...prev,
            system_id: opt && opt.value !== '' ? opt.value : '',
            system_name: opt && opt.value !== '' ? opt.label : ''
        }));
    };


    useEffect(() => {
        if (showAddRole) {
            if (addSystemOptions.length === 0) {
                setLoadingAddSystem(true);
                apiGet('/system', token)
                    .then(res => {
                        const options = (res.data || []).map(sys => ({
                            value: sys.system_id,
                            label: sys.system_name
                        }));
                        setAddSystemOptions(options);
                    })
                    .finally(() => setLoadingAddSystem(false));
            }
        }
    }, [showAddRole, token]);

    // FUNCTION DELETE USERS LIST
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);

    const handleDeleteRole = (roleId) => {
        setRoleToDelete(roleId);
        setShowDeletePopup(true);
    };

    const handleConfirmDelete = async () => {
        if (!roleToDelete) return;
        try {
            await apiDelete(`/roles/${roleToDelete}`, token);
            toast.success('Role berhasil dihapus!', {
                position: "top-right",
                autoClose: 3000
            });
            setShowDeletePopup(false);
            setRoleToDelete(null);// Refresh data role
            apiGet('/roles', token)
                .then(data => setDataRole(data?.data || []))
                .catch(err => {
                    console.error('Failed to refresh:', err);
                    toast.error('Gagal memuat ulang data', {
                            position: "top-right",
                            autoClose: 3000
                        });
                    });
        } catch (error) {
            toast.error('Gagal menghapus: ' + error.message, {
                position: "top-right",
                autoClose: 3000
            });
            setShowDeletePopup(false);
            setRoleToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeletePopup(false);
        setRoleToDelete(null);
    };

    // FUNCTION EDIT SYSTEM
    const [isEdit, setIsEdit] = useState(false);
    const [editRoleId, setEditRoleId] = useState(null);
    const handleEditRole = (roleId) => {
        const role = dataRole.find(u => u.role_id === roleId);
        if (!role) return;

        setFormData({
            role_id: role.role_id || '',
            role_name: role.role_name || '',
            role_description: role.role_description || '',
            system_id: role.system_id || '',
            system_name: role.system_name || '',
        });
        setIsEdit(true);
        setEditRoleId(roleId);
        setTitleModals('Edit Role');
        setTitleButton('Update Role');
        setShowAddRole(true);
    };

    const handleFormSubmit = async(e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (
            formData.role_name &&
            formData.system_name
        ) {
            setValidated(false);
            const dataToAdd = {
                role_name: formData.role_name,
                system_id: formData.system_id,
            };
            try {
                if (isEdit && editRoleId) {
                    // Edit role
                    await apiPut(`/roles/${editRoleId}`, token, dataToAdd);
                    toast.success('Role berhasil diupdate!', {
                        position: "top-right",
                        autoClose: 3000
                    });
                } else {
                    // Add role
                    await apiPost('/roles', token, dataToAdd);
                    toast.success('Role berhasil ditambahkan!', {
                        position: "top-right",
                        autoClose: 3000
                    });
                }
                setShowAddRole(false);
                setIsEdit(false);
                setEditRoleId(null);
                apiGet('/roles', token)
                    .then(data => setDataRole(data?.data || []))
                    .catch(err => {
                        console.error('Failed to refresh roles after update:', err);
                        toast.error('Data berhasil diubah, tapi gagal memuat ulang tampilan', {
                            position: "top-right",
                            autoClose: 3000
                        });
                    });
                setFormData({
                    role_id: '',
                    role_name: '',
                    role_description: '',
                    system_id: '',
                    system_name: '',
                    status: '',
                });
            } catch (error) {
                toast.error(error.message, {
                    position: "top-right",
                    autoClose: 3000
                });
                console.error('Gagal menyimpan menu:', error);
            }
        } else {
            setValidated(true);
        }
    };

    // FUNCTION SET PERMISSION
    const [showSetPermission, setShowSetPermission] = useState(false);
    const [selectedRoleForPermission, setSelectedRoleForPermission] = useState(null);
    const [menuList, setMenuList] = useState([]);
    const [loadingMenus, setLoadingMenus] = useState(false);
    const [permissions, setPermissions] = useState({});
    const [permissionIds, setPermissionIds] = useState({}); // Store permission IDs for reference
    
    const handleSetPermission = async (roleId) => {
        const role = dataRole.find(r => r.role_id === roleId);
        if (!role) return;
        
        setSelectedRoleForPermission(role);
        setShowSetPermission(true);
        setLoadingMenus(true);
        
        try {
            const permissionResponse = await apiGet(`/role-has-permission?role_id=${roleId}`, token);
            const allPermissions = permissionResponse?.data || [];
            
            const rolePermissions = allPermissions;
            
            const uniqueMenus = [];
            const seenMenuIds = new Set();
            
            rolePermissions.forEach(perm => {
                if (!seenMenuIds.has(perm.menu_id)) {
                    seenMenuIds.add(perm.menu_id);
                    uniqueMenus.push({
                        menu_id: perm.menu_id,
                        menu_name: perm.menu_name
                    });
                }
            });
            
            setMenuList(uniqueMenus);
            
            const permissionMap = {};
            const permissionIdMap = {};
            rolePermissions.forEach(menuPerm => {
                if (!permissionMap[menuPerm.menu_id]) {
                    permissionMap[menuPerm.menu_id] = {};
                    permissionIdMap[menuPerm.menu_id] = {};
                }
                
                menuPerm.permissions.forEach(perm => {
                    const permType = perm.permission_name.toLowerCase();
                    permissionMap[menuPerm.menu_id][permType] = perm.permission_status;
                    permissionIdMap[menuPerm.menu_id][permType] = perm.permission_id;
                });
                
            });

            setPermissions(permissionMap);
            setPermissionIds(permissionIdMap);
            
        } catch (error) {
            console.error('Error fetching permissions:', error);
            toast.error('Failed to load permissions', {
                position: "top-right",
                autoClose: 3000
            });
        } finally {
            setLoadingMenus(false);
        }
    };
    
    const handleCancelSetPermission = () => {
        setShowSetPermission(false);
        setSelectedRoleForPermission(null);
        setMenuList([]);
        setPermissions({});
        setPermissionIds({});
    };
    
    const handlePermissionChange = async (menuId, permissionType, isChecked) => {
        try {
            const endpoint = `/role-has-permission`;
            
            const permissionId = permissionIds[menuId]?.[permissionType] || null;
            
            const data = {
                role_id: selectedRoleForPermission.role_id,
                menu_id: menuId,
                permission_id: isChecked ? permissionId : null,
                permission_status: isChecked ? true : false
            };
            
            if (isChecked) {
                await apiPost(endpoint, token, data);
            } else {
                await apiPost(endpoint, token, data);
            }
            
            // Update local state
            setPermissions(prev => ({
                ...prev,
                [menuId]: {
                    ...prev[menuId],
                    [permissionType]: isChecked
                }
            }));
            
            toast.success(`Permission ${isChecked ? 'granted' : 'revoked'} successfully`, {
                position: "top-right",
                autoClose: 2000
            });
            
        } catch (error) {
            console.error('Error updating permission:', error);
            toast.error('Failed to update permission', {
                position: "top-right",
                autoClose: 3000
            });
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
                                placeholder="Search role name, system name, or date..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <div className='col-md-6 p-0 d-flex justify-content-end'>
                            <Button onClick={() => handleOpen('Add Role')}  className='btn-action' ><FiPlusCircle className='me-1'/> Add New Role</Button>
                        </div>
                    </Row>
                </Container>
                <table className="table table-bordered table-hover table-sort">
                    <thead>
                        <tr>
                            <SortableHeader
                                label="Menu Name"
                                columnKey="menu_name"
                                sortConfig={sortConfig}
                                onSort={() => handleSort('menu_name')}
                            />
                            <SortableHeader
                                label="System Name"
                                columnKey="system_name"
                                sortConfig={sortConfig}
                                onSort={() => handleSort('system_name')}
                            />
                            <SortableDateHeader
                                label="Created At"
                                columnKey="created_at"
                                sortConfig={sortConfig}
                                onSort={handleSort}
                            />
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedDataRole.map(role => (
                            <tr key={role.role_id}>
                                <td>{role?.role_name || 'n/a'}</td>
                                <td>{role?.system_name || '-'}</td>
                                <td>{formatDate(role.created_at, false)}</td>
                                <td>
                                    <Tooltips title={"Edit"} position="top">
                                        <button 
                                            onClick={() => handleEditRole(role.role_id)}
                                            className="btn btn-sm btn-transparent me-2"
                                        >
                                            <FaRegPenToSquare />
                                        </button>
                                    </Tooltips>
                                    <Tooltips title={"Set Permission"} position="top">
                                        <button 
                                            onClick={() => handleSetPermission(role.role_id)}
                                            className="btn btn-sm btn-transparent me-2"
                                        >
                                            <FaKey />
                                        </button>
                                    </Tooltips>
                                    {sortedDataRole.length > 1 && (
                                        <button 
                                            className="btn btn-sm btn-transparent"
                                            onClick={() => handleDeleteRole(role.role_id)}
                                        >
                                            <FaRegTrashCan />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {sortedDataRole.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    {searchTerm ? `No roles found for "${searchTerm}"` : 'No roles found.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </>)
            :<ErrorTemplate
                onRetry={handleRetry} 
                loading={loading}
            />}
            {/* MODALS ADD NEW MENU */}
            <Popup
                show={showAddRole}
                title={titleModals}
                size={'md'}
                onHide={handleClose}
                onConfirm={handleFormSubmit}
                titleConfirm={titleButton}
            >
                <FormModalAddRole
                    formData={formData}
                    validated={validated}
                    handleInputChange={handleInputChange}
                    handleSystemChange={handleSystemChange}
                    systemOptions={addSystemOptions}
                    loadingAddSystem={loadingAddSystem}
                />
            </Popup>

            {/* MODALS REMOVE SYSTEMS LIST */}
            <Popup
                show={showDeletePopup}
                title="Konfirmasi Hapus Menu"
                size="md"
                onHide={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                titleConfirm="Hapus"
            >
                <div>Apakah Anda yakin ingin menghapus sistem ini?</div>
            </Popup>

            {/* MODALS SET PERMISSION */}
            <Popup
                show={showSetPermission}
                title={`Set Permissions - ${selectedRoleForPermission?.role_name || ''}`}
                size="lg"
                onHide={handleCancelSetPermission}
                showConfirmButton={false}
            >
                <FormModalSetPermission 
                    menuList={menuList}
                    permissions={permissions}
                    loadingMenus={loadingMenus}
                    onPermissionChange={handlePermissionChange}
                    selectedRole={selectedRoleForPermission}
                />
            </Popup>
        </React.Fragment>
    )
}
const FormModalAddRole = ({
    formData,
    validated,
    handleInputChange,
    handleSystemChange,
    systemOptions,
    loadingAddSystem,
}) => {
    const [selectOpen, setSelectOpen] = useState(false);
    const handleMenuOpen = useCallback(() => {
        setSelectOpen(true);
    }, []);
    
    const handleMenuClose = useCallback(() => {
        setSelectOpen(false);
    }, []);
    
    return(
        <Form className='select-floating-form' noValidate validated={validated}>
            <FloatingLabel
                controlId="floatingInput"
                label="Role Name"
                className="mb-3"
            >
                <Form.Control
                    type="text"
                    placeholder="Role Name"
                    required
                    name="role_name"
                    value={formData.role_name}
                    onChange={handleInputChange}
                />
                <Form.Control.Feedback type="invalid">
                    Please provide a valid role name.
                </Form.Control.Feedback>
            </FloatingLabel>
            <div className={`form-floating select-filter-floating mb-3`} style={{ zIndex: selectOpen ? 10 : 0 }}>
                <Select
                    options={[
                        { value: '', label: 'Select System...' },
                        ...systemOptions
                    ]}
                    value={systemOptions.find(opt => opt.value === formData.system_id) || { value: '', label: 'Select System...' }}
                    onChange={handleSystemChange}
                    isLoading={loadingAddSystem}
                    classNamePrefix="react-select"
                    placeholder="Choose a system..."
                    isSearchable
                    name="system_id"
                    required
                    className={validated && !formData.system_id ? 'is-invalid' : ''}
                    onMenuOpen={handleMenuOpen}
                    onMenuClose={handleMenuClose}
                />
                <label className="floating-label" style={{ zIndex: selectOpen ? 11 : 0 }}>System</label>
                {validated && !formData.system_id && (
                    <div className="invalid-feedback d-block">
                        Please select a system.
                    </div>
                )}
            </div>
        </Form>
    )
}

const FormModalSetPermission = ({ 
    menuList, 
    permissions, 
    loadingMenus, 
    onPermissionChange, 
    selectedRole 
}) => {
    const permissionTypes = ['create', 'read', 'update', 'delete'];
    const permissionLabels = {
        create: 'Create',
        read: 'Read',
        update: 'Update',
        delete: 'Delete'
    };
    
    if (loadingMenus) {
        return (
            <div className="text-center py-4">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading menus...</p>
            </div>
        );
    }
    
    if (menuList.length === 0) {
        return (
            <div className="text-center py-4">
                <p>No menus found for this system.</p>
            </div>
        );
    }
    
    return (
        <div className="permission-settings">
            <div className="mb-3">
                <small className="text-muted">
                    System: <strong>{selectedRole?.system_name}</strong>
                </small>
            </div>
            
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>Menu Name</th>
                            {permissionTypes.map(type => (
                                <th key={type} className="text-center" style={{ width: '100px' }}>
                                    {permissionLabels[type]}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {menuList.map(menu => (
                            <tr key={menu.menu_id}>
                                <td className="fw-medium">{menu.menu_name}</td>
                                {permissionTypes.map(type => (
                                    <td key={type} className="text-center">
                                        <Form.Check
                                            type="checkbox"
                                            checked={permissions[menu.menu_id]?.[type] || false}
                                            onChange={(e) => onPermissionChange(
                                                menu.menu_id, 
                                                type, 
                                                e.target.checked
                                            )}
                                            className="permission-checkbox"
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="mt-3">
                <small className="text-muted">
                    <strong>Note:</strong> Changes are saved automatically when you check/uncheck permissions.
                </small>
            </div>
        </div>
    );
};