import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row, Badge, Offcanvas, Tabs, Tab, Table } from 'react-bootstrap';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { VscDebugBreakpointData } from "react-icons/vsc";
import { MdOutlineFileDownload, MdOutlineDescription } from "react-icons/md";

export const Candidate = ({ token, setPage }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setPage('Candidates');
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
            "interviewer": ["HR"],
            "status": "Interviewed",
            "referred": [
                {
                    "name": "Irene Simbolon",
                    "email": "irene@example.com",
                    "role": "Human Resources",
                    "role_alias": "HR"
                }
            ],
            "personal_information": [
                {
                    "candidate_name": "Adhi Pratomo",
                    "candidate_email": "adhi@example.com",
                    "candidate_phone": "8964278",
                    "candidate_nationality": "Indonesia",
                    "candidate_gender": "Male",
                    "candidate_religion": "Christian",
                    "candidate_date_birth": "23 Oct 2000",
                    "candidate_marital_status": "No"
                }
            ],
            "address_information": [
                {
                    "candidate_address": "Komplek Example No 25 block Example",
                    "candidate_city": "Jakarta",
                    "candidate_state": "Jakarta",
                    "candidate_country": "Indonesia"
                }
            ],
            "resume": "test.pdf",
            "notes": "Harold Gaynor is a detail-oriented and highly motivated accountant with 4 years of experience in financial reporting, auditing, and tax preparation."
        },
        {
            "id": 2,
            "name": "Putri Santika",
            "email": "putri@example.com",
            "image": "https://picsum.photos/id/200/200/200",
            "id_candidate": "cand-002",
            "date_applied": "12 Apr 2025",
            "position": "CSE",
            "interviewer": ["HR", "GM", "VP", "BOD"],
            "status": "Scheduled",
            "referred": [
                {
                    "name": "Irene Simbolon",
                    "email": "irene@example.com",
                    "role": "Human Resources",
                    "role_alias": "HR"
                },
                {
                    "name": "Irene2 Simbolon",
                    "email": "irene2@example.com",
                    "role": "Human Resources",
                    "role_alias": "HR"
                },
                {
                    "name": "User Name Manager 2",
                    "email": "user2@example.com",
                    "role": "Manager",
                    "role_alias": "GM"
                },
                {
                    "name": "User Name Manager 3",
                    "email": "user3@example.com",
                    "role": "Manager",
                    "role_alias": "GM"
                },
                {
                    "name": "User Name 3",
                    "email": "user3@example.com",
                    "role": "Vice President",
                    "role_alias": "VP"
                },
                {
                    "name": "User Name 4",
                    "email": "user4@example.com",
                    "role": "Board of Director",
                    "role_alias": "BOD"
                },
            ],
            "personal_information": [
                {
                    "candidate_name": "Putri Santika",
                    "candidate_email": "putri@example.com",
                    "candidate_phone": "8964278",
                    "candidate_nationality": "Indonesia",
                    "candidate_gender": "Female",
                    "candidate_religion": "Muslim",
                    "candidate_date_birth": "23 Oct 2001",
                    "candidate_marital_status": "Yes"
                }
            ],
            "address_information": [
                {
                    "candidate_address": "Komplek Example No 25 block Example",
                    "candidate_city": "Jakarta Selatan",
                    "candidate_state": "Jakarta Selatan",
                    "candidate_country": "Indonesia"
                }
            ],
            "resume": "test.pdf",
            "notes": "Harold Gaynor is a detail-oriented and highly motivated accountant with 4 years of experience in financial reporting, auditing, and tax preparation."
        },
        {
            "id": 3,
            "name": "Sandra Ornellas",
            "email": "sandra@example.com",
            "image": "https://picsum.photos/id/200/200/200",
            "id_candidate": "cand-003",
            "date_applied": "20 Mar 2025",
            "position": "Accountant",
            "interviewer": ["HR", "GM"],
            "status": "Rejected",
            "referred": [
                {
                    "name": "Irene Simbolon",
                    "email": "irene@example.com",
                    "role": "Human Resources",
                    "role_alias": "HR"
                },
                {
                    "name": "User Name Manager 2",
                    "email": "user2@example.com",
                    "role": "Manager",
                    "role_alias": "GM"
                },
                {
                    "name": "User Name Manager 3",
                    "email": "user3@example.com",
                    "role": "Manager",
                    "role_alias": "GM"
                }
            ],
            "personal_information": [
                {
                    "candidate_name": "Sandra Ornellas",
                    "candidate_email": "sandra@example.com",
                    "candidate_phone": "82123456789",
                    "candidate_nationality": "Indonesia",
                    "candidate_gender": "Female",
                    "candidate_religion": "Christian",
                    "candidate_date_birth": "15 Aug 1998",
                    "candidate_marital_status": "No"
                }
            ],
            "address_information": [
                {
                    "candidate_address": "Jl. Melati No. 15",
                    "candidate_city": "Bandung",
                    "candidate_state": "West Java",
                    "candidate_country": "Indonesia"
                }
            ],
            "resume": "sandra_ornellas_resume.pdf",
            "notes": "Harold Gaynor is a detail-oriented and highly motivated accountant with 4 years of experience in financial reporting, auditing, and tax preparation."
        },
        {
            "id": 4,
            "name": "Charles Marks",
            "email": "charles@example.com",
            "image": "https://picsum.photos/id/200/200/200",
            "id_candidate": "cand-004",
            "date_applied": "02 Feb 2025",
            "position": "Designer",
            "interviewer": ["HR", "GM", "VP"],
            "status": "Hired",
            "referred": [
                {
                    "name": "Irene Simbolon",
                    "email": "irene@example.com",
                    "role": "Human Resources",
                    "role_alias": "HR"
                },
                {
                    "name": "Irene2 Simbolon",
                    "email": "irene2@example.com",
                    "role": "Human Resources",
                    "role_alias": "HR"
                },
                {
                    "name": "User Name Manager 2",
                    "email": "user2@example.com",
                    "role": "Manager",
                    "role_alias": "GM"
                },
                {
                    "name": "User Name Manager 3",
                    "email": "user3@example.com",
                    "role": "Manager",
                    "role_alias": "GM"
                },
                {
                    "name": "User Name 3",
                    "email": "user3@example.com",
                    "role": "Vice President",
                    "role_alias": "VP"
                },
            ],
            "personal_information": [
                {
                    "candidate_name": "Charles Marks",
                    "candidate_email": "charles@example.com",
                    "candidate_phone": "82345678901",
                    "candidate_nationality": "Indonesia",
                    "candidate_gender": "Male",
                    "candidate_religion": "Christian",
                    "candidate_date_birth": "10 Jan 1995",
                    "candidate_marital_status": "Yes"
                }
            ],
            "address_information": [
                {
                    "candidate_address": "Jl. Cemara No. 9",
                    "candidate_city": "Surabaya",
                    "candidate_state": "East Java",
                    "candidate_country": "Indonesia"
                }
            ],
            "resume": "charles_marks_resume.pdf",
            "notes": "Harold Gaynor is a detail-oriented and highly motivated accountant with 4 years of experience in financial reporting, auditing, and tax preparation."
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
            "status": "New",
            "referred": [
                {
                    "name": "Irene Simbolon",
                    "email": "irene@example.com",
                    "role": "Human Resources",
                    "role_alias": "HR"
                }
            ],
            "personal_information": [
                {
                    "candidate_name": "Charles Marks",
                    "candidate_email": "charles@example.com",
                    "candidate_phone": "82345678901",
                    "candidate_nationality": "Indonesia",
                    "candidate_gender": "Male",
                    "candidate_religion": "Christian",
                    "candidate_date_birth": "10 Jan 1995",
                    "candidate_marital_status": "Yes"
                }
            ],
            "address_information": [
                {
                    "candidate_address": "Jl. Cemara No. 9",
                    "candidate_city": "Surabaya",
                    "candidate_state": "East Java",
                    "candidate_country": "Indonesia"
                }
            ],
            "resume": "charles_marks_resume.pdf",
            "notes": "Harold Gaynor is a detail-oriented and highly motivated accountant with 4 years of experience in financial reporting, auditing, and tax preparation."
        },
        {
            "id": 6,
            "name": "Charles Marks",
            "email": "charles@example.com",
            "image": "https://picsum.photos/id/200/200/200",
            "id_candidate": "cand-006",
            "date_applied": "15 Jan 2025",
            "position": "Designer",
            "interviewer": ["HR", "GM", "VP"],
            "status": "Offered",
            "referred": [
                {
                    "name": "Irene Simbolon",
                    "email": "irene@example.com",
                    "role": "Human Resources",
                    "role_alias": "HR"
                },
                {
                    "name": "Irene2 Simbolon",
                    "email": "irene2@example.com",
                    "role": "Human Resources",
                    "role_alias": "HR"
                },
                {
                    "name": "User Name Manager 2",
                    "email": "user2@example.com",
                    "role": "Manager",
                    "role_alias": "GM"
                },
                {
                    "name": "User Name Manager 3",
                    "email": "user3@example.com",
                    "role": "Manager",
                    "role_alias": "GM"
                },
                {
                    "name": "User Name 3",
                    "email": "user3@example.com",
                    "role": "Vice President",
                    "role_alias": "VP"
                }
            ],
            "referred": [
                {
                    "name": "Irene Simbolon",
                    "email": "irene@example.com",
                    "role": "Human Resources",
                    "role_alias": "HR"
                },
                {
                    "name": "User Name 2",
                    "email": "user2@example.com",
                    "role": "Manager",
                    "role_alias": "GM"
                },
                {
                    "name": "User Name 3",
                    "email": "user3@example.com",
                    "role": "Vice President",
                    "role_alias": "VP"
                }
            ],
            "personal_information": [
                {
                    "candidate_name": "Charles Marks",
                    "candidate_email": "charles@example.com",
                    "candidate_phone": "82345678901",
                    "candidate_nationality": "Indonesia",
                    "candidate_gender": "Male",
                    "candidate_religion": "Christian",
                    "candidate_date_birth": "10 Jan 1995",
                    "candidate_marital_status": "Yes"
                }
            ],
            "address_information": [
                {
                    "candidate_address": "Jl. Cemara No. 9",
                    "candidate_city": "Surabaya",
                    "candidate_state": "East Java",
                    "candidate_country": "Indonesia"
                }
            ],
            "resume": "charles_marks_resume.pdf",
            "notes": "Harold Gaynor is a detail-oriented and highly motivated accountant with 4 years of experience in financial reporting, auditing, and tax preparation."
        },
        {
            "id": 7,
            "name": "Joyce Golston",
            "email": "joyce@example.com",
            "image": "https://picsum.photos/id/200/200/200",
            "id_candidate": "cand-007",
            "date_applied": "12 Sep 2024",
            "position": "Designer",
            "interviewer": ["HR", "GM", "VP"],
            "status": "Interviewed",
            "referred": [
                {
                    "name": "Irene Simbolon",
                    "email": "irene@example.com",
                    "role": "Human Resources",
                    "role_alias": "HR"
                },
                {
                    "name": "Irene2 Simbolon",
                    "email": "irene2@example.com",
                    "role": "Human Resources",
                    "role_alias": "HR"
                },
                {
                    "name": "User Name Manager 2",
                    "email": "user2@example.com",
                    "role": "Manager",
                    "role_alias": "GM"
                },
                {
                    "name": "User Name 3",
                    "email": "user3@example.com",
                    "role": "Vice President",
                    "role_alias": "VP"
                },
            ],
            "personal_information": [
                {
                    "candidate_name": "Joyce Golston",
                    "candidate_email": "joyce@example.com",
                    "candidate_phone": "81234567890",
                    "candidate_nationality": "Indonesia",
                    "candidate_gender": "Female",
                    "candidate_religion": "Christian",
                    "candidate_date_birth": "25 Dec 1993",
                    "candidate_marital_status": "No"
                }
            ],
            "address_information": [
                {
                    "candidate_address": "Jl. Anggrek No. 2",
                    "candidate_city": "Bekasi",
                    "candidate_state": "West Java",
                    "candidate_country": "Indonesia"
                }
            ],
            "resume": "joyce_golston_resume.pdf",
            "notes": "Harold Gaynor is a detail-oriented and highly motivated accountant with 4 years of experience in financial reporting, auditing, and tax preparation."
        },
        {
            "id": 8,
            "name": "Cedric Rosalez",
            "email": "cedric@example.com",
            "image": "https://picsum.photos/id/200/200/200",
            "id_candidate": "cand-008",
            "date_applied": "12 Sep 2024",
            "position": "Accountant",
            "interviewer": ["HR", "GM"],
            "status": "Rejected",
            "referred": [
                {
                    "name": "Irene Simbolon",
                    "email": "irene@example.com",
                    "role": "Human Resources",
                    "role_alias": "HR"
                },
                {
                    "name": "Irene2 Simbolon",
                    "email": "irene2@example.com",
                    "role": "Human Resources",
                    "role_alias": "HR"
                },
                {
                    "name": "User Name Manager 2",
                    "email": "user2@example.com",
                    "role": "Manager",
                    "role_alias": "GM"
                },
                {
                    "name": "User Name Manager 3",
                    "email": "user3@example.com",
                    "role": "Manager",
                    "role_alias": "GM"
                }
            ],
            "personal_information": [
                {
                    "candidate_name": "Cedric Rosalez",
                    "candidate_email": "cedric@example.com",
                    "candidate_phone": "81345678910",
                    "candidate_nationality": "Indonesia",
                    "candidate_gender": "Male",
                    "candidate_religion": "Christian",
                    "candidate_date_birth": "17 Jul 1990",
                    "candidate_marital_status": "Yes"
                }
            ],
            "address_information": [
                {
                    "candidate_address": "Jl. Teratai No. 88",
                    "candidate_city": "Tangerang",
                    "candidate_state": "Banten",
                    "candidate_country": "Indonesia"
                }
            ],
            "resume": "cedric_rosalez_resume.pdf",
            "notes": "Harold Gaynor is a detail-oriented and highly motivated accountant with 4 years of experience in financial reporting, auditing, and tax preparation."
        }
    ];

    const [selectedCandidateId, setSelectedCandidateId] = useState(null);

    const [candidates, setCandidates] = useState(dataKandidat);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const handleShowProfile = (candidate) => {
        setSelectedCandidate(candidate);
        setShowProfile(true);
    };
    const handleCloseProfile = () => {
        setShowProfile(false);
        setSelectedCandidate(null);
    };
    return (
        <Container className="my-4 p-0">
            <Row className='g-3'>
                {dataKandidat.map((candidate, index) => (
                <Col md={3} sm={6} key={candidate.id}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * .1, duration: 0.4 }}
                    >
                    <StyleListCandidate>
                        <Card.Body>
                            <div className='header-candidate d-flex'>
                                <img src={candidate.image} width={50} height={50} alt={candidate.name} />
                                <div className='title-name ms-2'>
                                    <h3 
                                        className='title h6 m-0 cursor-pointer'
                                        onClick={() => handleShowProfile(candidate)}
                                    >
                                        {candidate.name} <Badge bg={'primary'}>{candidate.id_candidate}</Badge></h3>
                                    <small >{candidate.email}</small>
                                </div>
                            </div>
                            <div className='body-candidate'>
                                <ul className='list-unstyled mt-3 mb-0'>
                                    <li>
                                        <div className='titleRole'>Applied Role</div>
                                        <div className='titleRemark'>{candidate.position}</div>
                                    </li>
                                    <li>
                                        <div className='titleRole'>Applied Date</div>
                                        <div className='titleRemark'>{candidate.date_applied}</div>
                                    </li>
                                    <li>
                                        <div className='titleRole'>Interviewer</div>
                                        <div className='titleRemark'>
                                            {Array.isArray(candidate.interviewer)
                                                ? candidate.interviewer.map((name, idx) => (
                                                    <Badge key={idx} bg="light" text="dark" className="me-1">
                                                    {name}
                                                    </Badge>
                                                ))
                                                : <Badge bg="light" text="dark">{candidate.interviewer}</Badge>
                                            }
                                        </div>
                                    </li>
                                    <li>
                                        <div className='titleRole'>Status</div>
                                        <div className='titleRemark'>
                                            <Badge bg={getBadgeVariant(candidate.status)}><VscDebugBreakpointData /> {candidate.status}</Badge>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </Card.Body>
                    </StyleListCandidate>
                    </motion.div>
                </Col>
                ))}
            </Row>
            <StyleCanvas show={showProfile} onHide={handleCloseProfile} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        Candidate Details 
                        <Badge bg={'primary'}>{selectedCandidate && selectedCandidate.id_candidate}</Badge>
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <HeaderInformationProfile data={selectedCandidate} />
                    <TabCanvas
                        data={selectedCandidate}
                    />
                </Offcanvas.Body>
            </StyleCanvas>
        </Container>
    )
}

