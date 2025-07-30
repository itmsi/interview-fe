import React, { useEffect, useState } from 'react'
import { apiDelete, apiGet, apiPost, apiPut, SortableHeader } from '../Helper/Helper';
import { FaRegPenToSquare, FaRegTrashCan } from "react-icons/fa6";
import { Button, Container, FloatingLabel, Form, Row } from 'react-bootstrap';
import { FiPlusCircle } from "react-icons/fi";
import { Popup } from '../Component/Popup';
import { toast } from 'react-toastify';
import { ErrorTemplate } from '../Component/ErrorTemplate';

export const System = ({ endpoint, token, setPage }) => {

    const [dataSystem, setDataSystem] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setPage('System Management');
        fetchSystems();
    }, [token]);

    const fetchSystems = () => {
        setLoading(true);
        setErrors(false);
        apiGet(endpoint, '/system', token)
            .then(data => {
                setLoading(false);
                setDataSystem(data?.data || []);
            })
            .catch(err => {
                console.error('Error fetching data:', err);
                setErrors(true);
                setLoading(false);
            });
    };

    const handleRetry = () => {
        fetchSystems();
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedDataSystem = React.useMemo(() => {
        // First filter by search term
        let filteredData = dataSystem;
        if (searchTerm) {
            filteredData = dataSystem.filter(system => {
                const searchLower = searchTerm.toLowerCase();
                return (
                    (system.system_name || '').toLowerCase().includes(searchLower) ||
                    (system.system_description || '').toLowerCase().includes(searchLower)
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
    }, [dataSystem, sortConfig, searchTerm]);
    
    // HANDLE POPUP ADD USER
    const [titleModals, setTitleModals] = useState('');
    const [titleButton, setTitleButton] = useState('');
    const [showAddSystem, setShowAddSystem] = useState(false);
    const handleOpen = (title) => {
        setFormData({
            system_name: '',
            system_description: ''
        });
        setTitleModals(title);
        setTitleButton('Add System');
        setShowAddSystem(true)
    };
    const handleClose = () => setShowAddSystem(false);
    
    // HANDLE FORM POPUP
    // VALIDATE ADD NEW SYSTEM
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({
        system_name: '',
        system_description: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    // FUNCTION DELETE USERS LIST
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [systemToDelete, setSystemToDelete] = useState(null);

    const handleDeleteSystem = (systemId) => {
        setSystemToDelete(systemId);
        setShowDeletePopup(true);
    };

    const handleConfirmDelete = async () => {
        if (!systemToDelete) return;
        try {
            await apiDelete(endpoint, `/system/${systemToDelete}`, token);
            toast.success('System berhasil dihapus!', {
                position: "top-right",
                autoClose: 3000
            });
            setShowDeletePopup(false);
            setSystemToDelete(null);// Refresh data system
                apiGet(endpoint, '/system', token)
                    .then(data => setDataSystem(data?.data || []))
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
            setSystemToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeletePopup(false);
        setSystemToDelete(null);
    };

    // FUNCTION EDIT SYSTEM
    const [isEdit, setIsEdit] = useState(false);
    const [editSystemId, setEditSystemId] = useState(null);
    const handleEditSystem = (systemId) => {
        const system = dataSystem.find(u => u.system_id === systemId);
        if (!system) return;

        setFormData({
            system_name: system.system_name || '',
            system_description: system.system_description || ''
        });
        setIsEdit(true);
        setEditSystemId(systemId);
        setTitleModals('Edit System');
        setTitleButton('Update System');
        setShowAddSystem(true);
    };

    const handleFormSubmit = async(e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (
            formData.system_name.length > 0 &&
            formData.system_description.length > 0
        ) {
            setValidated(false);
            const dataToSend = { ...formData };

            try {
                if (isEdit && editSystemId) {
                    // Edit system
                    await apiPut(endpoint, `/system/${editSystemId}`, token, dataToSend);
                    toast.success('System berhasil diupdate!', {
                        position: "top-right",
                        autoClose: 3000
                    });
                } else {
                    // Add system
                    await apiPost(endpoint, '/system', token, dataToSend);
                    toast.success('System berhasil ditambahkan!', {
                        position: "top-right",
                        autoClose: 3000
                    });
                }
                setShowAddSystem(false);
                setIsEdit(false);
                setEditSystemId(null);
                apiGet(endpoint, '/system', token)
                    .then(data => setDataSystem(data?.data || []))
                    .catch(err => {
                        console.error('Failed to refresh system after update:', err);
                        toast.error('Data berhasil diubah, tapi gagal memuat ulang tampilan', {
                            position: "top-right",
                            autoClose: 3000
                        });
                    });
                setFormData({
                    system_name: '',
                    system_description: ''
                });
            } catch (error) {
                toast.error(error.message, {
                    position: "top-right",
                    autoClose: 3000
                });
                console.error('Gagal menyimpan system:', error);
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
                                placeholder="Search system name or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <div className='col-md-6 p-0 d-flex justify-content-end'>
                            <Button onClick={() => handleOpen('Add System')}  className='btn-action' ><FiPlusCircle className='me-1'/> Add New System</Button>
                        </div>
                    </Row>
                </Container>
                <table className="table table-bordered table-hover table-sort">
                    <thead>
                        <tr>
                            <SortableHeader
                                label="System Name"
                                columnKey="system_name"
                                sortConfig={sortConfig}
                                onSort={() => handleSort('system_name')}
                            />
                            <SortableHeader
                                label="Description"
                                columnKey="system_description"
                                sortConfig={sortConfig}
                                onSort={() => handleSort('system_description')}
                            />
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedDataSystem.map(system => (
                            <tr key={system.system_id}>
                                <td>{system?.system_name || 'n/a'}</td>
                                <td>{system?.system_description || 'n/a'}</td>
                                <td>
                                    <button 
                                        onClick={() => handleEditSystem(system.system_id)}
                                        className="btn btn-sm btn-transparent me-2"
                                    >
                                        <FaRegPenToSquare />
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-transparent"
                                        onClick={() => handleDeleteSystem(system.system_id)}
                                    >
                                        <FaRegTrashCan />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {sortedDataSystem.length === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center">
                                    {searchTerm ? `No systems found for "${searchTerm}"` : 'No systems found.'}
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
            {/* MODALS ADD NEW SYSTEM */}
            <Popup
                show={showAddSystem}
                title={titleModals}
                size={'md'}
                onHide={handleClose}
                onConfirm={handleFormSubmit}
                titleConfirm={titleButton}
            >
                <FormModalAddSystem
                    formData={formData}
                    validated={validated}
                    handleInputChange={handleInputChange}
                />
            </Popup>

            {/* MODALS REMOVE SYSTEMS LIST */}
            <Popup
                show={showDeletePopup}
                title="Konfirmasi Hapus System"
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
const FormModalAddSystem = ({ 
    formData,
    validated,
    handleInputChange
}) => (
    <Form noValidate validated={validated}>
        <FloatingLabel
            controlId="floatingInput"
            label="Name system"
            className="mb-3"
        >
            <Form.Control
                type="text"
                placeholder="Name system"
                required
                name="system_name"
                value={formData.system_name}
                onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
                Please provide a valid name.
            </Form.Control.Feedback>
        </FloatingLabel>
        <FloatingLabel
            controlId="floatingInput"
            label="Description system"
            className="mb-3"
        >
            <Form.Control
                type="text"
                placeholder="Description system"
                required
                name="system_description"
                value={formData.system_description}
                onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
                Please provide a valid description.
            </Form.Control.Feedback>
        </FloatingLabel>
    </Form>
)