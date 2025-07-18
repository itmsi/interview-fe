import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import styled from 'styled-components'
import { 
    FaFileInvoiceDollar, 
    FaEye, 
    FaDownload,
    FaExclamationTriangle,
    FaSpinner,
    FaFilePdf,
    FaCloudDownloadAlt
} from 'react-icons/fa'
import { 
    DataFilter, 
    DataTable, 
    DataPagination, 
    useDataFilter, 
    usePagination, 
    animationVariants 
} from '../Helper/TableHelper'
import { PaySlipDetail } from './components/PaySlipDetail'
import { generatePayslipPDF } from './utils/PDFGenerator'
import { generatePayslipPDFSimple } from './utils/PDFGeneratorSimple'
import { generatePayslipPDFWithLogo } from './utils/PDFGeneratorWithLogo'

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
        position: relative;
        
        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        &.btn-info {
            background: #17a2b8;
            color: white;
            &:hover:not(:disabled) {
                background: #138496;
                transform: translateY(-1px);
            }
        }
        
        &.btn-success {
            background: #28a745;
            color: white;
            &:hover:not(:disabled) {
                background: #218838;
                transform: translateY(-1px);
            }
        }
        
        .spinner {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `
}

export const ListPaySlip = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedPaySlip, setSelectedPaySlip] = useState(null)
    const [showDetail, setShowDetail] = useState(false)
    const [generatingPDF, setGeneratingPDF] = useState(null) // Track which PDF is being generated
    const [downloadingAll, setDownloadingAll] = useState(false) // Track bulk download

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                
                const localResponse = await fetch('/assets/data/payslipdata.json')
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
            label: 'NIK',
            type: 'text',
            placeholder: 'Search by NIK...',
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

    // Handle view details
    const handleViewDetails = (item) => {
        setSelectedPaySlip(item)
        setShowDetail(true)
    }

    const handleCloseDetail = () => {
        setShowDetail(false)
        setSelectedPaySlip(null)
    }

    // Handle download PDF
    const handleDownloadPDF = async (item) => {
        try {
            setGeneratingPDF(item.id) // Set loading state for this specific item
            
            // Add a small delay to show loading state
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // Try logo version first, then fallback to standard, then simple
            try {
                await generatePayslipPDF(item)
                // await generatePayslipPDFWithLogo(item)
            } catch (logoError) {
                console.warn('Logo PDF failed, trying standard version:', logoError)
                try {
                    await generatePayslipPDF(item)
                } catch (autoTableError) {
                    console.warn('AutoTable failed, using simple PDF generator:', autoTableError)
                    // await generatePayslipPDFSimple(item)
                }
            }
            
            // Show success message
            setTimeout(() => {
                alert(`PDF for ${item.kolom_name} has been downloaded successfully!`)
            }, 100)
            
        } catch (error) {
            console.error('Error generating PDF:', error)
            alert('Failed to generate PDF. Please try again.')
        } finally {
            setGeneratingPDF(null) // Clear loading state
        }
    }

    // Handle download all PDFs
    const handleDownloadAllPDFs = async () => {
        if (filteredData.length === 0) {
            alert('No data available to download.')
            return
        }

        const confirmDownload = window.confirm(
            `This will download ${filteredData.length} PDF files. This may take a few moments. Continue?`
        )
        
        if (!confirmDownload) return

        try {
            setDownloadingAll(true)
            
            for (let i = 0; i < filteredData.length; i++) {
                const item = filteredData[i]
                
                // Add delay between downloads to prevent browser freeze
                if (i > 0) {
                    await new Promise(resolve => setTimeout(resolve, 200))
                }
                
                // Try logo version first, then fallback to standard, then simple
                try {
                    await generatePayslipPDF(item)
                } catch (logoError) {
                    console.warn('Logo PDF failed, trying standard version:', logoError)
                    try {
                        await generatePayslipPDF(item)
                    } catch (autoTableError) {
                        console.warn('AutoTable failed, using simple PDF generator:', autoTableError)
                        // await generatePayslipPDFSimple(item)
                    }
                }
            }
            
            alert(`Successfully generated ${filteredData.length} PDF files!`)
            
        } catch (error) {
            console.error('Error generating PDFs:', error)
            alert('Failed to generate some PDF files. Please try again.')
        } finally {
            setDownloadingAll(false)
        }
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
        { header: 'NIK' },
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
            <span className="font-monospace fw-medium">{item.kolom_ktp}</span>
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
        <td key="unit" className="text-muted">{item.kolom_pt}</td>,
        
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
                    onClick={() => handleViewDetails(item)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="View Details"
                >
                    <FaEye size={14} />
                </PayslipComponents.ActionButton>
                
                <PayslipComponents.ActionButton
                    className="btn-success"
                    onClick={() => handleDownloadPDF(item)}
                    whileHover={{ scale: generatingPDF === item.id ? 1 : 1.1 }}
                    whileTap={{ scale: generatingPDF === item.id ? 1 : 0.9 }}
                    title={generatingPDF === item.id ? "Generating PDF..." : "Download PDF"}
                    disabled={generatingPDF === item.id}
                >
                    {generatingPDF === item.id ? (
                        <FaSpinner size={14} className="spinner" />
                    ) : (
                        <FaDownload size={14} />
                    )}
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
            style={{
                '--spinner-animation': 'spin 1s linear infinite'
            }}
        >
            <style jsx>{`
                .spinner {
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
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
                        
                        {/* Download All Button */}
                        <div className="d-flex gap-2">
                            <motion.button
                                className="btn btn-outline-success d-flex align-items-center"
                                onClick={handleDownloadAllPDFs}
                                disabled={downloadingAll || filteredData.length === 0}
                                whileHover={{ scale: downloadingAll ? 1 : 1.05 }}
                                whileTap={{ scale: downloadingAll ? 1 : 0.95 }}
                                title={`Download all ${filteredData.length} PDFs`}
                            >
                                {downloadingAll ? (
                                    <>
                                        <FaSpinner className="me-2 spinner" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <FaCloudDownloadAlt className="me-2" />
                                        Download All ({filteredData.length})
                                    </>
                                )}
                            </motion.button>
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

            {/* PaySlip Detail Modal */}
            <PaySlipDetail
                isOpen={showDetail}
                onClose={handleCloseDetail}
                data={selectedPaySlip}
            />
        </motion.div>
    )
}