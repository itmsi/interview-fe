import React, { useState } from 'react'
import { Badge, Button, Col, Form, Row, Table } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { RiCalendarScheduleFill } from "react-icons/ri";
import { Popup } from '../../Component/Popup';
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";

export const DateInterview = ({ token, data, userInfo }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return <div className="mt-4">No Date Interview.</div>;
    }

    const [dateSchedule, setDateShedule] = useState(data || []);
    const [showAdd, setShowAdd] = useState(false);

    const [form, setForm] = useState({
        date: null,
        time: null,
        assign: [],
        duration: '',
    });

    const handleSave = () => {
        if (!form.date || !form.time || form.assign.length === 0 || !form.duration) {
            alert("Please fill all fields!");
            return;
        }
        // Format date & time sesuai contoh
        const dateStr = form.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr = form.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + (form.time.getHours() < 12 ? ' AM' : ' PM');
        const newSchedule = {
            id: dateSchedule.length + 1,
            name: "You", // Ganti sesuai user login jika ada
            interviewer: form.assign,
            image: "https://picsum.photos/id/200/200/200",
            date: dateStr,
            time: timeStr,
            duration: form.duration
        };
        setDateShedule(prev => [...prev, newSchedule]);
        setShowAdd(false);
        setForm({
            date: null,
            time: null,
            assign: [],
            duration: '',
        });
    };
    
    return(<>
        <Button onClick={() => setShowAdd(true)} className='rounded-1 mt-4 w-100 font-primary'><RiCalendarScheduleFill className='ms-2' /> Add Date of Interview</Button>
        <div className="card mt-3">
            <Popup
                show={showAdd}
                title={"Add Date of Interview"}
                size={'md'}
                onHide={() => setShowAdd(false)}
                onConfirm={handleSave}
                titleConfirm={"Save"}
            >
                <AddSchduleInterview 
                    form={form}
                    setForm={setForm}
                />
            </Popup>
            <ListDateInterview data={dateSchedule} />
        </div>
    </>)
}

const ListDateInterview = ({ data }) => {
    return(
        <div className="card-body">
            <div className="table-responsive">
                <Table bordered={false} className="mb-0">
                    <thead>
                        <tr>
                            <th>Created by</th>
                            <th>Assigned</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((ref, idx) => (
                            <tr key={idx}>
                                <td>{ref.name}</td>
                                <td>
                                    <div className='titleRemark'>
                                        {Array.isArray(ref.interviewer)
                                            ? ref.interviewer.map((name, idx) => (
                                                <Badge key={idx} bg="light" text="dark" className="me-1">
                                                {name}
                                                </Badge>
                                            ))
                                            : <Badge bg="light" text="dark">{ref.interviewer}</Badge>
                                        }
                                    </div>
                                </td>
                                <td>{ref.date} - {ref.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

const AddSchduleInterview = ({ form, setForm }) => {
    return (
        <Form>
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Label className='m-0 fs-14 color-label'>Date</Form.Label>
                    <DatePicker
                        selected={form.date}
                        onChange={date => setForm(f => ({ ...f, date }))}
                        minDate={new Date()}
                        dateFormat="dd MMM yyyy"
                        className="form-control h-field fs-14"
                        placeholderText="Select date"
                    />
                </Col>
                <Col md={6}>
                    <Form.Label className='m-0 fs-14 color-label'>Time</Form.Label>
                    <DatePicker
                        selected={form.time}
                        onChange={time => setForm(f => ({ ...f, time }))}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="HH:mm aa"
                        showTimeCaption={false}
                        className="form-control h-field fs-14"
                        placeholderText="Select time"
                        minTime={setHours(setMinutes(new Date(), 30), 8)}
                        maxTime={setHours(setMinutes(new Date(), 30), 20)}
                    />
                </Col>
            </Row>
            <Row className="mb-3">
                <Col md={12}>
                    <Form.Label className='m-0 fs-14 color-label'>Assign</Form.Label>
                    <div className="d-flex flex-wrap gap-3">
                        {['HR', 'GM', 'VP', 'BOD'].map(role => (
                            <Form.Check
                                key={role}
                                type="checkbox"
                                id={`default-${role}`}
                                label={role}
                                checked={form.assign.includes(role)}
                                className='fs-14'
                                onChange={e => {
                                    setForm(f => ({
                                        ...f,
                                        assign: e.target.checked
                                            ? [...f.assign, role]
                                            : f.assign.filter(r => r !== role)
                                    }));
                                }}
                            />
                        ))}
                    </div>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col md={12}>
                    <Form.Label className='m-0 fs-14 color-label'>Duration of Interview</Form.Label>
                    <Form.Control
                        type="text"
                        value={form.duration}
                        onChange={e => setForm(f => ({ ...f, duration: e.target.value.replace(/[^\d]/g, '') }))}
                        className='h-field fs-14'
                    />
                </Col>
            </Row>
        </Form>
    )
}