const HeaderInformationProfile = ({ data }) => {
    return(<>
        {data && (
            <div className="card">
                <div className="card-body">
                    <div className="d-flex align-items-center flex-wrap flex-md-nowrap row-gap-3">
                        <span className="candidate-img me-3">
                            <img 
                                src={data.image} 
                                alt={data.name}
                                width={160}
                                className="img-fluid rounded"
                            />
                        </span>
                        <div className="flex-fill border rounded p-3">
                            <Row className="g-3 align-items-center">
                                <div className="col-md-4">
                                    <p className="mb-1 color-label font-primary">Candiate Name</p>
                                    <h6 className="fw-medium m-0 fs-14">{data.name}</h6>
                                </div>
                                <div className="col-md-4">
                                        <p className="mb-1 color-label font-primary">Applied Role</p>
                                        <h6 className="fw-medium m-0 fs-14">{data.position}</h6>
                                </div>
                                <div className="col-md-4">
                                    <p className="mb-1 color-label font-primary">Applied Date</p>
                                    <h6 className="fw-medium m-0 fs-14">{data.date_applied}</h6>
                                </div>
                                <div className="col-md-4">
                                    <p className="mb-1 color-label font-primary">Email</p>
                                    <h6 className="fw-medium m-0 fs-14">{data.email}</h6>
                                </div>
                                <div className="col-md-4">
                                    <p className="mb-1 color-label font-primary">Recruiter</p>
                                    {Array.isArray(data.interviewer)
                                        ? data.interviewer.map((name, idx) => (
                                            <Badge key={idx} bg="light" text="dark" className="me-1 fw-normal">
                                            {name}
                                            </Badge>
                                        ))
                                        : <Badge bg="light" text="dark">{data.interviewer}</Badge>
                                    }
                                </div>
                                <div className="col-md-4">
                                    <p className="mb-1 color-label font-primary">Recruiter</p>
                                    <Badge bg={getBadgeVariant(data.status)}><VscDebugBreakpointData /> {data.status}</Badge>
                                </div>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>)
}

const TabCanvas = ({ 
    data
}) =>  {
    return(
        <Tabs
            defaultActiveKey="profile"
            className="mt-4"
        >
            <Tab eventKey="profile" title="Profile">
                <TabPorfile
                    data={data}
                />
            </Tab>
            <Tab eventKey="hiringpipline" title="Referred">
                <Referred data={data} />
            </Tab>
        </Tabs>
    )
};
const TabPorfile = ({ data }) => {
    const personal_information = Array.isArray(data?.personal_information) ? data.personal_information[0] : data?.personal_information;
    const address_information = Array.isArray(data?.address_information) ? data.address_information[0] : data?.address_information;
    const resume = data?.resume || undefined;
    const notes = data?.notes || "";
    
    return(
        <>
            <PersonalInformation data={personal_information} />
            <AddressInformation data={address_information} />
            <NotesInformation data={notes} />
            <DownloadResume data={resume} />
        </>
    )
}
const PersonalInformation = ({
    data
}) => {
    return(
        <div className="card mt-4">
            <div className="card-header">
                <h6 className="m-0 font-primary-bold">Personal Information</h6>
            </div>
            <div className="card-body pb-0">
                <div className="row align-items-center">
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">
                                Candiate Name
                            </p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_name || "n/a"}</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">Phone</p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_phone || "-"}</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">Gender</p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_gender || "n/a"}</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">Date of Birth</p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_date_birth || "n/a"}</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">Email</p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_email || "n/a"}</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">Nationality</p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_nationality || "-"}</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">Religion</p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_religion || "-"}</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">Marital status</p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_marital_status || "-"}</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};
