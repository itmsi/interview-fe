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
    onClose,
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
    const EXPERIENCE_ASPECTS = [
        { key: 'role_matching', label: 'Role Matching' },
        { key: 'product_knowledge', label: 'Product Knowledge' },
        { key: 'significant_contribution', label: 'Significant Contribution' },
        { key: 'goals_align_with_roe', label: 'Goals align with ROE Company' },
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
    const [formExperience, setFormExperience] = useState(
    EXPERIENCE_ASPECTS.reduce((acc, aspect) => ({
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

                if (item.company_value === 'EXPERIENCE') {
                    return (
                        (aspectLabel === 'Role Matching' && itemAspect.includes('Role Matching')) ||
                        (aspectLabel === 'Product Knowledge' && itemAspect.includes('Product Knowledge')) ||
                        (aspectLabel === 'Significant Contribution' && itemAspect.includes('Significant Contribution')) ||
                        (aspectLabel === 'Goals Align with Role' && itemAspect.includes('Goals Align with Role'))
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
            if (companyValues.includes('EXPERIENCE')) {
                initializeFormFromEdit(editingFormData, EXPERIENCE_ASPECTS, setFormExperience);
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
                        caption={"Assess the employee's sincerity, trustworthiness, altruism, and humility."}
                        interview_aspects={SIAH_ASPECTS}
                        itemSchedule={itemSchedule}
                        endpoint={endpoint}
                        token={token}
                        loginInfo={loginInfo}
                        onSaveSuccess={onSaveSuccess}
                        onClose={onClose}
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
                        caption={"Evaluate the employee's alignment with the company's core values."}
                        interview_aspects={VALUE_ASPECTS}
                        itemSchedule={itemSchedule}
                        endpoint={endpoint}
                        token={token}
                        loginInfo={loginInfo}
                        onSaveSuccess={onSaveSuccess}
                        onClose={onClose}
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
                    caption={"Assess the employee's core self-evaluation traits."}
                    interview_aspects={CSE_ASPECTS}
                    itemSchedule={itemSchedule}
                    endpoint={endpoint}
                    token={token}
                    loginInfo={loginInfo}
                    onSaveSuccess={onSaveSuccess}
                    onClose={onClose}
                    system={system}
                    isEditMode={isEditMode}
                    editingFormData={editingFormData}
                />
            </Tab>
            <Tab eventKey="sdt" title="SDT">
                <QuestionSDT 
                    form={formSDT}
                    setForm={setFormSDT}
                    titleForm={"SDT"}
                    caption={"Assess the employee's motivation and self-determination."}
                    interview_aspects={SDT_ASPECTS}
                    itemSchedule={itemSchedule}
                    endpoint={endpoint}
                    token={token}
                    loginInfo={loginInfo}
                    onSaveSuccess={onSaveSuccess}
                    onClose={onClose}
                    system={system}
                    isEditMode={isEditMode}
                    editingFormData={editingFormData}
                />
            </Tab>
            <Tab eventKey="experience" title="EXPERIENCE">
                <QuestionSIAH 
                    form={formExperience}
                    setForm={setFormExperience}
                    titleForm={"EXPERIENCE"}
                    caption={"Evaluate the employee's experience, role fit, and contributions."}
                    interview_aspects={EXPERIENCE_ASPECTS}
                    itemSchedule={itemSchedule}
                    endpoint={endpoint}
                    token={token}
                    loginInfo={loginInfo}
                    onSaveSuccess={onSaveSuccess}
                    onClose={onClose}
                    system={system}
                    isEditMode={isEditMode}
                    editingFormData={editingFormData}
                />
            </Tab>
        </Tabs>
    );
}

const QuestionSDT = ({ 
    form,
    setForm,
    titleForm, 
    caption,
    interview_aspects,
    itemSchedule,
    endpoint,
    token,
    loginInfo,
    onSaveSuccess,
    onClose,
    system,
    isEditMode,
    editingFormData
}) => {
    const [isSubmit, setIsSubmit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedAspect, setSelectedAspect] = useState('');

    // SDT Point mapping based on aspect
    const getSDTPoint = (aspectKey) => {
        const pointMapping = {
            'l2': 20,
            'l3': 25,
            'l4': 30,
            'l5': 35,
            'l6': 40
        };
        return pointMapping[aspectKey] || 0;
    };

    // Initialize data from editing mode or from form prop
    useEffect(() => {
        if (isEditMode && editingFormData && editingFormData.interview) {
            const sdtData = editingFormData.interview.find(item => item.company_value === 'SDT');
            if (sdtData && !selectedAspect) { // Only set if selectedAspect is empty
                // Find the matching aspect
                const matchingAspect = interview_aspects.find(aspect => {
                    const aspectLabel = aspect.label.toLowerCase();
                    const itemAspect = sdtData.aspect.toLowerCase();
                    
                    // Check if aspect contains the L level identifier
                    if (aspectLabel.includes('l2') && itemAspect.includes('l2')) return true;
                    if (aspectLabel.includes('l3') && itemAspect.includes('l3')) return true;
                    if (aspectLabel.includes('l4') && itemAspect.includes('l4')) return true;
                    if (aspectLabel.includes('l5') && itemAspect.includes('l5')) return true;
                    if (aspectLabel.includes('l6') && itemAspect.includes('l6')) return true;
                    
                    return aspectLabel.includes(itemAspect) || itemAspect.includes(aspectLabel);
                });
                
                if (matchingAspect) {
                    setSelectedAspect(matchingAspect.key);
                    // Update form data
                    setForm(prev => ({
                        ...prev,
                        [matchingAspect.key]: {
                            point: getSDTPoint(matchingAspect.key).toString(),
                            question: sdtData.question || '',
                            remark: sdtData.answer || ''
                        }
                    }));
                }
            }
        }
    }, [isEditMode, editingFormData, interview_aspects]); // Removed selectedAspect from dependencies

    const handleAspectChange = (aspectKey) => {
        setSelectedAspect(aspectKey);
        setErrors(prev => ({ ...prev, aspect: false }));
        
        // Auto-set point based on selected aspect
        if (aspectKey) {
            const pointValue = getSDTPoint(aspectKey);
            
            // In edit mode, preserve existing data if changing to a different aspect
            // In create mode or when changing aspect, reset to default values
            const existingData = form[aspectKey] || {};
            
            setForm(prev => ({
                ...prev,
                [aspectKey]: {
                    point: pointValue.toString(),
                    question: existingData.question || '',
                    remark: existingData.remark || ''
                }
            }));
        }
    };

    const handleFieldChange = (field, value) => {
        if (selectedAspect) {
            setForm(prev => ({
                ...prev,
                [selectedAspect]: {
                    ...prev[selectedAspect],
                    [field]: value
                }
            }));
        }
        if (field === 'question') {
            setErrors(prev => ({ ...prev, question: false }));
        }
    };

    // Get current data from form state
    const currentData = selectedAspect ? form[selectedAspect] : { point: '', question: '', remark: '' };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        let hasErrors = false;
        
        if (!selectedAspect) {
            newErrors.aspect = true;
            hasErrors = true;
        }
        
        if (!currentData.question?.trim()) {
            newErrors.question = true;
            hasErrors = true;
        }
        
        setErrors(newErrors);

        if (hasErrors) {
            if (!selectedAspect) {
                document.getElementById('sdtAspectSelect')?.focus();
            } else if (!currentData.question?.trim()) {
                document.getElementById('sdtQuestion')?.focus();
            }
            return;
        }

        try {
            setIsLoading(true);
            
            const selectedAspectData = interview_aspects.find(aspect => aspect.key === selectedAspect);
            
            const postData = {
                schedule_interview_id: itemSchedule?.id || itemSchedule?.schedule_interview_id,
                interviews: [{
                    company_value: titleForm,
                    comment: "tidak ada komentar",
                    detail_interviews: [{
                        aspect: selectedAspectData.label,
                        question: currentData.question,
                        answer: currentData.remark,
                        score: parseInt(currentData.point) || 0,
                    }]
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
            
            // Don't close canvas after save - just call success callback for refresh
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
                    <div className="mb-4">
                        <div className="mb-3">
                            <h5 className="mb-1 text-primary fw-bold">{titleForm} Assessment</h5>
                            <p>{caption}</p>
                        </div>
                        
                        {/* SDT Aspect Dropdown */}
                        <FloatingLabel controlId="sdtAspectSelect" label="Select SDT Aspect" className="mb-3 fs-14">
                            <Form.Select
                                value={selectedAspect}
                                onChange={e => handleAspectChange(e.target.value)}
                                isInvalid={!!errors.aspect}
                            >
                                <option value="">Choose SDT Aspect...</option>
                                {interview_aspects.map(aspect => (
                                    <option key={aspect.key} value={aspect.key}>
                                        {aspect.label}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Please select an SDT aspect.
                            </Form.Control.Feedback>
                        </FloatingLabel>

                        {/* Question and Remark Fields */}
                        <Row className='gx-3'>
                            <Col lg={1}>
                                <FloatingLabel
                                    className='col-12 fs-14 h-100'
                                    controlId="sdtPointDisplay"
                                    label="Point"
                                >
                                    <Form.Control
                                        type="text"
                                        placeholder="Point"
                                        value={currentData.point || ''}
                                        readOnly
                                        disabled={!selectedAspect}
                                        className='h-100 fs-4'
                                        style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col>
                                <FloatingLabel
                                    className='col-12 fs-14'
                                    controlId="sdtQuestion"
                                    label="Question"
                                >
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Question"
                                        style={{ height: '120px' }}
                                        value={currentData.question || ''}
                                        onChange={e => handleFieldChange('question', e.target.value)}
                                        isInvalid={!!errors.question}
                                        disabled={!selectedAspect}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Question is required.
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Col>
                            <Col>
                                <FloatingLabel
                                    className='col-12'
                                    controlId="sdtRemark"
                                    label="Remark"
                                >
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Remark"
                                        style={{ height: '120px' }}
                                        value={currentData.remark || ''}
                                        onChange={e => handleFieldChange('remark', e.target.value)}
                                        disabled={!selectedAspect}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>
                    </div>

                    <div className="my-4">
                        <Button 
                            type="button" 
                            variant="outline-secondary" 
                            onClick={onClose}
                            className='fs-6 font-primary py-2 px-4 me-3'
                        >
                            Back
                        </Button>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            disabled={isLoading || !selectedAspect}
                            className='fs-6 font-primary py-2 px-5'
                        >
                            {isLoading 
                                ? (isEditMode ? 'Updating...' : 'Saving...') 
                                : (isEditMode ? `Update ${titleForm}` : `Save ${titleForm}`)
                            }
                        </Button>
                    </div>
                </Form>
            </Row>
        </StyledQuestion>
    );
};
const QuestionSIAH = ({ 
    form,
    setForm,
    titleForm, 
    caption,
    interview_aspects,
    itemSchedule,
    endpoint,
    token,
    loginInfo,
    onSaveSuccess,
    onClose,
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
            
            // Don't close canvas after save - just call success callback for refresh
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
                    <div className="mb-3">
                        <h5 className="mb-1 text-primary fw-bold">{titleForm} Assessment</h5>
                        <p>{caption}</p>
                    </div>
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
                                    <Row className='gx-3 col-rows-span-3'>
                                        <Col lg={1}>
                                            <FloatingLabel
                                                className='col-12 fs-14 h-100'
                                                controlId={`${aspect.key}PointDisplay`}
                                                label="Point"
                                            >
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Point"
                                                    value={form[aspect.key].point || ''}
                                                    className='h-100 fs-4'
                                                    readOnly
                                                    style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                                />
                                            </FloatingLabel>
                                        </Col>
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
                    <div className="my-4">
                        <Button 
                            type="button" 
                            variant="outline-secondary" 
                            onClick={onClose}
                            className='fs-6 font-primary py-2 px-4 me-3'
                        >
                            Back
                        </Button>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            disabled={isLoading}
                            className='fs-6 font-primary py-2 px-5'
                        >
                            {isLoading 
                                ? (isEditMode ? 'Updating...' : 'Saving...') 
                                : (isEditMode ? `Update ${titleForm}` : `Save ${titleForm}`)
                            }
                        </Button>
                    </div>
                </Form>
            </Row>
        </StyledQuestion>
    );
}

const StyledQuestion = styled(Container) `
    --bs-accordion-body-padding-y:1.25rem;
    --bs-accordion-inner-border-radius: 10px;
    border: solid 1px var(--bs-border-color);
    border-top: 0;
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