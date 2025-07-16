import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { FaFileAlt, FaCalendarCheck, FaDownload, FaEye } from 'react-icons/fa'
import styled from 'styled-components'
import { 
    DataFilter, 
    DataTable, 
    DataPagination, 
    useDataFilter, 
    usePagination, 
    animationVariants 
} from '../Helper/TableHelper'

// Styled Components khusus untuk Attendance
const AttendanceComponents = {
    StatusBadge: styled.span`
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        ${props => {
            switch(props.status) {
                case 'Present':
                    return 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;'
                case 'Late':
                    return 'background: #fff3cd; color: #856404; border: 1px solid #ffeaa7;'
                case 'Absent':
                    return 'background: #f8d7da; color: #721c24; border: 1px solid #f1aeb5;'
                default:
                    return 'background: #e2e3e5; color: #383d41; border: 1px solid #d6d8db;'
            }
        }}
    `,

    TimeText: styled.span`
        font-family: 'Courier New', monospace;
        font-weight: 500;
        color: #495057;
        font-size: 14px;
    `
}

// Contoh penggunaan komponen modular untuk data Attendance
const AttendanceReport = () => {
    const [attendanceData, setAttendanceData] = useState([])
    const [loading, setLoading] = useState(true)

    // Simulasi fetch data
    useEffect(() => {
        const fetchAttendance = async () => {
            setLoading(true)
            // Simulasi delay
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            // Data dummy attendance
            const dummyData = [
                {
                    id: 1,
                    employeeName: 'John Doe',
                    employeeId: 'EMP001',
                    date: '2025-07-15',
                    checkIn: '08:30',
                    checkOut: '17:15',
                    workHours: '8:45',
                    status: 'Present',
                    department: 'Engineering'
                },
                {
                    id: 2,
                    employeeName: 'Jane Smith',
                    employeeId: 'EMP002',
                    date: '2025-07-15',
                    checkIn: '09:15',
                    checkOut: '17:30',
                    workHours: '8:15',
                    status: 'Late',
                    department: 'Marketing'
                },
                {
                    id: 3,
                    employeeName: 'Bob Johnson',
                    employeeId: 'EMP003',
                    date: '2025-07-15',
                    checkIn: '-',
                    checkOut: '-',
                    workHours: '0:00',
                    status: 'Absent',
                    department: 'Finance'
                },
                {
                    id: 4,
                    employeeName: 'Alice Brown',
                    employeeId: 'EMP004',
                    date: '2025-07-15',
                    checkIn: '08:00',
                    checkOut: '17:00',
                    workHours: '9:00',
                    status: 'Present',
                    department: 'HR'
                },
                {
                    id: 5,
                    employeeName: 'Charlie Wilson',
                    employeeId: 'EMP005',
                    date: '2025-07-15',
                    checkIn: '08:45',
                    checkOut: '16:45',
                    workHours: '8:00',
                    status: 'Present',
                    department: 'Engineering'
                }
            ]
            
            setAttendanceData(dummyData)
            setLoading(false)
        }

        fetchAttendance()
    }, [])

    // Konfigurasi filter untuk Attendance
    const filterConfig = [
        {
            key: 'employeeName',
            label: 'Employee Name',
            type: 'text',
            placeholder: 'Search by employee name...',
            colSize: 3
        },
        {
            key: 'employeeId',
            label: 'Employee ID',
            type: 'text',
            placeholder: 'Search by ID...',
            colSize: 2
        },
        {
            key: 'department',
            label: 'Department',
            type: 'select',
            placeholder: 'Select Department',
            options: [
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Marketing', label: 'Marketing' },
                { value: 'Finance', label: 'Finance' },
                { value: 'HR', label: 'Human Resources' }
            ],
            colSize: 3
        },
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            placeholder: 'Select Status',
            options: [
                { value: 'Present', label: 'Present' },
                { value: 'Late', label: 'Late' },
                { value: 'Absent', label: 'Absent' }
            ],
            colSize: 2
        }
    ]

    // Filter logic
    const filterFunction = (data, filters) => {
        return data.filter(item => {
            const nameMatch = !filters.employeeName || 
                item.employeeName.toLowerCase().includes(filters.employeeName.toLowerCase())
            
            const idMatch = !filters.employeeId || 
                item.employeeId.toLowerCase().includes(filters.employeeId.toLowerCase())
            
            const departmentMatch = !filters.department || 
                item.department === filters.department
            
            const statusMatch = !filters.status || 
                item.status === filters.status

            return nameMatch && idMatch && departmentMatch && statusMatch
        })
    }

    // Use custom hooks
    const { filters, filteredData, handleFilterChange, handleReset } = useDataFilter(attendanceData, filterFunction)
    const { 
        currentPage, 
        totalPages, 
        startIndex, 
        endIndex, 
        currentData, 
        goToPage,
        totalItems 
    } = usePagination(filteredData, 10)

    // Table columns configuration
    const columns = [
        { header: 'No', style: { width: '60px' } },
        { header: 'Employee', width: '200' },
        { header: 'Employee ID', width: '120' },
        { header: 'Date', width: '120' },
        { header: 'Check In', width: '100' },
        { header: 'Check Out', width: '100' },
        { header: 'Work Hours', width: '120' },
        { header: 'Department', width: '120' },
        { header: 'Status', width: '100' },
        { header: 'Action', width: '120' }
    ]

    // Row renderer
    const renderRow = (item, index) => [
        <td key="no" className="text-center font-primary-bold">
            {startIndex + index + 1}
        </td>,
        <td key="employee">
            <div className="font-primary-bold text-dark">{item.employeeName}</div>
        </td>,
        <td key="employeeId">
            <span className="font-monospace text-muted">{item.employeeId}</span>
        </td>,
        <td key="date" className="text-muted">
            {item.date}
        </td>,
        <td key="checkIn">
            <AttendanceComponents.TimeText>
                {item.checkIn}
            </AttendanceComponents.TimeText>
        </td>,
        <td key="checkOut">
            <AttendanceComponents.TimeText>
                {item.checkOut}
            </AttendanceComponents.TimeText>
        </td>,
        <td key="workHours">
            <AttendanceComponents.TimeText>
                {item.workHours}
            </AttendanceComponents.TimeText>
        </td>,
        <td key="department" className="text-muted">
            {item.department}
        </td>,
        <td key="status">
            <AttendanceComponents.StatusBadge status={item.status}>
                {item.status}
            </AttendanceComponents.StatusBadge>
        </td>,
        <td key="action">
            <div className="d-flex">
                <button 
                    className="btn btn-sm btn-info me-1"
                    onClick={() => alert(`View details for ${item.employeeName}`)}
                    title="View Details"
                >
                    <FaEye size={12} />
                </button>
                <button 
                    className="btn btn-sm btn-success"
                    onClick={() => alert(`Export report for ${item.employeeName}`)}
                    title="Export Report"
                >
                    <FaDownload size={12} />
                </button>
            </div>
        </td>
    ]

    return (
        <motion.div 
            className="container-fluid"
            variants={animationVariants.container}
            initial="hidden"
            animate="visible"
        >
            <motion.div 
                className="row"
                variants={animationVariants.item}
            >
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="mb-0 d-flex align-items-center">
                                <FaCalendarCheck className="me-3 text-primary" />
                                Attendance Report
                            </h4>
                            <p className="text-muted mb-0">Daily attendance tracking and reports</p>
                        </div>
                        <div>
                            <button className="btn btn-primary">
                                <FaDownload className="me-2" />
                                Export All
                            </button>
                        </div>
                    </div>

                    {/* Filter Component - Reusable */}
                    <DataFilter
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onReset={handleReset}
                        filterConfig={filterConfig}
                        title="Filter Attendance"
                    />

                    {/* Table Component - Reusable */}
                    <DataTable
                        data={currentData}
                        columns={columns}
                        loading={loading}
                        emptyMessage="No attendance records found. Try adjusting your filters."
                        emptyIcon={FaFileAlt}
                        renderRow={renderRow}
                        currentPage={currentPage}
                        startIndex={startIndex}
                        minWidth="1200px"
                    />

                    {/* Pagination Component - Reusable */}
                    <DataPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={10}
                        onPageChange={goToPage}
                        startIndex={startIndex}
                        endIndex={endIndex}
                    />
                </div>
            </motion.div>
        </motion.div>
    )
}

export default AttendanceReport
