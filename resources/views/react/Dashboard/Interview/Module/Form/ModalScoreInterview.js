import React from 'react'
import { Col, Container, Modal, Row } from 'react-bootstrap'
import { InterviewScoreChart } from './InterviewScoreChart'

export const ModalScoreInterview = ({
    showScore,
    setShowScore,
    roleName,
    dataScoreHR,
    dataScoreHR2,
    dataScoreTMT,
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
                        {(roleName === "Super Admin" || roleName === "hr") ?<>
                            <Col lg={6} xs={12}>
                                <InterviewScoreChart metrics={dataScoreHR} />
                            </Col>
                            <Col lg={6} xs={12}>
                                <InterviewScoreChart metrics={dataScoreHR2} />
                            </Col>
                        </>:
                            <Col xs={12}>
                                <InterviewScoreChart metrics={dataScoreTMT} />
                            </Col>
                        }
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    )
}

