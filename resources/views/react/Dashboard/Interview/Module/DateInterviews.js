import React, { useEffect, useState } from 'react'
import { Badge, Button, Col, Form, Row, Table, Collapse } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { RiCalendarScheduleFill } from "react-icons/ri";
import { FaRegPenToSquare, FaRegTrashCan, FaChevronDown, FaChevronUp, FaPlus, FaChartSimple, FaRegFilePdf } from "react-icons/fa6";
import { Popup } from '../../Component/Popup';
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import { apiPost, apiPatch, apiDelete, getBadgeVariant, apiGet, AnimatedLoadingSpinner } from '../../Helper/Helper';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { CanvasFormInterview } from './Form/CanvasFormInterview';

dayjs.extend(customParseFormat);

export const DateInterview = ({ system, token, data, loginInfo, endpoint, infoCandidate, isActive = false }) => {
    const [candidate, setCandidate] = useState(infoCandidate || []);
    const [dateSchedule, setDateShedule] = useState(data || []);
    const [loading, setLoading] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [deletingSchedule, setDeletingSchedule] = useState(null);
    const [expandedSchedules, setExpandedSchedules] = useState({});
    const [showFormInterview, setShowFormInterview] = useState(false);
    const [selectedScheduleId, setSelectedScheduleId] = useState(null);
    const [itemSchedule, setItemSchedule] = useState(null);
    const [showDeleteFormConfirm, setShowDeleteFormConfirm] = useState(false);
    const [deletingForm, setDeletingForm] = useState(null);

    const [form, setForm] = useState({
        date: null,
        time: null,
        assign: [],
        duration: '',
    });

    // Fetch schedule data from API when tab is active
    const fetchScheduleData = async () => {
        if (!candidate?.id || !endpoint || !token) return;
        
        setLoading(true);
        try {
            const params = {
                candidate_id: candidate.id,
                systemName: "interview",
                menuName: "date-interview",
                permissionName: "read"
            };

            const response = await apiGet(endpoint, `/date-interview`, token, { params: params });

            
            const transformedData = (response?.data || []).map(item => {
                // Transform the new interview structure to match the expected formInterviews format
                const formInterviews = [];
                
                if (item.interview && Array.isArray(item.interview)) {
                    item.interview.forEach(interviewGroup => {
                        if (interviewGroup.form_interviews && Array.isArray(interviewGroup.form_interviews)) {
                            interviewGroup.form_interviews.forEach(formInterview => {
                                // Create a form interview object with the new structure
                                const transformedFormInterview = {
                                    interview_id: formInterview.interview_id,
                                    assigned_name: interviewGroup.assigned_name,
                                    assigned_role_alias: interviewGroup.assigned_role_alias,
                                    interview: [] // This will contain the flattened questions/forms
                                };
                                
                                // Flatten the questions structure
                                if (formInterview.questions && Array.isArray(formInterview.questions)) {
                                    formInterview.questions.forEach(questionGroup => {
                                        if (questionGroup.forms && Array.isArray(questionGroup.forms)) {
                                            questionGroup.forms.forEach(form => {
                                                transformedFormInterview.interview.push({
                                                    company_value: questionGroup.company_value,
                                                    aspect: form.aspect,
                                                    question: form.question,
                                                    answer: form.answer || "",
                                                    score: form.score || 0,
                                                    assigned_name: form.assigned_name,
                                                    assigned_role_alias: form.assigned_role_alias
                                                });
                                            });
                                        }
                                    });
                                }
                                
                                formInterviews.push(transformedFormInterview);
                            });
                        }
                    });
                }
                
                return {
                    id: item.schedule_interview_id,
                    schedule_interview_id: item.schedule_interview_id,
                    candidate_id: item.candidate_id,
                    name: item.create_by || "Unknown",
                    interviewer: item.assign_role ? item.assign_role.split(',') : [],
                    date: new Date(item.schedule_interview_date).toLocaleDateString('en-GB', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                    }),
                    time: new Date(`1970-01-01T${item.schedule_interview_time}`).toLocaleTimeString('en-US', { 
                        hour12: true, 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    }),
                    duration: item.schedule_interview_duration,
                    formInterviews: formInterviews,
                };
            });
            
            setDateShedule(transformedData);
        } catch (error) {
            console.error('Error fetching schedule interview:', error);
            toast.error('Failed to load schedule interviews');
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when tab becomes active
    useEffect(() => {
        if (isActive) {
            fetchScheduleData();
        }
    }, [isActive, candidate?.id, endpoint, token]);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            setDateShedule(data);
        }
    }, [data]);

    const handleSave = async () => {
        
        if (!form.date || !form.time || form.assign.length === 0 || !form.duration) {
            alert("Please fill all fields!");
            return;
        }

        try {
            const scheduleData = {
                candidate_id: candidate?.id || null,
                assign_role: form.assign.join(','),
                schedule_interview_date: form.date.toISOString().split('T')[0],
                schedule_interview_time: form.time.toLocaleTimeString('en-US', { 
                    hour12: false, 
                    hour: '2-digit', 
                    minute: '2-digit' 
                }), // Format: HH:mm
                schedule_interview_duration: form.duration,
                create_by: loginInfo?.employee?.name || "tidak dikenal"
            };
            const response = await apiPost(endpoint, '/schedule-interview', token, scheduleData);
            
            const dateStr = form.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
            const timeStr = form.time.toLocaleTimeString('en-US', { 
                hour12: true, 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            const newSchedule = {
                id: response?.data?.schedule_interview_id || response?.schedule_interview_id || Date.now(),
                schedule_interview_id: response?.data?.schedule_interview_id || response?.schedule_interview_id,
                name: loginInfo?.employee?.name || "You",
                interviewer: form.assign,
                date: dateStr,
                time: timeStr,
                duration: form.duration,
                formInterviews: []
            };
            
            setDateShedule(prev => [...prev, newSchedule]);
            setShowAdd(false);
            setForm({
                date: null,
                time: null,
                assign: [],
                duration: '',
            });
            
            toast.success('Interview schedule created successfully!');
        } catch (error) {
            toast.error('Failed to create interview schedule: ' + error.message);
        }
    };
    
    const handleEditDateSchedule = (scheduleId) => {
        const schedule = dateSchedule.find(s => s.id === scheduleId);

        if (schedule) {
            setEditingSchedule(schedule);
            
            let parsedDate = null;
            let parsedTime = null;
            
            try {
                parsedDate = dayjs(schedule.date, 'DD MMM YYYY');
                if (!parsedDate.isValid()) {
                    parsedDate = dayjs();
                }
                parsedDate = parsedDate.toDate();
            
                let timeString = schedule.time.trim();
                
                if (timeString.includes('AM') || timeString.includes('PM')) {
                    parsedTime = dayjs(`1970-01-01 ${timeString}`, 'YYYY-MM-DD hh:mm A');
                    if (!parsedTime.isValid()) {
                        const timeOnly = timeString.replace(/ (AM|PM)$/i, '');
                        parsedTime = dayjs(`1970-01-01 ${timeOnly}`, 'YYYY-MM-DD HH:mm');
                    }
                } else {
                    parsedTime = dayjs(`1970-01-01 ${timeString}`, 'YYYY-MM-DD HH:mm');
                }
                
                if (!parsedTime.isValid()) {
                    parsedTime = dayjs();
                }
                parsedTime = parsedTime.toDate();
                
            } catch (error) {
                console.error('Error parsing date/time:', error);
                parsedDate = new Date();
                parsedTime = new Date();
            }
            
            setForm({
                date: parsedDate,
                time: parsedTime,
                assign: Array.isArray(schedule.interviewer) ? schedule.interviewer : [schedule.interviewer],
                duration: schedule.duration
            });
            setShowEdit(true);
        }
    };

    const handleUpdateSchedule = async () => {
        if (!form.date || !form.time || form.assign.length === 0 || !form.duration) {
            alert("Please fill all fields!");
            return;
        }

        try {
            const scheduleData = {
                candidate_id: candidate?.id || null,
                assign_role: form.assign.join(','),
                schedule_interview_date: form.date.toISOString().split('T')[0],
                schedule_interview_time: form.time.toLocaleTimeString('en-US', { 
                    hour12: false, 
                    hour: '2-digit', 
                    minute: '2-digit' 
                }),
                schedule_interview_duration: form.duration,
                create_by: loginInfo?.employee?.name || "tidak dikenal"
            };

            // Gunakan schedule_interview_id dari API response
            const actualId = editingSchedule.schedule_interview_id || editingSchedule.id;
            await apiPatch(endpoint, `/schedule-interview/${actualId}`, token, scheduleData);
            
            // Update local state
            const dateStr = form.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
            const timeStr = form.time.toLocaleTimeString('en-US', { 
                hour12: true, 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            setDateShedule(prev => prev.map(schedule => 
                schedule.id === editingSchedule.id 
                    ? {
                        ...schedule,
                        interviewer: form.assign,
                        date: dateStr,
                        time: timeStr,
                        duration: form.duration
                    }
                    : schedule
            ));
            
            setShowEdit(false);
            setEditingSchedule(null);
            setForm({
                date: null,
                time: null,
                assign: [],
                duration: '',
            });
            
            toast.success('Interview schedule updated successfully!');
        } catch (error) {
            toast.error('Failed to update interview schedule: ' + error.message);
        }
    };

    const handleDeleteDateSchedule = (scheduleId) => {
        const schedule = dateSchedule.find(s => s.id === scheduleId);
        if (schedule) {
            setDeletingSchedule(schedule);
            setShowDeleteConfirm(true);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            // Gunakan schedule_interview_id dari API response  
            const actualId = deletingSchedule.schedule_interview_id || deletingSchedule.id;
            await apiDelete(endpoint, `/schedule-interview/${actualId}`, token);
            
            // Remove from local state
            setDateShedule(prev => prev.filter(schedule => schedule.id !== deletingSchedule.id));

            setShowDeleteConfirm(false);
            setDeletingSchedule(null);
            
            toast.success('Interview schedule deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete interview schedule: ' + error.message);
        }
    };

    const toggleExpand = (schedule) => {
        setExpandedSchedules(prev => ({
            ...prev,
            [schedule.id]: !prev[schedule.id]
        }));
    };

    const handleCreateFormInterview = (schedule) => {
        setItemSchedule(schedule);
        setSelectedScheduleId(schedule.id);
        setShowFormInterview(true);
    };

    const handleFormInterviewSave = (formData) => {
        // Update the specific schedule with new form interview
        setDateShedule(prev => prev.map(schedule => {
            if (schedule.id === selectedScheduleId) {
                return {
                    ...schedule,
                    formInterviews: [...(schedule.formInterviews || []), {
                        id: Date.now(),
                        ...formData,
                        createdAt: new Date().toISOString()
                    }]
                };
            }
            return schedule;
        }));
        
        setShowFormInterview(false);
        setSelectedScheduleId(null);
        toast.success('Form interview created successfully!');
    };

    const handleCloseFormInterview = () => {
        setShowFormInterview(false);
        setSelectedScheduleId(null);
        setItemSchedule(null);
    };

    const handleDeleteFormInterview = (form, scheduleId) => {
        setDeletingForm({ formData: form, scheduleId: scheduleId });
        setShowDeleteFormConfirm(true);
    };

    const handleConfirmDeleteForm = async () => {
        const params = {
            deleteBy: loginInfo?.employee?.name || "tidak dikenal",
            permissionName: 'delete',
            menuName: 'interview',
            systemName: 'interview'
        };
        try {
            // Gunakan interview_id untuk delete
            const interviewId = deletingForm.formData.interview_id;
            await apiDelete(endpoint, `/interview/${interviewId}`, token, {
                params: params
            });
            
            // Remove from local state
            setDateShedule(prev => prev.map(schedule => {
                if (schedule.id === deletingForm.scheduleId) {
                    return {
                        ...schedule,
                        formInterviews: (schedule.formInterviews || []).filter(
                            form => form.interview_id !== interviewId
                        )
                    };
                }
                return schedule;
            }));

            setShowDeleteFormConfirm(false);
            setDeletingForm(null);
            
            toast.success('Form interview deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete form interview: ' + error.message);
        }
    };
    
    if (loading) {
        return <AnimatedLoadingSpinner text={'schedule interviews'} />;
    }
    
    return(<>
        <Button onClick={() => setShowAdd(true)} className='rounded-1 mt-4 w-100 font-primary fs-6'><RiCalendarScheduleFill className='ms-2' /> Add Date of Interview</Button>
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

            <Popup
                show={showEdit}
                title={"Edit Date of Interview"}
                size={'md'}
                onHide={() => {
                    setShowEdit(false);
                    setEditingSchedule(null);
                    setForm({
                        date: null,
                        time: null,
                        assign: [],
                        duration: '',
                    });
                }}
                onConfirm={handleUpdateSchedule}
                titleConfirm={"Update"}
            >
                <AddSchduleInterview 
                    form={form}
                    setForm={setForm}
                />
            </Popup>

            <Popup
                show={showDeleteConfirm}
                title={"Delete Interview Schedule"}
                size={'md'}
                onHide={() => {
                    setShowDeleteConfirm(false);
                    setDeletingSchedule(null);
                }}
                onConfirm={handleConfirmDelete}
                titleConfirm={"Delete"}
                variant="danger"
            >
                <p>Are you sure you want to delete this interview schedule?</p>
                <p className="text-muted">This action cannot be undone.</p>
            </Popup>

            <Popup
                show={showDeleteFormConfirm}
                title={"Delete Form Interview"}
                size={'md'}
                onHide={() => {
                    setShowDeleteFormConfirm(false);
                    setDeletingForm(null);
                }}
                onConfirm={handleConfirmDeleteForm}
                titleConfirm={"Delete"}
                variant="danger"
            >
                <p>Are you sure you want to delete this form interview?</p>
                <p className="text-muted">This action cannot be undone.</p>
            </Popup>

            <CanvasFormInterview
                show={showFormInterview} 
                onHide={handleCloseFormInterview}
                selectedCandidate={candidate}
                system={system}
                itemSchedule={itemSchedule}
                endpoint={endpoint}
                token={token}
                loginInfo={loginInfo}
                onSaveSuccess={() => {
                    // Callback setelah save berhasil
                    console.log('Form interview saved successfully');
                }}
            />

            <ListDateInterview 
                data={dateSchedule} 
                onEdit={handleEditDateSchedule}
                onDelete={handleDeleteDateSchedule}
                onToggleExpand={toggleExpand}
                expandedSchedules={expandedSchedules}
                onCreateFormInterview={handleCreateFormInterview}
                onDeleteFormInterview={handleDeleteFormInterview}
            />
        </div>
    </>)
}

const ListDateInterview = ({ 
    data,
    onEdit,
    onDelete,
    onToggleExpand,
    expandedSchedules,
    onCreateFormInterview,
    onDeleteFormInterview
}) => {
    return(
        <div className="card-body">
            <div className="table-responsive">
                <Table bordered={false} className="mb-0">
                    <thead>
                        <tr>
                            <th>Created by</th>
                            <th>Assigned</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(!data || !Array.isArray(data) || data.length === 0) ? (
                            <tr className="mt-4">
                                <td colSpan={4} className='text-center py-4'>No Date Interview.</td>
                            </tr>
                        ) : (
                            data.map((ref, idx) => (
                                <React.Fragment key={idx}>
                                    <tr>
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
                                    <td>
                                        <button 
                                            onClick={() => onEdit(ref.id)}
                                            className="btn btn-sm btn-transparent me-2"
                                            title="Edit Schedule"
                                        >
                                            <FaRegPenToSquare />
                                        </button>
                                        <button 
                                            onClick={() => onCreateFormInterview(ref)}
                                            className="btn btn-sm btn-transparent me-2"
                                            title="Create Form Interview"
                                        >
                                            <FaPlus />
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-transparent me-2"
                                            onClick={() => onDelete(ref.id)}
                                            title="Delete Schedule"
                                        >
                                            <FaRegTrashCan />
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-transparent"
                                            onClick={() => onToggleExpand(ref)}
                                            title={expandedSchedules[ref.id] ? "Collapse" : "Expand"}
                                        >
                                            {expandedSchedules[ref.id] ? <FaChevronUp /> : <FaChevronDown />}
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={4} className="p-0">
                                        <Collapse in={expandedSchedules[ref.id]}>
                                            <div className="px-3 py-2 bg-light">
                                                <FormInterviewList 
                                                    formInterviews={ref.formInterviews || []}
                                                    scheduleId={ref.id}
                                                    onDeleteFormInterview={onDeleteFormInterview}
                                                />
                                            </div>
                                        </Collapse>
                                    </td>
                                </tr>
                            </React.Fragment>
                            ))
                    )}
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
                        dateFormat="HH:mm"
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

const FormInterviewList = ({ formInterviews, scheduleId, onDeleteFormInterview }) => {

    const getFormStatus = (formData) => {
        if (!formData.interview || !Array.isArray(formData.interview) || formData.interview.length === 0) {
            return 'draft';
        }
        
        const hasEmptyFields = formData.interview.some(item => 
            !item.answer || item.answer.trim() === '' ||
            !item.question || item.question.trim() === '' ||
            item.score === null || item.score === undefined || item.score === ''
        );
        
        if (hasEmptyFields) {
            return 'incomplete';
        } else {
            return 'completed';
        }
    };
    
    if (!formInterviews || formInterviews.length === 0) {
        return (
            <div className="text-center py-3 text-muted">
                <small>No form interviews created yet</small>
            </div>
        );
    }

    return (
        <Row className="row">
            {formInterviews.map((form, idx) => {
                const status = getFormStatus(form);
                const totalQuestions = form.interview ? form.interview.length : 0;
                const answeredQuestions = form.interview ? form.interview.filter(item => 
                    item.answer && item.answer.trim() !== ''
                ).length : 0;
                
                return (
                    <div key={idx} className="col-md-6 mb-3">
                        <div className="card border">
                            <div className="card-body p-3">
                                <h6 className="card-title mb-2 font-primary-bold fw-normal">
                                    {form.assigned_name || `Form Interview ${idx + 1}`}
                                </h6>
                                <p className="card-text small mb-1 fs-14">
                                    Interviewer : 
                                    <Badge bg="light" text="dark" className="ms-1">
                                        {form.assigned_role_alias || 'Not specified'}
                                    </Badge>
                                </p>
                                <p className="card-text small mb-1 fs-14">
                                    Questions : {totalQuestions} ({answeredQuestions} answered)
                                </p>
                                <p className="card-text small mb-1 fs-14">
                                    Status : <Badge bg={getBadgeVariant(status)}>{status}</Badge>
                                </p>
                                {form.interview && form.interview.length > 0 && (
                                    <p className="card-text small mb-1 fs-14">
                                        Company Values : 
                                        {[...new Set(form.interview.map(item => item.company_value))].map((value, valueIdx) => (
                                            <Badge key={valueIdx} bg="info" className="ms-1">
                                                {value}
                                            </Badge>
                                        ))}
                                    </p>
                                )}
                                <div className="d-flex gap-2 mt-3">
                                    <button className="btn fs-12 btn-sm btn-outline-secondary">
                                        <FaRegPenToSquare className='fs-6' /> Edit
                                    </button>
                                    <button className="fs-12 btn btn-sm btn-outline-secondary">
                                        <FaChartSimple className='fs-6' /> Score
                                    </button>
                                    <button className="fs-12 btn btn-sm btn-outline-secondary">
                                        <FaRegFilePdf className='fs-6' /> PDF
                                    </button>
                                    <button 
                                        className="fs-12 btn btn-sm btn-outline-danger"
                                        onClick={() => onDeleteFormInterview(form, scheduleId)}
                                        title="Delete Form Interview"
                                    >
                                        <FaRegTrashCan className='fs-6' /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </Row>
    );
};
