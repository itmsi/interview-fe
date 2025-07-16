import React, { useState } from 'react'
import { Card, Button, Modal, Form, Spinner } from 'react-bootstrap'
import { ImageProfileSrc } from '../../Helper/Helper';
import { Popup } from '../../Component/Popup';

export const Notes = ({ token, data, userInfo, onAddNote }) => {
    const [showModal, setShowModal] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOpenModal = () => {
        console.log('Opening modal...');
        setShowModal(true);
        setNewNote('');
    };

    const handleCloseModal = () => {
        console.log('Closing modal...');
        setShowModal(false);
        setNewNote('');
    };

    const handleInputChange = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const value = e.target.value;
        console.log('Input changed to:', value);
        setNewNote(value);
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        console.log('handleAddNote called, newNote:', newNote);
        
        if (!newNote.trim()) {
            alert('Please enter a note');
            return;
        }

        setIsSubmitting(true);
        try {
            if (onAddNote) {
                await onAddNote(newNote.trim());
            }
            setNewNote('');
            setShowModal(false);
        } catch (error) {
            console.error('Error adding note:', error);
            alert('Failed to add note. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!Array.isArray(data) || data.length === 0) {
        return (
            <>
                <Card className="mt-4">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">Notes</h6>
                        <Button 
                            variant="primary" 
                            size="sm"
                            onClick={handleOpenModal}
                        >
                            <i className="fas fa-plus me-1"></i> Add Note
                        </Button>
                    </Card.Header>
                    <Card.Body>
                        <p className='m-0'>No notes available.</p>
                    </Card.Body>
                </Card>
                
                <Popup
                    show={showModal}
                    title={"Add Date of Interview"}
                    size={'md'}
                    onHide={handleCloseModal}
                    onConfirm={handleAddNote}
                    titleConfirm={"Save"}
                >
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="noteText">Note</Form.Label>
                            <Form.Control
                                as="textarea"
                                id="noteText"
                                name="noteText"
                                rows={4}
                                value={newNote}
                                onChange={handleInputChange}
                                placeholder="Enter your note here..."
                                disabled={isSubmitting}
                                style={{ resize: 'vertical' }}
                            />
                        </Form.Group>
                    </Form>
                </Popup>
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
                        onClick={handleOpenModal}
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
            
            
            <Popup
                show={showModal}
                title={"Add Date of Interview"}
                size={'md'}
                onHide={handleCloseModal}
                onConfirm={handleAddNote}
                titleConfirm={"Save"}
            >
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="noteText">Note</Form.Label>
                        <Form.Control
                            as="textarea"
                            id="noteText"
                            name="noteText"
                            rows={4}
                            value={newNote}
                            onChange={handleInputChange}
                            placeholder="Enter your note here..."
                            disabled={isSubmitting}
                            style={{ resize: 'vertical' }}
                        />
                    </Form.Group>
                </Form>
            </Popup>
        </>
    );
}
