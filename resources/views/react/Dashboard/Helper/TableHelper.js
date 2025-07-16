import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import styled from 'styled-components'
import { 
    FaChevronLeft, 
    FaChevronRight,
    FaExclamationTriangle
} from 'react-icons/fa'

// Styled Components untuk komponen modular
export const ModularStyledComponents = {
    FilterCard: styled(motion.div)`
        border: none;
        border-radius: 0.5rem;
        background: #dfe8f2;
        
        .card-header {
            background: rgba(255, 255, 255, 0.1);
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        .form-label {
            margin-bottom: .2rem;
            font-weight: 500;
        }
    `,

    SearchInput: styled.input`
        border-radius: 0.375rem;
        border: 1px solid #e3e6f0;
        transition: all 0.15s ease-in-out;
        font-family: var(--font-main);
        font-size: 14px;
        &:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
    `,

    SearchSelect: styled.select`
        border-radius: 0.375rem;
        border: 1px solid #e3e6f0;
        transition: all 0.15s ease-in-out;
        font-family: var(--font-main);
        font-size: 14px;
        &:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
    `,

    ResetButton: styled(motion.button)`
        border-radius: 0.375rem;
        border: 1px solid #f8d7da;
        background: #f8d7da;
        color: #721c24;
        transition: all 0.15s ease-in-out;
        font-family: var(--font-main);
        font-size: 14px;
        
        &:hover {
            background: #f1aeb5;
            border-color: #f1aeb5;
            color: #58151c;
        }
    `,

    TableContainer: styled(motion.div)`
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
        overflow: hidden;
        
        .table-responsive {
            overflow-x: auto;
            position: relative;
            
            /* Custom scrollbar */
            &::-webkit-scrollbar {
                height: 8px;
            }
            
            &::-webkit-scrollbar-track {
                background: #f1f3f4;
                border-radius: 4px;
            }
            
            &::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 4px;
                border: 1px solid #f1f3f4;
            }
            
            &::-webkit-scrollbar-thumb:hover {
                background: #a8a8a8;
            }
            
            &.dragging {
                cursor: grabbing !important;
                user-select: none;
            }
        }
    `,

    CustomTable: styled.table`
        font-family: var(--font-main);
        
        thead th {
            background: #dfe8f2;
            color: #111827;
            font-weight: 400;
            font-family: var(--font-main-bold);
            font-size: 0.875rem;
            border: none;
            position: sticky;
            top: 0;
            z-index: 10;
            font-size: 14px;
            padding: 12px 8px;
        }
        
        tbody td {
            border-color: #e3e6f0;
            font-size: 14px;
            padding: 12px 8px;
            vertical-align: middle;
        }
        
        tbody tr:hover {
            background-color: #f8f9fc;
        }
    `,

    CustomPagination: styled.ul`
        .page-link {
            border: 1px solid #e3e6f0;
            color: #5a5c69;
            font-family: var(--font-main);
            font-size: 14px;
            transition: all 0.15s ease-in-out;
            cursor: pointer;
            pointer-events: auto;
            
            &:hover:not(:disabled) {
                background-color: var(--color-main);
                border-color: var(--color-main);
                color: white;
                /* transform: translateY(-1px); */
            }
            
            &:focus {
                box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
            }
            
            &:disabled {
                cursor: not-allowed;
                /* opacity: 0.6; */
            }
        }
        
        .page-item.active .page-link {
            background-color: var(--color-main);
            border-color: var(--color-main);
            color: white;
            cursor: default;
        }
        
        .page-item.disabled .page-link {
            color: #6c757d;
            background-color: #fff;
            border-color: #dee2e6;
            cursor: not-allowed;
        }
    `,

    LoadingSpinner: styled(motion.div)`
        text-align: center;
        padding: 3rem 1rem;
        color: #6c757d;
        
        .spinner-border {
            width: 3rem;
            height: 3rem;
            border-width: 0.25rem;
        }
    `,

    NoDataMessage: styled(motion.div)`
        text-align: center;
        padding: 3rem 1rem;
        color: #6c757d;
        
        .display-6 {
            font-size: 2rem;
            font-weight: 300;
            color: #adb5bd;
        }
    `
}

// Animation variants
export const animationVariants = {
    container: {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    },
    item: {
        hidden: { opacity: 0, x: 10 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3, ease: 'easeOut' }
        },
        exit: { 
            opacity: 0, 
            x: -10,
            transition: { 
                duration: 0.2,
                ease: "easeIn"
            }
        }
    },
    row: {
        hidden: { opacity: 0, x: -10 },
        visible: (index) => ({
            opacity: 1,
            x: 0,
            transition: { 
                duration: 0.2,
                delay: index * 0.07,
                ease: "easeOut"
            }
        }),
        exit: { 
            opacity: 0, 
            x: -10,
            transition: { 
                duration: 0.1,
                ease: "easeIn"
            }
        }
    }
}

