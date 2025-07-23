import React from 'react'
import { Col, Container, Modal, Row } from 'react-bootstrap'
import { InterviewScoreChart } from './InterviewScoreChart'

export const ModalScoreInterview = ({
    showScore,
    setShowScore,
    roleName,
    scoreData
}) => {
    return (
        <Modal
            size={`${(roleName === "Super Admin" || roleName === "hr") ? "lg" : "md"}`}
            centered
            show={showScore}
            onHide={() => setShowScore(false)}
        >
            <Modal.Body>
                <Container>
                    <Row>
                        <Col xs={12}>
                            <InterviewScoreChart metrics={scoreData} />
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    )
}

