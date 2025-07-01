import React, { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export const InterviewForm = ({ candidateId }) => {
    const [questions, setQuestions] = useState([
        {
            aspect: '',
            specific_point: '',
            scoring_test: '',
            question: '',
            remark: ''
        }
    ]);

    const handleChange = (index, field, value) => {
        const updated = [...questions];
        updated[index][field] = value;
        setQuestions(updated);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                aspect: '',
                specific_point: '',
                scoring_test: '',
                question: '',
                remark: ''
            }
        ]);
    };

    const removeQuestion = (index) => {
        const updated = questions.filter((_, i) => i !== index);
        setQuestions(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // try {
        //     await axios.post('/api/interview', {
        //         candidate_id: candidateId,
        //         questions
        //     });
        //     alert('Data saved successfully!');
        // } catch (err) {
        //     console.error(err);
        //     alert('Failed to save data.');
        // }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <AnimatePresence>
                {questions.map((q, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="mb-3 shadow-sm">
                        <Card.Body>
                            <Row className="mb-2">
                            <Col md={6}>
                                <Form.Label>Aspect</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={q.aspect}
                                    onChange={(e) => handleChange(index, 'aspect', e.target.value)}
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Label>Specific Point</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={q.specific_point}
                                    onChange={(e) => handleChange(index, 'specific_point', e.target.value)}
                                />
                            </Col>
                            </Row>

                            <Row className="mb-2">
                            <Col md={6}>
                                <Form.Label>Scoring Test</Form.Label>
                                <Form.Control
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[1-5]*"
                                    value={q.scoring_test}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^$|^[1-5]$/.test(value)) {
                                            handleChange(index, 'scoring_test', value);
                                        }
                                    }}
                                />
                            </Col>
                            <Col md={6}>
                                <Button
                                    variant="outline-danger"
                                    onClick={() => removeQuestion(index)}
                                    className="mt-4 float-end"
                                >
                                    🗑 Hapus Pertanyaan
                                </Button>
                            </Col>
                            </Row>

                            <Form.Group className="mb-2">
                            <Form.Label>Question</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={q.question}
                                onChange={(e) => handleChange(index, 'question', e.target.value)}
                            />
                            </Form.Group>

                            <Form.Group>
                            <Form.Label>Remark</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={q.remark}
                                onChange={(e) => handleChange(index, 'remark', e.target.value)}
                            />
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </motion.div>
                ))}
            </AnimatePresence>

            <div className="d-flex gap-3">
                <Button variant="secondary" onClick={addQuestion}>
                    + Tambah Pertanyaan
                </Button>
                <Button type="submit" variant="primary">
                    💾 Simpan
                </Button>
            </div>
        </Form>
    );
};