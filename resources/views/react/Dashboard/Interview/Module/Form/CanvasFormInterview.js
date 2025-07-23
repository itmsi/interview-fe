import React from 'react'
import { Badge, Offcanvas } from 'react-bootstrap';
import { FormHR } from './FormHR';
import { ImageProfileSrc } from '../../../Helper/Helper';
import styled from 'styled-components';

export const CanvasFormInterview = ({ 
    show,
    onHide,
    selectedCandidate,
    system,
    itemSchedule,
    endpoint,
    token,
    loginInfo,
    editingFormData,
    isEditMode,
    onSaveSuccess
}) => {
    const roleName = system?.roles?.[0]?.role_name;
    return (
        <StyleCanvas show={show} onHide={onHide} placement="end" backdrop="static">
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
                    {/* {isEditMode && <Badge bg={'warning'} className="ms-2">Edit Mode</Badge>} */}
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>

                <FormHR 
                    itemSchedule={itemSchedule}
                    endpoint={endpoint}
                    token={token}
                    loginInfo={loginInfo}
                    status={roleName.toLowerCase()}
                    system={system}
                    editingFormData={editingFormData}
                    isEditMode={isEditMode}
                    onSaveSuccess={() => {
                        if (onSaveSuccess) onSaveSuccess();
                        onHide(); // Tutup offcanvas
                    }}
                />

            </Offcanvas.Body>
        </StyleCanvas>
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