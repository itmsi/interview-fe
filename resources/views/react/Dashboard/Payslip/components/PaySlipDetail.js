import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import styled from 'styled-components'
import { 
    FaTimes, 
    FaUser, 
    FaIdCard, 
    FaMapMarkerAlt, 
    FaBriefcase,
    FaCalendarAlt,
    FaMoneyBillWave,
    FaClock,
    FaEnvelope,
    FaPhone,
    FaHome,
    FaGenderless,
    FaRing,
    FaFileInvoiceDollar
} from 'react-icons/fa'
import { Col, Container, Row } from 'react-bootstrap'

const ModalOverlay = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(5px);
    z-index: 1050;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
`

const ModalContent = styled(motion.div)`
    background: white;
    border-radius: 16px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    max-width: 1200px;
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    
    @media (max-width: 768px) {
        max-width: 95vw;
        margin: 10px;
        border-radius: 12px;
    }
`

const ModalHeader = styled.div`
    background: var(--gradient);
    color: white;
    padding: 24px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 16px 16px 0 0;
`

const CloseButton = styled(motion.button)`
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: rotate(90deg);
    }
`

const ModalBody = styled.div`
    padding: 0;
    overflow-y: auto;
    flex: 1;
`

const BgSection = styled.div`
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 32px;
    border-bottom: 1px solid #e9ecef;
`

const BgCardSection = styled.div`
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    height: 100%;
    &.grid-display {
        display: flex;
        align-items: center;
        gap: 24px;
    }
`

const Avatar = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(to right, #0065c7 0%, #0253a5 51%, #003a73 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: bold;
    text-transform: uppercase;
`

const ProfileInfo = styled.div`
    flex: 1;
`

const EmployeeName = styled.h3`
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--color-text);
`

const EmployeeSubtitle = styled.p`
    margin: 0;
    color: #718096;
    font-size: 16px;
`

const StatusBadge = styled.span`
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    background: ${props => props.status === 'ACTIVE' ? '#d4edda' : '#f8d7da'};
    color: ${props => props.status === 'ACTIVE' ? '#155724' : '#721c24'};
    border: 1px solid ${props => props.status === 'ACTIVE' ? '#c3e6cb' : '#f1aeb5'};
`

const SectionContainer = styled.div`
    /* padding: 24px 32px; */
    
    &:not(:last-child) {
        border-bottom: 1px solid #e9ecef;
    }
`

const SectionTitle = styled.h4`
    margin: 0 0 20px 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text);
    display: flex;
    align-items: center;
    gap: 8px;
`

const DetailGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(1, minmax(300px, 1fr));
    gap: 8px;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`

const DetailItem = styled.div`
    background: #f8f9fa;
    border-radius: 8px;
    padding: 8px 16px;
    border-left: 4px solid var(--color-main);
    transition: all 0.2s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &:hover {
        background: #f1f3f5;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    &.highlight {
        background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
        border-left-color: #f39c12;
    }
    
    &.success {
        background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
        border-left-color: #28a745;
    }
    
    &.info {
        background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
        border-left-color: #17a2b8;
    }
`

const DetailLabel = styled.div`
    font-size: 12px;
    font-weight: 600;
    color: #718096;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    strong {
        font-family: var(--font-main-bold);
        font-weight: 400;
    }
`

const DetailValue = styled.div`
    font-size: 14px;
    color: var(--color-text);
    font-family: var(--font-main);
    word-break: break-word;
    strong {
        font-family: var(--font-main-bold);
        font-weight: 400;
    }
`

const AttendanceGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
    
    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    }
`

const AttendanceCard = styled.div`
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px;
    text-align: center;
    transition: all 0.2s ease;
    
    &:hover {
        border-color: #667eea;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    }
`

const AttendanceNumber = styled.div`
    font-size: 24px;
    font-weight: bold;
    color: #667eea;
    margin-bottom: 4px;
`

const AttendanceLabel = styled.div`
    font-size: 12px;
    color: #718096;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`

const formatCurrency = (amount) => {
    if (!amount || amount === '') return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount)
}

