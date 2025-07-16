import { getImageBase64 } from '../../Helper/Helper'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Initialize autoTable plugin
if (typeof jsPDF !== 'undefined') {
    jsPDF.autoTableText = function (text, x, y, styles) {
        this.text(text, x, y, styles)
    }
}

// Function to format currency
const formatCurrency = (amount) => {
    if (!amount || amount === '') return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount)
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

// Function to safely get numeric value
const getNumericValue = (value) => {
    if (!value || value === '' || isNaN(value)) return 0
    return parseFloat(value)
}

export const generatePayslipPDF = async (payslipData) => {
    try {
        // Validate required data
        if (!payslipData) {
            throw new Error('Payslip data is required')
        }

        // Create new PDF document
        const doc = new jsPDF('landscape', 'mm', 'a4')
        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
    
    // Colors
    const primaryColor = [2, 83, 165] // Dark blue
    const secondaryColor = [102, 126, 234] // Light blue
    const accentColor = [40, 167, 69] // Green
    const lightGray = [248, 249, 250]
    const darkGray = [108, 117, 125]
    
    let yPos = 20
    
    // Header Section
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, pageWidth, 35, 'F')
        
    // Try to load and add logo
    try {
        const logoBase64 = await getImageBase64('/assets/img/motor-sights-international-logo-footer-white.png')
        if (logoBase64) {
            // Add logo image
            doc.addImage(logoBase64, 'PNG', 20, 8, 30, 20) // Adjust dimensions as needed
        } else {
            throw new Error('Logo not loaded')
        }
    } catch (logoError) {
        console.warn('Logo loading failed, using text fallback:', logoError)
        // Fallback to text
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        doc.text('MOTOR SIGHTS INTERNATIONAL', 20, 15)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'normal')
        doc.text('PAYROLL SLIP', 20, 25)
    }
    
    // Company Logo/Name
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    const headerPeriod = formatPeriod(payslipData.kolom_month)
    doc.text(headerPeriod, pageWidth - 20, 20, { align: 'right' })

    yPos = 40
    
    // Employee Information Section
    doc.setTextColor(...primaryColor)
    doc.setFillColor(...lightGray)
    doc.rect(10, yPos, pageWidth - 20, 8, 'F')
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('EMPLOYEE INFORMATION', 15, yPos + 5)
    
    yPos += 15
    
    // Employee details in two columns
    const employeeData = [
        ['Employee Name', payslipData.kolom_name || '-', 'NIK', payslipData.kolom_ktp || '-'],
        ['Job Title', payslipData.kolom_job_title || '-', 'Department', payslipData.kolom_departement || '-'],
        ['Location', payslipData.kolom_location || '-', 'Employment Status', payslipData.kolom_employment_status || '-'],
        ['Working Status', payslipData.kolom_working_status || '-', 'Level', payslipData.kolom_level || '-'],
        ['Email', payslipData.kolom_email_address || '-', 'NPWP', payslipData.kolom_npwp || '-'],
        ['Account Number', payslipData.kolom_accout_number || '-', 'Beneficiary', payslipData.kolom_beneficiery || '-']
    ]
    
    autoTable(doc, {
        startY: yPos,
        head: [],
        body: employeeData,
        theme: 'plain',
        styles: {
            fontSize: 9,
            cellPadding: 2,
            textColor: [0, 0, 0]
        },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 35 },
            1: { cellWidth: 55 },
            2: { fontStyle: 'bold', cellWidth: 35 },
            3: { cellWidth: 55 }
        },
        margin: { left: 15, right: 15 }
    })
    
    yPos = doc.lastAutoTable.finalY - 15
    
    const earningsData = [
        ['Basic Salary', formatCurrency(payslipData.kolom_basic)],
        ['Attendance Allowance', formatCurrency(payslipData.kolom_attendance)],
        ['Meal & Transport', formatCurrency(payslipData.kolom_meal_transport)],
        ['Communication Allowance', formatCurrency(payslipData.kolom_comunication)],
        ['Full Attendance Bonus', formatCurrency(payslipData.kolom_full_attendance)],
        ['Skill Allowance', formatCurrency(payslipData.kolom_skill)],
        ['Special Skill Allowance', formatCurrency(payslipData.kolom_special_skill)],
        ['Accommodation', formatCurrency(payslipData.kolom_accomodation)],
        ['KPI Bonus', formatCurrency(payslipData.kolom_kpi)],
        ['Total KPI', formatCurrency(payslipData.kolom_total_kpi)],
        ['Overtime Hours', `${payslipData.kolom_overtime_hour || '0'} hours`],
        ['Total Overtime Pay', formatCurrency(payslipData.kolom_total_overtime)],
        ['Point Payment', formatCurrency(payslipData.kolom_point_to_be_paid)],
        ['Sales Incentive', formatCurrency(payslipData.kolom_sales_incentive)],
        ['Other Allowances', formatCurrency(payslipData.kolom_others_tj)]
    ].filter(item => {
        // Filter out zero values and empty overtime hours
        if (item[0].includes('hours')) {
            return getNumericValue(payslipData.kolom_overtime_hour) > 0
        }
        return item[1] !== 'Rp 0' && item[1] !== '-'
    })
    
    // Add total earnings
    earningsData.push(['GROSS TOTAL', formatCurrency(payslipData.kolom_total_basic_allowance_incentive_bonus_pay_by_company_gross)])
    
    autoTable(doc, {
        startY: yPos,
        head: [
            [{ content: 'Salary', colSpan: 2, styles: { halign: 'center', fillColor: [195, 207, 226], textColor: [0, 0, 0], fontStyle: 'normal' } }]
        ],
        body: earningsData,
        theme: 'striped',
        styles: {
            fontSize: 9,
            cellPadding: 3,
            overflow: 'ellipsize', cellWidth: 'wrap'
        },
        columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: 40, halign: 'right' }
        },
        didParseCell: function(data) {
            if (data.row.index === earningsData.length - 1) {
                data.cell.styles.fontStyle = 'bold'
                data.cell.styles.fillColor = [254, 255, 226]
            }
        },
        margin: { left: 15, right: 15 },
        tableWidth: '100'
    })
    
    // yPos = doc.lastAutoTable.finalY + 15
    
    // // Check if we need a new page
    // if (yPos > pageHeight - 80) {
    //     doc.addPage()
    //     yPos = 20
    // }
    
    // yPos += 15
    
    const deductionsData = [
        ['APD (Safety Equipment)', formatCurrency(payslipData.kolom_apd)],
        ['Transport Ticket', formatCurrency(payslipData.kolom_transport_ticket)],
        ['Loan Deduction', formatCurrency(payslipData.kolom_loan)],
        ['Unpaid Leave', formatCurrency(payslipData.kolom_unpaid_leave_defaulters_work)],
        ['JHT (Employee 2%)', formatCurrency(payslipData.kolom_provident_fund_benefit_by_emp_jht_2_persen)],
        ['Pension (Employee 1%)', formatCurrency(payslipData.kolom_pension_by_emp_jp_1_persen)],
        ['Health Insurance (Employee 1%)', formatCurrency(payslipData.kolom_health_insurance_by_employee_1_persen)],
        ['Adjustment Deduction', formatCurrency(payslipData.kolom_adjusment_cut)],
        ['General Deduction', formatCurrency(payslipData.kolom_deduction)],
        ['PPh 21 Tax', formatCurrency(payslipData.kolom_pph_21)],
        ['Other Deductions', formatCurrency(payslipData.kolom_other_deduction)]
    ].filter(item => item[1] !== 'Rp 0')
    
    // Add total deductions
    deductionsData.push(['TOTAL DEDUCTIONS', formatCurrency(payslipData.kolom_total_deduction)])
    
    autoTable(doc, {
        startY: yPos,
        head: [
            [{ content: 'TOTAL DEDUCTIONS', colSpan: 2, styles: { halign: 'center', fillColor: [195, 207, 226], textColor: [0, 0, 0], fontStyle: 'normal' } }]
        ],
        body: deductionsData,
        theme: 'striped',
        styles: {
            fontSize: 9,
            cellPadding: 3
        },
        columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: 40, halign: 'right' }
        },
        didParseCell: function(data) {
            if (data.row.index === deductionsData.length - 1) {
                data.cell.styles.fontStyle = 'bold'
                data.cell.styles.fillColor = [255, 226, 226]
            }
        },
        margin: { left: 115, right: 15 },
        tableWidth: '100'
    })
    
    yPos = doc.lastAutoTable.finalY + 15
    
    // Company Contributions Section
    if (yPos > pageHeight - 60) {
        doc.addPage()
        yPos = 20
    }
    
    doc.setFillColor(...lightGray)
    doc.rect(10, yPos, pageWidth - 20, 8, 'F')
    doc.setFont('helvetica', 'bold')
    doc.text('COMPANY CONTRIBUTIONS', 15, yPos + 5)
    
    yPos += 15
    
    const contributionsData = [
        ['JHT (Company 3.7%)', formatCurrency(payslipData.kolom_jht_by_company_37_persen)],
        ['JKK (Company 0.24%)', formatCurrency(payslipData.kolom_jkk_by_company_024_persen)],
        ['JKM (Company 0.30%)', formatCurrency(payslipData.kolom_jkm_by_company_030_persen)],
        ['Pension (Company 2%)', formatCurrency(payslipData.kolom_jp_by_company_2_persen)],
        ['Health Insurance (Company 4%)', formatCurrency(payslipData.kolom_kes_by_company_4_persen)],
        ['TOTAL COMPANY CONTRIBUTION', formatCurrency(payslipData.kolom_total_by_company_1024_persen)]
    ]
    
    autoTable(doc, {
        startY: yPos,
        head: [],
        body: contributionsData,
        theme: 'striped',
        styles: {
            fontSize: 9,
            cellPadding: 3
        },
        columnStyles: {
            0: { cellWidth: 120 },
            1: { cellWidth: 60, halign: 'right' }
        },
        didParseCell: function(data) {
            if (data.row.index === contributionsData.length - 1) {
                data.cell.styles.fontStyle = 'bold'
                data.cell.styles.fillColor = [226, 255, 226]
            }
        },
        margin: { left: 15, right: 15 }
    })
    
    yPos = doc.lastAutoTable.finalY + 15
    
    // Summary Section
    doc.setFillColor(...secondaryColor)
    doc.rect(10, yPos, pageWidth - 20, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.text('PAYSLIP SUMMARY', 15, yPos + 5)
    
    yPos += 15
    
    const summaryData = [
        ['Gross Salary', formatCurrency(payslipData.kolom_total_basic_allowance_incentive_bonus_pay_by_company_gross)],
        ['Total Deductions', `(${formatCurrency(payslipData.kolom_total_deduction)})`],
        ['Tax Amount', formatCurrency(payslipData.kolom_tax)],
        ['NET SALARY RECEIVED', formatCurrency(payslipData.kolom_total_received_nett)],
        ['GRAND TOTAL', formatCurrency(payslipData.kolom_grand_total)]
    ]
    
    autoTable(doc, {
        startY: yPos,
        head: [],
        body: summaryData,
        theme: 'plain',
        styles: {
            fontSize: 11,
            cellPadding: 4,
            textColor: [0, 0, 0]
        },
        columnStyles: {
            0: { cellWidth: 120, fontStyle: 'bold' },
            1: { cellWidth: 60, halign: 'right', fontStyle: 'bold' }
        },
        didParseCell: function(data) {
            if (data.row.index === 3) { // NET SALARY RECEIVED
                data.cell.styles.fillColor = [212, 237, 218]
                data.cell.styles.fontSize = 12
            }
            if (data.row.index === 4) { // GRAND TOTAL
                data.cell.styles.fillColor = [255, 243, 205]
                data.cell.styles.fontSize = 12
            }
        },
        margin: { left: 15, right: 15 }
    })
    
    yPos = doc.lastAutoTable.finalY + 20
    
    // Attendance Information (if space allows)
    if (yPos < pageHeight - 60) {
        doc.setTextColor(...primaryColor)
        doc.setFillColor(...lightGray)
        doc.rect(10, yPos, pageWidth - 20, 8, 'F')
        doc.setFont('helvetica', 'bold')
        doc.text('ATTENDANCE INFORMATION', 15, yPos + 5)
        
        yPos += 15
        
        const attendanceData = [
            ['Standard Days', payslipData.kolom_std || '0', 'Scheduled Days', payslipData.kolom_sch || '0'],
            ['Actual Days', payslipData.kolom_act || '0', 'Days Off', payslipData.kolom_off || '0'],
            ['Holiday', payslipData.kolom_h || '0', 'Sick Leave', payslipData.kolom_s1 || '0'],
            ['Annual Leave', payslipData.kolom_al || '0', 'Late Days', payslipData.kolom_late || '0']
        ]
        
        autoTable(doc, {
            startY: yPos,
            head: [],
            body: attendanceData,
            theme: 'plain',
            styles: {
                fontSize: 9,
                cellPadding: 2
            },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 35 },
                1: { cellWidth: 25, halign: 'center' },
                2: { fontStyle: 'bold', cellWidth: 35 },
                3: { cellWidth: 25, halign: 'center' }
            },
            margin: { left: 15, right: 15 }
        })
        
        yPos = doc.lastAutoTable.finalY + 10
    }
    
    // Footer
    if (yPos > pageHeight - 30) {
        doc.addPage()
        yPos = pageHeight - 30
    } else {
        yPos = pageHeight - 30
    }
    
    // Add watermark
    doc.setTextColor(200, 200, 200)
    doc.setFontSize(50)
    doc.setFont('helvetica', 'bold')
    const watermarkText = 'CONFIDENTIAL'
    const watermarkWidth = doc.getTextWidth(watermarkText)
    doc.text(
        watermarkText, 
        (pageWidth - watermarkWidth) / 2, 
        pageHeight / 2, 
        { 
            angle: 45,
            align: 'center'
        }
    )
    
    doc.setTextColor(...darkGray)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Generated on: ' + new Date().toLocaleDateString('id-ID'), 15, yPos)
    doc.text('This is a computer generated payslip and does not require signature.', pageWidth - 15, yPos, { align: 'right' })
    
    // Add remarks if any
    if (payslipData.kolom_remarks) {
        yPos -= 10
        doc.text('Remarks: ' + payslipData.kolom_remarks, 15, yPos)
    }
    
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
