import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const EditJobModal = forwardRef(({ onJobUpdate }, ref) => {
    const [show, setShow] = useState(false);
    const [job, setJob] = useState({});

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useImperativeHandle(ref, () => ({
        openModal(job) {
            setJob(job);
            handleShow();
        }
    }));

    const handleSave = async () => {
        try {
            const response = await axios.put(`http://54.221.28.111:3000/api/jobs/${job.id}`, job);
            console.log("Job updated successfully:", response.data);
            onJobUpdate(response.data);
            handleClose();
        } catch (error) {
            console.error('Error updating job:', error);
        }
    };

    const handleDelete = async () => {
        // Need to figure this part out
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Job</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formJobTitle">
                        <Form.Label>Job Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={job.job_title || ''}
                            onChange={(e) => setJob({ ...job, job_title: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group controlId="formCompany">
                        <Form.Label>Company</Form.Label>
                        <Form.Control
                            type="text"
                            value={job.company_name || ''}
                            onChange={(e) => setJob({ ...job, company_name: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group controlId="formLocation">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                            type="text"
                            value={job.location || ''}
                            onChange={(e) => setJob({ ...job, location: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group controlId="formPay">
                        <Form.Label>Pay</Form.Label>
                        <Form.Control
                            type="text"
                            value={job.pay_range || ''}
                            onChange={(e) => setJob({ ...job, pay_range: e.target.value })}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Delete
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default EditJobModal;
