import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import styled from 'styled-components'
import { 
    FaFileInvoiceDollar, 
    FaEye, 
    FaDownload,
    FaExclamationTriangle
} from 'react-icons/fa'
import { 
    DataFilter, 
    DataTable, 
    DataPagination, 
    useDataFilter, 
    usePagination, 
    animationVariants 
} from '../Helper/TableHelper'

// Styled Components khusus untuk PaySlip
const PayslipComponents = {
    PayslipAvatar: styled.div`
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
        background: linear-gradient(to right, #65b3ff 0%, #0253a5 51%, #003a73 100%);
        color: white;
        text-transform: uppercase;
    `,

    PeriodBadge: styled.span`
        background: #f8f9fc;
        color: #5a5c69;
        border: 1px solid #e3e6f0;
        font-size: 0.75rem;
        padding: 0.375rem 0.75rem;
        border-radius: 0.5rem;
        font-weight: 500;
    `,

    StatusBadge: styled.span`
        padding: 4px 12px;
        border-radius: 0.5rem;
        font-size: 12px;
        font-weight: 500;
        background: ${props => props.status === 'ACTIVE' ? '#d4edda' : '#f8d7da'};
        color: ${props => props.status === 'ACTIVE' ? '#155724' : '#721c24'};
        border: 1px solid ${props => props.status === 'ACTIVE' ? '#c3e6cb' : '#f1aeb5'};
    `,

    ActionButton: styled(motion.button)`
        border: none;
        border-radius: 4px;
        padding: 6px;
        margin: 0 2px;
        width: 32px;
        height: 32px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        
        &.btn-info {
            background: #17a2b8;
            color: white;
            &:hover {
                background: #138496;
                transform: translateY(-1px);
            }
        }
        
        &.btn-success {
            background: #28a745;
            color: white;
            &:hover {
                background: #218838;
                transform: translateY(-1px);
            }
        }
    `
}

