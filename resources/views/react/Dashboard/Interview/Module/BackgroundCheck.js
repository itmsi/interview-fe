import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Badge, Table, Container } from 'react-bootstrap';
import { FaPlus, FaUserCheck, FaUserTimes, FaTrash, FaCalendar, FaFilePdf, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { apiGet, apiPost, apiDelete, apiPostFormData, Tooltips } from '../../Helper/Helper';
import { Popup } from '../../Component/Popup';
import { AnimatedLoadingSpinner } from '../../Helper/Helper';

export const BackgroundCheck = ({ 
    infoCandidate, 
    loginInfo, 
    system,
    token,
    endpoint, 
    isActive = false 
}) => {
    const [candidateId] = useState(infoCandidate?.id);
    const [backgroundChecks, setBackgroundChecks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingCheck, setDeletingCheck] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    
    // Form state
    const [form, setForm] = useState({
        status: '', // 'hired' or 'rejected'
        notes: '',
        file_attachment: null
    });

    // Fetch background checks from API
    const fetchBackgroundChecks = async () => {
        if (!candidateId || !endpoint || !token) return;
        
        setLoading(true);
        try {
            const params = {
                page: 1,
                limit: 500,
                orderBy: 'create_at',
                orderDirection: "DESC",
                candidate_id: candidateId
            };

            const response = await apiGet(endpoint, '/background-check', token, { params });
            
            if (response && response.data) {
                const responseData = Array.isArray(response.data.data) ? response.data.data : [];
                setBackgroundChecks(responseData);
            }
            
        } catch (error) {
            console.error('Error fetching background checks:', error);
            toast.error('Failed to fetch background checks: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when tab becomes active
    useEffect(() => {
        if (isActive) {
            fetchBackgroundChecks();
        }
    }, [isActive, candidateId, endpoint, token]);

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Handle file upload change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type (PDF only)
            if (file.type !== 'application/pdf') {
                toast.error('Please select a PDF file only');
                e.target.value = ''; // Clear the input
                return;
            }
            
            // Validate file size (max 10MB)
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes
            if (file.size > maxSize) {
                toast.error('File size must be less than 10MB');
                e.target.value = ''; // Clear the input
                return;
            }
            
            setForm(prev => ({ ...prev, file_attachment: file }));
        } else {
            setForm(prev => ({ ...prev, file_attachment: null }));
        }
    };

    // Handle status radio button change
    const handleStatusChange = (e) => {
        const status = e.target.value;
        setForm(prev => ({ ...prev, status }));
    };

    // Handle add background check
    const handleAdd = async () => {
        if (!form.notes.trim()) {
            toast.error('Please enter background check notes');
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('candidate_id', candidateId);
            formData.append('background_check_reject', form.status === 'rejected');
            formData.append('status', form.status); // Add status field
            formData.append('background_check_note', form.notes);
            formData.append('create_by', loginInfo?.employee?.name || 'tidak dikenal');
            
            // Add file if selected
            if (form.file_attachment) {
                formData.append('file_attachment', form.file_attachment);
            }

            await apiPostFormData(endpoint, '/background-check/multipart', token, formData);
            
            toast.success('Background check added successfully!');
            setShowAddModal(false);
            setForm({ status: 'hired', notes: '', file_attachment: null });
            fetchBackgroundChecks(); // Refresh the list
            
        } catch (error) {
            console.error('Error adding background check:', error);
            toast.error('Failed to add background check: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle delete confirmation
    const handleDeleteConfirm = (check) => {
        setDeletingCheck(check);
        setShowDeleteModal(true);
    };

    // Handle background check deletion
    const handleDelete = async () => {
        console.log({
            deletingCheck
        });
        if (!deletingCheck) return;
        
        try {
            const params = {
                id: deletingCheck.background_check_id,
                deleteBy: loginInfo?.employee?.name || "tidak dikenal"
            };

            await apiDelete(endpoint, `/background-check/${deletingCheck.background_check_id}`, token, { params });
            
            toast.success('Background check deleted successfully!');
            setShowDeleteModal(false);
            setDeletingCheck(null);
            fetchBackgroundChecks(); // Refresh the list
            
        } catch (error) {
            console.error('Error deleting background check:', error);
            toast.error('Failed to delete background check: ' + error.message);
        }
    };

    // Get status badge variant
    const getStatusBadge = (isRejected, status) => {
        if (isRejected || status === 'rejected') {
            return (
                <Badge bg="danger" className="d-flex align-items-center gap-1 fs-14 rounded-3 justify-content-center">
                    <FaUserTimes /> Rejected
                </Badge>
            );
        } else if (status === 'hired') {
            return (
                <Badge bg="success" className="d-flex align-items-center gap-1 fs-14 rounded-3 justify-content-center">
                    <FaUserCheck /> Hired
                </Badge>
            );
        } else {
            return (
                <Badge bg="warning" className="d-flex align-items-center gap-1 fs-14 rounded-3 justify-content-center">
                    <FaCalendar /> On Hold
                </Badge>
            );
        }
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <AnimatedLoadingSpinner text="background checks" />;
    }

    const roleName = system?.roles?.[0]?.role_name;
    return (
        <Container className="p-0">
            <Button 
                variant="primary" 
                size="sm"
                onClick={() => setShowAddModal(true)}
                className="rounded-1 mt-4 w-100 font-primary fs-6"
            >
                <FaPlus /> Add Check
            </Button>

            {backgroundChecks.length === 0 ? (
                <Card className="mt-3">
                    <Card.Body className="text-center py-5">
                        <FaUserCheck size={48} className="text-muted mb-3" />
                        <h6 className="text-muted">No background checks yet</h6>
                        <p className="text-muted small">Add your first background check to get started</p>
                    </Card.Body>
                </Card>
            ) : (
                <Card className="mt-3">
                    <Card.Body>
                        <div className="table-responsive">
                            <Table hover className="mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th></th>
                                        <th>Notes</th>
                                        <th>Created By</th>
                                        <th>Date</th>
                                        <th className="text-center">Status</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {backgroundChecks.map((check, index) => (
                                        <tr key={index}>
                                            <td valign="middle">
                                                <FaFilePdf className="text-danger fs-5" />
                                            </td>
                                            <td valign='middle'>
                                                <p className="mb-0 text-wrap" style={{ maxWidth: '300px' }}>
                                                    {check.background_check_note}
                                                </p>
                                            </td>
                                            <td valign='middle'>
                                                <span className="text-dark">{check.create_by || 'Unknown'}</span>
                                            </td>
                                            <td valign='middle'>
                                                <div className="d-flex align-items-center gap-2">
                                                    <FaCalendar className="text-muted" />
                                                    <span className="text-muted small">
                                                        {formatDate(check.create_at)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td valign='middle'>
                                                {getStatusBadge(check.background_check_reject, check.status || (check.background_check_reject ? 'rejected' : 'hired'))}
                                            </td>
                                            <td valign='middle' className="text-center">
                                                <div className="d-flex align-items-center gap-2 justify-content-center">
                                                    {check.file_attachment ? (
                                                        <Tooltips title={"Download Attachment"} position="top">
                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                onClick={() => window.open(check.file_attachment, '_blank')}
                                                                className="w-50"
                                                                title="Download PDF"
                                                            >
                                                                <FaDownload size={12} />
                                                            </Button>
                                                        </Tooltips>
                                                    ) : (
                                                        <span className="text-muted">No attachment</span>
                                                    )}
                                                    {roleName && roleName.toLowerCase() === 'hr' && (
                                                        <Tooltips title={"Delete Background Check"} position="top">
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                onClick={() => handleDeleteConfirm(check)}
                                                                className="w-50"
                                                                title="Delete"
                                                            >
                                                                <FaTrash />
                                                            </Button>
                                                        </Tooltips>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            )}

            {/* Add Background Check Modal */}
            <Popup
                show={showAddModal}
                title="Add Background Check"
                size="md"
                onHide={() => {
                    setShowAddModal(false);
                    setForm({ status: '', notes: '', file_attachment: null });
                }}
                onConfirm={handleAdd}
                titleConfirm={submitting ? "Adding..." : "Add Check"}
                confirmDisabled={submitting}
            >
                <Form>
                    {/* Status Switch */}
                    <Form.Group className="mb-4">
                        <Form.Label className="mb-3">Background Check Result</Form.Label>
                        <div className="d-flex align-items-center gap-3 p-3 bg-light rounded">
                            {/* <div className="d-flex align-items-center gap-2">
                                <FaUserTimes className="text-danger" />
                                <span className={form.status === 'rejected' ? 'text-dark fw-bold' : 'text-muted'}>
                                    Rejected
                                </span>
                            </div> */}

                            <Form.Check 
                                type="radio"
                                id="status-rejected"
                                name="status"
                                value="rejected"
                                checked={form.status === 'rejected'}
                                onChange={handleStatusChange}
                                disabled={submitting}
                                className="mx-2"
                                label="Rejected"
                            />
                            <Form.Check 
                                type="radio"
                                id="status-hold"
                                name="status"
                                value="on_hold"
                                checked={form.status === 'on_hold'}
                                onChange={handleStatusChange}
                                disabled={submitting}
                                className="mx-2"
                                label="On Hold"
                            />
                            <Form.Check 
                                type="radio"
                                id="status-hired"
                                name="status"
                                value="hired"
                                checked={form.status === 'hired'}
                                onChange={handleStatusChange}
                                disabled={submitting}
                                className="mx-2"
                                label="Hired"
                            />
                            {/* <div className="d-flex align-items-center gap-2">
                                <FaUserCheck className="text-success" />
                                <span className={form.status === 'hired' ? 'text-dark fw-bold' : 'text-muted'}>
                                    Hired
                                </span>
                            </div> */}
                        </div>
                    </Form.Group>
                    
                    {/* Notes */}
                    <Form.Group className="mb-3">
                        <Form.Label>Notes <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            name="notes"
                            value={form.notes}
                            onChange={handleInputChange}
                            placeholder="Enter background check notes, findings, or comments..."
                            disabled={submitting}
                        />
                        <Form.Text className="text-muted">
                            Provide detailed information about the background check results.
                        </Form.Text>
                    </Form.Group>

                    {/* File Attachment */}
                    <Form.Group className="mb-3">
                        <Form.Label>Attachment (PDF)</Form.Label>
                        <Form.Control
                            type="file"
                            name="file_attachment"
                            accept=".pdf"
                            onChange={handleFileChange}
                            disabled={submitting}
                        />
                        <Form.Text className="text-muted">
                            Upload background check documents (PDF only, max 10MB)
                        </Form.Text>
                        {form.file_attachment && (
                            <div className="mt-2 p-2 bg-light rounded d-flex align-items-center gap-2">
                                <FaFilePdf className="text-danger" />
                                <span className="text-dark small">
                                    Selected: {form.file_attachment.name} ({(form.file_attachment.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                            </div>
                        )}
                    </Form.Group>
                </Form>
            </Popup>

            {/* Delete Confirmation Modal */}
            <Popup
                show={showDeleteModal}
                title="Delete Background Check"
                size="md"
                onHide={() => {
                    setShowDeleteModal(false);
                    setDeletingCheck(null);
                }}
                onConfirm={handleDelete}
                titleConfirm="Delete"
                variant="danger"
            >
                <div>
                    <p>Are you sure you want to delete this background check?</p>
                    <div className="bg-light p-3 rounded">
                        <div className="mb-2">
                            {deletingCheck && getStatusBadge(deletingCheck.background_check_reject, deletingCheck.status || (deletingCheck.background_check_reject ? 'rejected' : 'hired'))}
                        </div>
                        <p className="mb-1 text-wrap">
                            <strong>Notes:</strong> {deletingCheck?.background_check_note}
                        </p>
                        <small className="text-muted">
                            Created by: {deletingCheck?.create_by} • {deletingCheck && formatDate(deletingCheck.create_at)}
                        </small>
                    </div>
                    <p className="text-muted mt-3 mb-0">This action cannot be undone.</p>
                </div>
            </Popup>
        </Container>
    );
};
