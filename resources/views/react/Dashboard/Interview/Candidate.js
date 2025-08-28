import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row, Badge, Offcanvas, Tabs, Tab, Form, Modal, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { VscDebugBreakpointData } from "react-icons/vsc";
import { RiUserAddFill } from "react-icons/ri";
import { AnimatedLoadingSpinner, apiDelete, apiGet, getBadgeVariant, ImageProfileSrc, Tooltips, useSystemFromUrl } from '../Helper/Helper';
import { CreateCandidateForm } from './CreateCandidateForm';
import { AnimatePresence, motion } from 'framer-motion';
import { Profile } from './Module/Profile';
import { Assigned } from './Module/Assigned';
import { DateInterview } from './Module/DateInterviews';
import { FormInterview } from './Module/FormInterview';
import { BackgroundCheck } from './Module/BackgroundCheck';
import { DocumentOnBoarding } from './Module/DocumentOnBoarding';
import { DataKandidat } from './data/candidateData';
import CandidateNotes from './Module/CandidateNotes';
import { ServerErrorTemplate } from '../Component/ErrorTemplate';
import { FaPencil, FaTrash } from "react-icons/fa6";
import { toast } from 'react-toastify';

const CandidateCardSkeleton = () => (
    <div className="candidate-skeleton">
        <div className="skeleton-header">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-text-block">
                <div className="skeleton-text skeleton-title"></div>
                <div className="skeleton-text skeleton-subtitle"></div>
            </div>
        </div>
        <div className="skeleton-body">
            {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="skeleton-list-item">
                    <div className="skeleton-text skeleton-label"></div>
                    <div className="skeleton-text skeleton-value"></div>
                </div>
            ))}
        </div>
    </div>
);

const LoadingCandidates = () => (
    <div>
        <AnimatedLoadingSpinner text={'candidates'} />
        <Row className='g-3'>
            {[1, 2, 3, 4].map((index) => (
                <Col md={4} lg={3} sm={6} key={index}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                        <CandidateCardSkeleton />
                    </motion.div>
                </Col>
            ))}
        </Row>
    </div>
);