const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const getAttendanceData = (data) => [
    { label: 'Standard Days', value: data.kolom_std || '0', color: '#0253a5' },
    { label: 'Scheduled', value: data.kolom_sch || '0', color: '#48bb78' },
    { label: 'Actual', value: data.kolom_act || '0', color: '#ed8936' },
    { label: 'Days Off', value: data.kolom_off || '0', color: '#e53e3e' },
    { label: 'Holiday', value: data.kolom_h || '0', color: '#805ad5' },
    { label: 'Sick Leave', value: data.kolom_s1 || '0', color: '#38b2ac' },
    { label: 'Annual Leave', value: data.kolom_al || '0', color: '#d69e2e' },
]

export const PaySlipDetail = ({ isOpen, onClose, data }) => {
    if (!data) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <ModalOverlay
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <ModalContent
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        transition={{ type: "spring", duration: 0.4 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ModalHeader>
                            <div>
                                <h2 className="mb-0 d-flex align-items-center h5">
                                    <FaFileInvoiceDollar className="me-2" />
                                    Pay Slip Details
                                </h2>
                                <p className="mb-0 opacity-75">Complete employee information and payroll data</p>
                            </div>
                            <CloseButton
                                onClick={onClose}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaTimes size={16} />
                            </CloseButton>
                        </ModalHeader>

                        <ModalBody>
                            {/* Profile Section */}
                            <BgSection>
                                <BgCardSection className='grid-display'>
                                    <Avatar>
                                        {data.kolom_name?.charAt(0) || 'U'}
                                    </Avatar>
                                    <ProfileInfo>
                                        <EmployeeName>{data.kolom_name || 'Unknown Employee'}</EmployeeName>
                                        <EmployeeSubtitle>{data.kolom_job_title} • {data.kolom_departement}</EmployeeSubtitle>
                                        <EmployeeSubtitle className="text-muted">{data.kolom_email_address}</EmployeeSubtitle>
                                    </ProfileInfo>
                                    <StatusBadge status={data.kolom_working_status}>
                                        {data.kolom_working_status}
                                    </StatusBadge>
                                </BgCardSection>
                                
                                {/* Attendance Information */}
                                <SectionContainer className='mt-4'>
                                    <SectionTitle>
                                        <FaClock />
                                        Attendance Information
                                    </SectionTitle>
                                    <AttendanceGrid>
                                        {getAttendanceData(data).map((item, index) => (
                                            <AttendanceCard key={index}>
                                                <AttendanceNumber style={{ color: item.color }}>
                                                    {item.value}
                                                </AttendanceNumber>
                                                <AttendanceLabel>{item.label}</AttendanceLabel>
                                            </AttendanceCard>
                                        ))}
                                    </AttendanceGrid>
                                </SectionContainer>
                                
                                <BgCardSection className='mt-4'>
                                    <Row className='row gx-3 mx-0'>
                                        <SectionTitle>
                                            <FaUser />
                                            Personal Information
                                        </SectionTitle>
                                        <DetailGrid className='col-6'>
                                            <DetailItem>
                                                <DetailLabel>Full Name</DetailLabel>
                                                <DetailValue>{data.kolom_name || '-'}</DetailValue>
                                            </DetailItem>
                                            <DetailItem>
                                                <DetailLabel>NIK</DetailLabel>
                                                <DetailValue>{data.kolom_ktp || '-'}</DetailValue>
                                            </DetailItem>
                                            <DetailItem>
                                                <DetailLabel>NPWP</DetailLabel>
                                                <DetailValue>{data.kolom_npwp || '-'}</DetailValue>
                                            </DetailItem>
                                            <DetailItem>
                                                <DetailLabel>Birth Date</DetailLabel>
                                                <DetailValue>{formatDate(data.kolom_birth_date)}</DetailValue>
                                            </DetailItem>
                                            <DetailItem>
                                                <DetailLabel>Age</DetailLabel>
                                                <DetailValue>{data.kolom_age || '-'} years old</DetailValue>
                                            </DetailItem>
                                        </DetailGrid>
                                        <DetailGrid className='col-6'>
                                            <DetailItem>
                                                <DetailLabel>Gender</DetailLabel>
                                                <DetailValue>{data.kolom_gender || '-'}</DetailValue>
                                            </DetailItem>
                                            <DetailItem>
                                                <DetailLabel>Marital Status</DetailLabel>
                                                <DetailValue>{data.kolom_martial_status || '-'}</DetailValue>
                                            </DetailItem>
                                            <DetailItem>
                                                <DetailLabel>Religion</DetailLabel>
                                                <DetailValue>{data.kolom_religion || '-'}</DetailValue>
                                            </DetailItem>
                                            <DetailItem>
                                                <DetailLabel>PTKP</DetailLabel>
                                                <DetailValue>{data.kolom_ptkp || '-'}</DetailValue>
                                            </DetailItem>
                                            <DetailItem>
                                                <DetailLabel>Email</DetailLabel>
                                                <DetailValue>{data.kolom_email_address || '-'}</DetailValue>
                                            </DetailItem>
                                        </DetailGrid>
                                        {/* <DetailGrid className='col-6'>
                                            <DetailItem>
                                                <DetailLabel>Full Name</DetailLabel>
                                                <DetailValue>{data.kolom_name || '-'}</DetailValue>
                                            </DetailItem>
                                            <DetailItem>
                                                <DetailLabel>Job Title</DetailLabel>
                                                <DetailValue>{data.kolom_job_title || '-'}</DetailValue>
                                            </DetailItem>
                                            <DetailItem>
                                                <DetailLabel>Department</DetailLabel>
                                                <DetailValue>{data.kolom_departement || '-'}</DetailValue>
                                            </DetailItem>
                                            <DetailItem>
                                                <DetailLabel>Employment Status</DetailLabel>
                                                <DetailValue>{data.kolom_employment_status || '-'}</DetailValue>
                                            </DetailItem>
                                            <DetailItem>
                                                <DetailLabel>First Onboard</DetailLabel>
                                                <DetailValue>{formatDate(data.kolom_first_onboard)}</DetailValue>
                                            </DetailItem>
                                            <DetailItem>
                                                <DetailLabel>Email</DetailLabel>
                                                <DetailValue>{data.kolom_email_address || '-'}</DetailValue>
                                            </DetailItem>
                                        </DetailGrid>
                                        <DetailGrid className='col-6'>
                                            <DetailItem>
                                                <DetailLabel>Net Salary Received</DetailLabel>
                                                <DetailValue>{formatCurrency(data.kolom_total_received_nett)}</DetailValue>
                                            </DetailItem>
                                            <DetailItem>
                                                <DetailLabel>Bank Name</DetailLabel>
                                                <DetailValue>BRI</DetailValue>
                                            </DetailItem>
                                            <DetailItem>
                                                <DetailLabel>Beneficiary</DetailLabel>
                                                <DetailValue>{data.kolom_beneficiery || '-'}</DetailValue>
                                            </DetailItem>
                                            <DetailItem>
                                                <DetailLabel>Account Number</DetailLabel>
                                                <DetailValue>{data.kolom_accout_number || '-'}</DetailValue>
                                            </DetailItem>
                                            <DetailItem>
                                                <DetailLabel>BPJS TK Number</DetailLabel>
                                                <DetailValue>{data.kolom_no_bpjs_tk || '-'}</DetailValue>
                                            </DetailItem>
                                            <DetailItem>
                                                <DetailLabel>BPJS KS Number</DetailLabel>
                                                <DetailValue>{data.kolom_no_bpjs_ks || '-'}</DetailValue>
                                            </DetailItem>
                                        </DetailGrid> */}
                                    </Row>
                                </BgCardSection>


                                <Row className='row gx-4 mt-4'>
                                    <Col lg={6}>
                                        <BgCardSection>
                                            <SectionTitle>
                                                <FaBriefcase />
                                                Employment Information
                                            </SectionTitle>
                                            <DetailGrid>
                                                <DetailItem>
                                                    <DetailLabel>Company</DetailLabel>
                                                    <DetailValue>{data.kolom_pt1 || data.kolom_pt || '-'}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Job Title</DetailLabel>
                                                    <DetailValue>{data.kolom_job_title || '-'}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Department</DetailLabel>
                                                    <DetailValue>{data.kolom_departement || '-'}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Level</DetailLabel>
                                                    <DetailValue>{data.kolom_level || '-'}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Employment Status</DetailLabel>
                                                    <DetailValue>{data.kolom_employment_status || '-'}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Working Status</DetailLabel>
                                                    <DetailValue>{data.kolom_working_status || '-'}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Location</DetailLabel>
                                                    <DetailValue>{data.kolom_location || '-'}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>First Onboard</DetailLabel>
                                                    <DetailValue>{formatDate(data.kolom_first_onboard)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Working Service</DetailLabel>
                                                    <DetailValue>{data.kolom_working_service || '-'}</DetailValue>
                                                </DetailItem>
                                                {data.kolom_resigent_date && (
                                                    <DetailItem>
                                                        <DetailLabel>Resignation Date</DetailLabel>
                                                        <DetailValue>{formatDate(data.kolom_resigent_date)}</DetailValue>
                                                    </DetailItem>
                                                )}
                                            </DetailGrid>
                                        </BgCardSection>
                                    </Col>
                                    <Col lg={6}>
                                        <BgCardSection>
                                            <SectionTitle>
                                                <FaMoneyBillWave />
                                                Financial Information
                                            </SectionTitle>
                                            <DetailGrid>
                                                <DetailItem>
                                                    <DetailLabel>Payroll ID</DetailLabel>
                                                    <DetailValue>{data.kolom_id_payroll || '-'}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Beneficiary</DetailLabel>
                                                    <DetailValue>{data.kolom_beneficiery || '-'}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Account Number</DetailLabel>
                                                    <DetailValue>{data.kolom_accout_number || '-'}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Pay Period</DetailLabel>
                                                    <DetailValue>{formatDate(data.kolom_month)}</DetailValue>
                                                </DetailItem>
                                            </DetailGrid>
                                        </BgCardSection>
                                    </Col>
                                </Row>
                                
                                <Row className='row gx-4 mt-4'>
                                    <Col lg={6}>
                                        <BgCardSection>
                                            <SectionTitle>
                                                <FaMoneyBillWave />
                                                Earnings & Allowances
                                            </SectionTitle>
                                            <DetailGrid>
                                                <DetailItem>
                                                    <DetailLabel>Basic Salary</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_basic)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Attendance Allowance</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_attendance)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Meal & Transport</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_meal_transport)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Communication Allowance</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_comunication)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Full Attendance Bonus</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_full_attendance)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Skill Allowance</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_skill)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Special Skill Allowance</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_special_skill)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Accommodation</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_accomodation)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>KPI Bonus</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_kpi)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Total KPI</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_total_kpi)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Overtime Hours</DetailLabel>
                                                    <DetailValue>{data.kolom_overtime_hour || '0'} hours</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Total Overtime Pay</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_total_overtime)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Total Points</DetailLabel>
                                                    <DetailValue>{data.kolom_total_point || '0'}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Point Payment</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_point_to_be_paid)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Sales Incentive</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_sales_incentive)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Adjustment Allowance</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_adjusment_tj)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Standby Allowance</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_standby)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Funeral Allowance</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_happy_funeral_allowance)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Other Allowances</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_others_tj)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem className="highlight">
                                                    <DetailLabel><strong>Gross Total</strong></DetailLabel>
                                                    <DetailValue><strong>{formatCurrency(data.kolom_total_basic_allowance_incentive_bonus_pay_by_company_gross)}</strong></DetailValue>
                                                </DetailItem>
                                            </DetailGrid>
                                        </BgCardSection>
                                    </Col>
                                    <Col lg={6}>
                                        <BgCardSection>
                                            <SectionTitle>
                                                <FaMoneyBillWave />
                                                Deductions
                                            </SectionTitle>
                                            <DetailGrid>
                                                <DetailItem>
                                                    <DetailLabel>APD (Safety Equipment)</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_apd)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Transport Ticket</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_transport_ticket)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Loan Deduction</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_loan)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Unpaid Leave</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_unpaid_leave_defaulters_work)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>JHT (Employee 2%)</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_provident_fund_benefit_by_emp_jht_2_persen)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Pension (Employee 1%)</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_pension_by_emp_jp_1_persen)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Health Insurance (Employee 1%)</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_health_insurance_by_employee_1_persen)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Adjustment Deduction</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_adjusment_cut)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>General Deduction</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_deduction)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>PPh 21 Tax</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_pph_21)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Other Deductions</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_other_deduction)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem className="info">
                                                    <DetailLabel><strong>Total Deductions</strong></DetailLabel>
                                                    <DetailValue><strong>{formatCurrency(data.kolom_total_deduction)}</strong></DetailValue>
                                                </DetailItem>
                                            </DetailGrid>
                                        </BgCardSection>
                                    </Col>
                                </Row>

                                <Row className='row gx-4 mt-4'>
                                    <Col lg={6}>
                                        <BgCardSection>
                                            <SectionTitle>
                                                <FaMoneyBillWave />
                                                Company Contributions
                                            </SectionTitle>
                                            <DetailGrid>
                                                <DetailItem>
                                                    <DetailLabel>JHT (Company 3.7%)</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_jht_by_company_37_persen)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>JKK (Company 0.24%)</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_jkk_by_company_024_persen)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>JKM (Company 0.30%)</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_jkm_by_company_030_persen)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Pension (Company 2%)</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_jp_by_company_2_persen)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Health Insurance (Company 4%)</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_kes_by_company_4_persen)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem className="success">
                                                    <DetailLabel><strong>Total Company Contribution</strong></DetailLabel>
                                                    <DetailValue><strong>{formatCurrency(data.kolom_total_by_company_1024_persen)}</strong></DetailValue>
                                                </DetailItem>
                                            </DetailGrid>
                                        </BgCardSection>
                                    </Col>
                                    <Col lg={6}>
                                        <BgCardSection>
                                            <SectionTitle>
                                                <FaMoneyBillWave />
                                                Employee Contributions
                                            </SectionTitle>
                                            <DetailGrid>
                                                <DetailItem>
                                                    <DetailLabel>JHT (Employee 3.7%)</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_jht_by_employee_37_persen)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>JKK (Employee 0.24%)</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_jkk_by_employee_024_persen)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>JKM (Employee 0.30%)</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_jkm_by_employee_030_persen)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Pension (Employee 2%)</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_jp_by_employee_2_persen)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem>
                                                    <DetailLabel>Health Insurance (Employee 4%)</DetailLabel>
                                                    <DetailValue>{formatCurrency(data.kolom_kes_by_employee_4_persen)}</DetailValue>
                                                </DetailItem>
                                                <DetailItem className="success">
                                                    <DetailLabel><strong>Total Employee Contribution</strong></DetailLabel>
                                                    <DetailValue><strong>{formatCurrency(data.kolom_total_by_employee_1024_persen)}</strong></DetailValue>
                                                </DetailItem>
                                            </DetailGrid>
                                        </BgCardSection>
                                    </Col>
                                </Row>

                                <BgCardSection className='mt-4'>
                                    <Row className='row gx-3 mx-0'>
                                        <SectionTitle>
                                            <FaFileInvoiceDollar />
                                            Pay Slip Summary
                                        </SectionTitle>
                                        <DetailGrid>
                                            <DetailItem className="success">
                                                <DetailLabel><strong>Net Salary Received</strong></DetailLabel>
                                                <DetailValue><strong style={{fontSize: '18px', color: '#28a745'}}>{formatCurrency(data.kolom_total_received_nett)}</strong></DetailValue>
                                            </DetailItem>
                                            <DetailItem className="info">
                                                <DetailLabel>Tax Amount</DetailLabel>
                                                <DetailValue>{formatCurrency(data.kolom_tax)}</DetailValue>
                                            </DetailItem>
                                            <DetailItem className="highlight">
                                                <DetailLabel><strong>Grand Total</strong></DetailLabel>
                                                <DetailValue><strong style={{fontSize: '18px', color: '#007bff'}}>{formatCurrency(data.kolom_grand_total)}</strong></DetailValue>
                                            </DetailItem>
                                            {data.kolom_remarks && (
                                                <DetailItem style={{gridColumn: '1 / -1'}}>
                                                    <DetailLabel>Remarks</DetailLabel>
                                                    <DetailValue>{data.kolom_remarks}</DetailValue>
                                                </DetailItem>
                                            )}
                                        </DetailGrid>
                                    </Row>
                                </BgCardSection>

                            </BgSection>

                        </ModalBody>
                    </ModalContent>
                </ModalOverlay>
            )}
        </AnimatePresence>
    )
}
