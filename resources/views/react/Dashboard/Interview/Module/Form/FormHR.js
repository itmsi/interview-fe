import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Container, Accordion, FloatingLabel, Tabs, Tab } from 'react-bootstrap';
import styled from 'styled-components';
import { apiPost } from '../../../Helper/Helper';
import { toast } from 'react-toastify';

const POINT_OPTIONS = [
    { value: '', label: 'Select Specific point' },
    { value: '5', label: 'Excellent' },
    { value: '4', label: 'Good' },
    { value: '3', label: 'Average' },
    { value: '2', label: 'Poor' },
    { value: '1', label: 'Very Poor' },
];
export const FormHR = ({ 
    itemSchedule,
    endpoint,
    token,
    loginInfo,
    status = "hr",
    onSaveSuccess,
    system,
    editingFormData,
    isEditMode
}) => {
    const SIAH_ASPECTS = [
        { key: 'sincerity', label: 'Sincerity' },
        { key: 'trustworthy', label: 'Trustworthy' },
        { key: 'altruism', label: 'Altruism' },
        { key: 'humble', label: 'Humble' },
    ];
    const VALUE_ASPECTS = [
        { key: 'giving_meaning', label: 'Giving Meaning' },
        { key: 'love_to_learn', label: 'Love to learn' },
        { key: 'happy_practice', label: 'Happy practice' },
        { key: 'like_innovation', label: 'Like innovation' },
        { key: 'happy_to_share', label: 'Happy to share' },
        { key: 'embrace_failure', label: 'Embrace failure' },
        { key: 'habit_of_excellence', label: 'Habit of excellence' },
    ];
    const CSE_ASPECTS = [
        { key: 'giving_meaning', label: 'Self Esteem' },
        { key: 'love_to_learn', label: 'Self Efficacy' },
        { key: 'happy_practice', label: 'Locus of control' },
        { key: 'like_innovation', label: 'Emotional Stability' }
    ];
    const SDT_ASPECTS = [
        { key: 'l2', label: 'L2 (External Regulation – Driven by rewards or punishments ( not ideal)' },
        { key: 'l3', label: 'L3 (Self - Involment and focus on self and other evaluation)' },
        { key: 'l4', label: 'L4 (I personally think it is important and consciously give it meaning)' },
        { key: 'l5', label: 'L5 (Consistency self-integration of goals)' },
        { key: 'l6', label: 'L6 (Interest, happiness, self-satisfaction)' }
    ];

    const [formSiah, setFormSiah] = useState(
    SIAH_ASPECTS.reduce((acc, aspect) => ({
            ...acc,
            [aspect.key]: { point: '', question: '', remark: '' }
        }), {})
    );
    const [formValues, setFormValues] = useState(
    VALUE_ASPECTS.reduce((acc, aspect) => ({
            ...acc,
            [aspect.key]: { point: '', question: '', remark: '' }
        }), {})
    );

    const [formCSE, setFormCSE] = useState(
    CSE_ASPECTS.reduce((acc, aspect) => ({
            ...acc,
            [aspect.key]: { point: '', question: '', remark: '' }
        }), {})
    );
    const [formSDT, setFormSDT] = useState(
    SDT_ASPECTS.reduce((acc, aspect) => ({
            ...acc,
            [aspect.key]: { point: '', question: '', remark: '' }
        }), {})
    );

    // Helper function to initialize form data from editing data
    const initializeFormFromEdit = (editData, aspects, setFormFunction) => {
        if (!editData || !editData.interview) return;
        
        const initializedForm = aspects.reduce((acc, aspect) => {
            // More specific matching logic for each aspect
            const matchingItem = editData.interview.find(item => {
                if (!item.aspect) return false;
                
                // Exact aspect matching - case insensitive
                const itemAspect = item.aspect.toLowerCase().trim();
                const aspectLabel = aspect.label.toLowerCase().trim();
                
                // Direct match first
                if (itemAspect === aspectLabel) return true;
                
                // Specific matching for different company values
                if (item.company_value === 'SIAH') {
                    return (
                        (aspectLabel === 'sincerity' && itemAspect.includes('sincerity')) ||
                        (aspectLabel === 'trustworthy' && itemAspect.includes('trustworthy')) ||
                        (aspectLabel === 'altruism' && itemAspect.includes('altruism')) ||
                        (aspectLabel === 'humble' && itemAspect.includes('humble'))
                    );
                }
                
                if (item.company_value === 'CSE') {
                    return (
                        (aspectLabel === 'self esteem' && itemAspect.includes('self esteem')) ||
                        (aspectLabel === 'self efficacy' && itemAspect.includes('self efficacy')) ||
                        (aspectLabel === 'locus of control' && itemAspect.includes('locus of control')) ||
                        (aspectLabel === 'emotional stability' && itemAspect.includes('emotional stability'))
                    );
                }
                
                if (item.company_value === 'SDT') {
                    return (
                        (aspectLabel.includes('l2') && itemAspect.includes('l2')) ||
                        (aspectLabel.includes('l3') && itemAspect.includes('l3')) ||
                        (aspectLabel.includes('l4') && itemAspect.includes('l4')) ||
                        (aspectLabel.includes('l5') && itemAspect.includes('l5')) ||
                        (aspectLabel.includes('l6') && itemAspect.includes('l6'))
                    );
                }
                
                if (item.company_value === '7 Values' || item.company_value === 'VALUE') {
                    return (
                        (aspectLabel === 'giving meaning' && itemAspect.includes('giving meaning')) ||
                        (aspectLabel === 'love to learn' && itemAspect.includes('love to learn')) ||
                        (aspectLabel === 'happy practice' && itemAspect.includes('happy practice')) ||
                        (aspectLabel === 'like innovation' && itemAspect.includes('like innovation')) ||
                        (aspectLabel === 'happy to share' && itemAspect.includes('happy to share')) ||
                        (aspectLabel === 'embrace failure' && itemAspect.includes('embrace failure')) ||
                        (aspectLabel === 'habit of excellence' && itemAspect.includes('habit of excellence'))
                    );
                }
                
                return false;
            });
            
            return {
                ...acc,
                [aspect.key]: {
                    point: matchingItem ? matchingItem.score.toString() : '',
                    question: matchingItem ? matchingItem.question : '',
                    remark: matchingItem ? matchingItem.answer : ''
                }
            };
        }, {});
        
        setFormFunction(initializedForm);
    };

    // Effect to handle edit mode initialization
    useEffect(() => {
        if (isEditMode && editingFormData) {
            // Determine which form to initialize based on company values in the data
            const companyValues = editingFormData.interview?.map(item => item.company_value) || [];
            
            if (companyValues.includes('SIAH')) {
                initializeFormFromEdit(editingFormData, SIAH_ASPECTS, setFormSiah);
            }
            if (companyValues.includes('7 Values')) {
                initializeFormFromEdit(editingFormData, VALUE_ASPECTS, setFormValues);
            }
            if (companyValues.includes('CSE')) {
                initializeFormFromEdit(editingFormData, CSE_ASPECTS, setFormCSE);
            }
            if (companyValues.includes('SDT')) {
                initializeFormFromEdit(editingFormData, SDT_ASPECTS, setFormSDT);
            }
        }
    }, [isEditMode, editingFormData]);

    const getTotalPoint = (form, aspects) => {
        return aspects.reduce((sum, aspect) => {
            const val = parseInt(form[aspect.key]?.point, 10);
            return sum + (isNaN(val) ? 0 : val);
        }, 0);
    };

    const totalPointSIAH = getTotalPoint(formSiah, SIAH_ASPECTS);
    const totalPointVALUE = getTotalPoint(formValues, VALUE_ASPECTS);
    const totalPointCSE = getTotalPoint(formCSE, CSE_ASPECTS);
    const totalPointSDT = getTotalPoint(formSDT, SDT_ASPECTS);

    return (
        <Tabs
            defaultActiveKey={`${status === 'hr' ? 'siah' : 'cse' }`}
            className="mt-4 tab-question"
        >
            {status === 'hr' && (
                <Tab eventKey="siah" title="SIAH">
                    <QuestionSIAH 
                        form={formSiah}
                        setForm={setFormSiah}
                        titleForm={"SIAH"}
                        interview_aspects={SIAH_ASPECTS}
                        itemSchedule={itemSchedule}
                        endpoint={endpoint}
                        token={token}
                        loginInfo={loginInfo}
                        onSaveSuccess={onSaveSuccess}
                        system={system}
                        isEditMode={isEditMode}
                        editingFormData={editingFormData}
                    />
                </Tab>
            )}
            {status === 'hr' && (
                <Tab eventKey="values" title="7 Values">
                    <QuestionSIAH 
                        form={formValues}
                        setForm={setFormValues}
                        titleForm={"7 Values"}
                        interview_aspects={VALUE_ASPECTS}
                        itemSchedule={itemSchedule}
                        endpoint={endpoint}
                        token={token}
                        loginInfo={loginInfo}
                        onSaveSuccess={onSaveSuccess}
                        system={system}
                        isEditMode={isEditMode}
                        editingFormData={editingFormData}
                    />
                </Tab>
            )}
            <Tab eventKey="cse" title="CSE">
                <QuestionSIAH 
                    form={formCSE}
                    setForm={setFormCSE}
                    titleForm={"CSE"}
                    interview_aspects={CSE_ASPECTS}
                    itemSchedule={itemSchedule}
                    endpoint={endpoint}
                    token={token}
                    loginInfo={loginInfo}
                    onSaveSuccess={onSaveSuccess}
                    system={system}
                    isEditMode={isEditMode}
                    editingFormData={editingFormData}
                />
            </Tab>
            <Tab eventKey="sdt" title="SDT">
                <QuestionSIAH 
                    form={formSDT}
                    setForm={setFormSDT}
                    titleForm={"SDT"}
                    interview_aspects={SDT_ASPECTS}
                    itemSchedule={itemSchedule}
                    endpoint={endpoint}
                    token={token}
                    loginInfo={loginInfo}
                    onSaveSuccess={onSaveSuccess}
                    system={system}
                    isEditMode={isEditMode}
                    editingFormData={editingFormData}
                />
            </Tab>
        </Tabs>
    );
};
const QuestionSIAH = ({ 
    form,
    setForm,
    titleForm, 
    interview_aspects,
    itemSchedule,
    endpoint,
    token,
    loginInfo,
    onSaveSuccess,
    system,
    isEditMode,
    editingFormData
}) => {
    const [isSubmit, setIsSubmit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [activeAccordion, setActiveAccordion] = useState([interview_aspects[0].key]);

    const handleChange = (aspectKey, field, value) => {
        setForm(prev => ({
            ...prev,
            [aspectKey]: {
                ...prev[aspectKey],
                [field]: value
            }
        }));
        if (field === 'question') {
            setErrors(prev => ({ ...prev, [aspectKey]: false }));
        }
    };

    const handleAccordionToggle = (eventKey) => {
        setActiveAccordion(prev =>
            prev.includes(eventKey)
                ? prev.filter(key => key !== eventKey)
                : [...prev, eventKey]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        let allFilled = true;
        let errorKeys = [];
        
        interview_aspects.forEach(aspect => {
            if (!form[aspect.key].question.trim()) {
                newErrors[aspect.key] = true;
                allFilled = false;
                errorKeys.push(aspect.key);
            }
        });
        
        setErrors(newErrors);

        // Buka semua accordion yang error
        if (!allFilled) {
            setActiveAccordion(prev => Array.from(new Set([...prev, ...errorKeys])));
            // Scroll ke accordion pertama yang error
            if (errorKeys.length > 0) {
                const el = document.getElementById(`${errorKeys[0]}Question`);
                if (el) el.focus();
            }
            return;
        }

        try {
            setIsLoading(true);
            
                // Create mode - original logic
                const postData = {
                    schedule_interview_id: itemSchedule?.id || itemSchedule?.schedule_interview_id,
                    interviews: [{
                        company_value: titleForm,
                        comment: "tidak ada komentar",
                        detail_interviews: interview_aspects.map(aspect => ({
                            aspect: aspect.label,
                            question: form[aspect.key].question,
                            answer: form[aspect.key].remark,
                            score: parseInt(form[aspect.key].point) || 0,
                        }))
                    }],
                    assigneds: [
                        {
                            cum_id: loginInfo?.employee?.id || loginInfo?.id,
                            assigned_name: loginInfo?.employee?.name || loginInfo?.name || "Unknown",
                            assigned_email: loginInfo?.employee?.email || loginInfo?.email || "",
                            assigned_role: system?.roles?.[0]?.role_name || 'role_name',
                            assigned_role_alias: system?.roles?.[0]?.role_slug || 'role_slug'
                        }
                    ]
                };
                
                const response = await apiPost(
                    endpoint, 
                    '/interview/batch-upsert', 
                    token, 
                    postData
                );

                toast.success(`${titleForm} form submitted successfully!`);
            

            setIsSubmit(true);
            
            // Panggil callback untuk menutup offcanvas
            if (onSaveSuccess) {
                onSaveSuccess();
            }
            
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(`Failed to submit ${titleForm} form: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <StyledQuestion fluid className='pt-4'>
            <Row>
                <Form onSubmit={handleSubmit}>
                    <Accordion activeKey={activeAccordion} alwaysOpen onSelect={handleAccordionToggle}>
                        {interview_aspects.map(aspect => (
                            <Accordion.Item eventKey={aspect.key} key={aspect.key}>
                                <Accordion.Header
                                    onClick={() =>
                                        setActiveAccordion(prev =>
                                            prev.includes(aspect.key)
                                                ? prev.filter(key => key !== aspect.key)
                                                : [...prev, aspect.key]
                                        )
                                    }
                                >
                                    {aspect.label}
                                    {errors[aspect.key] && (
                                        <span style={{ color: 'red', marginLeft: 8, fontSize: 14 }}>
                                            • Required
                                        </span>
                                    )}
                                </Accordion.Header>
                                <Accordion.Body>
                                    <FloatingLabel controlId={`${aspect.key}Point`} label="Specific point" className="mb-3 fs-14">
                                        <Form.Select
                                            value={form[aspect.key].point}
                                            onChange={e => handleChange(aspect.key, 'point', e.target.value)}
                                        >
                                            {POINT_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </Form.Select>
                                    </FloatingLabel>
                                    <Row className='gx-3 col-rows-span-2'>
                                        <Col>
                                            <FloatingLabel
                                                className='col-12 fs-14'
                                                controlId={`${aspect.key}Question`}
                                                label="Question"
                                            >
                                                <Form.Control
                                                    as="textarea"
                                                    placeholder="Question"
                                                    style={{ height: '120px' }}
                                                    value={form[aspect.key].question}
                                                    onChange={e => handleChange(aspect.key, 'question', e.target.value)}
                                                    isInvalid={!!errors[aspect.key]}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Question is required.
                                                </Form.Control.Feedback>
                                            </FloatingLabel>
                                        </Col>
                                        <Col>
                                            <FloatingLabel
                                                className='col-12'
                                                controlId={`${aspect.key}Remark`}
                                                label="Remark"
                                            >
                                                <Form.Control
                                                    as="textarea"
                                                    placeholder="Remark"
                                                    style={{ height: '120px' }}
                                                    value={form[aspect.key].remark}
                                                    onChange={e => handleChange(aspect.key, 'remark', e.target.value)}
                                                />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                    <div className="mt-4">
                        <Button 
                            type="submit" 
                            variant="success" 
                            disabled={isLoading}
                        >
                            {isLoading 
                                ? (isEditMode ? 'Updating...' : 'Saving...') 
                                : (isEditMode ? `Update ${titleForm}` : `Save ${titleForm}`)
                            }
                        </Button>
                        {isSubmit && 
                            <Button type="button" variant="success" className="ms-2">
                                Show Result {titleForm}
                            </Button>
                        }
                    </div>
                </Form>
            </Row>
        </StyledQuestion>
    );
}

const StyledQuestion = styled(Container) `
    --bs-accordion-body-padding-y:1.25rem;
    --bs-accordion-inner-border-radius: 10px;
    background-color: #f5f5f5;
    
    .title {
        letter-spacing: .03rem;
        font-weight: bold;
        font-size: 2.5rem;
        border-bottom: solid 1px #ddd;
        padding: 1rem 0;
        margin-bottom: 1.5rem;
        line-height: 1;
    }
    .form-select {
        font-size: 14px;
    }
    .accordion-button {
        border-radius: var(--bs-accordion-inner-border-radius);
        overflow: hidden;
        font-family: var(--font-main);
        &:not(.collapsed) {
            background-color: #e5edf6;
            box-shadow: 0px 4px 10px -5px #ababab;
        }
    }
    .accordion-item {
        border:0;
        margin-bottom: 1rem;
        background-color: transparent;
    }
    .accordion-collapse {
        margin: 1rem 0 1.7rem;
        border-radius: var(--bs-accordion-inner-border-radius);
        background: #e5edf6;
    }
`