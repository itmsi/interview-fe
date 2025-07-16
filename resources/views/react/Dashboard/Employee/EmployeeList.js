import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { FaUsers, FaCalendarAlt, FaBuilding } from 'react-icons/fa'
import { 
    DataFilter, 
    DataTable, 
    DataPagination, 
    useDataFilter, 
    usePagination, 
    animationVariants 
} from '../Helper/TableHelper'

// Contoh penggunaan komponen modular untuk data Employee
const EmployeeList = () => {
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)

    // Simulasi fetch data
    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true)
            // Simulasi delay
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Data dummy
            const dummyData = [
                {
                    id: 1,
                    name: 'John Doe',
                    email: 'john@company.com',
                    department: 'Engineering',
                    position: 'Senior Developer',
                    status: 'Active',
                    joinDate: '2023-01-15'
                },
                {
                    id: 2,
                    name: 'Jane Smith',
                    email: 'jane@company.com',
                    department: 'Marketing',
                    position: 'Marketing Manager',
                    status: 'Active',
                    joinDate: '2022-08-20'
                },
                // ... more employees
            ]
            
            setEmployees(dummyData)
            setLoading(false)
        }

        fetchEmployees()
    }, [])

    // Konfigurasi filter untuk Employee
    const filterConfig = [
        {
            key: 'name',
            label: 'Employee Name',
            type: 'text',
            placeholder: 'Search by name...',
            colSize: 4
        },
        {
            key: 'department',
            label: 'Department',
            type: 'select',
            placeholder: 'Select Department',
            options: [
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Marketing', label: 'Marketing' },
                { value: 'HR', label: 'Human Resources' },
                { value: 'Finance', label: 'Finance' }
            ],
            colSize: 3
        },
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            placeholder: 'Select Status',
            options: [
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' }
            ],
            colSize: 3
        }
    ]

    // Filter logic
    const filterFunction = (data, filters) => {
        return data.filter(item => {
            const nameMatch = !filters.name || 
                item.name.toLowerCase().includes(filters.name.toLowerCase())
            
            const departmentMatch = !filters.department || 
                item.department === filters.department
            
            const statusMatch = !filters.status || 
                item.status === filters.status

            return nameMatch && departmentMatch && statusMatch
        })
    }

    // Use custom hooks
    const { filters, filteredData, handleFilterChange, handleReset } = useDataFilter(employees, filterFunction)
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
        { header: 'Employee Name' },
        { header: 'Department' },
        { header: 'Position' },
        { header: 'Join Date' },
        { header: 'Status' },
        { header: 'Action' }
    ]

    // Row renderer
    const renderRow = (item, index) => [
        <td key="no" className="text-center font-primary-bold">
            {startIndex + index + 1}
        </td>,
        <td key="name">
            <div>
                <div className="font-primary-bold text-dark">{item.name}</div>
                <small className="text-muted">{item.email}</small>
            </div>
        </td>,
        <td key="department" className="text-muted">{item.department}</td>,
        <td key="position" className="text-muted">{item.position}</td>,
        <td key="joinDate" className="text-muted">{item.joinDate}</td>,
        <td key="status">
            <span className={`badge ${item.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                {item.status}
            </span>
        </td>,
        <td key="action">
            <button 
                className="btn btn-sm btn-primary"
                onClick={() => alert(`Edit ${item.name}`)}
            >
                Edit
            </button>
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
                                <FaUsers className="me-3 text-primary" />
                                Employee Management
                            </h4>
                            <p className="text-muted mb-0">Manage company employees</p>
                        </div>
                    </div>

                    {/* Filter Component - Reusable */}
                    <DataFilter
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onReset={handleReset}
                        filterConfig={filterConfig}
                        title="Filter Employees"
                    />

                    {/* Table Component - Reusable */}
                    <DataTable
                        data={currentData}
                        columns={columns}
                        loading={loading}
                        emptyMessage="No employees found. Try adjusting your filters."
                        emptyIcon={FaUsers}
                        renderRow={renderRow}
                        currentPage={currentPage}
                        startIndex={startIndex}
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

export default EmployeeList