// Hook untuk drag scroll functionality
export const useDragScroll = () => {
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)
    const tableResponsiveRef = useRef(null)

    const handleMouseDown = useCallback((e) => {
        const tableContainer = tableResponsiveRef.current
        if (!tableContainer) return
        
        setIsDragging(true)
        setStartX(e.pageX - tableContainer.offsetLeft)
        setScrollLeft(tableContainer.scrollLeft)
        tableContainer.style.cursor = 'grabbing'
        tableContainer.classList.add('dragging')
        
        e.preventDefault()
    }, [])

    const handleMouseLeave = useCallback((e) => {
        if (isDragging) {
            setIsDragging(false)
            const tableContainer = tableResponsiveRef.current
            if (tableContainer) {
                tableContainer.style.cursor = 'grab'
                tableContainer.classList.remove('dragging')
            }
        }
    }, [isDragging])

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
        const tableContainer = tableResponsiveRef.current
        if (tableContainer) {
            tableContainer.style.cursor = 'grab'
            tableContainer.classList.remove('dragging')
        }
    }, [])

    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return
        e.preventDefault()
        
        const tableContainer = tableResponsiveRef.current
        if (!tableContainer) return
        
        const x = e.pageX - tableContainer.offsetLeft
        const walk = (x - startX) * 2
        tableContainer.scrollLeft = scrollLeft - walk
    }, [isDragging, startX, scrollLeft])

    const handleTouchStart = useCallback((e) => {
        const tableContainer = tableResponsiveRef.current
        if (!tableContainer) return
        
        const touch = e.touches[0]
        setIsDragging(true)
        setStartX(touch.pageX - tableContainer.offsetLeft)
        setScrollLeft(tableContainer.scrollLeft)
        tableContainer.classList.add('dragging')
    }, [])

    const handleTouchMove = useCallback((e) => {
        if (!isDragging) return
        
        const tableContainer = tableResponsiveRef.current
        if (!tableContainer) return
        
        const touch = e.touches[0]
        const x = touch.pageX - tableContainer.offsetLeft
        const walk = (x - startX) * 2
        tableContainer.scrollLeft = scrollLeft - walk
    }, [isDragging, startX, scrollLeft])

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false)
        const tableContainer = tableResponsiveRef.current
        if (tableContainer) {
            tableContainer.classList.remove('dragging')
        }
    }, [])

    return {
        tableResponsiveRef,
        isDragging,
        dragHandlers: {
            onMouseDown: handleMouseDown,
            onMouseLeave: handleMouseLeave,
            onMouseUp: handleMouseUp,
            onMouseMove: handleMouseMove,
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd
        }
    }
}

