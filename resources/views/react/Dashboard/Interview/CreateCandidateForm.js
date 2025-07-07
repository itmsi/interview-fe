import React, { useState } from 'react';
import { Form, Button, Row, Col, FloatingLabel } from 'react-bootstrap';
import { GrAttachment } from "react-icons/gr";
import DatePicker from "react-datepicker";
import { addDays } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import styled from 'styled-components';

export const CreateCandidateForm = ({ onSave, onCancel }) => {
    const [validated, setValidated] = useState(false);

    const [fileNamePhoto, setFileNamePhoto] = useState('');
    const [fileNameCV, setFileNameCV] = useState('');
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        position: '',
        company: '',
        nationality: '',
        gender: '',
        religion: '',
        date_of_birth: '',
        age: '',
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
            if (file) {
                setFileNamePhoto(file.name);
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
            if (file) {
                setFileNameCV(file.name);
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
        <StyleForm noValidate validated={validated} onSubmit={handleSubmit} className="p-3 border bg-light rounded">
            <h5 className="mb-4">Create New Candidate</h5>
            <Row className="g-3">

                <Col md={6}>
                    <FloatingLabel controlId="inputName" label="Name">
                        <Form.Control 
                            name="name"
                            type="text" 
                            placeholder="Enter your full name"
                            value={form.name}
                            onChange={handleChange} 
                            required
                        />
                        <Form.Control.Feedback type="invalid">Name is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <FloatingLabel controlId="inputEmail" label="Email">
                        <Form.Control 
                            name="email"
                            type="email"
                            placeholder="" 
                            value={form.email}
                            onChange={handleChange}
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                            required
                        />
                        <Form.Control.Feedback type="invalid">Valid email is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="Phone Number">
                        <Form.Control 
                            name="phone" 
                            value={form.phone}
                            placeholder="Enter your phone number"
                            pattern="^08[0-9]{8,11}$"
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^\d]/g, '');
                                setForm(prev => ({
                                    ...prev,
                                    phone: value
                                }));
                            }}
                            maxLength={13}
                            onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid phone number starting with 08
                        </Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="Religion">
                        <Form.Control 
                            name="religion" 
                            value={form.religion} 
                            onChange={handleChange} 
                            placeholder="Enter your religion"
                        />
                    </FloatingLabel>
                </Col>
                
                <Col md={6}>
                    <FloatingLabel label="Company">
                        <Form.Control 
                            name="company" 
                            value={form.company}
                            onChange={handleChange}
                            placeholder="Enter your company name"
                            required
                        />
                        <Form.Control.Feedback type="invalid">Company is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="Position">
                        <Form.Control 
                            name="position" 
                            value={form.position}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            required
                        />
                        <Form.Control.Feedback type="invalid">Position is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="Gender">
                        <Form.Select name="gender" value={form.gender} onChange={handleChange}>
                            <option value="">-- Choose --</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">Gender is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="Marital Status">
                        <Form.Select name="marital_status" value={form.marital_status} onChange={handleChange}>
                            <option value="">-- Choose --</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">Marital Status is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="Age">
                        <Form.Control 
                            name="age" 
                            value={form.age}
                            onChange={handleChange}
                            placeholder="Enter your age"
                            required
                        />
                        <Form.Control.Feedback type="invalid">Age is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <Form.Group 
                        controlId="date_of_birth" 
                        className='d-flex flex-wrap justify-content-between align-items-center'
                    >
                        <Form.Label className='m-0 fs-14 color-label col ps-2'>Date of Birth</Form.Label>
                        <DatePicker
                            selected={form.date_of_birth}
                            onChange={(date) => setForm({ ...form, date_of_birth: date })}
                            dateFormat="dd MMM yyyy"
                            className="form-control h-field"
                            maxDate={addDays(new Date())}
                            placeholderText="Select Date of Birth"
                            wrapperClassName="col-lg-8 col-12"
                        />
                        <Form.Control.Feedback type="invalid">Date of Birth is required.</Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="Nationality">
                        <Form.Control 
                            name="nationality" 
                            value={form.nationality} 
                            onChange={handleChange} 
                            placeholder="Enter your Nationality"
                        />
                        <Form.Control.Feedback type="invalid">Nationality is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="City">
                        <Form.Control 
                            name="city" 
                            value={form.city} 
                            onChange={handleChange} 
                            placeholder="Enter your City"
                        />
                        <Form.Control.Feedback type="invalid">City is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="State">
                        <Form.Control 
                            name="state" 
                            value={form.state} 
                            onChange={handleChange} 
                            placeholder="Enter your State"
                        />
                        <Form.Control.Feedback type="invalid">State is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="Country">
                        <Form.Control 
                            name="country" 
                            value={form.country} 
                            onChange={handleChange} 
                            placeholder="Enter your Country"
                        />
                        <Form.Control.Feedback type="invalid">Country is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>
                
                <Col xs={12}>
                    <FloatingLabel label="Address">
                        <Form.Control 
                            as="textarea"
                            name="address" 
                            value={form.address} 
                            onChange={handleChange} 
                            placeholder="Enter your Address"
                        />
                        <Form.Control.Feedback type="invalid">Address is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6} className='d-flex flex-wrap justify-content-between align-items-center'>
                    <div className=''>Upload Photo</div>
                    <Form.Group controlId="imageUpload" className='upload-files'>
                        <Form.Label className='mb-0 cursor-pointer d-block'>
                            Photo <small className="d-block text-center text-muted">(max 1MB)</small>
                        </Form.Label>
                        <Form.Control 
                            type="file"
                            accept="image/*"
                            name="image"
                            onChange={handleFileChange} 
                            hidden
                        />
                        {fileNamePhoto && (
                            <div className="text-truncate small text-primary" title={fileNamePhoto}>
                            📁 {fileNamePhoto}
                            </div>
                        )}
                        <Form.Control.Feedback type="invalid">Image is required.</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                
                <Col md={6} className='d-flex flex-wrap justify-content-between align-items-center'>
                    <div className=''>Attach resume</div>
                    <Form.Group controlId="resumeUpload" className='upload-files'>
                        <Form.Label className='mb-0 cursor-pointer d-block'>
                            <GrAttachment /> Attach Resume/CV (PDF)
                            <small className="d-block text-center text-muted">(max 2MB, PDF only)</small>
                        </Form.Label>
                        <Form.Control
                            type="file"
                            name="resume"
                            accept=".pdf"
                            onChange={handleFileChange}
                            hidden
                        />
                        
                        {fileNameCV && (
                            <div className="text-truncate small text-primary" title={fileNameCV}>
                            📁 {fileNameCV}
                            </div>
                        )}
                    </Form.Group>
                </Col>

                <Col xs={12} className="d-flex gap-2 mt-3">
                    <Button type="submit" variant="success">Save</Button>
                    <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                </Col>
            </Row>
        </StyleForm>
    );
};

const StyleForm = styled(Form) `
    --font-placeholder: 14px;
    .h-field {
        height: 58px;
    }
    ::-webkit-input-placeholder {
        font-family: var(--font-primary);
        font-size:var(--font-placeholder);
    }
    ::-moz-placeholder { 
        font-size:var(--font-placeholder);
    }
    :-ms-input-placeholder { 
        font-size:var(--font-placeholder);
    }
    :-moz-placeholder { 
        font-size:var(--font-placeholder);
    }
`