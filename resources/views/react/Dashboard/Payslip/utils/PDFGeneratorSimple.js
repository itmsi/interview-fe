import jsPDF from 'jspdf'

// Function to format currency
const formatCurrency = (amount) => {
    if (!amount || amount === '') return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount)
}

// Function to format date
const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

// Function to format period
const formatPeriod = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long'
    })
}

// Simple table function
const drawSimpleTable = (doc, data, startY, columnWidths = [90, 60]) => {
    let currentY = startY
    const margin = 15
    const rowHeight = 6
    
    data.forEach((row, index) => {
        const isHeader = Array.isArray(row) && row.length === 4 && index === 0
        const isTotal = row[0] && (row[0].includes('TOTAL') || row[0].includes('GROSS'))
        
        if (isTotal) {
            doc.setFont('helvetica', 'bold')
            doc.setFillColor(255, 255, 200)
            doc.rect(margin, currentY - 4, columnWidths[0] + columnWidths[1], rowHeight, 'F')
        } else {
            doc.setFont('helvetica', 'normal')
        }
        
        // Draw left column
        doc.text(row[0] || '', margin + 2, currentY)
        
        // Draw right column
        const rightText = row[1] || ''
        doc.text(rightText, margin + columnWidths[0] + columnWidths[1] - 2, currentY, { align: 'right' })
        
        // Draw line
        doc.setDrawColor(200, 200, 200)
        doc.line(margin, currentY + 2, margin + columnWidths[0] + columnWidths[1], currentY + 2)
        
        currentY += rowHeight
    })
    
    return currentY
}

