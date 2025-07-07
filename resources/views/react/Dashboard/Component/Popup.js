import React from 'react'
import { Button, Modal } from 'react-bootstrap'

export const Popup = ({
    show,
    title,
    children,
    size = 'lg',
    onHide,
    onConfirm,
    titleConfirm = ''
}) => {
    return (
        <Modal
            size={size}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={show}
            onHide={onHide}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="outline-secondary" className='btn-hide' onClick={onHide} style={{ minWidth: "100px" }}>Close</Button>
                {titleConfirm !== '' && 
                    <Button variant="primary" onClick={onConfirm} className='btn-action' style={{ minWidth: "100px" }}>{titleConfirm}</Button>
                }
            </Modal.Footer>
        </Modal>
    )
}