import React, { useState, useEffect } from 'react';
import { Notes } from './Form/Notes';
import { Container } from 'react-bootstrap';
import { apiGet, apiPost } from '../../Helper/Helper';
import { toast } from 'react-toastify';
import { assign } from 'lodash';

const CandidateNotes = ({ 
    candidateId, 
    candidateNotes, 
    loginInfo, 
    onUpdateNotes,
    token,
    endpoint,
    system,
    isActive = false
}) => {
    const [notes, setNotes] = useState(Array.isArray(candidateNotes) ? candidateNotes : []);
    const [loading, setLoading] = useState(false);

    const fetchNotes = async () => {
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

            const response = await apiGet(endpoint, '/notes', token, { params });
            
            if (response && response.data) {
                const responseData = Array.isArray(response.data.data) ? response.data.data : [];
                const transformedData = responseData.map(item => ({
                    id: item.note_id,
                    name: item.create_by || 'Unknown User',
                    image_profile: null,
                    date_created: new Date(item.create_at).toLocaleDateString('en-US', {
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric'
                    }),
                    role_alias: item.create_role,
                    note: item.notes,
                    note_id: item.note_id,
                    candidate_id: item.candidate_id,
                    create_at: item.create_at,
                    create_by: item.create_by
                }));
                
                setNotes(transformedData);
                if (onUpdateNotes) {
                    onUpdateNotes(candidateId, transformedData);
                }
            }
            
        } catch (error) {
            console.error('Error fetching notes:', error);
            toast.error('Failed to fetch notes: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isActive) {
            fetchNotes();
        }
    }, [candidateId, endpoint, token, isActive]);

    const handleAddNote = async (noteText) => {
        try {
            const noteData = {
                candidate_id: candidateId,
                notes: noteText,
                create_by: loginInfo?.employee?.name || "Unknown User",
                assigned_data: [
                    {
                        cum_id: loginInfo?.employee?.id || loginInfo?.id,
                        assigned_name: loginInfo?.employee?.name || loginInfo?.name || "Unknown",
                        assigned_email: loginInfo?.employee?.email || loginInfo?.email || "",
                        assigned_role: system?.roles?.[0]?.role_name || 'role_name',
                        assigned_role_alias: system?.roles?.[0]?.role_slug || 'role_slug'
                    }
                ]
            };

            // Post to API
            const response = await apiPost(endpoint, '/notes', token, noteData);
            const newNote = {
                id: response?.data?.note_id || response?.note_id || Date.now(),
                name: loginInfo?.employee?.name || 'Unknown User',
                email: loginInfo?.employee?.email || 'user@example.com',
                image_profile: loginInfo?.employee?.image || null,
                date_created: new Date().toLocaleDateString('en-US', {
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric'
                }),
                role: loginInfo?.employee?.role || 'User',
                role_alias: system?.roles?.[0]?.role_slug || 'role_slug',
                note: noteText,
                note_id: response?.data?.note_id || response?.note_id,
                candidate_id: candidateId,
                create_at: new Date().toISOString(),
                create_by: loginInfo?.employee?.name || "Unknown User"
            };
            
            const currentNotes = Array.isArray(notes) ? notes : [];
            const updatedNotes = [newNote, ...currentNotes];
            setNotes(updatedNotes);
            
            if (onUpdateNotes) {
                await onUpdateNotes(candidateId, updatedNotes);
            }
            
            toast.success('Note added successfully!');
            return newNote;
            
        } catch (error) {
            console.error('Error adding note:', error);
            toast.error('Failed to add note. Please try again.');
            throw error;
        }
    };

    return (
        <Container className="p-0">
            <Notes 
                token={token}
                data={notes}
                loginInfo={loginInfo}
                onAddNote={handleAddNote}
                loading={loading}
            />
        </Container>
    );
};

export default CandidateNotes;