export const Candidate = ({ endpoint, systems, token, setPage, loginInfo }) => {
    const [errors, setErrors] = useState(false);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [isAdd, setIsAdd] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [editCandidate, setEditCandidate] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteCandidate, setDeleteCandidate] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    
    const handleUpdateCandidateNotes = async (candidateId, newNotes) => {
        try {
            setCandidates(prevCandidates => 
                prevCandidates.map(candidate => 
                    candidate.id === candidateId 
                        ? { ...candidate, notes: newNotes }
                        : candidate
                )
            );
            return true;
        } catch (error) {
            console.error('Error updating candidate notes:', error);
            return false;
        }
    };

    const handleRetry = () => {
        setLoading(true);
        setErrors(false);
        apiGet(endpoint, '/dashboard/candidates', token)
            .then(data => {
                setLoading(false);
                setErrors(false);
                setUsers(data?.data || []);
            })
            .catch(err => {
                console.error('Error fetching candidates:', err);
                setErrors(true);
                setLoading(false);
            });
    };
    
    useEffect(() => {
        setPage('Candidates');
        apiGet(endpoint, '/dashboard/candidates', token)
            .then(data => {
                setLoading(false);
                setErrors(false);
                setCandidates(data?.data || []);
            })
            .catch(err => {
                console.error('Error fetching candidates:', err);
                setErrors(true);
                setLoading(false);
            });
    }, [token]);

    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    const system = useSystemFromUrl(systems);
    
    const handleEditProfile = (candidate) => {
        setEditCandidate(candidate);
        setShowEdit(true);
    };

    const handleSaveEdit = (updatedCandidate) => {
        apiGet(endpoint, '/dashboard/candidates', token)
            .then(data => {
                setCandidates(data?.data || []);
                setShowEdit(false);
                setEditCandidate(null);
            })
            .catch(err => {
                console.error('Error fetching updated candidates:', err);
                setShowEdit(false);
                setEditCandidate(null);
            });
    };

    const handleDeleteProfile = (candidate) => {
        setDeleteCandidate(candidate);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await apiDelete(endpoint, `/candidates/${deleteCandidate.id}`, token);
    
            const data = await apiGet(endpoint, '/dashboard/candidates', token);
            setCandidates(data?.data || []);
            toast.success('Candidate deleted successfully!');
            setShowDeleteConfirm(false);
            setDeleteCandidate(null);
            setShowProfile(false);
        } catch (error) {
            toast.error('Failed to delete candidate: ' + error.message);
        }
    };

    return (
        <Container fluid className="my-4 p-0 position-relative">
            <AnimatePresence mode="wait">
            {isAdd ? (
                <motion.div
                    key="form"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={formVariants}
                    transition={{ duration: 0.4 }}
                >
                    <CreateCandidateForm
                        endpoint={endpoint}
                        token={token}
                        onSave={(newCandidate) => {
                            apiGet(endpoint, '/dashboard/candidates', token)
                                .then(data => {
                                    setCandidates(data?.data || []);
                                    setIsAdd(false);
                                })
                                .catch(err => {
                                    console.error('Error fetching updated candidates:', err);
                                    setIsAdd(false);
                                });
                        }}
                        onCancel={() => setIsAdd(false)}
                    />
                </motion.div>
            ) : (
                <motion.div
                    key="list"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={formVariants}
                    transition={{ duration: 0.4 }}
                >
                    {!errors ? (
                        loading ? (
                            <LoadingCandidates />
                        ) : (
                            <LayoutCandidat 
                                token={token} 
                                system={system} 
                                loginInfo={loginInfo} 
                                candidates={candidates} 
                                setIsAdd={setIsAdd} 
                                onUpdateNotes={handleUpdateCandidateNotes}
                                handleEditProfile={handleEditProfile}
                                handleDeleteProfile={handleDeleteProfile}
                                selectedCandidate={selectedCandidate}
                                setSelectedCandidate={setSelectedCandidate}
                                showProfile={showProfile}
                                setShowProfile={setShowProfile}
                                endpoint={endpoint}
                            />
                        )
                    ) : (
                        <ServerErrorTemplate
                            onRetry={handleRetry} 
                            loading={loading}
                        />
                    )}
                </motion.div>
            )}
            </AnimatePresence>

            {/* Modal Edit Profile */}
            <Modal show={showEdit} onHide={() => setShowEdit(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Candidate Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body className='pb-0'>
                    {editCandidate && (
                        <CreateCandidateForm
                            endpoint={endpoint}
                            token={token}
                            initialData={editCandidate}
                            onSave={handleSaveEdit}
                            onCancel={() => setShowEdit(false)}
                        />
                    )}
                </Modal.Body>
            </Modal>

            {/* Modal Delete Confirmation */}
            <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Candidate</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete candidate <strong>{deleteCandidate?.name}</strong>?</p>
                    <p className="text-muted">This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

const LayoutCandidat = ({
    token,
    system,
    loginInfo,
    candidates,
    setIsAdd,
    onUpdateNotes,
    handleEditProfile,
    handleDeleteProfile,
    selectedCandidate,
    setSelectedCandidate,
    showProfile,
    setShowProfile,
    endpoint
}) => {
    const [filters, setFilters] = useState({
        text: '',
        status: '',
        interviewer: '',
        sort: 'latest'
    });

    const handleShowProfile = (candidate) => {
        setSelectedCandidate(candidate);
        setShowProfile(true);
    };
    
    const handleCloseProfile = () => {
        setShowProfile(false);
        setSelectedCandidate(null);
    };

    const roleName = system?.roles?.[0]?.role_name;
    return(
        <>
            <div className="d-flex justify-content-end align-items-center mb-3 action-create-candidate">
                <button className="btn btn-outline-primary fs-14" onClick={() => setIsAdd(true)}>
                    <RiUserAddFill /> Add Candidate
                </button>
            </div>
            <Row className="mb-4 g-3">
                <Form.Group as={Col} className='col-lg-5 col-12'>
                    <Form.Control 
                        type="text"
                        className="fs-14 color-text"
                        placeholder="Search candidate..."
                        onChange={(e) => setFilters({ ...filters, text: e.target.value.toLowerCase() })} 
                    />
                </Form.Group>
                <Form.Group as={Col} className='col-lg-3 col-4'>
                    <Form.Select 
                        size="md"
                        className="fs-14 color-text"
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">All Status</option>
                        {['Interviewed', 'Scheduled', 'Complete', 'New'].map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                
                <Form.Group as={Col} className='col-lg-2 col-4'>
                    <Form.Select 
                        size="md" 
                        className="fs-14 color-text"
                        onChange={(e) => setFilters({ ...filters, interviewer: e.target.value })}
                    >
                        <option value="">All Interviewers</option>
                        {['HR', 'GM', 'VP', 'BOD'].map(role => (
                        <option key={role} value={role}>{role}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                
                <Form.Group as={Col} className='col-lg-2 col-4'>
                    <Form.Select 
                        size="md" 
                        className="fs-14 color-text"
                        onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                    >
                        <option value="latest">Sort by Latest</option>
                        <option value="oldest">Sort by Oldest</option>
                    </Form.Select>
                </Form.Group>
            </Row>
            <Row className='g-3'>
                {candidates
                .filter(c => {
                    const q = filters.text;
                    const interviewerText = Array.isArray(c.interviewer) && c.interviewer.length > 0 ? c.interviewer.join(' ') : 'No interviewers';
                    const matchText = `${c.name} ${c.email} ${c.id_candidate} ${c.position} ${c.status} ${interviewerText}`.toLowerCase().includes(q);
                    const matchStatus = filters.status ? c.status === filters.status : true;
                    const matchInterviewer = filters.interviewer ? (Array.isArray(c.interviewer) && c.interviewer.includes(filters.interviewer)) : true;
                    return matchText && matchStatus && matchInterviewer;
                })
                .sort((a, b) => {
                    const dA = new Date(a.date_applied);
                    const dB = new Date(b.date_applied);
                    return filters.sort === 'latest' ? dB - dA : dA - dB;
                })
                .map((candidate, index) => (
                <Col md={4} lg={3} sm={6} key={index}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * .1, duration: 0.4 }}
                        className='h-100'
                    >
                    <StyleListCandidate className='h-100'>
                        <Card.Body className='h-100'>
                            <div className='header-candidate d-flex'>
                                {candidate?.image ? 
                                    <ImageProfileSrc
                                        src={candidate.image} 
                                        alt={candidate.name} 
                                        width={50} 
                                        className='avatar me-2' />
                                : 
                                    <div className='avatar-user'>
                                        {candidate?.name?.charAt(0) || '-'}
                                    </div>
                                }
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
                                        <div className='titleRole'>Company</div>
                                        <div className='titleRemark'>{candidate.company}</div>
                                    </li>
                                    <li>
                                        <div className='titleRole'>Applied Role</div>
                                        <div className='titleRemark'>{candidate.position}</div>
                                    </li>
                                    <li>
                                        <div className='titleRole'>Date Interview</div>
                                        <div className='titleRemark'>
                                            {candidate.date_schedule && candidate.date_schedule.length > 0 
                                                ? candidate.date_schedule
                                                    .sort((a, b) => new Date(b.date) - new Date(a.date))[0].date
                                                : "-"
                                            }
                                        </div>
                                    </li>
                                    <li>
                                        <div className='titleRole'>Assigned</div>
                                        <div className='titleRemark'>
                                            {Array.isArray(candidate.interviewer) && candidate.interviewer.length > 0
                                                ? candidate.interviewer.map((name, idx) => (
                                                    <Badge key={idx} bg="light" text="dark" className="me-1">
                                                    {name}
                                                    </Badge>
                                                ))
                                                : <Badge bg="light" text="dark">No interviewers</Badge>
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
                        <ImageProfileSrc 
                            src={selectedCandidate?.image} 
                            alt={`${selectedCandidate?.name}`} 
                            width={50} 
                            className='avatar me-2'
                        />
                        {selectedCandidate?.name || "-"}
                        <Badge bg={'primary'}>{selectedCandidate && selectedCandidate.id_candidate}</Badge>
                        
                        {/* Button Actions */}
                        {roleName && roleName.toLowerCase() === 'hr' && (
                        <div className="ms-3 d-flex gap-2">
                            <Tooltips title={"Edit Candidate"} position="top">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="rounded-circle"
                                    onClick={() => handleEditProfile(selectedCandidate)}
                                >
                                    <FaPencil />
                                </Button>
                            </Tooltips>
                            
                            <Tooltips title={"Delete Candidate"} position="top">
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="rounded-circle"
                                    onClick={() => handleDeleteProfile(selectedCandidate)}
                                >
                                    <FaTrash />
                                </Button>
                            </Tooltips>
                        </div>
                        )}
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <HeaderInformationProfile data={selectedCandidate} />
                    <TabCanvas
                        token={token}
                        system={system}
                        loginInfo={loginInfo}
                        data={selectedCandidate}
                        onUpdateNotes={onUpdateNotes}
                        endpoint={endpoint}
                    />
                </Offcanvas.Body>
            </StyleCanvas>
        </>
    )
}

const HeaderInformationProfile = ({ data }) => {
    return(<>
        {data && (
            <div className="card">
                <div className="card-body">
                    <div className="d-flex align-items-center flex-wrap flex-md-nowrap row-gap-3">
                        <Row className="g-3 align-items-center">
                            <div className="col-md-3 col-sm-6 col-12">
                                <p className="mb-1 color-label font-primary">Candidate Name</p>
                                <h6 className="fw-medium m-0 fs-14">{data.name}</h6>
                            </div>
                            <div className="col-md-3 col-sm-6 col-12">
                                <p className="mb-1 color-label font-primary">Company</p>
                                <h6 className="fw-medium m-0 fs-14">{data.company}</h6>
                            </div>
                            <div className="col-md-3 col-sm-6 col-12">
                                <p className="mb-1 color-label font-primary">Applied Role</p>
                                <h6 className="fw-medium m-0 fs-14">{data.position}</h6>
                            </div>
                            <div className="col-md-3 col-sm-6 col-12">
                                <p className="mb-1 color-label font-primary">Age</p>
                                <h6 className="fw-medium m-0 fs-14">{data.age}</h6>
                            </div>
                            <div className="col-md-3 col-sm-6 col-12">
                                <p className="mb-1 color-label font-primary">Gender</p>
                                <h6 className="fw-medium m-0 fs-14">{data?.personal_information?.[0]?.candidate_gender || "-"}</h6>
                            </div>
                            <div className="col-md-3 col-sm-6 col-12">
                                <p className="mb-1 color-label font-primary">Recruiter</p>
                                {Array.isArray(data.interviewer) && data.interviewer.length > 0
                                    ? data.interviewer.map((name, idx) => (
                                        <Badge key={idx} bg="light" text="dark" className="me-1 fw-normal">
                                        {name}
                                        </Badge>
                                    ))
                                    : <Badge bg="light" text="dark">No interviewers</Badge>
                                }
                            </div>
                            <div className="col-md-3 col-sm-6 col-12">
                                <p className="mb-1 color-label font-primary">Date of Interview</p>
                                <h6 className="fw-medium m-0 fs-14">
                                    {data.date_schedule && data.date_schedule.length > 0 
                                        ? data.date_schedule
                                            .sort((a, b) => new Date(b.date) - new Date(a.date))[0].date
                                        : "-"
                                    }
                                </h6>
                            </div>
                            <div className="col-md-3 col-sm-6 col-12">
                                <p className="mb-1 color-label font-primary">Status</p>
                                <Badge bg={getBadgeVariant(data.status)}><VscDebugBreakpointData /> {data.status}</Badge>
                            </div>
                        </Row>
                    </div>
                </div>
            </div>
        )}
    </>)
}

const TabCanvas = ({ 
    token,
    system,
    loginInfo,
    data,
    onUpdateNotes,
    endpoint
}) =>  {
    const [activeTab, setActiveTab] = useState("profile");

    const handleTabSelect = async (eventKey) => {
        setActiveTab(eventKey);
    };
    return(
        <Tabs
            activeKey={activeTab}
            onSelect={handleTabSelect}
            className="mt-3"
        >
            <Tab eventKey="profile" title="Profile">
                <Profile
                    data={data}
                    token={token}
                    loginInfo={loginInfo}
                />
            </Tab>
            <Tab eventKey="history" title="Date Interview">
                <DateInterview 
                    endpoint={endpoint}
                    token={token}
                    loginInfo={loginInfo}
                    infoCandidate={data}
                    system={system}
                    isActive={activeTab === "history"}
                />
            </Tab>
            <Tab eventKey="backgroundCheck" title="Background Check">
                <BackgroundCheck
                    endpoint={endpoint}
                    system={system}
                    token={token}
                    infoCandidate={data}
                    loginInfo={loginInfo}
                    isActive={activeTab === "backgroundCheck"}
                />
            </Tab>
            <Tab eventKey="documentOnBoarding" title="Document Onboarding">
                <DocumentOnBoarding
                    endpoint={endpoint}
                    system={system}
                    token={token}
                    infoCandidate={data}
                    loginInfo={loginInfo}
                    isActive={activeTab === "documentOnBoarding"}
                />
            </Tab>
            <Tab eventKey="notes" title="Notes">
                <CandidateNotes
                    endpoint={endpoint}
                    system={system}
                    candidateId={data?.id}
                    candidateNotes={data?.notes || []}
                    token={token}
                    infoCandidate={data}
                    loginInfo={loginInfo}
                    onUpdateNotes={onUpdateNotes}
                    isActive={activeTab === "notes"}
                />
            </Tab>
        </Tabs>
    )
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
                        width: 60%;
                    }
                }
            }
        }
    }
`;

const StyleCanvas = styled(Offcanvas) `

    --bs-offcanvas-width:100%;
    --bs-border-color-translucent: #e5e7eb;
    @media (min-width: 992px) {
        --bs-offcanvas-width:60%;
        /* z-index: 10000; */
    }
    .offcanvas-title {
        display: inline-flex;
        align-items: center;
        span {
            color: var(--color-main);
            font-weight: 600;
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
    .btn-dark {
        letter-spacing: .03rem;
    }
    .notes-candidate {
        li {
            display: flex;
            align-items: flex-start;
            margin-bottom: 1rem;
            border-bottom: solid 1px var(--bs-border-color-translucent);
            .description {
                flex: 1 1 auto;
                margin-left: 1rem;
                p {
                    margin-bottom: 0;
                    font-size: .875rem;
                    color: var(--color-text);
                }
            }
            .header-profile {
                display: flex;
                justify-content: space-between;
                span {
                    color: #6b7280;
                    font-size: 12px;
                }
            }
            .left-profile {
                p {
                    font-family: var(--font-main-bold);
                    line-height: 1;
                }
            }
        }
    }
`;