export const generatePayslipPDFSimple = (payslipData) => {
    try {
        // Validate required data
        if (!payslipData) {
            throw new Error('Payslip data is required')
        }

        // Create new PDF document
        const doc = new jsPDF('p', 'mm', 'a4')
        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        
        // Colors
        const primaryColor = [54, 69, 79]
        const lightGray = [248, 249, 250]
        const darkGray = [108, 117, 125]
        
        let yPos = 20
        
        // Header Section
        doc.setFillColor(...primaryColor)
        doc.rect(0, 0, pageWidth, 35, 'F')
        
        // Company Logo/Name
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(20)
        doc.setFont('helvetica', 'bold')
        doc.text('PAY SLIP', 20, 15)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'normal')
        doc.text(`${payslipData.kolom_pt1 || payslipData.kolom_pt || 'Company Name'}`, 20, 25)
        
        // Period in header
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        const headerPeriod = formatPeriod(payslipData.kolom_month)
        doc.text(headerPeriod, pageWidth - 20, 20, { align: 'right' })
        
        // Employee ID in header
        doc.setFontSize(10)
        doc.text(`ID: ${payslipData.kolom_ktp || 'N/A'}`, pageWidth - 20, 28, { align: 'right' })
        
        yPos = 45
        
        // Employee Information Section
        doc.setTextColor(...primaryColor)
        doc.setFillColor(...lightGray)
        doc.rect(10, yPos, pageWidth - 20, 8, 'F')
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('EMPLOYEE INFORMATION', 15, yPos + 5)
        
        yPos += 15
        
        // Employee details
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        
        const employeeInfo = [
            `Name: ${payslipData.kolom_name || '-'}`,
            `NIK: ${payslipData.kolom_ktp || '-'}`,
            `Job Title: ${payslipData.kolom_job_title || '-'}`,
            `Department: ${payslipData.kolom_departement || '-'}`,
            `Location: ${payslipData.kolom_location || '-'}`,
            `Email: ${payslipData.kolom_email_address || '-'}`
        ]
        
        employeeInfo.forEach((info, index) => {
            doc.text(info, 15, yPos + (index * 5))
        })
        
        yPos += (employeeInfo.length * 5) + 10
        
        // Earnings Section
        doc.setFillColor(...lightGray)
        doc.rect(10, yPos, pageWidth - 20, 8, 'F')
        doc.setFont('helvetica', 'bold')
        doc.text('EARNINGS & ALLOWANCES', 15, yPos + 5)
        
        yPos += 15
        
        const earningsData = [
            ['Basic Salary', formatCurrency(payslipData.kolom_basic)],
            ['Full Attendance Bonus', formatCurrency(payslipData.kolom_full_attendance)],
            ['Special Skill Allowance', formatCurrency(payslipData.kolom_special_skill)],
            ['Total Overtime Pay', formatCurrency(payslipData.kolom_total_overtime)],
            ['Point Payment', formatCurrency(payslipData.kolom_point_to_be_paid)],
            ['GROSS TOTAL', formatCurrency(payslipData.kolom_total_basic_allowance_incentive_bonus_pay_by_company_gross)]
        ].filter(item => item[1] !== 'Rp 0')
        
        yPos = drawSimpleTable(doc, earningsData, yPos)
        yPos += 10
        
        // Check if we need a new page
        if (yPos > pageHeight - 80) {
            doc.addPage()
            yPos = 20
        }
        
        // Deductions Section
        doc.setFillColor(...lightGray)
        doc.rect(10, yPos, pageWidth - 20, 8, 'F')
        doc.setFont('helvetica', 'bold')
        doc.text('DEDUCTIONS', 15, yPos + 5)
        
        yPos += 15
        
        const deductionsData = [
            ['APD (Safety Equipment)', formatCurrency(payslipData.kolom_apd)],
            ['JHT (Employee 2%)', formatCurrency(payslipData.kolom_provident_fund_benefit_by_emp_jht_2_persen)],
            ['Pension (Employee 1%)', formatCurrency(payslipData.kolom_pension_by_emp_jp_1_persen)],
            ['Health Insurance (Employee 1%)', formatCurrency(payslipData.kolom_health_insurance_by_employee_1_persen)],
            ['PPh 21 Tax', formatCurrency(payslipData.kolom_pph_21)],
            ['TOTAL DEDUCTIONS', formatCurrency(payslipData.kolom_total_deduction)]
        ].filter(item => item[1] !== 'Rp 0')
        
        yPos = drawSimpleTable(doc, deductionsData, yPos)
        yPos += 10
        
        // Summary Section
        doc.setFillColor(102, 126, 234)
        doc.rect(10, yPos, pageWidth - 20, 8, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFont('helvetica', 'bold')
        doc.text('PAYSLIP SUMMARY', 15, yPos + 5)
        
        yPos += 15
        
        // Summary with larger font
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        
        // NET SALARY RECEIVED
        doc.setFillColor(212, 237, 218)
        doc.rect(15, yPos - 4, pageWidth - 30, 10, 'F')
        doc.text('NET SALARY RECEIVED:', 20, yPos + 2)
        doc.text(formatCurrency(payslipData.kolom_total_received_nett), pageWidth - 20, yPos + 2, { align: 'right' })
        
        yPos += 15
        
        // GRAND TOTAL
        doc.setFillColor(255, 243, 205)
        doc.rect(15, yPos - 4, pageWidth - 30, 10, 'F')
        doc.text('GRAND TOTAL:', 20, yPos + 2)
        doc.text(formatCurrency(payslipData.kolom_grand_total), pageWidth - 20, yPos + 2, { align: 'right' })
        
        yPos += 20
        
        // Footer
        yPos = pageHeight - 20
        doc.setTextColor(...darkGray)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.text('Generated on: ' + new Date().toLocaleDateString('id-ID'), 15, yPos)
        doc.text('This is a computer generated payslip and does not require signature.', pageWidth - 15, yPos, { align: 'right' })
        
        // Generate filename
        const employeeName = payslipData.kolom_name?.replace(/[^a-zA-Z0-9]/g, '_') || 'Employee'
        const filePeriod = payslipData.kolom_month?.substring(0, 7).replace('-', '_') || 'Unknown'
        const filename = `Payslip_${employeeName}_${filePeriod}.pdf`
        
        // Save the PDF
        doc.save(filename)
        
    } catch (error) {
        console.error('Error generating PDF:', error)
        throw new Error(`Failed to generate PDF: ${error.message}`)
    }
}
