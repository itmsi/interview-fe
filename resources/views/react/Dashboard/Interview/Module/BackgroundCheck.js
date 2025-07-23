import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Badge, Table, Container, Row, Col } from 'react-bootstrap';
import { FaPlus, FaUserCheck, FaUserTimes, FaTrash, FaStickyNote, FaCalendar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { apiGet, apiPost, apiDelete } from '../../Helper/Helper';
import { Popup } from '../../Component/Popup';
import { AnimatedLoadingSpinner } from '../../Helper/Helper';

export const BackgroundCheck = ({ 
    infoCandidate, 
    loginInfo, 
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
        status: 'hired', // 'hired' or 'rejected'
        notes: ''
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

    // Handle status switch change
    const handleStatusChange = (e) => {
        const status = e.target.checked ? 'hired' : 'rejected';
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
            const checkData = {
                candidate_id: candidateId,
                background_check_reject: form.status === 'rejected',
                background_check_note: form.notes,
                create_by: loginInfo?.employee?.name || 'tidak dikenal'
            };

            await apiPost(endpoint, '/background-check', token, checkData);
            
            toast.success('Background check added successfully!');
            setShowAddModal(false);
            setForm({ status: 'hired', notes: '' });
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
        if (!deletingCheck) return;

        try {
            const params = {
                id: deletingCheck.id,
                deleteBy: loginInfo?.employee?.name || "tidak dikenal"
            };

            await apiDelete(endpoint, `/background-check/${deletingCheck.id}`, token, { params });
            
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
    const getStatusBadge = (isRejected) => {
        return isRejected ? (
            <Badge bg="danger" className="d-flex align-items-center gap-1 fs-14 rounded-3 justify-content-center">
                <FaUserTimes /> Rejected
            </Badge>
        ) : (
            <Badge bg="success" className="d-flex align-items-center gap-1 fs-14 rounded-3 justify-content-center">
                <FaUserCheck /> Hired
            </Badge>
        );
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
                                                {getStatusBadge(check.background_check_reject)}
                                            </td>
                                            <td valign='middle' className="text-center">
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteConfirm(check)}
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </Button>
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
                    setForm({ status: 'hired', notes: '' });
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
                            <div className="d-flex align-items-center gap-2">
                                <FaUserTimes className="text-danger" />
                                <span className={form.status === 'rejected' ? 'text-dark fw-bold' : 'text-muted'}>
                                    Rejected
                                </span>
                            </div>
                            <Form.Check 
                                type="switch"
                                id="status-switch"
                                checked={form.status === 'hired'}
                                onChange={handleStatusChange}
                                disabled={submitting}
                                className="mx-2"
                            />
                            <div className="d-flex align-items-center gap-2">
                                <FaUserCheck className="text-success" />
                                <span className={form.status === 'hired' ? 'text-dark fw-bold' : 'text-muted'}>
                                    Hired
                                </span>
                            </div>
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
                            {deletingCheck && getStatusBadge(deletingCheck.background_check_reject)}
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
