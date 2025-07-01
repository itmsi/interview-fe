import React, { useState, useEffect } from 'react';
import { Table, Button, Container } from 'react-bootstrap';
import { InterviewForm } from './InterviewForm';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';

export const ListInterview = ({ token, setPage }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setPage('Interviews');
        // apiGet('/users', token)
        //     .then(data => {
        //         setLoading(false);
        //         setUsers(data?.data?.data || [])
        //     })
        //     .catch(err => console.error(err));
    }, [token]);

    const dataKandidat = [
        {
            "id": 1,
            "name": "Adhi Pratomo",
            "email": "adhi@example.com",
            "image": "https://picsum.photos/id/200/200/200",
            "id_candidate": "cand-001",
            "date_applied": "10 Jun 2025",
            "position": "Business Strategic",
            "interviewer": "Irene Simbolon",
            "status": "Interviewed"
        },
        {
            "id": 2,
            "name": "Putri Santika",
            "email": "putri@example.com",
            "image": "https://picsum.photos/id/200/200/200",
            "id_candidate": "cand-002",
            "date_applied": "12 Apr 2025",
            "position": "CSE",
            "interviewer": ["HR","GM","VP", "BOD"],
            "status": "Scheduled"
        },
        {
            "id": 3,
            "name": "Sandra Ornellas",
            "email": "sandra@example.com",
            "image": "https://picsum.photos/id/200/200/200",
            "id_candidate": "cand-003",
            "date_applied": "20 Mar 2025",
            "position": "Accountant",
            "interviewer": ["HR","GM"],
            "status": "Rejected"
        },
        {
            "id": 4,
            "name": "Charles Marks",
            "email": "charles@example.com",
            "image": "https://picsum.photos/id/200/200/200",
            "id_candidate": "cand-004",
            "date_applied": "02 Feb 2025",
            "position": "Designer",
            "interviewer": ["HR","GM","VP"],
            "status": "Hired"
        },
        {
            "id": 5,
            "name": "Charles Marks",
            "email": "charles@example.com",
            "image": "https://picsum.photos/id/200/200/200",
            "id_candidate": "cand-005",
            "date_applied": "20 Jan 2025",
            "position": "Designer",
            "interviewer": ["HR"],
            "status": "New"
        },
        {
            "id": 6,
            "name": "Charles Marks",
            "email": "charles@example.com",
            "image": "https://picsum.photos/id/200/200/200",
            "id_candidate": "cand-006",
            "date_applied": "15 Jan 2025",
            "position": "Designer",
            "interviewer": ["HR","GM","VP"],
            "status": "Offered"
        },
        {
            "id": 7,
            "name": "Joyce Golston",
            "email": "joyce@example.com",
            "image": "https://picsum.photos/id/200/200/200",
            "id_candidate": "cand-007",
            "date_applied": "12 Sep 2024",
            "position": "Designer",
            "interviewer": ["HR","GM","VP"],
            "status": "Interviewed"
        },
        {
            "id": 8,
            "name": "Cedric Rosalez",
            "email": "cedric@example.com",
            "image": "https://picsum.photos/id/200/200/200",
            "id_candidate": "cand-008",
            "date_applied": "12 Sep 2024",
            "position": "Accountant",
            "interviewer": ["HR","GM"],
            "status": "Rejected"
        }
    ];
    const [candidates, setCandidates] = useState(dataKandidat);
    const [selectedCandidateId, setSelectedCandidateId] = useState(null);

    const handleSelect = (id) => {
        setSelectedCandidateId(id);
    };
    const pageVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };
    return (
        <Container className="my-4">
            <AnimatePresence mode="wait">
                {!selectedCandidateId ? (
                    <motion.div
                        key="list"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={pageVariants}
                        transition={{ duration: 0.4 }}
                    >
                    <h3>Daftar Kandidat Interview</h3>
                    <Table bordered hover responsive className="mt-3">
                        <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Posisi</th>
                            <th>Interviewer</th>
                            <th>Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {candidates.map(candidate => (
                            <tr key={candidate.id}>
                                <td>{candidate.name}</td>
                                <td>{candidate.position}</td>
                                <td>{candidate.interviewer}</td>
                                <td>
                                    <Button variant="primary" onClick={() => handleSelect(candidate.id)}>
                                    Mulai Interview
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={pageVariants}
                        transition={{ duration: 0.4 }}
                    >
                        <Button variant="secondary" onClick={() => setSelectedCandidateId(null)} className="mb-3">
                            ← Kembali ke Daftar Kandidat
                        </Button>
                        <InterviewForm candidateId={selectedCandidateId} />
                    </motion.div>
                )}
            </AnimatePresence>
        </Container>
    )
}
