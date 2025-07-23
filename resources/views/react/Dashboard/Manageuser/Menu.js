import React, { useEffect, useState } from 'react'
import { apiDelete, apiGet, apiPost, apiPut, formatDate, SortableDateHeader, SortableHeader, sortDataByDate } from '../Helper/Helper';
import { FaRegPenToSquare, FaRegTrashCan } from "react-icons/fa6";
import { Button, Container, FloatingLabel, Form, Row } from 'react-bootstrap';
import { FiPlusCircle } from "react-icons/fi";
import { Popup } from '../Component/Popup';
import { toast } from 'react-toastify';
import { ErrorTemplate } from '../Component/ErrorTemplate';
import Select from 'react-select';

export const Menu = ({ endpoint, token, setPage }) => {

    const [dataMenu, setDataMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setPage('Menu Management');
        fetchMenus();
    }, [token]);

    const fetchMenus = () => {
        setLoading(true);
        setErrors(false);
        apiGet(endpoint, '/menu', token)
            .then(data => {
                setLoading(false);
                setDataMenu(data?.data || []);
            })
            .catch(err => {
                console.error('Error fetching data:', err);
                setErrors(true);
                setLoading(false);
            });
    };

    const handleRetry = () => {
        fetchMenus();
    };

    const handleSort = (key, type = 'normal') => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        if (type === 'date') {
            const sortedData = sortDataByDate(dataMenu, key, direction);
            setDataMenu(sortedData);
        }
    };

    const sortedDataMenu = React.useMemo(() => {
        // First filter by search term
        let filteredData = dataMenu;
        if (searchTerm) {
            filteredData = dataMenu.filter(menu => {
                const searchLower = searchTerm.toLowerCase();
                return (
                    (menu.menu_name || '').toLowerCase().includes(searchLower) ||
                    (menu.system_name || '').toLowerCase().includes(searchLower) ||
                    (menu.parent_menu_name || '').toLowerCase().includes(searchLower) ||
                    formatDate(menu.created_at, false, 'DD MMM YYYY').toLowerCase().includes(searchLower)
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
    }, [dataMenu, sortConfig, searchTerm]);

    // HANDLE POPUP ADD USER
    const [titleModals, setTitleModals] = useState('');
    const [titleButton, setTitleButton] = useState('');
    const [showAddMenu, setShowAddMenu] = useState(false);
    const handleOpen = (title) => {
        setFormData({
            menu_id: '',
            menu_name: '',
            system_id: '',
            system_name: '',
            menu_order: 1,
            parent_menu_id: '',
        });
        setTitleModals(title);
        setTitleButton('Add System');
        setShowAddMenu(true)
    };
    const handleClose = () => setShowAddMenu(false);

    // HANDLE FORM POPUP
    // VALIDATE ADD NEW SYSTEM

    const [addSystemOptions, setAddSystemOptions] = useState([]);
    const [addMenuOptions, setAddMenuOptions] = useState([]);
    const [loadingAddSystem, setLoadingAddSystem] = useState(false);
    const [loadingAddMenu, setLoadingAddMenu] = useState(false);
    
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({
        menu_id: '',
        menu_name: '',
        system_id: '',
        system_name: '',
        menu_order: 1,
        parent_menu_id: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMenuChange = (opt) => {
        setFormData(prev => ({
            ...prev,
            menu_id: opt && opt.value !== '' ? opt.value : '',
            menu_name: opt && opt.value !== '' ? opt.label : ''
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
        if (showAddMenu) {
            if (addSystemOptions.length === 0) {
                setLoadingAddSystem(true);
                apiGet(endpoint, '/system', token)
                    .then(res => {
                        const options = (res.data || []).map(sys => ({
                            value: sys.system_id,
                            label: sys.system_name
                        }));
                        setAddSystemOptions(options);
                    })
                    .finally(() => setLoadingAddSystem(false));
            }
            if (addMenuOptions.length === 0) {
                setLoadingAddMenu(true);
                apiGet(endpoint, '/menu', token)
                    .then(res => {
                        const options = (res.data || []).map(menu => ({
                            value: menu.menu_id,
                            label: menu.menu_name
                        }));
                        setAddMenuOptions(options);
                    })
                    .finally(() => setLoadingAddMenu(false));
            }
        }
    }, [showAddMenu, token]);

    // FUNCTION DELETE USERS LIST
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [menuToDelete, setMenuToDelete] = useState(null);

    const handleDeleteMenu = (menuId) => {
        setMenuToDelete(menuId);
        setShowDeletePopup(true);
    };

    const handleConfirmDelete = async () => {
        if (!menuToDelete) return;
        try {
            await apiDelete(endpoint, `/menu/${menuToDelete}`, token);
            toast.success('Menu berhasil dihapus!', {
                position: "top-right",
                autoClose: 3000
            });
            setShowDeletePopup(false);
            setMenuToDelete(null);// Refresh data menu
                apiGet(endpoint, '/menu', token)
                    .then(data => setDataMenu(data?.data || []))
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
            setMenuToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeletePopup(false);
        setMenuToDelete(null);
    };

    // FUNCTION EDIT SYSTEM
    const [isEdit, setIsEdit] = useState(false);
    const [editMenuId, setEditMenuId] = useState(null);
    const handleEditMenu = (menuId) => {
        const menu = dataMenu.find(u => u.menu_id === menuId);
        if (!menu) return;

        setFormData({
            menu_id: menu.menu_id || '',
            menu_name: menu.menu_name || '',
            system_id: menu.system_id || '',
            system_name: menu.system_name || '',
            menu_order: menu.menu_order || 1,
            parent_menu_id: menu.parent_menu_id || ''
        });
        setIsEdit(true);
        setEditMenuId(menuId);
        setTitleModals('Edit Menu');
        setTitleButton('Update Menu');
        setShowAddMenu(true);
    };

    const handleFormSubmit = async(e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (
            formData.menu_name &&
            formData.system_id
        ) {
            setValidated(false);
            const dataToSend = { ...formData };
            const dataToAdd = {
                menu_name: formData.menu_name,
                system_id: formData.system_id,
                menu_order: formData.menu_order,
                parent_menu_id: formData.parent_menu_id
            };
            try {
                if (isEdit && editMenuId) {
                    // Edit menu
                    await apiPut(endpoint, `/menu/${editMenuId}`, token, dataToAdd);
                    toast.success('Menu berhasil diupdate!', {
                        position: "top-right",
                        autoClose: 3000
                    });
                } else {
                    // Add menu
                    await apiPost(endpoint, '/menu', token, dataToAdd);
                    toast.success('Menu berhasil ditambahkan!', {
                        position: "top-right",
                        autoClose: 3000
                    });
                }
                setShowAddMenu(false);
                setIsEdit(false);
                setEditMenuId(null);
                apiGet(endpoint, '/menu', token)
                    .then(data => setDataMenu(data?.data || []))
                    .catch(err => {
                        console.error('Failed to refresh menu after update:', err);
                        toast.error('Data berhasil diubah, tapi gagal memuat ulang tampilan', {
                            position: "top-right",
                            autoClose: 3000
                        });
                    });
                setFormData({
                    menu_name: '',
                    system_id: '',
                    menu_order: '',
                    parent_menu_id: '',
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
                                placeholder="Search menu name, system name, parent menu, or date..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <div className='col-md-6 p-0 d-flex justify-content-end'>
                            <Button onClick={() => handleOpen('Add Menu')}  className='btn-action' ><FiPlusCircle className='me-1'/> Add New Menu</Button>
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
                            <SortableHeader
                                label="Parent Menu"
                                columnKey="parent_menu_name"
                                sortConfig={sortConfig}
                                onSort={() => handleSort('parent_menu_name')}
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
                        {sortedDataMenu.map(menu => (
                            <tr key={menu.menu_id}>
                                <td>{menu?.menu_name || 'n/a'}</td>
                                <td>{menu?.system_name || 'n/a'}</td>
                                <td>{menu?.parent_menu_name || '-'}</td>
                                <td>{formatDate(menu.created_at, false)}</td>
                                <td>
                                    <button 
                                        onClick={() => handleEditMenu(menu.menu_id)}
                                        className="btn btn-sm btn-transparent me-2"
                                    >
                                        <FaRegPenToSquare />
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-transparent"
                                        onClick={() => handleDeleteMenu(menu.menu_id)}
                                    >
                                        <FaRegTrashCan />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {sortedDataMenu.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    {searchTerm ? `No menus found for "${searchTerm}"` : 'No menus found.'}
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
                show={showAddMenu}
                title={titleModals}
                size={'md'}
                onHide={handleClose}
                onConfirm={handleFormSubmit}
                titleConfirm={titleButton}
            >
                <FormModalAddMenu
                    formData={formData}
                    setFormData={setFormData}
                    validated={validated}
                    handleInputChange={handleInputChange}
                    handleMenuChange={handleMenuChange}
                    handleSystemChange={handleSystemChange}
                    systemOptions={addSystemOptions}
                    menuOptions={addMenuOptions}
                    loadingAddSystem={loadingAddSystem}
                    loadingAddMenu={loadingAddMenu}
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
        </React.Fragment>
    )
}
const FormModalAddMenu = ({ 
    formData,
    setFormData,
    validated,
    handleInputChange,
    handleMenuChange,
    handleSystemChange,
    systemOptions,
    menuOptions,
    loadingAddSystem,
    loadingAddMenu
}) => {
    const [selectOpen, setSelectOpen] = useState(false);
    return(
        <Form className='select-floating-form' noValidate validated={validated}>
            <FloatingLabel
                controlId="floatingInput"
                label="Name Menu"
                className="mb-3"
            >
                <Form.Control
                    type="text"
                    placeholder="Name Menu"
                    required
                    name="menu_name"
                    value={formData.menu_name}
                    onChange={handleInputChange}
                />
                <Form.Control.Feedback type="invalid">
                    Please provide a valid name.
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
                    styles={{
                        control: (baseStyles, state) => {
                            setSelectOpen(state.menuIsOpen ? true : false);
                            return {
                                ...baseStyles,
                                zIndex: state.menuIsOpen ? 10 : 0,
                            };
                        },
                    }}
                />
                <label className="floating-label" style={{ zIndex: selectOpen ? 11 : 0 }}>System</label>
                {validated && !formData.system_id && (
                    <div className="invalid-feedback d-block">
                        Please select a system.
                    </div>
                )}
            </div>
            <div className="form-floating select-filter-floating mb-3">
                <Select
                    options={[
                        { value: '', label: 'No Parent Menu' },
                        ...menuOptions
                    ]}
                    value={menuOptions.find(opt => opt.value === formData.parent_menu_id) || { value: '', label: 'No Parent Menu' }}
                    onChange={handleMenuChange}
                    isLoading={loadingAddMenu}
                    classNamePrefix="react-select"
                    placeholder="Choose a menu..."
                    isSearchable
                    name="parent_menu_id"
                />
                <label className="floating-label">Menu</label>
            </div>

            <FloatingLabel
                controlId="floatingInput"
                label="Order Menu"
                className="mb-3"
            >
                <Form.Control
                    name="menu_order"
                    value={formData.menu_order}
                    placeholder="Enter your order menu"
                    pattern="^08[0-9]{8,11}$"
                    onChange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, '');
                        setFormData(prev => ({
                            ...prev,
                            menu_order: value
                        }));
                    }}
                    maxLength={1}
                    onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                        }
                    }}
                />
            </FloatingLabel>
        </Form>
    )
}