import React, { useState } from 'react';
import { Form, Button, Row, Col, FloatingLabel } from 'react-bootstrap';
import { GrAttachment } from "react-icons/gr";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const CreateCandidateForm = ({ onSave, onCancel }) => {
    const [validated, setValidated] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        date_applied: '',
        position: '',
        interviewer: [],
        nationality: '',
        gender: '',
        religion: '',
        date_of_birth: '',
        marital_status: '',
        address: '',
        city: '',
        state: '',
        country: '',
        status: 'New',
        image: null,
        resume: null
    });

    const MAX_IMAGE_SIZE = 1024 * 1024;
    const MAX_PDF_SIZE = 2 * 1024 * 1024;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];

        if (!file) return;

        if (name === "image") {
            if (!file.type.startsWith("image/")) {
                alert("File must be an image");
                return;
            }
            if (file.size > MAX_IMAGE_SIZE) {
                alert("Image size must be under 1MB");
                return;
            }
        }

        if (name === "resume") {
            if (file.type !== "application/pdf") {
                alert("Resume must be a PDF file");
                return;
            }
            if (file.size > MAX_PDF_SIZE) {
                alert("Resume size must be under 2MB");
                return;
            }
        }

        setForm(prev => ({ ...prev, [name]: file }));
    };


    const handleSubmit = (e) => {
        const formEl = e.currentTarget;
        e.preventDefault();

        if (formEl.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        const formData = new FormData();
        for (const key in form) {
            const value = form[key];
            if (Array.isArray(value)) {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value);
            }
        }

        onSave(formData);
    };

    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit} className="p-3 border bg-light rounded">
            <h5 className="mb-4">Create New Candidate</h5>
            <Row className="g-3">

                <Col md={6}>
                    <FloatingLabel label="Name">
                        <Form.Control name="name" required value={form.name} onChange={handleChange} />
                        <Form.Control.Feedback type="invalid">Name is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="Email">
                        <Form.Control name="email" type="email" required value={form.email} onChange={handleChange} />
                        <Form.Control.Feedback type="invalid">Valid email is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="Phone">
                        <Form.Control name="phone" value={form.phone} onChange={handleChange} />
                    </FloatingLabel>
                </Col>

                <Col md={6} className='d-flex justify-content-between align-items-center'>
                    <div className=''>Upload Photo</div>
                    <Form.Group controlId="imageUpload" className='upload-files'>
                        <Form.Label className='mb-0'>Photo <small className="d-block text-center text-muted">(max 1MB)</small></Form.Label>
                        <Form.Control type="file" accept="image/*" name="image" onChange={handleFileChange} required hidden/>
                        <Form.Control.Feedback type="invalid">Image is required.</Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group controlId="date_applied">
                        <Form.Label>Date Applied</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="date_applied"
                            required
                            value={form.date_applied}
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">Date applied is required.</Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="Position">
                        <Form.Control name="position" required value={form.position} onChange={handleChange} />
                        <Form.Control.Feedback type="invalid">Position is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <Form.Label>Interviewer</Form.Label>
                    <div className="d-flex flex-wrap gap-3">
                        {['HR', 'GM', 'VP', 'BOD'].map((role) => (
                            <Form.Check
                            key={role}
                            type="checkbox"
                            id={`interviewer-${role}`}
                            label={role}
                            value={role}
                            checked={form.interviewer.includes(role)}
                            onChange={(e) => {
                                const selected = form.interviewer.includes(role)
                                ? form.interviewer.filter(r => r !== role)
                                : [...form.interviewer, role];
                                setForm({ ...form, interviewer: selected });
                            }}
                            />
                        ))}
                    </div>
                </Col>

                <Col md={6} className='d-flex justify-content-between align-items-center'>
                    <div className=''>Attach resume</div>
                    <Form.Group controlId="resumeUpload" className='upload-files'>
                        <Form.Label className='mb-0'><GrAttachment /> Attach Resume/CV (PDF)<small className="d-block text-center text-muted">(max 2MB, PDF only)</small></Form.Label>
                        <Form.Control type="file" name="resume" accept=".pdf" onChange={handleFileChange} hidden/>
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="Nationality">
                        <Form.Control name="nationality" value={form.nationality} onChange={handleChange} />
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="Gender">
                        <Form.Select name="gender" value={form.gender} onChange={handleChange}>
                        <option value="">-- Choose --</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        </Form.Select>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="Religion">
                        <Form.Control name="religion" value={form.religion} onChange={handleChange} />
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} />
                            <DatePicker
                                selected={form.date_applied}
                                onChange={(date) => setForm({ ...form, date_applied: date })}
                                showTimeSelect
                                dateFormat="dd MMM yyyy HH:mm"
                                className="form-control"
                                placeholderText="Select date and time"
                            />
                        </Form.Group>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="Marital Status">
                        <Form.Select name="marital_status" value={form.marital_status} onChange={handleChange}>
                        <option value="">-- Choose --</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        </Form.Select>
                    </FloatingLabel>
                </Col>

                {/* <Col md={6}>
                    <FloatingLabel label="Status">
                        <Form.Select name="status" value={form.status} onChange={handleChange}>
                        {['New', 'Scheduled', 'Interviewed', 'Hired', 'Rejected', 'Offered'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                        </Form.Select>
                    </FloatingLabel>
                </Col> */}

                <Col xs={12}>
                    <FloatingLabel label="Address">
                        <Form.Control name="address" value={form.address} onChange={handleChange} />
                    </FloatingLabel>
                </Col>

                <Col md={4}>
                    <FloatingLabel label="City">
                        <Form.Control name="city" value={form.city} onChange={handleChange} />
                    </FloatingLabel>
                </Col>

                <Col md={4}>
                    <FloatingLabel label="State">
                        <Form.Control name="state" value={form.state} onChange={handleChange} />
                    </FloatingLabel>
                </Col>

                <Col md={4}>
                    <FloatingLabel label="Country">
                        <Form.Control name="country" value={form.country} onChange={handleChange} />
                    </FloatingLabel>
                </Col>

                <Col xs={12} className="d-flex gap-2 mt-3">
                    <Button type="submit" variant="success">Save</Button>
                    <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                </Col>
            </Row>
        </Form>
    );
};
