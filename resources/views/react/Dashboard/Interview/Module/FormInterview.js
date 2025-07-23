import React, { useState } from 'react'
import { Badge, Button, Col, Container, Modal, Offcanvas, Row, Table } from 'react-bootstrap';
import { getBadgeVariant, ImageProfileSrc, Tooltips } from '../../Helper/Helper';
import styled from 'styled-components';
import { FormHR } from '../Module/Form/FormHR';
import { RxPencil2 } from "react-icons/rx";
import { FaRegPenToSquare, FaChartSimple, FaRegFilePdf } from "react-icons/fa6";
import { Popup } from '../../Component/Popup';
import { InterviewScoreChart } from '../Module/Form/InterviewScoreChart';
import { ModalScoreInterview } from './Form/ModalScoreInterview';

export const FormInterview = ({ system, token, loginInfo, data }) => {
    const [candidate, setCandidate] = useState(data);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    
    const roleName = system?.roles?.[0]?.role_name;
    
    const handleCloseProfile = () => {
        setShowProfile(false);
        setTimeout(() => {
            setSelectedCandidate(null);
        }, 100);
    };
    const handleShowProfile = (candidate) => {
        setSelectedCandidate(candidate);
        setShowProfile(true);
    };
    const ListDataQuestion = [
        {
            name: "Admin",
            position: "HR",
            role: "Human Resources",
            date_created: "12 Jun 2025",
            status: "save"
        },
        {
            name: "Admin",
            position: "HR",
            role: "Human Resources",
            date_created: "13 Jun 2025",
            status: "submit"
        },
        {
            name: "Admin",
            position: "HR",
            role: "Human Resources",
            date_created: "14 Jun 2025",
            status: "submit"
        },
    ];

    const [totalPointSIAH, setTotalPointSIAH] = useState(0);
    const [totalPointValues, setTotalPointValues] = useState(0);
    const [totalPointCSE, setTotalPointCSE] = useState(0);
    const [totalPointSDT, setTotalPointSDT] = useState(0);
    
    return (<>

        {ListDataQuestion.length === 0 ?
            <div className='d-flex justify-content-center create-center h-statik align-items-center'>
                <Button onClick={() => handleShowProfile(candidate)} className='fs-14'> <RxPencil2 className='ms-2' /> Create Question </Button>
            </div>
        : <>
            <div className='d-flex create-center'>
                <Button onClick={() => handleShowProfile(candidate)} className='fs-14'> <RxPencil2 className='ms-2' /> Create Question </Button>
            </div>
            <ListOfQuestion 
                system={roleName} 
                loginInfo={loginInfo} 
                data={ListDataQuestion}
            />
        </>}

        <StyleCanvas show={showProfile} onHide={handleCloseProfile} placement="end" backdrop="static">
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
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>

                <FormHR 
                    setTotalPointSIAH={setTotalPointSIAH}
                    setTotalPointValues={setTotalPointValues}
                    setTotalPointCSE={setTotalPointCSE}
                    setTotalPointSDT={setTotalPointSDT}
                    status={candidate.id_candidate == "cand-003" ? 'hr' : roleName} 
                />

            </Offcanvas.Body>
        </StyleCanvas>
    </>)
}

const ListOfQuestion = ({ 
    roleName, 
    loginInfo, 
    data 
}) => {
    
    const { employee, user } = loginInfo;
    
    if (!data || !Array.isArray(data) || data.length === 0) {
        return <div className="mt-4 d-flex justify-content-center create-center h-statik align-items-center">No data available.</div>;
    }

    const dataScore = [
        { name: 'SIAH', score: 25 },
        { name: '7 Values', score: 35 },
    ];

    const dataScore2 = [
        { name: 'CSE', score: 32 },
        { name: 'SDT', score: 30 },
    ];

    // const dataScore2 = [
    //     { name: 'CSE', score: 32 },
    //     { name: 'SDT', score: 30 },
    // ];

    // const dataScore2 = [
    //     { name: 'CSE', score: 32 },
    //     { name: 'SDT', score: 30 },
    // ];

    const [showScore, setShowScore] = useState(false);
    const handleShowScore = () => {
        setShowScore(true)
    }

    return(
        <div className="card mt-4">
            <div className="card-body">
                <div className="table-responsive">
                    <Table bordered={false} className="mb-0">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Date Created</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((ref, idx) => (
                                <tr key={idx}>
                                    <td valign='middle'>{ref.name}</td>
                                    <td valign='middle'>{ref.role}</td>
                                    <td valign='middle'>{ref.date_created}</td>
                                    <td valign='middle'>
                                        <Badge bg={getBadgeVariant(ref.status)}>
                                            {ref.status}
                                        </Badge>
                                    </td>
                                    <td valign='middle'>
                                        
                                        <Tooltips title={"Edit"} position="top">
                                            <button 
                                                onClick={() => handleEditInterview(ref.id)}
                                                className="btn btn-sm btn-transparent"
                                            >
                                                <FaRegPenToSquare className='fs-6' />
                                            </button>
                                        </Tooltips>

                                        {ref.status === "submit" && <>
                                            <Tooltips title={"Show Score"} position="left">
                                                <button 
                                                    onClick={() => handleShowScore(ref.id)}
                                                    className="btn btn-sm btn-transparent"
                                                >
                                                    <FaChartSimple className='fs-6' />
                                                </button>
                                            </Tooltips>
                                            <Tooltips title={"Download PDF"} position="left">
                                                <button 
                                                    onClick={() => handleDownloadScore(ref.id)}
                                                    className="btn btn-sm btn-transparent"
                                                >
                                                    <FaRegFilePdf className='fs-6' />
                                                </button>
                                            </Tooltips>
                                        </>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
            <ModalScoreInterview 
                showScore={showScore}
                setShowScore={setShowScore}
                roleName={roleName}
                dataScoreHR={dataScore}
                dataScoreHR2={dataScore2}
                dataScoreTMT={dataScore2}
            />
        </div>
    )
}

const StyleCanvas = styled(Offcanvas) `
    --bs-offcanvas-width:80%;
    --bs-border-color-translucent: #e5e7eb;
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
`;