// Komponen Filter yang dapat digunakan kembali
export const DataFilter = ({ 
    filters, 
    onFilterChange, 
    filterConfig = [],
}) => {
    return (
        <ModularStyledComponents.FilterCard
            variants={animationVariants.item}
            initial="hidden"
            animate="visible"
            className="mb-4 p-4"
        >
            <div className="row g-3">
                {filterConfig.map((config, index) => (
                    <div key={index} className={`col-md-${config.colSize || 3}`}>
                        <label className="form-label">{config.label}</label>
                        {config.type === 'select' ? (
                            <ModularStyledComponents.SearchSelect
                                className="form-select"
                                value={filters[config.key] || ''}
                                onChange={(e) => onFilterChange(config.key, e.target.value)}
                            >
                                <option value="">{config.placeholder}</option>
                                {config.options.map((option, idx) => (
                                    <option key={idx} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </ModularStyledComponents.SearchSelect>
                        ) : (
                            <ModularStyledComponents.SearchInput
                                type={config.type || 'text'}
                                className="form-control"
                                placeholder={config.placeholder}
                                value={filters[config.key] || ''}
                                onChange={(e) => onFilterChange(config.key, e.target.value)}
                            />
                        )}
                    </div>
                ))}
                
                {/* {showResetButton && (
                    <div className="col-md-3 d-flex align-items-end">
                        <ModularStyledComponents.ResetButton
                            type="button"
                            className="btn w-100"
                            onClick={onReset}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FaUndo className="me-2" />
                            Reset Filter
                        </ModularStyledComponents.ResetButton>
                    </div>
                )} */}
            </div>
        </ModularStyledComponents.FilterCard>
    )
}

// Komponen Table yang dapat digunakan kembali
export const DataTable = ({ 
    data, 
    columns, 
    loading = false, 
    emptyMessage = "No data available",
    emptyIcon = FaExclamationTriangle,
    minWidth = "1440px",
    renderRow,
    currentPage = 1,
    startIndex = 0
}) => {
    const { tableResponsiveRef, isDragging, dragHandlers } = useDragScroll()
    const EmptyIcon = emptyIcon

    if (loading) {
        return (
            <ModularStyledComponents.LoadingSpinner
                variants={animationVariants.item}
                initial="hidden"
                animate="visible"
            >
                <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div>Loading data...</div>
            </ModularStyledComponents.LoadingSpinner>
        )
    }

    return (
        <ModularStyledComponents.TableContainer
            variants={animationVariants.item}
            initial="hidden"
            animate="visible"
        >
            <div 
                ref={tableResponsiveRef}
                className="table-responsive"
                {...dragHandlers}
                style={{ 
                    cursor: isDragging ? 'grabbing' : 'grab',
                    userSelect: isDragging ? 'none' : 'auto'
                }}
            >
                <ModularStyledComponents.CustomTable 
                    className="table table-hover mb-0" 
                    style={{ minWidth }}
                >
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th 
                                    key={index} 
                                    scope="col" 
                                    style={column.style}
                                    width={column.width}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence mode="popLayout">
                            {data.length > 0 ? (
                                data.map((item, index) => (
                                    <motion.tr 
                                        key={`${item.id || index}-${currentPage}`}
                                        variants={animationVariants.row}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        custom={index}
                                        layout
                                        as="tr"
                                    >
                                        {renderRow(item, startIndex + index)}
                                    </motion.tr>
                                ))
                            ) : (
                                <motion.tr
                                    variants={animationVariants.row}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    as="tr"
                                >
                                    <td colSpan={columns.length}>
                                        <ModularStyledComponents.NoDataMessage>
                                            <EmptyIcon size={48} className="text-muted mb-3" />
                                            <div className="display-6 mb-2">No Data Found</div>
                                            <p className="text-muted mb-0">{emptyMessage}</p>
                                        </ModularStyledComponents.NoDataMessage>
                                    </td>
                                </motion.tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </ModularStyledComponents.CustomTable>
            </div>
        </ModularStyledComponents.TableContainer>
    )
}

// Komponen Pagination yang dapat digunakan kembali
export const DataPagination = ({ 
    currentPage, 
    totalPages, 
    totalItems, 
    itemsPerPage, 
    onPageChange,
    startIndex,
    endIndex 
}) => {
    if (totalPages <= 1) return null

    const getVisiblePages = () => {
        const delta = 2
        const range = []
        const rangeWithDots = []

        // Handle case when totalPages is 1 or 2
        if (totalPages <= 2) {
            for (let i = 1; i <= totalPages; i++) {
                rangeWithDots.push(i)
            }
            return rangeWithDots
        }

        // Generate range around current page
        for (let i = Math.max(2, currentPage - delta); 
             i <= Math.min(totalPages - 1, currentPage + delta); 
             i++) {
            range.push(i)
        }

        // Add first page
        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...')
        } else {
            rangeWithDots.push(1)
        }

        // Add range
        rangeWithDots.push(...range)

        // Add last page
        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages)
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages)
        }

        return rangeWithDots
    }

    return (
        <motion.div 
            className="d-flex justify-content-between align-items-center mt-4"
            variants={animationVariants.item}
            initial="hidden"
            animate="visible"
        >
            <div className="text-muted">
                Showing {startIndex + 1} to {endIndex} of {totalItems} entries
            </div>
            <nav>
                <ModularStyledComponents.CustomPagination className="pagination mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                            type="button"
                            className="page-link" 
                            onClick={(e) => {
                                e.preventDefault()
                                onPageChange(currentPage - 1)
                            }}
                            disabled={currentPage === 1}
                        >
                            <FaChevronLeft />
                        </button>
                    </li>

                    {getVisiblePages().map((page, index) => (
                        <li key={`page-${index}`} className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}>
                            {page === '...' ? (
                                <span className="page-link">...</span>
                            ) : (
                                <button 
                                    type="button"
                                    className="page-link" 
                                    onClick={(e) => {
                                        e.preventDefault()
                                        onPageChange(page)
                                    }}
                                    disabled={page === currentPage}
                                >
                                    {page}
                                </button>
                            )}
                        </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button 
                            type="button"
                            className="page-link" 
                            onClick={(e) => {
                                e.preventDefault()
                                onPageChange(currentPage + 1)
                            }}
                            disabled={currentPage === totalPages}
                        >
                            <FaChevronRight />
                        </button>
                    </li>
                </ModularStyledComponents.CustomPagination>
            </nav>
        </motion.div>
    )
}

// Hook untuk pagination logic
export const usePagination = (data, itemsPerPage = 10) => {
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = Math.ceil(data.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, data.length)
    const currentData = data.slice(startIndex, endIndex)

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    // Reset ke halaman 1 ketika data berubah
    useEffect(() => {
        setCurrentPage(1)
    }, [data.length])

    return {
        currentPage,
        totalPages,
        startIndex,
        endIndex,
        currentData,
        goToPage,
        totalItems: data.length
    }
}

// Hook untuk filter logic
export const useDataFilter = (data, filterFunction) => {
    const [filters, setFilters] = useState({})

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const handleReset = () => {
        setFilters({})
    }

    const filteredData = useMemo(() => {
        if (!filterFunction) return data
        return filterFunction(data, filters)
    }, [data, filters, filterFunction])

    return {
        filters,
        filteredData,
        handleFilterChange,
        handleReset
    }
}
