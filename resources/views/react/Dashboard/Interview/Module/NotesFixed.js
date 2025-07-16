import React, { useState, useCallback } from 'react'
import { Card, Button, Modal, Form, Spinner } from 'react-bootstrap'
import { ImageProfileSrc } from '../../Helper/Helper';

export const Notes = ({ token, data, loginInfo, onAddNote }) => {
    const [showModal, setShowModal] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use useCallback to prevent unnecessary re-renders
    const openModal = useCallback(() => {
        console.log('Opening modal...');
        setNewNote(''); // Clear any previous input
        setShowModal(true);
    }, []);

    const closeModal = useCallback(() => {
        console.log('Closing modal...');
        setShowModal(false);
        setNewNote('');
    }, []);

    const handleTextChange = useCallback((e) => {
        const value = e.target.value;
        console.log('Text input:', value);
        setNewNote(value);
    }, []);

    const submitNote = useCallback(async () => {
        console.log('Submitting note:', newNote);
        
        if (!newNote.trim()) {
            alert('Please enter a note');
            return;
        }

        setIsSubmitting(true);
        try {
            if (onAddNote) {
                await onAddNote(newNote.trim());
            }
            closeModal();
        } catch (error) {
            console.error('Error adding note:', error);
            alert('Failed to add note. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }, [newNote, onAddNote, closeModal]);

    if (!Array.isArray(data) || data.length === 0) {
        return (
            <>
                <Card className="mt-4">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">Notes</h6>
                        <Button 
                            variant="primary" 
                            size="sm"
                            onClick={openModal}
                        >
                            <i className="fas fa-plus me-1"></i> Add Note
                        </Button>
                    </Card.Header>
                    <Card.Body>
                        <p className='m-0'>No notes available.</p>
                    </Card.Body>
                </Card>
                
                <Modal 
                    show={showModal} 
                    onHide={closeModal} 
                    centered 
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Note</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="noteTextEmpty">Note</Form.Label>
                            <Form.Control
                                as="textarea"
                                id="noteTextEmpty"
                                rows={4}
                                value={newNote}
                                onChange={handleTextChange}
                                placeholder="Enter your note here..."
                                disabled={isSubmitting}
                                autoFocus
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button 
                            variant="secondary" 
                            onClick={closeModal}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={submitNote}
                            disabled={isSubmitting || !newNote.trim()}
                        >
                            {isSubmitting ? (
                                <>
                                    <Spinner size="sm" className="me-1" />
                                    Adding...
                                </>
                            ) : (
                                'Add Note'
                            )}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    return (
        <>
            <Card className="mt-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Notes</h6>
                    <Button 
                        variant="primary" 
                        size="sm"
                        onClick={openModal}
                    >
                        <i className="fas fa-plus me-1"></i> Add Note
                    </Button>
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <ul className="list-unstyled notes-candidate">
                            {data.map((note, idx) => (
                                <li key={idx}>
                                    <div className="image-profile">
                                        <ImageProfileSrc
                                            src={note.image_profile} 
                                            alt={`${note.name} - ${note.email}`} 
                                            width={"50"} 
                                            className='avatar'
                                        />
                                    </div>
                                    <div className='description ms-2'>
                                        <div className='header-profile mb-2'>
                                            <div className="left-profile">
                                                <p className="text-dark mb-0">
                                                    {note.name}
                                                </p>
                                                <span className="fs-12">{note.role} ({note.role_alias})</span>
                                            </div>
                                            <span className="right-profile">
                                                {note.date_created}
                                            </span>
                                        </div>
                                        <p>{note.note}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Card.Body>
            </Card>
            
            <Modal 
                show={showModal} 
                onHide={closeModal} 
                centered 
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add New Note</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="noteTextFilled">Note</Form.Label>
                        <Form.Control
                            as="textarea"
                            id="noteTextFilled"
                            rows={4}
                            value={newNote}
                            onChange={handleTextChange}
                            placeholder="Enter your note here..."
                            disabled={isSubmitting}
                            autoFocus
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="secondary" 
                        onClick={closeModal}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={submitNote}
                        disabled={isSubmitting || !newNote.trim()}
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner size="sm" className="me-1" />
                                Adding...
                            </>
                        ) : (
                            'Add Note'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
