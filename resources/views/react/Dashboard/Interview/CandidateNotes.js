import React, { useState } from 'react';
import { Notes } from './Module/NotesFixed'; // Menggunakan versi yang sudah diperbaiki
import { Container, Alert } from 'react-bootstrap';

// Komponen untuk menampilkan notes kandidat dan menambahkan notes baru
const CandidateNotes = ({ 
    candidateId, 
    candidateNotes, 
    loginInfo, 
    onUpdateNotes,
    token
}) => {
    console.log({
        loginInfo
    });
    
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('success');

    // Handler untuk menambah note baru
    const handleAddNote = async (noteText) => {
        try {
            // Buat note baru berdasarkan loginInfo yang diberikan
            const newNote = {
                name: loginInfo.employee.name,
                email: loginInfo.employee.email || 'user@example.com',
                image_profile: loginInfo.employee.image || 'https://picsum.photos/id/1/200/200',
                date_created: new Date().toLocaleDateString('en-US', {
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric'
                }),
                role: loginInfo.employee.role || 'Interviewer',
                role_alias: loginInfo.employee.role_alias || 'INT',
                note: noteText
            };

            console.log('Adding new note:', newNote);
            
            // Panggil callback untuk update state di parent component
            if (onUpdateNotes) {
                // Tambahkan note baru ke array notes kandidat
                await onUpdateNotes(candidateId, [...candidateNotes, newNote]);
            }
            
            // Tampilkan notifikasi sukses
            setAlertMessage('Note added successfully!');
            setAlertVariant('success');
            setShowAlert(true);
            
            // Otomatis sembunyikan alert setelah 3 detik
            setTimeout(() => setShowAlert(false), 3000);

            return newNote;
            
        } catch (error) {
            console.error('Error adding note:', error);
            
            // Tampilkan notifikasi error
            setAlertMessage('Failed to add note. Please try again.');
            setAlertVariant('danger');
            setShowAlert(true);
            
            setTimeout(() => setShowAlert(false), 5000);
            throw error;
        }
    };

    return (
        <Container className="p-0">
            {/* Alert notification */}
            {showAlert && (
                <Alert 
                    variant={alertVariant} 
                    onClose={() => setShowAlert(false)} 
                    dismissible
                    className="mt-3"
                >
                    {alertMessage}
                </Alert>
            )}
            
            {/* Notes component */}
            <Notes 
                token={token}
                data={candidateNotes || []}
                loginInfo={loginInfo}
                onAddNote={handleAddNote}
            />
        </Container>
    );
};

export default CandidateNotes;
