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
    const lightGray = [255, 255, 255]
    const darkGray = [108, 117, 125]
    
    let yPos = 20
    
    // Header Section
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, pageWidth, 25, 'F')
        
    // Try to load and add logo
    try {
        const logoBase64 = await getImageBase64('/assets/img/motor-sights-international-logo-footer-white.png')
        if (logoBase64) {
            // Add logo image
            doc.addImage(logoBase64, 'PNG', 20, 5, 20, 15) // Adjust dimensions as needed
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
    doc.text(headerPeriod, pageWidth - 20, 15, { align: 'right' })

    yPos = 30
    
    // Employee Information Section
    doc.setTextColor(...primaryColor)
    // doc.setFillColor(...lightGray)
    doc.rect(10, yPos, pageWidth - 20, 8, 'F')
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    // doc.text('EMPLOYEE INFORMATION', 15, yPos + 5)
    
    // yPos += 15
    
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
            cellPadding: 1,
            textColor: [0, 0, 0]
        },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 35 },
            1: { cellWidth: 55 },
            2: { fontStyle: 'bold', cellWidth: 35 },
            3: { cellWidth: 55 }
        },
        margin: { left: 10, right: 15 }
    })

    yPos = doc.lastAutoTable.finalY + 5
    
    // Company Contributions Section
    if (yPos > pageHeight - 60) {
        doc.addPage()
        yPos = 20
    }
    
    doc.setFillColor(...lightGray)
    doc.rect(10, yPos, pageWidth - 20, 8, 'F')
    doc.setFont('helvetica', 'bold')
    doc.text('Gaji dan Potongan', 10, yPos + 5)
    
    yPos += 8
    
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
        [`Total Overtime Pay ${payslipData.kolom_overtime_hour || '0'} hours` , formatCurrency(payslipData.kolom_total_overtime)],
        ['Point Payment', formatCurrency(payslipData.kolom_point_to_be_paid)],
        ['Sales Incentive', formatCurrency(payslipData.kolom_sales_incentive)],
        ['Other Allowances', formatCurrency(payslipData.kolom_others_tj)]
    ].filter(item => {
        if (item[0].includes('hours')) {
            return getNumericValue(payslipData.kolom_overtime_hour) > 0
        }
        return item[1] !== 'Rp 0' && item[1] !== '-'
    })
    
    const dataLeft = 10;
    const colWidthLeft = 50;
    const colWidthRight = 42;
    const countColumns = (colWidthLeft + colWidthRight);
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
            cellPadding: 2,
            overflow: 'ellipsize', cellWidth: 'wrap'
        },
        columnStyles: {
            0: { cellWidth: colWidthLeft },
            1: { cellWidth: colWidthRight, halign: 'right' }
        },
        didParseCell: function(data) {
            if (data.row.index === earningsData.length - 1) {
                data.cell.styles.fontStyle = 'bold'
                data.cell.styles.fillColor = [254, 255, 226]
            }
        },
        margin: { left: dataLeft, right: 15 },
        tableWidth: countColumns
    })
    
    // yPos = doc.lastAutoTable.finalY + 15
    
    // // Check if we need a new page
    // if (yPos > pageHeight - 80) {
    //     doc.addPage()
    //     yPos = 20
    // }
    
    // yPos += 15
    
    const deductionsData = [
        // ['APD (Safety Equipment)', formatCurrency(payslipData.kolom_apd)],
        // ['Transport Ticket', formatCurrency(payslipData.kolom_transport_ticket)],
        // ['Loan Deduction', formatCurrency(payslipData.kolom_loan)],
        // ['Unpaid Leave', formatCurrency(payslipData.kolom_unpaid_leave_defaulters_work)],
        ['BPJS JHT (Employee 2%)', formatCurrency(payslipData.kolom_provident_fund_benefit_by_emp_jht_2_persen)],
        ['BPJS JP (Employee 1%)', formatCurrency(payslipData.kolom_pension_by_emp_jp_1_persen)],
        ['BPJS KES (Employee 1%)', formatCurrency(payslipData.kolom_health_insurance_by_employee_1_persen)],
        ['TAX', formatCurrency(payslipData.kolom_tax)],
        // ['Pension (Employee 1%)', formatCurrency(payslipData.kolom_pension_by_emp_jp_1_persen)],
        // ['Health Insurance (Employee 1%)', formatCurrency(payslipData.kolom_health_insurance_by_employee_1_persen)],
        // ['Adjustment Deduction', formatCurrency(payslipData.kolom_adjusment_cut)],
        // ['General Deduction', formatCurrency(payslipData.kolom_deduction)],
        // ['PPh 21 Tax', formatCurrency(payslipData.kolom_pph_21)],
        // ['Other Deductions', formatCurrency(payslipData.kolom_other_deduction)]
    ].filter(item => item[1] !== 'Rp 0')
    
    // Add total deductions
    deductionsData.push(['TOTAL', formatCurrency(payslipData.kolom_total_deduction)])
    
    autoTable(doc, {
        startY: yPos,
        head: [
            [{ content: 'DEDUCTIONS', colSpan: 2, styles: { halign: 'center', fillColor: [195, 207, 226], textColor: [0, 0, 0], fontStyle: 'normal' } }]
        ],
        body: deductionsData,
        theme: 'striped',
        styles: {
            fontSize: 9,
            cellPadding: 2
        },
        columnStyles: {
            0: { cellWidth: colWidthLeft },
            1: { cellWidth: colWidthRight, halign: 'right' }
        },
        didParseCell: function(data) {
            if (data.row.index === deductionsData.length - 1) {
                data.cell.styles.fontStyle = 'bold'
                data.cell.styles.fillColor = [255, 226, 226]
            }
        },
        margin: { left: countColumns + dataLeft, right: 15 },
        tableWidth: countColumns
    })
    
    // yPos = doc.lastAutoTable.finalY + 15
    
    // // Company Contributions Section
    // if (yPos > pageHeight - 60) {
    //     doc.addPage()
    //     yPos = 20
    // }
    
    // doc.setFillColor(...lightGray)
    // doc.rect(10, yPos, pageWidth - 20, 8, 'F')
    // doc.setFont('helvetica', 'bold')
    // doc.text('COMPANY CONTRIBUTIONS', 15, yPos + 5)
    
    // yPos += 15
    
    const contributionsData = [
        ['BPJS JHT (Company 3.7%)', formatCurrency(payslipData.kolom_jht_by_company_37_persen)],
        ['BPJS JP (Company 2%)', formatCurrency(payslipData.kolom_jp_by_company_2_persen)],
        ['BPJS JKM (Company 0.30%)', formatCurrency(payslipData.kolom_jkm_by_company_030_persen)],
        ['BPJS JKK (Company 0.24%)', formatCurrency(payslipData.kolom_jkk_by_company_024_persen)],
        ['BPJS KES (Company 4%)', formatCurrency(payslipData.kolom_kes_by_company_4_persen)],
        ['TOTAL', formatCurrency(payslipData.kolom_total_by_company_1024_persen)]
    ]
    
    autoTable(doc, {
        startY: yPos,
        head: [
            [{ content: 'COMPANY CONTRIBUTIONS', colSpan: 2, styles: { halign: 'center', fillColor: [195, 207, 226], textColor: [0, 0, 0], fontStyle: 'normal' } }]
        ],
        body: contributionsData,
        theme: 'striped',
        styles: {
            fontSize: 9,
            cellPadding: 2
        },
        columnStyles: {
            0: { cellWidth: colWidthLeft },
            1: { cellWidth: colWidthRight, halign: 'right' }
        },
        didParseCell: function(data) {
            if (data.row.index === contributionsData.length - 1) {
                data.cell.styles.fontStyle = 'bold'
                data.cell.styles.fillColor = [226, 255, 226]
            }
        },
        margin: { left: (countColumns * 2) + dataLeft, right: 15 },
        tableWidth: countColumns
    })
    
    yPos = doc.lastAutoTable.finalY + 5
    
    const headersAbsensi = [
        { header: "STD", dataKey: "STD" },
        { header: "SCH", dataKey: "SCH" },
        { header: "ACT", dataKey: "ACT" },
        { header: "OFF", dataKey: "OFF" },
        { header: "S1", dataKey: "S1" },
        { header: "H", dataKey: "H" },
        { header: "AL", dataKey: "AL" },
        { header: "RL", dataKey: "RL" },
        { header: "K", dataKey: "K" },
        { header: "DW", dataKey: "DW" },
        { header: "UL", dataKey: "UL" },
        { header: "ML", dataKey: "ML" },
        { header: "WFH", dataKey: "WFH" },
        { header: "WFS", dataKey: "WFS" },
        { header: "LATE", dataKey: "LATE" },
        { header: "1/2", dataKey: "HALF" },
    ];
    const absensiData = [
        {
            STD: payslipData.kolom_std,
            SCH: payslipData.kolom_sch,
            ACT: payslipData.kolom_act,
            OFF: payslipData.kolom_off,
            S1: payslipData.kolom_s1,
            H: payslipData.kolom_h,
            AL: payslipData.kolom_al,
            RL: payslipData.kolom_rl,
            K: payslipData.kolom_k,
            DW: payslipData.kolom_dw,
            UL: payslipData.kolom_ul,
            ML: payslipData.kolom_ml,
            WFH: payslipData.kolom_wfh,
            WFS: payslipData.kolom_wfs,
            LATE: payslipData.kolom_late,
            HALF: payslipData.kolom_half
        }
    ]
    
    autoTable(doc, {
        columns: headersAbsensi,
        startY: yPos,
        body: absensiData,
        styles: {
            fontSize: 9,
            cellPadding: 2,
            textColor: [0, 0, 0]
        },
        headStyles: {
            fillColor: transparent,
            textColor: 255,
            fontStyle: 'bold',
        },
        theme: "grid",
        margin: { left: 10, right: 10 }
    })

    // ======================================================
    yPos = doc.lastAutoTable.finalY + 20
    
    // Footer
    if (yPos > pageHeight - 15) {
        doc.addPage()
        yPos = pageHeight - 15
    } else {
        yPos = pageHeight - 15
    }
    
    // Tambahkan "Keterangan Lain Lain"
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("KETERANGAN LAIN LAIN:", 10, yPos - 20);

    // Tambahkan garis putus-putus
    doc.setLineWidth(0.1);
    doc.setDrawColor(100);
    doc.setLineDash([1], 0);
    doc.line(10, yPos - 15, doc.internal.pageSize.getWidth() - 10, yPos - 15);
    
    // Add remarks if any
    if (payslipData.kolom_remarks) {
        yPos -= 10
        doc.text('Remarks: ' + payslipData.kolom_remarks, 15, yPos)
    }
    doc.setTextColor(...darkGray)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text("DISCLAIMER:", 10, yPos - 5);
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text('SLIP PEMBAYARAN GAJI DITUJUKAN BAGI KARYAWAN PT INDONESIA EQUIPMENT CENTRE MELALUI SURAT ELEKTRONIK DAN SAH TANPA TANDA TANGAN/STEMPEL PERUSAHAAN.\nPT INDONESIA EQUIPMENT CENTRE TIDAK BERTANGGUNG JAWAB ATAS SEGALA HAL YANG TIMBUL DILUAR KETENTUAN YANG BERLAKU TENTANG SLIP PEMBAYARAN GAJI KARYAWAN.', 10, yPos)
    
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