const AddressInformation = ({ data }) => {
    return(
        <div className="card mt-4">
            <div className="card-header">
                <h6 className="m-0 font-primary-bold">Address Information</h6>
            </div>
            <div className="card-body pb-0">
                <div className="row">
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">Address</p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_address || '-'}</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">City</p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_city || '-'}</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">State</p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_state || '-'}</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">Country</p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_country || '-'}</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
const NotesInformation = ({ data }) => {
    return(
        <div className="card mt-4">
            <div className="card-header">
                <h6 className='m-0 font-primary-bold'>Notes</h6>
            </div>
            <div className="card-body">
                <p className='m-0'>{data}</p>
            </div>
        </div>
    )
}
const DownloadResume = ({ data }) => {
    return(
        <div className="card mt-4">
            <div className="card-header">
                <h6 className="m-0 font-primary-bold">Resume</h6>
            </div>
            <div className="card-body pb-0">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <div className="d-flex align-items-center mb-3">
                            <span className="avatar border text-dark me-2">
                                <MdOutlineDescription />
                            </span>
                            <div>
                                <h6 className="fw-medium m-0 fs-14">Resume.doc</h6>
                                <span>120 KB</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3 text-md-end">
                            <a className="btn btn-dark d-inline-flex align-items-center fs-14 font-primary" href={data} data-discover="true">
                                <MdOutlineFileDownload className='me-1 fs-5' />
                                Download
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
const Referred = ({ data }) => {
    if (!data?.referred || !Array.isArray(data.referred) || data.referred.length === 0) {
        return <div className="mt-4">No referred data available.</div>;
    }
    return(
        <div className="card mt-4">
            <div className="card-header">
                <h6 className="m-0 font-primary-bold">Recruiter</h6>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <Table bordered={false} className="mb-0">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Role Alias</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.referred.map((ref, idx) => (
                                <tr key={idx}>
                                    <td>{ref.name}</td>
                                    <td>{ref.email}</td>
                                    <td>{ref.role}</td>
                                    <td>{ref.role_alias}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
const getBadgeVariant = (status) => {
    switch (status) {
    case 'Hired':
        return 'success';
    case 'Rejected':
        return 'danger';
    case 'Interviewed':
        return 'primary';
    case 'Offered':
        return 'warning';
    case 'New':
        return 'secondary';
    default:
        return 'info';
    }
};
const StyleListCandidate = styled(Card) `
    box-shadow: 0px 2px 10px -1px rgb(0 0 0 / 22%);
    border:0;
    .header-candidate {
        .title-name {
            display: flex;
            flex: 1 1 auto;
            flex-direction: column;
            justify-content: center;
        }
        img {
            border-radius: 5px;
        }
        .title {
            font-size: clamp(14px, 4vw, 15px);
            font-family: var(--font-main-bold);
            span {
                color: var(--color-main);
                font-weight: normal;
                font-family: var(--font-main);
                background: rgba(var(--bs-primary-rgb), .1) !important;
            }
        }
    }
    .body-candidate {
        ul {
            li {
                color:var(--text-color);
                margin-bottom: 5px;
                @media (min-width: 992px) {
                    display: flex;
                    > * {
                        flex: 0 0 auto;
                        font-size: clamp(.775rem, 4vh, 13px);
                    }
                    .titleRole {
                        width: 40%;
                        color:#6b7280;
                    }
                    .titleRemark {
                        font-weight: 500;
                    }
                }
                .badge {
                    font-family: var(--font-secondary);
                    font-weight: normal;
                    border-radius: 2px;
                }
            }
        }
    }
`;
const StyleCanvas = styled(Offcanvas) `
    --bs-offcanvas-width:60%;
    --bs-border-color-translucent: #e5e7eb;
    .offcanvas-title {
        display: inline-flex;
        align-items: center;
        span {
            color: var(--color-main);
            font-weight: normal;
            font-family: var(--font-main);
            background: rgba(var(--bs-primary-rgb), .1) !important;
            margin-left: 1rem;
        }
    }
    .card-header {
        padding:1rem 1.25rem;
        color: var(--color-text);
        background-color: var(--color-white);
    }
    .nav-tabs {
        --bs-border-width: 0;
        border-bottom: solid 1px var(--bs-border-color-translucent);
        font-size: 1rem;
        font-family: var(--font-main);
        .nav-link {
            border-bottom: solid 2px transparent;
            letter-spacing: .02rem;
            color: var(--color-text);
            &.active {
                border-color: var(--color-main);
                color:var(--color-main);
            }
        }
    }
    .avatar {
        line-height: 2.813rem;
        font-size: 1rem;
        position: relative;
        height: 2.625rem;
        width: 2.625rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        font-weight: 500;
    }
    .btn-dark {
        letter-spacing: .03rem;
    }
`;