export const ListPaySlipTKA = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                
                const localResponse = await fetch('/assets/data/payslipdata-tka.json')
                if (localResponse.ok) {
                    const localData = await localResponse.json()
                    if (Array.isArray(localData)) {
                        setData(localData)
                    }
                }
                
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // Filter configuration
    const filterConfig = [
        {
            key: 'name',
            label: 'Employee Name',
            type: 'text',
            placeholder: 'Search by name...',
            colSize: 3
        },
        {
            key: 'nik',
            label: 'NIK/Passport',
            type: 'text',
            placeholder: 'Search by NIK/Passport...',
            colSize: 3
        },
        {
            key: 'year',
            label: 'Year',
            type: 'select',
            placeholder: 'Select Year',
            options: [
                { value: '2025', label: '2025' },
                { value: '2024', label: '2024' },
                { value: '2023', label: '2023' }
            ],
            colSize: 2
        },
        {
            key: 'month',
            label: 'Month',
            type: 'select',
            placeholder: 'Select Month',
            options: [
                { value: '01', label: 'January' },
                { value: '02', label: 'February' },
                { value: '03', label: 'March' },
                { value: '04', label: 'April' },
                { value: '05', label: 'May' },
                { value: '06', label: 'June' },
                { value: '07', label: 'July' },
                { value: '08', label: 'August' },
                { value: '09', label: 'September' },
                { value: '10', label: 'October' },
                { value: '11', label: 'November' },
                { value: '12', label: 'December' }
            ],
            colSize: 2
        }
    ]

    // Filter logic
    const filterFunction = (data, filters) => {
        return data.filter(item => {
            const nameMatch = !filters.name || 
                item.kolom_name.toLowerCase().includes(filters.name.toLowerCase())
            
            const nikMatch = !filters.nik || 
                item.kolom_ktp.toString().includes(filters.nik)
            
            const yearMatch = !filters.year || 
                item.kolom_month.includes(filters.year)
            
            const monthMatch = !filters.month || 
                item.kolom_month.includes(`-${filters.month}-`)

            return nameMatch && nikMatch && yearMatch && monthMatch
        })
    }
    
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('id-ID', { 
            year: 'numeric', 
            month: 'long'
        })
    }

    // Use custom hooks
    const { filters, filteredData, handleFilterChange, handleReset } = useDataFilter(data, filterFunction)
    const { 
        currentPage, 
        totalPages, 
        currentData, 
        goToPage,
        totalItems,
        startIndex,
        endIndex
    } = usePagination(filteredData, 10)

    // Table columns configuration
    const columns = [
        { header: 'No', style: { width: '60px' } },
        { header: 'Employee Name' },
        { header: 'NIK/Passport' },
        { header: 'Location' },
        { header: 'Employment', width: '100' },
        { header: 'Position', width: '100' },
        { header: 'Department' },
        { header: 'Unit', width: '100' },
        { header: 'Period', width: '130' },
        { header: 'Status' },
        { header: 'Action' }
    ]

    // Row renderer
    const renderRow = (item, index) => [
        // No
        <td key="no" className="text-center font-primary-bold">
            {index + 1}
        </td>,
        
        // Employee Name
        <td key="name">
            <div className="d-flex align-items-center">
                <PayslipComponents.PayslipAvatar className="me-3">
                    {item.kolom_name.charAt(0)}
                </PayslipComponents.PayslipAvatar>
                <div>
                    <div className="font-primary-bold text-dark">{item.kolom_name}</div>
                    <small className="text-muted">{item.kolom_email_address}</small>
                </div>
            </div>
        </td>,
        
        // NIK
        <td key="nik">
            <span className="font-monospace fw-medium">{item.kolom_ktp_passport}</span>
        </td>,
        
        // Location
        <td key="employment" className="text-muted">{item.kolom_location}</td>,
        
        // Employment
        <td key="location" className="text-muted">{item.kolom_employment_status}</td>,
        
        // Position
        <td key="position" className="text-muted">{item.kolom_job_title}</td>,
        
        // Department
        <td key="department" className="text-muted">{item.kolom_departement}</td>,
        
        // Unit
        <td key="unit" className="text-muted">{item.kolom_pt1}</td>,
        
        // Period
        <td key="period">
            <PayslipComponents.PeriodBadge>
                {formatDate(item.kolom_month)}
            </PayslipComponents.PeriodBadge>
        </td>,
        
        // Status
        <td key="status">
            <PayslipComponents.StatusBadge status={item.kolom_working_status}>
                {item.kolom_working_status}
            </PayslipComponents.StatusBadge>
        </td>,
        
        // Action
        <td key="action">
            <div className="d-flex">
                <PayslipComponents.ActionButton
                    className="btn-info"
                    onClick={() => alert(`View details for ${item.kolom_name}`)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="View Details"
                >
                    <FaEye size={14} />
                </PayslipComponents.ActionButton>
                
                <PayslipComponents.ActionButton
                    className="btn-success"
                    onClick={() => alert(`Download PDF for ${item.kolom_name}`)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Download PDF"
                >
                    <FaDownload size={14} />
                </PayslipComponents.ActionButton>
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
                                <FaFileInvoiceDollar className="me-3 text-primary" />
                                Pay Slip Management
                            </h4>
                            <p className="text-muted mb-0">Manage and view employee pay slips</p>
                        </div>
                    </div>

                    {/* Filter Component */}
                    <DataFilter
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onReset={handleReset}
                        filterConfig={filterConfig}
                        title="Filter Pay Slips"
                    />

                    {/* Table Component */}
                    <DataTable
                        data={currentData}
                        columns={columns}
                        loading={loading}
                        emptyMessage="No pay slips found. Try adjusting your filters."
                        emptyIcon={FaExclamationTriangle}
                        renderRow={renderRow}
                        currentPage={currentPage}
                    />

                    {/* Pagination Component */}
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