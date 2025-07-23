import React, { useState } from 'react'
import { Card, Button, Form } from 'react-bootstrap'
import { Popup } from '../../../Component/Popup';
import { toast } from 'react-toastify';
import { IoMdChatbubbles } from "react-icons/io";
import { BsChatLeftQuote } from "react-icons/bs";
import { AnimatedLoadingSpinner } from '../../../Helper/Helper';

export const Notes = ({ loading, data, onAddNote }) => {
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
        setNewNote(value);
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        
        if (!newNote.trim()) {
            toast.error('Please enter a note');
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
            toast.error('Failed to add note. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <AnimatedLoadingSpinner text={'Notes interviews'} />;
    }

    return (
        <>
            <Button 
                variant="primary" 
                size="sm"
                onClick={handleOpenModal}
                className='rounded-1 mt-4 w-100 font-primary fs-6'
            >
                <IoMdChatbubbles /> Add Note
            </Button>
            {data.length === 0 ? (
                <Card className="mt-3">
                    <Card.Body className="text-center py-5">
                        <BsChatLeftQuote size={48} className="text-muted mb-3" />
                        <h6 className="text-muted">No notes available</h6>
                        <p className="text-muted small">Add your first note to get started</p>
                    </Card.Body>
                </Card>
            ) : (
                <Card className="mt-4">
                    <Card.Body>
                        <div className="table-responsive">
                            <ul className="list-unstyled notes-candidate">
                                {data.map((note, idx) => (
                                    <li key={idx} className='pb-2'>
                                        <div className="image-profile">
                                            <div className="avatar">
                                                {(() => {
                                                    const nameParts = note.name.trim().split(' ');
                                                    if (nameParts.length > 1) {
                                                        // Ambil huruf pertama dari kata pertama dan kata kedua
                                                        return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
                                                    } else {
                                                        // Ambil huruf pertama saja jika tidak ada spasi
                                                        return nameParts[0].charAt(0).toUpperCase();
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                        <div className='description ms-2'>
                                            <div className='header-profile mb-2'>
                                                <div className="left-profile">
                                                    <p className="text-dark mb-0">
                                                        {note.name}
                                                    </p>
                                                    <span className="fs-12">{note.role_alias}</span>
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
            )}
            
            
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
                        <Form.Label className='m-0 fs-14 color-label' htmlFor="noteText">Note</Form.Label>
                        <Form.Control
                            as="textarea"
                            id="noteText"
                            name="noteText"
                            rows={4}
                            value={newNote}
                            onChange={handleInputChange}
                            placeholder="Enter your note here..."
                            disabled={isSubmitting}
                            className='fs-14'
                            style={{ resize: 'vertical' }}
                        />
                    </Form.Group>
                </Form>
            </Popup>
        </>
    );
}
