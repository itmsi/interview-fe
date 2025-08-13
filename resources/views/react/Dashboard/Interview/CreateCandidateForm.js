import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, FloatingLabel } from 'react-bootstrap';
import { GrAttachment } from "react-icons/gr";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from 'styled-components';
import { apiPost, apiPatch, apiPostFormData } from '../Helper/Helper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';

export const CreateCandidateForm = ({ endpoint, token, onSave, onCancel, initialData }) => {
    const [validated, setValidated] = useState(false);
    const isEdit = !!initialData; // Menentukan apakah mode edit atau add

    const [fileNamePhoto, setFileNamePhoto] = useState('');
    const [fileNameCV, setFileNameCV] = useState('');
    const [form, setForm] = useState({
        candidate_name: '',
        candidate_email: '',
        candidate_phone: '',
        candidate_position: '',
        candidate_company: '',
        candidate_nationality: '',
        candidate_gender: '',
        candidate_religion: '',
        candidate_date_birth: null,
        candidate_age: '',
        candidate_marital_status: '',
        candidate_address: '',
        candidate_city: '',
        candidate_state: '',
        candidate_country: '',
        candidate_foto: null,
        candidate_resume: null
    });

    useEffect(() => {
        if (initialData) {
            setForm(prev => ({
                ...prev,
                candidate_name: initialData.name || '',
                candidate_email: initialData.email || '',
                candidate_phone: initialData?.personal_information?.[0]?.candidate_phone ? initialData.personal_information[0].candidate_phone : '',
                candidate_position: initialData.position || '',
                candidate_company: initialData.company || '',
                candidate_nationality: initialData?.personal_information?.[0]?.candidate_nationality ? initialData.personal_information[0].candidate_nationality : '',
                candidate_gender: initialData?.personal_information?.[0]?.candidate_gender ? initialData.personal_information[0].candidate_gender : '',
                candidate_religion: initialData?.personal_information?.[0]?.candidate_religion ? initialData.personal_information[0].candidate_religion : '',
                candidate_date_birth: initialData?.personal_information?.[0]?.candidate_date_birth ? new Date(initialData.personal_information[0].candidate_date_birth) : null,
                candidate_age: initialData.age || '',
                candidate_marital_status: initialData?.personal_information?.[0]?.candidate_marital_status ? initialData.personal_information[0].candidate_marital_status : '',
                candidate_address: initialData?.address_information?.[0]?.candidate_address ? initialData.address_information[0].candidate_address : '',
                candidate_city: initialData?.address_information?.[0]?.candidate_city ? initialData.address_information[0].candidate_city : '',
                candidate_state: initialData?.address_information?.[0]?.candidate_state ? initialData.address_information[0].candidate_state : '',
                candidate_country: initialData?.address_information?.[0]?.candidate_country ? initialData.address_information[0].candidate_country : '',
                candidate_foto: initialData.image || null,
                candidate_resume: initialData.resume || null
            }));
            
            // Set file name jika ada file
            if (initialData.image) {
                setFileNamePhoto(typeof initialData.image === 'string' ? 'Current Photo' : initialData.image.name);
            }
            if (initialData.resume) {
                setFileNameCV(typeof initialData.resume === 'string' ? 'Current Resume' : initialData.resume.name);
            }
        }
    }, [initialData]);

    const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
    const MAX_PDF_SIZE = 2 * 1024 * 1024;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];

        if (!file) return;

        if (name === "candidate_foto") {
            if (!file.type.startsWith("image/")) {
                toast.error("File must be an image");
                return;
            }
            if (file.size > MAX_IMAGE_SIZE) {
                toast.error("Image size must be under 2MB");
                return;
            }
            setFileNamePhoto(file.name);
        }

        if (name === "candidate_resume") {
            if (file.type !== "application/pdf") {
                toast.error("Resume must be a PDF file");
                return;
            }
            if (file.size > MAX_PDF_SIZE) {
                toast.error("Resume size must be under 2MB");
                return;
            }
            setFileNameCV(file.name);
        }

        setForm(prev => ({ ...prev, [name]: file }));
    };

    const handleSubmit = async (e) => {
        const formEl = e.currentTarget;   
        e.preventDefault();

        if (formEl.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        // Persiapkan data untuk dikirim
        const submitData = { ...form };
        
        // Format date jika ada
        if (submitData.candidate_date_birth) {
            submitData.candidate_date_birth = dayjs(submitData.candidate_date_birth).format('YYYY-MM-DD');
        }

        // Jika ada file yang di-upload, gunakan FormData
        const hasFile = form.candidate_foto instanceof File || form.candidate_resume instanceof File;
        
        let dataToSend;
        if (hasFile) {
            const formData = new FormData();
            Object.keys(submitData).forEach(key => {
                const value = submitData[key];
                if (value !== null && value !== undefined && value !== '') {
                    formData.append(key, value);
                }
            });
            dataToSend = formData;
        } else {
            // Bersihkan data kosong untuk JSON
            dataToSend = Object.keys(submitData).reduce((acc, key) => {
                const value = submitData[key];
                if (value !== null && value !== undefined && value !== '') {
                    acc[key] = value;
                }
                return acc;
            }, {});
        }

        try {
            let response;
            if (isEdit) {
                response = await apiPatch(endpoint, `/candidates/${initialData.id}/multipart`, token, dataToSend);
                toast.success('Candidate updated successfully!');
            } else {
                if (hasFile) {
                    response = await apiPostFormData(endpoint, '/candidates/multipart', token, dataToSend);
                } else {
                    response = await apiPost(endpoint, '/candidates/multipart', token, dataToSend);
                }
                
                toast.success('Candidate created successfully!');
            }
            
            // Callback setelah berhasil
            if (onSave && response?.data) {
                onSave(response.data);
            }
        } catch (error) {
            console.error('API Error:', error);
            toast.error(`Failed to ${isEdit ? 'update' : 'create'} candidate: ` + (error.response?.data?.message || error.message));
        }
    };

    return (
        <StyleForm noValidate validated={validated} onSubmit={handleSubmit} className={`${!isEdit ? 'p-3 border bg-light rounded' : ''}`}>
            {!isEdit && <h5 className="mb-4">Create New Candidate</h5>}
            <Row className="g-3">

                <Col md={6}>
                    <FloatingLabel controlId="inputName" label="Name">
                        <Form.Control 
                            name="candidate_name"
                            type="text" 
                            placeholder="Enter your full name"
                            value={form.candidate_name}
                            onChange={handleChange} 
                            required
                        />
                        <Form.Control.Feedback type="invalid">Name is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <FloatingLabel controlId="inputEmail" label="Email">
                        <Form.Control 
                            name="candidate_email"
                            type="email"
                            placeholder="" 
                            value={form.candidate_email}
                            onChange={handleChange}
                            pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
                            required
                        />
                        <Form.Control.Feedback type="invalid">Valid email is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="Phone Number">
                        <Form.Control 
                            name="candidate_phone" 
                            value={form.candidate_phone}
                            placeholder="Enter your phone number"
                            pattern="^08[0-9]{8,11}$"
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^\d]/g, '');
                                setForm(prev => ({
                                    ...prev,
                                    candidate_phone: value
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
                            name="candidate_religion" 
                            value={form.candidate_religion} 
                            onChange={handleChange} 
                            placeholder="Enter your religion"
                        />
                    </FloatingLabel>
                </Col>
                
                <Col md={6}>
                    <FloatingLabel label="Company">
                        <Form.Control 
                            name="candidate_company" 
                            value={form.candidate_company}
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
                            name="candidate_position" 
                            value={form.candidate_position}
                            onChange={handleChange}
                            placeholder="Enter your position"
                            required
                        />
                        <Form.Control.Feedback type="invalid">Position is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="Gender">
                        <Form.Select name="candidate_gender" value={form.candidate_gender} onChange={handleChange}>
                            <option value="">-- Choose --</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">Gender is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="Marital Status">
                        <Form.Select name="candidate_marital_status" value={form.candidate_marital_status} onChange={handleChange}>
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
                            name="candidate_age" 
                            value={form.candidate_age}
                            // onChange={handleChange}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^\d]/g, '');
                                setForm(prev => ({
                                    ...prev,
                                    candidate_age: value
                                }));
                            }}
                            placeholder="Enter your age"
                            maxLength={2}
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
                            selected={form.candidate_date_birth}
                            onChange={(date) => setForm({ ...form, candidate_date_birth: date })}
                            dateFormat="dd MMM yyyy"
                            className="form-control h-field height-date"
                            placeholderText="Select Date of Birth"
                            wrapperClassName="col-lg-8 col-12"
                            showMonthDropdown
                            showYearDropdown
                            yearDropdownItemNumber={55}
                            maxDate={new Date(2015, 11, 31)}
                            minDate={new Date(new Date().getFullYear() - 50, 0, 1)}
                            scrollableYearDropdown
                        />
                        <Form.Control.Feedback type="invalid">Date of Birth is required.</Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="Nationality">
                        <Form.Control 
                            name="candidate_nationality" 
                            value={form.candidate_nationality} 
                            onChange={handleChange} 
                            placeholder="Enter your Nationality"
                        />
                        <Form.Control.Feedback type="invalid">Nationality is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="City">
                        <Form.Control 
                            name="candidate_city" 
                            value={form.candidate_city} 
                            onChange={handleChange} 
                            placeholder="Enter your City"
                        />
                        <Form.Control.Feedback type="invalid">City is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="State">
                        <Form.Control 
                            name="candidate_state" 
                            value={form.candidate_state} 
                            onChange={handleChange} 
                            placeholder="Enter your State"
                        />
                        <Form.Control.Feedback type="invalid">State is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="Country">
                        <Form.Control 
                            name="candidate_country" 
                            value={form.candidate_country} 
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
                            name="candidate_address"
                            value={form.candidate_address}
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
                            name="candidate_foto"
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
                            name="candidate_resume"
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

                <Col xs={12} className="d-flex gap-2 mt-3 button-form-footer-actions">
                    <Button 
                        variant="outline-secondary" 
                        className='btn-hide' 
                        onClick={onCancel} 
                        style={{ minWidth: "100px" }}
                        type="button"
                    >Cancel</Button>
                    <Button 
                        type="submit" 
                        variant="primary"
                        className='btn-action' 
                        style={{ minWidth: "100px" }}
                    >
                        {isEdit ? 'Update' : 'Save'}
                    </Button>
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