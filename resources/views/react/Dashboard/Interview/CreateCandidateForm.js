import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, FloatingLabel } from 'react-bootstrap';
import { GrAttachment } from "react-icons/gr";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from 'styled-components';
import { apiPost, apiPatch, apiPostFormData, apiGet, apiPatchFormData, apiPatchFormDataXHR } from '../Helper/Helper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';

export const CreateCandidateForm = ({ endpoint, token, onSave, onCancel, initialData }) => {
    const [validated, setValidated] = useState(false);
    const isEdit = !!initialData; // Menentukan apakah mode edit atau add

    const [company, setCompany] = useState([]);
    const [errorsCompany, setErrorsCompany] = useState(false);
    const [loadingCompany, setLoadingCompany] = useState(true);
    const [departments, setDepartments] = useState([]);
    const [errorsDept, setErrorsDept] = useState(false);
    const [loadingDept, setLoadingDept] = useState(true);
    const [jobrole, setJobrole] = useState([]);
    const [errorsJob, setErrorsJob] = useState(false);
    const [loadingJob, setLoadingJob] = useState(true);

    const [fileNamePhoto, setFileNamePhoto] = useState('');
    const [fileNameCV, setFileNameCV] = useState('');
    const [form, setForm] = useState({
        candidate_name: '',
        candidate_email: '',
        candidate_phone: '',
        candidate_title: '',
        cum_title_id: '',
        candidate_company: '',
        cum_companies_id: '',
        candidate_department: '',
        cum_departement_id: '',
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
    const endpointTest = `https://dev-cum-api.motorsights.com/api/v1`;
    useEffect(() => {
        apiGet(endpointTest, '/companies?limit=500', token)
            .then(data => {
                setLoadingCompany(false);
                setErrorsCompany(false);
                setCompany(data?.data || []);
            })
            .catch(err => {
                console.error('Error fetching companies:', err);
                setErrorsCompany(true);
                setLoadingCompany(false);
            });
        
        // Don't load departments initially - they will be loaded when company is selected
        setLoadingDept(false);
        
        // Don't load job titles initially - they will be loaded when department is selected
        setLoadingJob(false);
    },[]);
    useEffect(() => {
        if (initialData) {
            setForm(prev => ({
                ...prev,
                candidate_name: initialData.name || '',
                candidate_email: initialData.email || '',
                candidate_phone: initialData?.personal_information?.[0]?.candidate_phone ? initialData.personal_information[0].candidate_phone : '',
                candidate_title: initialData.position || '',
                cum_title_id: initialData.position_id || '',
                candidate_company: initialData.company || '',
                cum_companies_id: initialData.company_id || '',
                candidate_department: initialData.department || '',
                cum_departement_id: initialData.department_id || '',
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

    // Separate useEffect to load departments and positions when editing and companies are loaded
    useEffect(() => {
        if (initialData && initialData.company && company.length > 0 && !loadingCompany) {
            // Find company ID from company name
            const selectedCompany = company.find(comp => comp.company_name === initialData.company);
            const companyId = selectedCompany?.company_id;
            
            // Set company ID
            setForm(prev => ({
                ...prev,
                cum_companies_id: companyId || ''
            }));
            
            if (companyId) {
                setLoadingDept(true);
                setErrorsDept(false);
                
                apiGet(endpointTest, `/departement?limit=500&companies_id=${companyId}`, token)
                    .then(data => {
                        setLoadingDept(false);
                        setErrorsDept(false);
                        setDepartments(data?.data || []);
                        
                        // Find department ID and set both name and ID
                        const selectedDepartment = data?.data?.find(dept => dept.departement_name === initialData.department);
                        const departementId = selectedDepartment?.departement_id;
                        
                        setForm(prev => ({
                            ...prev,
                            candidate_department: initialData.department || '',
                            cum_departement_id: departementId || ''
                        }));

                        // Load positions for the selected department when editing
                        if (initialData.department && departementId) {
                            setLoadingJob(true);
                            setErrorsJob(false);
                            
                            apiGet(endpointTest, `/job-titles?limit=500&departement_id=${departementId}`, token)
                                .then(jobData => {
                                    setLoadingJob(false);
                                    setErrorsJob(false);
                                    setJobrole(jobData?.response?.result || []);
                                    
                                    // Find title ID and set both name and ID
                                    const selectedJob = jobData?.response?.result?.find(job => job.job_title_name === initialData.position);
                                    const titleId = selectedJob?.job_title_id;
                                    
                                    setForm(prev => ({
                                        ...prev,
                                        candidate_title: initialData.position || '',
                                        cum_title_id: titleId || ''
                                    }));
                                })
                                .catch(err => {
                                    console.error('Error fetching job titles:', err);
                                    setErrorsJob(true);
                                    setLoadingJob(false);
                                    setJobrole([]);
                                });
                        }
                    })
                    .catch(err => {
                        console.error('Error fetching departments:', err);
                        setErrorsDept(true);
                        setLoadingDept(false);
                        setDepartments([]);
                    });
            }
        }
    }, [initialData, company, loadingCompany]);

    const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
    const MAX_PDF_SIZE = 2 * 1024 * 1024;

    // Reusable alphabetical sorting function
    const sortAlphabetically = (array, key) => {
        return [...array].sort((a, b) => {
            const valueA = a[key]?.toLowerCase() || '';
            const valueB = b[key]?.toLowerCase() || '';
            return valueA.localeCompare(valueB);
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ 
            ...prev, 
            [name]: value,
            // Reset department when company changes
            ...(name === 'candidate_company' && { 
                candidate_department: '', 
                candidate_title: '',
                cum_departement_id: '',
                cum_title_id: ''
            }),
            // Reset position when department changes
            ...(name === 'candidate_department' && { 
                candidate_title: '',
                cum_title_id: ''
            })
        }));
        
        // Store company ID when company is selected
        if (name === 'candidate_company' && value) {
            const selectedCompany = company.find(comp => comp.company_name === value);
            const companyId = selectedCompany?.company_id;
            
            setForm(prev => ({
                ...prev,
                cum_companies_id: companyId || ''
            }));
            
            if (companyId) {
                setLoadingDept(true);
                setErrorsDept(false);
                setDepartments([]);
                
                apiGet(endpointTest, `/departement?limit=500&companies_id=${companyId}`, token)
                    .then(data => {
                        setLoadingDept(false);
                        setErrorsDept(false);
                        setDepartments(data?.data || []);
                    })
                    .catch(err => {
                        console.error('Error fetching departments:', err);
                        setErrorsDept(true);
                        setLoadingDept(false);
                        setDepartments([]);
                    });
            }
        }

        // Store department ID when department is selected
        if (name === 'candidate_department' && value) {
            const selectedDepartment = departments.find(dept => dept.departement_name === value);
            const departementId = selectedDepartment?.departement_id;
            
            setForm(prev => ({
                ...prev,
                cum_departement_id: departementId || ''
            }));
            
            if (departementId) {
                setLoadingJob(true);
                setErrorsJob(false);
                setJobrole([]);
                
                apiGet(endpointTest, `/job-titles?limit=500&departement_id=${departementId}`, token)
                    .then(data => {
                        setLoadingJob(false);
                        setErrorsJob(false);
                        setJobrole(data?.response?.result || []);
                    })
                    .catch(err => {
                        console.error('Error fetching job titles:', err);
                        setErrorsJob(true);
                        setLoadingJob(false);
                        setJobrole([]);
                    });
            }
        }

        // Store title ID when title is selected
        if (name === 'candidate_title' && value) {
            const selectedJob = jobrole.find(job => job.job_title_name === value);
            const titleId = selectedJob?.job_title_id;
            
            setForm(prev => ({
                ...prev,
                cum_title_id: titleId || ''
            }));
        }
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
                if (key === 'candidate_foto' || key === 'candidate_resume') {
                    if (value instanceof File) {
                        formData.append(key, value);
                    }
                } else if (value !== null && value !== undefined && value !== '') {
                    formData.append(key, value);
                }
            });
            dataToSend = formData;
            
        } else {
            const formData = new FormData();
            Object.keys(submitData).forEach(key => {
                const value = submitData[key];
                if (value !== null && value !== undefined && value !== '') {
                    formData.append(key, value);
                }
            });
            dataToSend = formData;
        }

        try {
            let response;
            if (isEdit) {
                const params = {
                    permissionName: "update",
                    menuName: "candidate",
                    systemName: "interview",
                };
                response = await apiPatchFormData(
                    endpoint,
                    `/candidates/${initialData.id}/multipart`,
                    token,
                    submitData,
                    { params: params }
                );
                toast.success('Candidate updated successfully!');
            } else {
                if (hasFile) {
                    response = await apiPostFormData(endpoint, '/candidates/multipart', token, dataToSend);
                } else {
                    response = await apiPost(endpoint, '/candidates', token, submitData);
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
                        <Form.Select name="candidate_company" value={form.candidate_company} onChange={handleChange} required disabled={loadingCompany}>
                            <option value="">
                                {loadingCompany ? "Loading companies..." : errorsCompany ? "Error loading companies" : "-- Choose Company --"}
                            </option>
                            {!loadingCompany && !errorsCompany && sortAlphabetically(company, 'company_name').map(comp => (
                                // <option key={comp.company_id} value={comp.company_id}>{comp.company_name}</option>
                                <option key={comp.company_id} value={comp.company_name} data-company-id={comp.company_id}>{comp.company_name}</option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">Company is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="Department">
                        <Form.Select 
                            name="candidate_department" 
                            value={form.candidate_department} 
                            onChange={handleChange} 
                            required 
                            disabled={loadingDept || !form.candidate_company}
                        >
                            <option value="">
                                {!form.candidate_company 
                                    ? "Please select a company first" 
                                    : loadingDept 
                                        ? "Loading departments..." 
                                        : errorsDept 
                                            ? "Error loading departments" 
                                            : "-- Choose Department --"
                                }
                            </option>
                            {!loadingDept && !errorsDept && form.candidate_company && sortAlphabetically(departments, 'departement_name').map(department => (
                                <option key={department.departement_id} value={department.departement_name}>{department.departement_name}</option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">Department is required.</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col md={6}>
                    <FloatingLabel label="Position">
                        <Form.Select 
                            name="candidate_title" 
                            value={form.candidate_title} 
                            onChange={handleChange} 
                            required 
                            disabled={loadingJob || !form.candidate_department}
                        >
                            <option value="">
                                {!form.candidate_department 
                                    ? "Please select a department first" 
                                    : loadingJob 
                                        ? "Loading positions..." 
                                        : errorsJob 
                                            ? "Error loading positions" 
                                            : "-- Choose Position --"
                                }
                            </option>
                            {!loadingJob && !errorsJob && form.candidate_department && sortAlphabetically(jobrole, 'job_title_name').map(job => (
                                <option key={job.job_title_id} value={job.job_title_name}>{job.job_title_name}</option>
                            ))}
                        </Form.Select>
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