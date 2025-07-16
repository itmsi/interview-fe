import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Function to convert image to base64
const getImageBase64 = async (imagePath) => {
    try {
        const response = await fetch(imagePath)
        const blob = await response.blob()
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        })
    } catch (error) {
        console.error('Failed to load image:', error)
        return null
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

export const generatePayslipPDFWithLogo = async (payslipData) => {
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
        const secondaryColor = [102, 126, 234]
        const lightGray = [248, 249, 250]
        const darkGray = [108, 117, 125]
        
        let yPos = 20
        
        // Header Section
        doc.setFillColor(...primaryColor)
        doc.rect(0, 0, pageWidth, 35, 'F')
        
        // Try to load and add logo
        try {
            const logoBase64 = await getImageBase64('/assets/img/motor-sights-international-text-white.png')
            if (logoBase64) {
                // Add logo image
                doc.addImage(logoBase64, 'PNG', 20, 8, 60, 20) // Adjust dimensions as needed
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
        
        // Period in header (right side)
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        const headerPeriod = formatPeriod(payslipData.kolom_month)
        doc.text(headerPeriod, pageWidth - 20, 20, { align: 'right' })
        
        yPos = 40
        
        // Employee Information Section (Compact)
        doc.setTextColor(...primaryColor)
        doc.setFillColor(...lightGray)
        doc.rect(10, yPos, pageWidth - 20, 6, 'F')
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text('EMPLOYEE INFORMATION', 15, yPos + 4)
        
        yPos += 10
        
        // Employee details
        const employeeData = [
            ['Employee Name', payslipData.kolom_name || '-', 'NIK', payslipData.kolom_ktp || '-'],
            ['Job Title', payslipData.kolom_job_title || '-', 'Department', payslipData.kolom_departement || '-'],
            ['Location', payslipData.kolom_location || '-', 'Status', payslipData.kolom_employment_status || '-']
        ]
        
        autoTable(doc, {
            startY: yPos,
            head: [],
            body: employeeData,
            theme: 'plain',
            styles: {
                fontSize: 8,
                cellPadding: 1,
                textColor: [0, 0, 0]
            },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 30 },
                1: { cellWidth: 50 },
                2: { fontStyle: 'bold', cellWidth: 25 },
                3: { cellWidth: 45 }
            },
            margin: { left: 15, right: 15 }
        })
        
        yPos = doc.lastAutoTable.finalY + 8
        
        // Earnings Section
        doc.setFillColor(...lightGray)
        doc.rect(10, yPos, pageWidth - 20, 6, 'F')
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.text('EARNINGS & ALLOWANCES', 15, yPos + 4)
        
        yPos += 10
        
        const earningsData = [
            ['Basic Salary', formatCurrency(payslipData.kolom_basic)],
            ['Full Attendance Bonus', formatCurrency(payslipData.kolom_full_attendance)],
            ['Special Skill Allowance', formatCurrency(payslipData.kolom_special_skill)],
            ['Total Overtime Pay', formatCurrency(payslipData.kolom_total_overtime)],
            ['Point Payment', formatCurrency(payslipData.kolom_point_to_be_paid)]
        ].filter(item => item[1] !== 'Rp 0')
        
        earningsData.push(['GROSS TOTAL', formatCurrency(payslipData.kolom_total_basic_allowance_incentive_bonus_pay_by_company_gross)])
        
        autoTable(doc, {
            startY: yPos,
            head: [],
            body: earningsData,
            theme: 'striped',
            styles: {
                fontSize: 8,
                cellPadding: 2
            },
            columnStyles: {
                0: { cellWidth: 100 },
                1: { cellWidth: 50, halign: 'right' }
            },
            didParseCell: function(data) {
                if (data.row.index === earningsData.length - 1) {
                    data.cell.styles.fontStyle = 'bold'
                    data.cell.styles.fillColor = [254, 255, 226]
                }
            },
            margin: { left: 15, right: 15 }
        })
        
        yPos = doc.lastAutoTable.finalY + 8
        
        // Deductions Section
        doc.setFillColor(...lightGray)
        doc.rect(10, yPos, pageWidth - 20, 6, 'F')
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.text('DEDUCTIONS', 15, yPos + 4)
        
        yPos += 10
        
        const deductionsData = [
            ['JHT (Employee 2%)', formatCurrency(payslipData.kolom_provident_fund_benefit_by_emp_jht_2_persen)],
            ['Pension (Employee 1%)', formatCurrency(payslipData.kolom_pension_by_emp_jp_1_persen)],
            ['Health Insurance (Employee 1%)', formatCurrency(payslipData.kolom_health_insurance_by_employee_1_persen)],
            ['PPh 21 Tax', formatCurrency(payslipData.kolom_pph_21)]
        ].filter(item => item[1] !== 'Rp 0')
        
        deductionsData.push(['TOTAL DEDUCTIONS', formatCurrency(payslipData.kolom_total_deduction)])
        
        autoTable(doc, {
            startY: yPos,
            head: [],
            body: deductionsData,
            theme: 'striped',
            styles: {
                fontSize: 8,
                cellPadding: 2
            },
            columnStyles: {
                0: { cellWidth: 100 },
                1: { cellWidth: 50, halign: 'right' }
            },
            didParseCell: function(data) {
                if (data.row.index === deductionsData.length - 1) {
                    data.cell.styles.fontStyle = 'bold'
                    data.cell.styles.fillColor = [255, 226, 226]
                }
            },
            margin: { left: 15, right: 15 }
        })
        
        yPos = doc.lastAutoTable.finalY + 8
        
        // Summary Section
        doc.setFillColor(...secondaryColor)
        doc.rect(10, yPos, pageWidth - 20, 6, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.text('PAYSLIP SUMMARY', 15, yPos + 4)
        
        yPos += 10
        
        const summaryData = [
            ['Gross Salary', formatCurrency(payslipData.kolom_total_basic_allowance_incentive_bonus_pay_by_company_gross)],
            ['Total Deductions', `(${formatCurrency(payslipData.kolom_total_deduction)})`],
            ['NET SALARY RECEIVED', formatCurrency(payslipData.kolom_total_received_nett)]
        ]
        
        autoTable(doc, {
            startY: yPos,
            head: [],
            body: summaryData,
            theme: 'plain',
            styles: {
                fontSize: 10,
                cellPadding: 3,
                textColor: [0, 0, 0]
            },
            columnStyles: {
                0: { cellWidth: 100, fontStyle: 'bold' },
                1: { cellWidth: 50, halign: 'right', fontStyle: 'bold' }
            },
            didParseCell: function(data) {
                if (data.row.index === 2) { // NET SALARY RECEIVED
                    data.cell.styles.fillColor = [212, 237, 218]
                    data.cell.styles.fontSize = 12
                }
            },
            margin: { left: 15, right: 15 }
        })
        
        // Watermark
        doc.setTextColor(230, 230, 230)
        doc.setFontSize(40)
        doc.setFont('helvetica', 'bold')
        const watermarkText = 'CONFIDENTIAL'
        const watermarkWidth = doc.getTextWidth(watermarkText)
        doc.text(
            watermarkText, 
            (pageWidth - watermarkWidth) / 2, 
            pageHeight / 2 - 20, 
            { 
                angle: 45,
                align: 'center'
            }
        )
        
        // Footer
        yPos = pageHeight - 15
        doc.setTextColor(...darkGray)
        doc.setFontSize(7)
        doc.setFont('helvetica', 'normal')
        doc.text('Generated on: ' + new Date().toLocaleDateString('id-ID'), 15, yPos)
        doc.text('This is a computer generated payslip.', pageWidth - 15, yPos, { align: 'right' })
        
        // Generate filename
        const employeeName = payslipData.kolom_name?.replace(/[^a-zA-Z0-9]/g, '_') || 'Employee'
        const filePeriod = payslipData.kolom_month?.substring(0, 7).replace('-', '_') || 'Unknown'
        const filename = `Payslip_${employeeName}_${filePeriod}.pdf`
        
        // Save the PDF
        doc.save(filename)
        
    } catch (error) {
        console.error('Error generating PDF with logo:', error)
        throw new Error(`Failed to generate PDF: ${error.message}`)
    }
}
