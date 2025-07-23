import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Badge, Row, Col, Table, Container } from 'react-bootstrap';
import { FaCloudUploadAlt, FaFileAlt, FaDownload, FaTrash, FaPlus, FaFileImage } from 'react-icons/fa';
import { BsFiletypeDoc, BsFiletypePdf, BsFiletypeXls } from "react-icons/bs";
import { toast } from 'react-toastify';
import { apiGet, apiPostFormData, apiDelete, Tooltips } from '../../Helper/Helper';
import { Popup } from '../../Component/Popup';
import { AnimatedLoadingSpinner } from '../../Helper/Helper';

export const DocumentOnBoarding = ({ 
    infoCandidate, 
    loginInfo, 
    token, 
    endpoint, 
    isActive = false 
}) => {
    const candidateId = infoCandidate?.id || null;
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingDocument, setDeletingDocument] = useState(null);
    const [uploading, setUploading] = useState(false);
    
    // Form state
    const [form, setForm] = useState({
        title: '',
        file: null
    });

    // Fetch documents from API
    const fetchDocuments = async () => {
        if (!candidateId || !endpoint || !token) return;
        
        setLoading(true);
        try {
            const params = {
                page: 1,
                limit: 500,
                orderBy: 'create_at',
                orderDirection: "DESC",
                candidate_id: candidateId,
                on_board_documents_name: ''
            };

            const response = await apiGet(endpoint, '/on-board-documents', token, { params });
            
            if (response && response.data) {
                const responseData = Array.isArray(response.data.data) ? response.data.data : [];
                setDocuments(responseData);
            }
            
        } catch (error) {
            console.error('Error fetching documents:', error);
            toast.error('Failed to fetch documents: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch documents when tab becomes active
    useEffect(() => {
        if (isActive) {
            fetchDocuments();
        }
    }, [isActive, candidateId, endpoint, token]);

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setForm(prev => ({ ...prev, file }));
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Handle document upload
    const handleUpload = async () => {
        if (!form.title.trim()) {
            toast.error('Please enter document title');
            return;
        }
        
        if (!form.file) {
            toast.error('Please select a file to upload');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('candidate_id', candidateId);
            formData.append('on_board_documents_name', form.title);
            formData.append('create_by', loginInfo?.employee?.name || "tidak dikenal");
            
            // Try different possible field names - uncomment one at a time to test
            formData.append('on_board_documents_file', form.file); // Current attempt
            // formData.append('file', form.file); // Original
            // formData.append('document', form.file); // Alternative 1
            // formData.append('document_file', form.file); // Alternative 2
            // formData.append('attachment', form.file); // Alternative 3
            // formData.append('upload', form.file); // Alternative 4

            console.log('FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(key, ':', value instanceof File ? `File: ${value.name}` : value);
            }

            await apiPostFormData(endpoint, '/on-board-documents/multipart', token, formData);
            
            toast.success('Document uploaded successfully!');
            setShowAddModal(false);
            setForm({ title: '', file: null });
            fetchDocuments(); // Refresh the list
            
        } catch (error) {
            console.error('Error uploading document:', error);
            console.error('Full error details:', error);
            toast.error('Failed to upload document: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    // Handle delete confirmation
    const handleDeleteConfirm = (documentId) => {
        setDeletingDocument(documents.find(doc => doc.on_board_documents_id === documentId));
        setShowDeleteModal(true);
    };

    // Handle document deletion
    const handleDelete = async () => {
        if (!deletingDocument) return;
        try {
            const params = {
                id: deletingDocument.candidate_id,
                deleteBy: loginInfo?.employee?.name || "tidak dikenal"
            };

            await apiDelete(endpoint, `/on-board-documents/${deletingDocument.on_board_documents_id}`, token, { params });

            toast.success('Document deleted successfully!');
            setShowDeleteModal(false);
            setDeletingDocument(null);
            fetchDocuments(); // Refresh the list
            
        } catch (error) {
            console.error('Error deleting document:', error);
            toast.error('Failed to delete document: ' + error.message);
        }
    };

    const getFileIcon = (filename) => {
        console.log({
            filename
        });
        
        if (!filename) return <FaFileAlt />;
        
        const extension = filename.split('.').pop()?.toLowerCase();
        
        switch (extension) {
            case 'pdf':
                return <BsFiletypePdf className="fs-5 text-danger" />;
            case 'doc':
            case 'docx':
                return <BsFiletypeDoc className="fs-5 text-primary" />;
            case 'xls':
            case 'xlsx':
                return <BsFiletypeXls className="fs-5 text-success" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <FaFileImage className="fs-5 text-secondary" />;
            default:
                return <FaFileAlt className="fs-5 text-info" />;
        }
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (!bytes) return 'Unknown size';
        
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    if (loading) {
        return <AnimatedLoadingSpinner text="onboarding documents" />;
    }

    return (
        <Container className="p-0">
            <Button 
                variant="primary" 
                size="sm"
                onClick={() => setShowAddModal(true)}
                className="rounded-1 mt-4 w-100 font-primary fs-6"
            >
                <FaCloudUploadAlt className='ms-2' /> Upload Document
            </Button>

            {documents.length === 0 ? (
                <Card className="mt-3">
                    <Card.Body className="text-center py-5">
                        <FaFileAlt size={48} className="text-muted mb-3" />
                        <h6 className="text-muted">No documents uploaded yet</h6>
                        <p className="text-muted small">Upload your first document to get started</p>
                    </Card.Body>
                </Card>
            ) : (
                <Card className="mt-3">
                    <Card.Body>
                        <div className="table-responsive">
                            <Table hover bordered={false} className="mb-0">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Document</th>
                                        <th>Uploaded By</th>
                                        <th>Date</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((doc, index) => (
                                        <tr key={index}>
                                            <td valign='middle' className="text-center" width={40}>
                                                {getFileIcon(doc.on_board_documents_file)}
                                            </td>
                                            <td valign='middle'>
                                                <div className="d-flex align-items-center">
                                                    <div>
                                                        <h6 className="mb-1 font-primary">{doc.on_board_documents_name}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td valign='middle'>
                                                <span className="text-dark">{doc.create_by || 'Unknown'}</span>
                                            </td>
                                            <td valign='middle'>
                                                <span className="text-muted">
                                                    {new Date(doc.create_at).toLocaleDateString('en-US', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </td>
                                            <td valign='middle' className="text-center">
                                                <div className="d-flex justify-content-center gap-2">
                                                    {doc.on_board_documents_file && (
                                                        <Tooltips title={"Download Document"} position="top">
                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                onClick={() => window.open(doc.on_board_documents_file, '_blank')}
                                                                title="Download"
                                                            >
                                                                <FaDownload />
                                                            </Button>
                                                        </Tooltips>
                                                    )}
                                                    {/* <Tooltips title={"Delete Document"} position="top">
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleDeleteConfirm(doc.on_board_documents_id)}
                                                            title="Delete"
                                                        >
                                                            <FaTrash />
                                                        </Button>
                                                    </Tooltips> */}
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

            {/* Upload Modal */}
            <Popup
                show={showAddModal}
                title="Upload Document"
                size="md"
                onHide={() => {
                    setShowAddModal(false);
                    setForm({ title: '', file: null });
                }}
                onConfirm={handleUpload}
                titleConfirm={uploading ? "Uploading..." : "Upload"}
                confirmDisabled={uploading}
            >
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label className='fs-14 color-label m-0'>Document Title <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleInputChange}
                            placeholder="Enter document title..."
                            className='fs-14'
                            disabled={uploading}
                        />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label className='fs-14 color-label m-0'>Select File <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="file"
                            onChange={handleFileChange}
                            disabled={uploading}
                            className='fs-14'
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                        />
                        {form.file && (
                            <Form.Text className="text-muted">
                                Selected: {form.file.name} ({formatFileSize(form.file.size)})
                            </Form.Text>
                        )}
                    </Form.Group>
                </Form>
            </Popup>

            {/* Delete Confirmation Modal */}
            <Popup
                show={showDeleteModal}
                title="Delete Document"
                size="md"
                onHide={() => {
                    setShowDeleteModal(false);
                    setDeletingDocument(null);
                }}
                onConfirm={handleDelete}
                titleConfirm="Delete"
                variant="danger"
            >
                <div>
                    <p>Are you sure you want to delete this document?</p>
                    <div className="bg-light p-3 rounded">
                        <strong>{deletingDocument?.on_board_documents_name}</strong>
                        <br />
                        <small className="text-muted">{deletingDocument?.file_name}</small>
                    </div>
                    <p className="text-muted mt-3 mb-0">This action cannot be undone.</p>
                </div>
            </Popup>
        </Container>
    );
};