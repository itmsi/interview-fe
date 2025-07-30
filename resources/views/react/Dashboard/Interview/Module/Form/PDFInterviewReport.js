import React from 'react';
import { toast } from 'react-toastify';

/**
 * PDF Interview Report Generator
 * 
 * Features:
 * - Logo support: Pass company_logo in formData as base64 string or URL
 * - Default logo: '/assets/img/motor-sights-international-logo-footer-white.png'
 * - Example: formData.company_logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...'
 * - Or from URL: formData.company_logo = '/path/to/logo.png'
 * - Header layout: Logo (left) + "HR FORM INTERVIEW" text (right)
 * - Custom table styling with corporate colors
 * - Auto dark background for white/footer logos
 */

// Cache untuk libraries yang sudah di-load
let librariesCache = {
    jsPDF: null,
    html2canvas: null,
    initialized: false
};

// Global variables untuk tracking
let autoTableAvailable = false;

// Function untuk reset cache jika terjadi error
const resetLibrariesCache = () => {
    librariesCache = {
        jsPDF: null,
        html2canvas: null,
        initialized: false
    };
    autoTableAvailable = false;
};

const initializeLibraries = async () => {
    if (librariesCache.initialized) return librariesCache;
    
    try {
        // Add timeout untuk prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Library loading timeout')), 30000)
        );
        
        const loadPromise = Promise.all([
            import('jspdf'),
            import('html2canvas')
        ]);
        
        const [jsPDFModule, html2canvasModule] = await Promise.race([loadPromise, timeoutPromise]);
        
        const jsPDFClass = jsPDFModule.default;
        const html2canvasClass = html2canvasModule.default;
        
        // Try loading autoTable with proper error handling
        try {
            await Promise.race([
                import('jspdf-autotable'),
                new Promise((_, reject) => setTimeout(() => reject(new Error('autoTable timeout')), 10000))
            ]);
            
            const testDoc = new jsPDFClass();
            autoTableAvailable = typeof testDoc.autoTable === 'function';
        } catch (e) {
            console.warn('autoTable not available:', e.message);
            autoTableAvailable = false;
        }
        
        librariesCache.jsPDF = jsPDFClass;
        librariesCache.html2canvas = html2canvasClass;
        librariesCache.initialized = true;
        
        return librariesCache;
    } catch (error) {
        console.error('Failed to load PDF libraries:', error);
        resetLibrariesCache(); // Reset cache pada error
        throw new Error(`Library initialization failed: ${error.message}`);
    }
};

const generateManualTable = (doc, formData, yPosition) => {
    const posisi_x = 0;
    const candidateData = formData.data_candidate || {};
    // candidateData.id_alias_candidate || 'N/A'
    const candidateInfo = [
        ['Candidate Name', candidateData.name_candidate || 'N/A', 'Gender', candidateData.gender_candidate || 'N/A'],
        ['Company', candidateData.company_candidate || 'N/A', 'Interviewer', candidateData.interviewer_candidate || 'N/A'],
        ['Position', candidateData.position_candidate || 'N/A', 'Date of Interview', candidateData.date_interview_candidate || 'N/A'],
        ['Age', candidateData.age_candidate || 'N/A', 'Duration', candidateData.duration_candidate ? `${candidateData.duration_candidate} hour(s)` : 'N/A']
    ];

    let currentY = yPosition;
    const rowHeight = 8;
    const col1Width = 40;
    const col2Width = 70;
    
    currentY += rowHeight;
    
    // Draw rows
    candidateInfo.forEach((row, index) => {
        if (row.length === 4) {
            
            // Field 1 background (biru)
            doc.setFillColor(2, 83, 165); // 0253a5 untuk label
            doc.rect(posisi_x, currentY, col1Width, rowHeight, 'F');
            
            // Value 1 background (biru muda)
            doc.setFillColor(217, 225, 242); // D9E1F2 untuk value
            doc.rect(posisi_x + col1Width, currentY, col2Width, rowHeight, 'F');
            
            // Field 2 background (biru)
            doc.setFillColor(2, 83, 165); // 0253a5 untuk label
            doc.rect(posisi_x + col1Width + col2Width, currentY, col1Width, rowHeight, 'F');
            
            // Value 2 background (biru muda)
            doc.setFillColor(217, 225, 242); // D9E1F2 untuk value
            doc.rect(posisi_x + col1Width + col2Width + col1Width, currentY, col2Width, rowHeight, 'F');
            
            // Text untuk field 1 (putih pada background biru)
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text(row[0], posisi_x + 2, currentY + 5);
            
            // Text untuk value 1 (hitam pada background biru muda)
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');
            doc.text(row[1], posisi_x + 2 + col1Width, currentY + 5);
            
            // Text untuk field 2 (putih pada background biru)
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.text(row[2], posisi_x + 2 + col1Width + col2Width, currentY + 5);
            
            // Text untuk value 2 (hitam pada background biru muda)
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');
            doc.text(row[3], posisi_x + 2 + col1Width + col2Width + col1Width, currentY + 5);
            
        } else if (row.length === 2) {
            // Row dengan 2 elemen: field, value (span full width)
            
            // Field background (biru)
            doc.setFillColor(2, 83, 165); // 0253a5 untuk label
            doc.rect(posisi_x, currentY, col1Width, rowHeight, 'F');
            
            // Value background (biru muda, span remaining width)
            doc.setFillColor(217, 225, 242); // D9E1F2 untuk value
            doc.rect(posisi_x + col1Width, currentY, col2Width + col1Width + col2Width, rowHeight, 'F');
            
            // Text untuk field (putih pada background biru)
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text(row[0], posisi_x + 2, currentY + 5);
            
            // Text untuk value (hitam pada background biru muda)
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');
            doc.text(row[1], posisi_x + 2 + col1Width, currentY + 5);
        }
        
        currentY += rowHeight;
    });
    
    // Draw borders dengan layout yang sesuai
    doc.setLineWidth(0);
    doc.setDrawColor(255, 255, 255); // Border gelap untuk kontras yang lebih baik
    
    const tableWidth = (col1Width + col2Width) * 2;
    
    // Header border
    doc.rect(posisi_x, yPosition, tableWidth, rowHeight);
    
    // Row borders
    candidateInfo.forEach((row, index) => {
        const y = yPosition + rowHeight + (index * rowHeight);
        
        if (row.length === 4) {
            // 4 kolom borders
            doc.rect(posisi_x, y, col1Width, rowHeight); // field 1
            doc.rect(posisi_x + col1Width, y, col2Width, rowHeight); // value 1
            doc.rect(posisi_x + col1Width + col2Width, y, col1Width, rowHeight); // field 2
            doc.rect(posisi_x + col1Width + col2Width + col1Width, y, col2Width, rowHeight); // value 2
        } else if (row.length === 2) {
            // 2 kolom spanning borders
            doc.rect(posisi_x, y, col1Width, rowHeight); // field
            doc.rect(posisi_x + col1Width, y, col2Width + col1Width + col2Width, rowHeight); // value span
        }
    });
    
    return currentY + 15;
};

// Function untuk menambahkan logo dari file atau URL
const addLogoToDoc = (doc, logoData, x, y, width, height) => {
    try {
        if (logoData) {
            doc.addImage(logoData, 'PNG', x, y, width, height);
        } else {
            // Fallback: placeholder dengan teks LOGO
            doc.setFillColor(52, 58, 64);
            doc.rect(x, y, width, height, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text('LOGO', x + width/2, y + height/2 + 2, { align: 'center' });
        }
    } catch (error) {
        console.warn('Error adding logo:', error);
        // Fallback ke placeholder
        doc.setFillColor(52, 58, 64);
        doc.rect(x, y, width, height, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('LOGO', x + width/2, y + height/2 + 2, { align: 'center' });
    }
};

// Function untuk manual assessment table dengan rowspan
const generateManualAssessmentTable = (doc, formData, yPosition) => {
    const posisi_x = 0;
    let currentY = yPosition - 12;
    const baseRowHeight = 8;
    const pageWidth = doc.internal.pageSize.width;
    const totalTableWidth = pageWidth - 20; // Margin 10mm each side
    
    // New column widths untuk fit paper width
    const colCompanyWidth = 20;
    const colStandardWidth = 20;
    const colAspectWidth = 45;
    const colQuestionWidth = 40;
    const colScoreWidth = 15;
    const colRemarksWidth = pageWidth - (colCompanyWidth + colStandardWidth + colAspectWidth + colQuestionWidth + colScoreWidth); // Sisa space untuk remarks (no gap)
    
    // Multiplier function
    const getMultipliedScore = (companyValue, score) => {
        switch (companyValue) {
            case 'SIAH':
                return score * 2;
            case '7 Values':
                return score * 1.7;
            case 'CSE':
                return score * 2;
            default:
                return score;
        }
    };
    
    // Standard values untuk comparison
    const standard_values = {
        'SIAH': 40,
        '7 Values': 60,
        'CSE': 40,
        'SDT': 40,
        'EXPERIENCE': 20
    };
    
    // Header
    doc.setFillColor(2, 83, 165); // Header biru
    doc.rect(posisi_x, currentY, colCompanyWidth + colStandardWidth + colAspectWidth + colQuestionWidth + colScoreWidth + colRemarksWidth, baseRowHeight, 'F');
    
    // Header text dengan better alignment
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('Company', posisi_x + (colCompanyWidth / 2), currentY + 3, { align: 'center' });
    doc.text('Value', posisi_x + (colCompanyWidth / 2), currentY + 6, { align: 'center' });
    
    doc.text('Standard', posisi_x + colCompanyWidth + (colStandardWidth / 2), currentY + 3, { align: 'center' });
    doc.text('Point', posisi_x + colCompanyWidth + (colStandardWidth / 2), currentY + 6, { align: 'center' });
    
    doc.text('Aspect', posisi_x + colCompanyWidth + colStandardWidth + (colAspectWidth / 2), currentY + 5, { align: 'center' });
    doc.text('Question', posisi_x + colCompanyWidth + colStandardWidth + colAspectWidth + (colQuestionWidth / 2), currentY + 5, { align: 'center' });
    doc.text('Score', posisi_x + colCompanyWidth + colStandardWidth + colAspectWidth + colQuestionWidth + (colScoreWidth / 2), currentY + 5, { align: 'center' });
    doc.text('Answer/Remarks', posisi_x + colCompanyWidth + colStandardWidth + colAspectWidth + colQuestionWidth + colScoreWidth + (colRemarksWidth / 2), currentY + 5, { align: 'center' });
    
    // Header borders
    doc.setLineWidth(0.1);
    doc.setDrawColor(255, 255, 255);
    doc.line(posisi_x + colCompanyWidth, currentY, posisi_x + colCompanyWidth, currentY + baseRowHeight);
    doc.line(posisi_x + colCompanyWidth + colStandardWidth, currentY, posisi_x + colCompanyWidth + colStandardWidth, currentY + baseRowHeight);
    doc.line(posisi_x + colCompanyWidth + colStandardWidth + colAspectWidth, currentY, posisi_x + colCompanyWidth + colStandardWidth + colAspectWidth, currentY + baseRowHeight);
    doc.line(posisi_x + colCompanyWidth + colStandardWidth + colAspectWidth + colQuestionWidth, currentY, posisi_x + colCompanyWidth + colStandardWidth + colAspectWidth + colQuestionWidth, currentY + baseRowHeight);
    doc.line(posisi_x + colCompanyWidth + colStandardWidth + colAspectWidth + colQuestionWidth + colScoreWidth, currentY, posisi_x + colCompanyWidth + colStandardWidth + colAspectWidth + colQuestionWidth + colScoreWidth, currentY + baseRowHeight);
    
    currentY += baseRowHeight;
    
    // Define desired order
    const desiredOrder = ['SIAH', '7 Values', 'CSE', 'SDT', 'EXPERIENCE'];
    
    // Group data by company_value and sort by desired order
    const groupedData = {};
    if (formData.interview && Array.isArray(formData.interview)) {
        formData.interview.forEach(item => {
            if (!groupedData[item.company_value]) {
                groupedData[item.company_value] = [];
            }
            groupedData[item.company_value].push(item);
        });
    }
    
    // Sort by desired order
    const sortedCompanyValues = desiredOrder.filter(company => groupedData[company]);
    
    sortedCompanyValues.forEach((companyValue, companyIndex) => {
        const items = groupedData[companyValue];
        const startY = currentY; // Record start position untuk company value
        
        items.forEach((item, index) => {
            const originalScore = item.score || 0;
            const multipliedScore = getMultipliedScore(companyValue, originalScore);
            
            // Calculate row height based on content
            let maxLines = 1;
            
            // Check aspect text length
            const aspect = item.aspect || 'N/A';
            const wrappedAspect = doc.splitTextToSize(aspect, colAspectWidth - 4);
            maxLines = Math.max(maxLines, wrappedAspect.length);
            
            // Check question text length
            const question = item.question || 'N/A';
            const wrappedQuestion = doc.splitTextToSize(question, colQuestionWidth - 4);
            maxLines = Math.max(maxLines, wrappedQuestion.length);
            
            // Check answer text length
            const answer = item.answer || 'N/A';
            const wrappedAnswer = doc.splitTextToSize(answer, colRemarksWidth - 4);
            maxLines = Math.max(maxLines, wrappedAnswer.length);
            
            // Calculate dynamic row height
            const dynamicRowHeight = Math.max(baseRowHeight, maxLines * 4 + 2);
            
            // Alternate row colors untuk value
            if (index % 2 === 0) {
                doc.setFillColor(217, 225, 242); // Biru muda untuk value
            } else {
                doc.setFillColor(245, 248, 251); // Lebih terang untuk alternating
            }
            doc.rect(posisi_x, currentY, colCompanyWidth + colStandardWidth + colAspectWidth + colQuestionWidth + colScoreWidth + colRemarksWidth, dynamicRowHeight, 'F');
            
            // Draw data
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'normal');
            
            // Aspect
            doc.text(wrappedAspect, posisi_x + colCompanyWidth + colStandardWidth + 2, currentY + 4);
            
            // Question
            doc.text(wrappedQuestion, posisi_x + colCompanyWidth + colStandardWidth + colAspectWidth + 2, currentY + 4);
            
            // Score (show multiplied score, no color)
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0); // Always black
            doc.text(Math.round(multipliedScore).toString(), posisi_x + colCompanyWidth + colStandardWidth + colAspectWidth + colQuestionWidth + (colScoreWidth / 2), currentY + 5, { align: 'center' });
            
            // Answer/Remarks (dengan text wrapping yang lebih baik)
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(wrappedAnswer, posisi_x + colCompanyWidth + colStandardWidth + colAspectWidth + colQuestionWidth + colScoreWidth + 2, currentY + 4);
            
            // Borders untuk kolom kecuali company value dan standard point ( merged)
            doc.setLineWidth(0.1);
            doc.rect(posisi_x + colCompanyWidth + colStandardWidth, currentY, colAspectWidth, dynamicRowHeight); // Aspect
            doc.rect(posisi_x + colCompanyWidth + colStandardWidth + colAspectWidth, currentY, colQuestionWidth, dynamicRowHeight); // Question
            doc.rect(posisi_x + colCompanyWidth + colStandardWidth + colAspectWidth + colQuestionWidth, currentY, colScoreWidth, dynamicRowHeight); // Score
            doc.rect(posisi_x + colCompanyWidth + colStandardWidth + colAspectWidth + colQuestionWidth + colScoreWidth, currentY, colRemarksWidth, dynamicRowHeight); // Remarks
            
            currentY += dynamicRowHeight;
        });
        
        // Setelah semua items, gambar company value dan standard point di tengah dengan background dan border
        const companyRowHeight = currentY - startY; // Total height dari semua rows
        const companyTextY = startY + (companyRowHeight / 2) + 1;
        
        // Background untuk company value (spanning multiple rows)
        doc.setFillColor(2, 83, 165); // Biru untuk company value
        doc.rect(posisi_x, startY, colCompanyWidth, companyRowHeight, 'F');
        
        // Company Value text (di tengah)
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        const lines = doc.splitTextToSize(companyValue, colCompanyWidth - 4);
        const lineHeight = 3;
        let textStartY = companyTextY - ((lines.length - 1) * lineHeight / 2);
        
        lines.forEach((line, i) => {
            doc.text(line, posisi_x + (colCompanyWidth / 2), textStartY + (i * lineHeight), { align: 'center' });
        });
        
        // Background untuk standard point (spanning multiple rows)
        doc.setFillColor(2, 83, 165); // Biru untuk standard point
        doc.rect(posisi_x + colCompanyWidth, startY, colStandardWidth, companyRowHeight, 'F');
        
        // Standard Point text (di tengah)
        const standardPoint = standard_values[companyValue] || 0;
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text(standardPoint.toString(), posisi_x + colCompanyWidth + (colStandardWidth / 2), companyTextY, { align: 'center' });
        
        // Border untuk company value dan standard point columns
        doc.setLineWidth(0.1);
        doc.setDrawColor(128, 128, 128);
        doc.rect(posisi_x, startY, colCompanyWidth, companyRowHeight);
        doc.rect(posisi_x + colCompanyWidth, startY, colStandardWidth, companyRowHeight);
        
        // Total row untuk setiap company value (dengan multiplier yang benar)
        doc.setFillColor(2, 83, 165); // Biru untuk total
        doc.rect(posisi_x, currentY, colCompanyWidth + colStandardWidth + colAspectWidth + colQuestionWidth + colScoreWidth + colRemarksWidth, baseRowHeight, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('TOTAL', posisi_x + colCompanyWidth + colStandardWidth + 2, currentY + 5);
        
        // Calculate total dengan multiplier yang benar
        let totalWithMultiplier = 0;
        items.forEach(item => {
            const originalScore = item.score || 0;
            const multipliedScore = getMultipliedScore(companyValue, originalScore);
            totalWithMultiplier += multipliedScore;
        });
        
        doc.text(Math.round(totalWithMultiplier).toString(), posisi_x + colCompanyWidth + colStandardWidth + colAspectWidth + colQuestionWidth + (colScoreWidth / 2), currentY + 5, { align: 'center' });
        
        // Show standard vs actual in total row
        const standardTotal = standard_values[companyValue] || 0;
        doc.setFontSize(7);
        doc.text(`(Target: ${standardTotal})`, posisi_x + colCompanyWidth + colStandardWidth + colAspectWidth + colQuestionWidth + colScoreWidth + 2, currentY + 5);
        
        // Total row borders
        doc.setLineWidth(0.1);
        doc.setDrawColor(128, 128, 128);
        doc.rect(posisi_x, currentY, colCompanyWidth + colStandardWidth + colAspectWidth + colQuestionWidth + colScoreWidth + colRemarksWidth, baseRowHeight);
        
        currentY += baseRowHeight; // Extra space after each company section
    });
    
    return currentY + 10;
};

// Fallback function untuk assessment data sebagai text
const generateAssessmentText = (doc, formData, yPosition) => {
    let currentY = yPosition;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    if (formData.interview && Array.isArray(formData.interview)) {
        const groupedData = {};
        formData.interview.forEach(item => {
            if (!groupedData[item.company_value]) {
                groupedData[item.company_value] = [];
            }
            groupedData[item.company_value].push(item);
        });

        Object.keys(groupedData).forEach(companyValue => {
            const items = groupedData[companyValue];
            let companyTotal = 0;

            doc.setFont('helvetica', 'bold');
            doc.text(`${companyValue}:`, 20, currentY);
            currentY += 8;

            items.forEach((item, index) => {
                const score = item.score || 0;
                companyTotal += score;
                
                doc.setFont('helvetica', 'normal');
                doc.text(`${index + 1}. ${item.aspect || 'N/A'}: ${score}/10`, 25, currentY);
                currentY += 6;
            });

            doc.setFont('helvetica', 'bold');
            doc.text(`Total: ${companyTotal}`, 25, currentY);
            currentY += 12;
        });
    } else {
        doc.text('No assessment data available', 20, currentY);
        currentY += 10;
    }
    
    return currentY + 10;
};

// Fallback function untuk summary sebagai text
const generateSummaryText = (doc, formData, yPosition) => {
    let currentY = yPosition;
    
    const validMetrics = Array.isArray(formData.data_score) ? formData.data_score.filter(m => 
        m && 
        typeof m === 'object' && 
        typeof m.total_score === 'number' &&
        m.company_value
    ) : [];

    const total = validMetrics.reduce((sum, m) => sum + m.total_score, 0);
    
    const getEvaluation = (total) => {
        if (total <= 20) return { remark: "Very Poor", recommendation: "Reject" };
        if (total <= 40) return { remark: "Poor", recommendation: "Reject" };
        if (total <= 60) return { remark: "Average", recommendation: "Consideration - need comparison" };
        if (total <= 80) return { remark: "Good", recommendation: "Next Process To be Hired" };
        return { remark: "Excellent", recommendation: "Next Process To be Hired" };
    };

    const { remark, recommendation } = getEvaluation(total);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Assessment Summary:', 20, currentY);
    currentY += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Score: ${total}`, 20, currentY);
    currentY += 8;
    doc.text(`Overall Rating: ${remark}`, 20, currentY);
    currentY += 8;
    doc.text(`Recommendation: ${recommendation}`, 20, currentY);
    currentY += 12;

    if (validMetrics.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.text('Detailed Scores:', 20, currentY);
        currentY += 8;
        
        validMetrics.forEach(metric => {
            const standard_value = [
                { "company_value": "SIAH", "total_score": 40 },
                { "company_value": "7 Values", "total_score": 60 },
                { "company_value": "SDT", "total_score": 40 },
                { "company_value": "CSE", "total_score": 40 },
                { "company_value": "EXPERIENCE", "total_score": 20 },
            ];
            const standard = standard_value.find(s => s.company_value === metric.company_value);
            const standardScore = standard ? standard.total_score : 0;
            const percentage = standardScore === 0 ? 100 : Math.round((metric.total_score / standardScore) * 100);
            
            doc.setFont('helvetica', 'normal');
            doc.text(`${metric.company_value}: ${metric.total_score} (${percentage}%)`, 25, currentY);
            currentY += 6;
        });
    }
    
    return currentY + 15;
};

// Helper function untuk generate score result tanpa tabel (untuk card)
const generateScoreResultForCard = (formData) => {
    // Multiplier function
    const getMultipliedScore = (companyValue, score) => {
        switch (companyValue) {
            case 'SIAH':
                return score * 2;
            case '7 Values':
                return score * 1.7;
            case 'CSE':
                return score * 2;
            default:
                return score;
        }
    };
    
    // Calculate scores dengan multiplier
    const validMetrics = Array.isArray(formData.data_score) ? formData.data_score.filter(m => 
        m && 
        typeof m === 'object' && 
        typeof m.total_score === 'number' &&
        m.company_value
    ) : [];

    const total = validMetrics.reduce((sum, m) => sum + getMultipliedScore(m.company_value, m.total_score), 0);
    
    const getEvaluation = (total) => {
        if (total <= 20) return { remark: "Very Poor", recommendation: "Reject", color: [220, 53, 69] };
        if (total <= 40) return { remark: "Poor", recommendation: "Reject", color: [255, 193, 7] };
        if (total <= 60) return { remark: "Average", recommendation: "Consideration - need comparison", color: [0, 123, 255] };
        if (total <= 80) return { remark: "Good", recommendation: "Next Process To be Hired", color: [40, 167, 69] };
        return { remark: "Excellent", recommendation: "Next Process To be Hired", color: [40, 167, 69] };
    };

    const { remark, recommendation, color } = getEvaluation(total);
    
    return { 
        total: Math.round(total), 
        remark, 
        recommendation, 
        color 
    };
};

// Function untuk generate comprehensive score section seperti show score
const generateComprehensiveScoreSection = (doc, formData, yPosition) => {
    let currentY = yPosition;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    
    // Multiplier function
    const getMultipliedScore = (companyValue, score) => {
        switch (companyValue) {
            case 'SIAH':
                return score * 2;
            case '7 Values':
                return score * 1.7;
            case 'CSE':
                return score * 2;
            default:
                return score;
        }
    };
    
    // Calculate scores dengan multiplier
    const validMetrics = Array.isArray(formData.data_score) ? formData.data_score.filter(m => 
        m && 
        typeof m === 'object' && 
        typeof m.total_score === 'number' &&
        m.company_value
    ) : [];

    // Sort metrics by desired order
    const desiredOrder = ['SIAH', '7 Values', 'CSE', 'SDT', 'EXPERIENCE'];
    const sortedMetrics = [...validMetrics].sort((a, b) => {
        const indexA = desiredOrder.indexOf(a.company_value);
        const indexB = desiredOrder.indexOf(b.company_value);
        
        const orderA = indexA === -1 ? 999 : indexA;
        const orderB = indexB === -1 ? 999 : indexB;
        
        return orderA - orderB;
    });

    const total = sortedMetrics.reduce((sum, m) => sum + getMultipliedScore(m.company_value, m.total_score), 0);
    
    const getEvaluation = (total) => {
        if (total <= 20) return { remark: "Very Poor", recommendation: "Reject", color: [220, 53, 69] };
        if (total <= 40) return { remark: "Poor", recommendation: "Reject", color: [255, 193, 7] };
        if (total <= 60) return { remark: "Average", recommendation: "Consideration - need comparison", color: [0, 123, 255] };
        if (total <= 80) return { remark: "Good", recommendation: "Next Process To be Hired", color: [40, 167, 69] };
        return { remark: "Excellent", recommendation: "Next Process To be Hired", color: [40, 167, 69] };
    };

    const { remark, recommendation, color } = getEvaluation(total);
    
    // Score percentage
    doc.setFontSize(10);
    doc.setTextColor(color[0], color[1], color[2]);
    
    currentY += 35;
    
    // Standard values untuk comparison dengan urutan yang benar
    const standard_value = [
        { "company_value": "SIAH", "total_score": 40 },
        { "company_value": "7 Values", "total_score": 60 },
        { "company_value": "CSE", "total_score": 40 },
        { "company_value": "SDT", "total_score": 40 },
        { "company_value": "EXPERIENCE", "total_score": 20 },
    ];
    
    if (sortedMetrics.length > 0) {
        // Table header untuk detail - FULL WIDTH
        const detailRowHeight = 8;
        const tableStartX = 0;  // Start from edge
        const tableWidth = pageWidth;  // Full page width
        
        // Dynamic column widths to fill full page width
        const col1Width = Math.floor(tableWidth * 0.35);  // 35% for Company Value
        const col2Width = Math.floor(tableWidth * 0.2);   // 20% for Actual
        const col3Width = Math.floor(tableWidth * 0.2);   // 20% for Target
        const col4Width = tableWidth - col1Width - col2Width - col3Width;  // Remaining for Achievement
        
        // Enhanced table header dengan gradient effect
        doc.setFillColor(2, 83, 165); // Primary blue
        doc.rect(tableStartX, currentY, tableWidth, detailRowHeight, 'F');
        
        // Header border dengan shadow effect
        doc.setLineWidth(1);
        doc.setDrawColor(0, 51, 102); // Darker blue for border
        doc.rect(tableStartX, currentY, tableWidth, detailRowHeight);
        
        // Header text dengan better spacing
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Company Value', tableStartX + (col1Width / 2), currentY + 6, { align: 'center' });
        doc.text('Actual', tableStartX + col1Width + (col2Width / 2), currentY + 6, { align: 'center' });
        doc.text('Target', tableStartX + col1Width + col2Width + (col3Width / 2), currentY + 6, { align: 'center' });
        doc.text('Achievement', tableStartX + col1Width + col2Width + col3Width + (col4Width / 2), currentY + 6, { align: 'center' });
        
        // Vertical separators dalam header
        doc.setLineWidth(0.5);
        doc.setDrawColor(255, 255, 255);
        doc.line(tableStartX + col1Width, currentY + 1, tableStartX + col1Width, currentY + detailRowHeight - 1);
        doc.line(tableStartX + col1Width + col2Width, currentY + 1, tableStartX + col1Width + col2Width, currentY + detailRowHeight - 1);
        doc.line(tableStartX + col1Width + col2Width + col3Width, currentY + 1, tableStartX + col1Width + col2Width + col3Width, currentY + detailRowHeight - 1);
        
        currentY += detailRowHeight;
        
        sortedMetrics.forEach((metric, index) => {
            const standard = standard_value.find(s => s.company_value === metric.company_value);
            const standardScore = standard ? standard.total_score : 0;
            const multipliedScore = getMultipliedScore(metric.company_value, metric.total_score);
            const percentage = standardScore === 0 ? 100 : Math.round((multipliedScore / standardScore) * 100);
            
            // Enhanced alternating row colors dengan subtle gradients
            let rowBgColor;
            if (index % 2 === 0) {
                rowBgColor = [248, 249, 250]; // Light grey
            } else {
                rowBgColor = [255, 255, 255]; // White
            }
            
            // Row background dengan subtle border
            doc.setFillColor(rowBgColor[0], rowBgColor[1], rowBgColor[2]);
            doc.rect(tableStartX, currentY, tableWidth, detailRowHeight, 'F');
            
            // Row border dengan subtle color
            doc.setLineWidth(0.2);
            doc.setDrawColor(230, 230, 230);
            doc.rect(tableStartX, currentY, tableWidth, detailRowHeight);
            
            // Cell content dengan better alignment
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            
            // Company Value dengan emphasis
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(2, 83, 165); // Corporate blue
            doc.text(metric.company_value, tableStartX + (col1Width / 2), currentY + 6, { align: 'center' });
            
            // Actual Score dengan center alignment (multiplied score)
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            const actualText = Math.round(multipliedScore).toString();
            doc.text(actualText, tableStartX + col1Width + (col2Width / 2), currentY + 6, { align: 'center' });
            
            // Target Score dengan center alignment
            const targetText = standardScore.toString();
            doc.text(targetText, tableStartX + col1Width + col2Width + (col3Width / 2), currentY + 6, { align: 'center' });
            
            // Achievement color based on performance
            let achievementColor = [220, 53, 69]; // Red for poor
            if (percentage >= 80) achievementColor = [40, 167, 69]; // Green for good
            else if (percentage >= 60) achievementColor = [255, 193, 7]; // Yellow for average
            
            // Achievement percentage dengan enhanced progress bar mini
            const achievementBarWidth = Math.floor(col4Width * 0.6); // 60% of achievement column width
            const achievementBarHeight = 4;
            const achievementBarX = tableStartX + col1Width + col2Width + col3Width + (col4Width - achievementBarWidth) / 2;
            const achievementBarY = currentY + 2;
            
            // Background bar dengan border
            doc.setFillColor(240, 240, 240);
            doc.rect(achievementBarX, achievementBarY, achievementBarWidth, achievementBarHeight, 'F');
            doc.setLineWidth(0.1);
            doc.setDrawColor(200, 200, 200);
            doc.rect(achievementBarX, achievementBarY, achievementBarWidth, achievementBarHeight);
            
            // Achievement fill bar dengan gradient effect
            const achievementFillWidth = (achievementBarWidth * Math.min(percentage, 100)) / 100;
            doc.setFillColor(achievementColor[0], achievementColor[1], achievementColor[2]);
            doc.rect(achievementBarX, achievementBarY, achievementFillWidth, achievementBarHeight, 'F');
            
            // Achievement text dengan better positioning
            doc.setTextColor(achievementColor[0], achievementColor[1], achievementColor[2]);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7);
            doc.text(`${percentage}%`, achievementBarX + achievementBarWidth + 3, currentY + 6);
            
            // Vertical separators untuk cell consistency
            doc.setLineWidth(0.2);
            doc.setDrawColor(220, 220, 220);
            doc.line(tableStartX + col1Width, currentY, tableStartX + col1Width, currentY + detailRowHeight);
            doc.line(tableStartX + col1Width + col2Width, currentY, tableStartX + col1Width + col2Width, currentY + detailRowHeight);
            doc.line(tableStartX + col1Width + col2Width + col3Width, currentY, tableStartX + col1Width + col2Width + col3Width, currentY + detailRowHeight);
            
            // Borders untuk final row consistency
            doc.setLineWidth(0.1);
            doc.setDrawColor(200, 200, 200);
            doc.rect(tableStartX, currentY, col1Width, detailRowHeight);
            doc.rect(tableStartX + col1Width, currentY, col2Width, detailRowHeight);
            doc.rect(tableStartX + col1Width + col2Width, currentY, col3Width, detailRowHeight);
            doc.rect(tableStartX + col1Width + col2Width + col3Width, currentY, col4Width, detailRowHeight);
            
            currentY += detailRowHeight;
        });
        
        // Summary footer untuk tabel
        doc.setFillColor(2, 83, 165); // Corporate blue
        doc.rect(tableStartX, currentY, tableWidth, detailRowHeight, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('OVERALL TOTAL', tableStartX + (col1Width / 2), currentY + 6, { align: 'center' });
        
        const overallActual = sortedMetrics.reduce((sum, m) => sum + getMultipliedScore(m.company_value, m.total_score), 0);
        const overallTarget = sortedMetrics.reduce((sum, m) => {
            const standard = standard_value.find(s => s.company_value === m.company_value);
            return sum + (standard ? standard.total_score : 0);
        }, 0);
        const overallPercentage = overallTarget === 0 ? 100 : Math.round((overallActual / overallTarget) * 100);
        
        doc.text(Math.round(overallActual).toString(), tableStartX + col1Width + (col2Width / 2), currentY + 6, { align: 'center' });
        doc.text(overallTarget.toString(), tableStartX + col1Width + col2Width + (col3Width / 2), currentY + 6, { align: 'center' });
        doc.text(`${overallPercentage}%`, tableStartX + col1Width + col2Width + col3Width + (col4Width / 2), currentY + 6, { align: 'center' });
        
        currentY += detailRowHeight;
    }
    
    // Return total and evaluation for chart card
    return { 
        nextY: currentY + 15, 
        total: Math.round(total), 
        remark, 
        recommendation, 
        color 
    };
};

export const generateChartImage = async (formData) => {
    let chartContainer = null;
    let chart = null;
    
    try {
        const { html2canvas } = await initializeLibraries();
        
        // Create hidden container for chart
        chartContainer = document.createElement('div');
        chartContainer.id = 'pdf-chart-container';
        chartContainer.style.cssText = `
            position: absolute;
            left: -9999px;
            width: 600px;
            height: 400px;
            background-color: white;
            padding: 20px;
            z-index: -1;
        `;
        document.body.appendChild(chartContainer);

        // Import Chart.js components dengan timeout dan better error handling
        const chartLoadPromise = import('chart.js');
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Chart.js loading timeout')), 15000)
        );
        
        const chartModule = await Promise.race([chartLoadPromise, timeoutPromise]);
        
        // Handle different Chart.js export patterns
        const ChartJS = chartModule.default || chartModule.Chart || chartModule;
        
        // Check if Chart.js loaded properly
        if (!ChartJS || typeof ChartJS !== 'function') {
            throw new Error('Chart.js failed to load properly');
        }
        
        // Import and register required components with error handling
        try {
            const { 
                RadialLinearScale, 
                PointElement, 
                LineElement, 
                Filler, 
                Tooltip, 
                Legend 
            } = chartModule;
            
            if (RadialLinearScale && PointElement && LineElement && Filler && Tooltip && Legend) {
                ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
            } else {
                console.warn('Some Chart.js components not found, using defaults');
            }
        } catch (registerError) {
            console.warn('Chart.js component registration failed:', registerError);
        }

        const validMetrics = Array.isArray(formData.data_score) ? formData.data_score.filter(m => 
            m && 
            typeof m === 'object' && 
            typeof m.total_score === 'number' &&
            m.company_value
        ) : [];

        if (validMetrics.length === 0) {
            console.error('No valid metrics data:', formData.data_score);
            throw new Error('No valid metrics data available for chart');
        }

        // Multiplier function
        const getMultipliedScore = (companyValue, score) => {
            switch (companyValue) {
                case 'SIAH':
                    return score * 2;
                case '7 Values':
                    return score * 1.7;
                case 'CSE':
                    return score * 2;
                default:
                    return score;
            }
        };

        // Define desired order dan sort metrics
        const desiredOrder = ['SIAH', '7 Values', 'CSE', 'SDT', 'EXPERIENCE'];
        
        const sortedMetrics = [...validMetrics].sort((a, b) => {
            const indexA = desiredOrder.indexOf(a.company_value);
            const indexB = desiredOrder.indexOf(b.company_value);
            
            // If not found in desired order, put at end
            const orderA = indexA === -1 ? 999 : indexA;
            const orderB = indexB === -1 ? 999 : indexB;
            
            return orderA - orderB;
        });

        const standard_value = [
            { "company_value": "SIAH", "total_score": 40 },
            { "company_value": "7 Values", "total_score": 60 },
            { "company_value": "CSE", "total_score": 40 },
            { "company_value": "SDT", "total_score": 40 },
            { "company_value": "EXPERIENCE", "total_score": 20 }
        ];

        const companyValues = sortedMetrics.map(m => m.company_value);
        const actualScores = sortedMetrics.map(m => getMultipliedScore(m.company_value, m.total_score));
        const standardScores = companyValues.map(companyValue => {
            const standardItem = standard_value.find(item => item.company_value === companyValue);
            return standardItem ? standardItem.total_score : 0;
        });

        // Create canvas element
        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 350;
        chartContainer.appendChild(canvas);

        // Create chart dengan better error handling
        chart = new ChartJS(canvas, {
            type: 'radar',
            data: {
                labels: companyValues,
                datasets: [
                    {
                        label: 'Standard Target',
                        data: standardScores,
                        borderColor: 'rgba(255, 193, 7, 1)',
                        backgroundColor: 'rgba(255, 193, 7, 0.2)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(255, 193, 7, 1)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        fill: true
                    },
                    {
                        label: 'Actual Score',
                        data: actualScores,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.3)',
                        borderWidth: 3,
                        pointBackgroundColor: actualScores.map((score, index) => {
                            const standard = standardScores[index];
                            return score >= standard ? 'rgba(40, 167, 69, 1)' : 'rgba(220, 53, 69, 1)';
                        }),
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                animation: {
                    duration: 0 // Disable animation for faster rendering
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: { size: 12 }
                        }
                    }
                },
                scales: {
                    r: {
                        angleLines: { display: true, color: 'rgba(0, 0, 0, 0.1)' },
                        grid: { color: 'rgba(0, 0, 0, 0.1)' },
                        pointLabels: { 
                            font: { size: 12, weight: 'bold' },
                            color: '#000'
                        },
                        ticks: {
                            beginAtZero: true,
                            stepSize: 10,
                            font: { size: 10 },
                            backdropColor: 'rgba(255, 255, 255, 0.8)',
                            color: '#000'
                        },
                        suggestedMin: 0,
                        suggestedMax: Math.max(...standardScores, ...actualScores) + 10
                    }
                }
            }
        });

        // Verify chart was created successfully
        if (!chart) {
            throw new Error('Chart creation failed');
        }

        // Wait for chart to render dengan extended timeout dan multiple checks
        await new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 20;
            const checkInterval = 200;
            
            const checkRender = () => {
                attempts++;
                
                // Check if chart is rendered by looking at canvas state
                if (chart && chart.canvas && chart.canvas.getContext) {
                    const ctx = chart.canvas.getContext('2d');
                    const imageData = ctx.getImageData(0, 0, 10, 10);
                    const hasContent = imageData.data.some(value => value !== 0);
                    
                    if (hasContent || attempts >= maxAttempts) {
                        resolve();
                        return;
                    }
                }
                
                if (attempts >= maxAttempts) {
                    console.warn('Chart render timeout after maximum attempts');
                    resolve(); // Continue anyway
                    return;
                }
                
                setTimeout(checkRender, checkInterval);
            };
            
            // Start checking after initial delay
            setTimeout(checkRender, 500);
            
            // Absolute timeout
            setTimeout(() => {
                console.warn('Chart render absolute timeout');
                resolve();
            }, 10000);
        });
        
        
        const canvasImagePromise = html2canvas(chartContainer, {
            backgroundColor: 'white',
            scale: 2,
            useCORS: true,
            allowTaint: true,
            foreignObjectRendering: false,
            timeout: 15000,
            logging: false, // Reduce console noise
            width: chartContainer.offsetWidth,
            height: chartContainer.offsetHeight
        });
        
        const canvasTimeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Canvas conversion timeout')), 20000)
        );
        
        const canvasImage = await Promise.race([canvasImagePromise, canvasTimeoutPromise]);
        
        if (!canvasImage) {
            throw new Error('Canvas conversion returned null');
        }
        
        const imageData = canvasImage.toDataURL('image/png', 1.0);
        
        if (!imageData || imageData.length < 100) {
            throw new Error('Generated image data is invalid or empty');
        }
        
        return imageData;

    } catch (error) {
        console.error('Error generating chart image:', error);
        console.error('FormData received:', formData);
        console.error('Data score structure:', formData.data_score);
        
        // Try to create a simple fallback chart using canvas directly
        try {
            
            const fallbackCanvas = document.createElement('canvas');
            fallbackCanvas.width = 500;
            fallbackCanvas.height = 350;
            const ctx = fallbackCanvas.getContext('2d');
            
            // Simple fallback visualization
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 500, 350);
            
            ctx.fillStyle = 'black';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Performance Chart', 250, 50);
            
            ctx.font = '12px Arial';
            ctx.fillText('Chart generation failed', 250, 100);
            ctx.fillText('Error: ' + error.message, 250, 120);
            
            // Draw a simple placeholder chart
            ctx.strokeStyle = 'rgba(54, 162, 235, 1)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(250, 200, 80, 0, 2 * Math.PI);
            ctx.stroke();
            
            ctx.fillStyle = 'rgba(54, 162, 235, 0.3)';
            ctx.fill();
            
            const fallbackImageData = fallbackCanvas.toDataURL('image/png');
            return fallbackImageData;
            
        } catch (fallbackError) {
            console.error('Fallback chart also failed:', fallbackError);
            return null;
        }
    } finally {
        // Cleanup dengan safety checks
        try {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        } catch (e) {
            console.warn('Error destroying chart:', e);
        }
        
        try {
            if (chartContainer && chartContainer.parentNode) {
                chartContainer.parentNode.removeChild(chartContainer);
            }
        } catch (e) {
            console.warn('Error removing chart container:', e);
        }
    }
};

export const generateCandidateInfoTable = (doc, formData, yPosition) => {
    return generateManualTable(doc, formData, yPosition);
};

export const generateAssessmentTable = (doc, formData, yPosition) => {
    return generateManualAssessmentTable(doc, formData, yPosition);
};

export const generateSummaryTable = (doc, formData, yPosition) => {
    if (typeof doc.autoTable !== 'function') {
        console.warn('autoTable not available for summary table, using text format');
        return generateSummaryText(doc, formData, yPosition);
    }
    
    const validMetrics = Array.isArray(formData.data_score) ? formData.data_score.filter(m => 
        m && 
        typeof m === 'object' && 
        typeof m.total_score === 'number' &&
        m.company_value
    ) : [];

    const total = validMetrics.reduce((sum, m) => sum + m.total_score, 0);
    
    const getEvaluation = (total) => {
        if (total <= 20) return { remark: "Very Poor", recommendation: "Reject" };
        if (total <= 40) return { remark: "Poor", recommendation: "Reject" };
        if (total <= 60) return { remark: "Average", recommendation: "Consideration - need comparison" };
        if (total <= 80) return { remark: "Good", recommendation: "Next Process To be Hired" };
        return { remark: "Excellent", recommendation: "Next Process To be Hired" };
    };

    const { remark, recommendation } = getEvaluation(total);

    const summaryData = [
        ['Total Score', total.toString()],
        ['Overall Rating', remark],
        ['Recommendation', recommendation]
    ];

    const standard_value = [
        { "company_value": "SIAH", "total_score": 40 },
        { "company_value": "7 Values", "total_score": 60 },
        { "company_value": "SDT", "total_score": 40 },
        { "company_value": "CSE", "total_score": 40 },
        { "company_value": "EXPERIENCE", "total_score": 20 }
    ];

    if (validMetrics.length > 0) {
        validMetrics.forEach(metric => {
            const standard = standard_value.find(s => s.company_value === metric.company_value);
            const standardScore = standard ? standard.total_score : 0;
            const percentage = standardScore === 0 ? 100 : Math.round((metric.total_score / standardScore) * 100);
            summaryData.push([
                `${metric.company_value} Score`,
                `${metric.total_score} (${percentage}%)`
            ]);
        });
    }

    try {
        doc.autoTable({
            startY: yPosition,
            head: [['Assessment Criteria', 'Result']],
            body: summaryData,
            theme: 'grid',
            headStyles: { 
                fillColor: [52, 58, 64], 
                textColor: 255, 
                fontStyle: 'bold',
                fontSize: 10
            },
            styles: { 
                fontSize: 9, 
                cellPadding: 3 
            },
            columnStyles: { 
                0: { 
                    fontStyle: 'bold', 
                    fillColor: [248, 249, 250],
                    cellWidth: 80
                },
                1: {
                    cellWidth: 70
                }
            }
        });

        return doc.lastAutoTable.finalY + 15;
    } catch (error) {
        console.error('autoTable error for summary:', error);
        return generateSummaryText(doc, formData, yPosition);
    }
};

export const generatePDF = async (formData) => {
    let doc = null;
    
    try {
        
        // Initialize libraries dengan timeout
        const { jsPDF } = await Promise.race([
            initializeLibraries(),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('PDF initialization timeout')), 20000)
            )
        ]);
        
        doc = new jsPDF('p', 'mm', 'a4');
        
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        let yPosition = 10;

        // Logo section dengan error handling
        try {
            const logoWidth = 70;
            const logoHeight = 8;
            const logoX = 10;
            const logoY = yPosition - 5;
            const logoData = '/assets/img/motor-sights-international.png'; 
            addLogoToDoc(doc, logoData, logoX, logoY, logoWidth, logoHeight);
        } catch (logoError) {
            console.warn('Logo loading failed:', logoError);
        }
        
        // Reset text color untuk title
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        
        // Position text di sebelah kanan logo
        const textX = 10 + 70 + 50;
        doc.text('HR FORM INTERVIEW', textX, yPosition + 1);
        
        yPosition += 5;

        // Generate tables dengan progress tracking
        yPosition = generateCandidateInfoTable(doc, formData, yPosition);

        yPosition = generateAssessmentTable(doc, formData, yPosition);

        // Check if we need new page for chart section
        if (yPosition > pageHeight - 120) {
            doc.addPage();
            yPosition = 20;
        }

        let scoreResult = null;
        
        try {
            const chartPromise = generateChartImage(formData);
            const chartTimeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Chart generation timeout')), 45000)
            );
            
            const chartImage = await Promise.race([chartPromise, chartTimeoutPromise]);
            
            // Generate scoreResult for card data
            scoreResult = generateScoreResultForCard(formData);
            
            if (chartImage && chartImage.length > 100) {
                // Chart dan Card side by side
                const chartWidth = 110;
                const chartHeight = 80;
                const chartX = 20;

                // Card di sebelah kanan chart
                const cardX = chartX + chartWidth + 15;
                const cardY = yPosition;
                const cardWidth = 50;
                const cardHeight = 80;

                // Background card dengan border
                doc.setFillColor(248, 249, 250);
                doc.rect(cardX, cardY, cardWidth, cardHeight, 'F');
                doc.setLineWidth(0.5);
                doc.setDrawColor(200, 200, 200);
                doc.rect(cardX, cardY, cardWidth, cardHeight);

                // Total Score di center atas card
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text('TOTAL', cardX + (cardWidth / 2), cardY + 15, { align: 'center' });

                // Total value dengan ukuran besar
                doc.setFontSize(24);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(scoreResult.color[0], scoreResult.color[1], scoreResult.color[2]);
                doc.text(scoreResult.total.toString(), cardX + (cardWidth / 2), cardY + 30, { align: 'center' });

                // Remark di bawah total
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(0, 0, 0);
                doc.text(scoreResult.remark, cardX + (cardWidth / 2), cardY + 45, { align: 'center' });

                // Text "Recommendation" 
                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');
                doc.text('Recommendation:', cardX + (cardWidth / 2), cardY + 55, { align: 'center' });

                // Recommendation text dengan word wrap
                doc.setFontSize(7);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(scoreResult.color[0], scoreResult.color[1], scoreResult.color[2]);
                const wrappedRecommendation = doc.splitTextToSize(scoreResult.recommendation, cardWidth - 4);
                let recY = cardY + 62;
                wrappedRecommendation.forEach((line, index) => {
                    doc.text(line, cardX + (cardWidth / 2), recY + (index * 4), { align: 'center' });
                });

                // Chart image
                doc.addImage(chartImage, 'PNG', chartX, yPosition, chartWidth, chartHeight);
                yPosition += chartHeight + 10;
                
            } else {
                console.warn('Chart generation failed or returned invalid data, showing summary card only');
                const cardX = 20;
                const cardY = yPosition;
                const cardWidth = 80;
                const cardHeight = 60;

                doc.setFillColor(248, 249, 250);
                doc.rect(cardX, cardY, cardWidth, cardHeight, 'F');
                doc.setLineWidth(0.5);
                doc.setDrawColor(200, 200, 200);
                doc.rect(cardX, cardY, cardWidth, cardHeight);

                doc.setTextColor(0, 0, 0);
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('ASSESSMENT SUMMARY', cardX + (cardWidth / 2), cardY + 15, { align: 'center' });

                doc.setFontSize(18);
                doc.setTextColor(scoreResult.color[0], scoreResult.color[1], scoreResult.color[2]);
                doc.text(`Total: ${scoreResult.total}`, cardX + (cardWidth / 2), cardY + 30, { align: 'center' });

                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                doc.text(`Rating: ${scoreResult.remark}`, cardX + (cardWidth / 2), cardY + 42, { align: 'center' });

                // Add note about chart failure
                doc.setFontSize(8);
                doc.setTextColor(220, 53, 69);
                doc.text('(Chart generation failed)', cardX + (cardWidth / 2), cardY + 52, { align: 'center' });

                yPosition += cardHeight + 10;
            }
        } catch (chartError) {
            console.error('Chart generation failed with error:', chartError);
            // Continue without chart but add error message
            doc.setTextColor(220, 53, 69);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text('Chart generation failed: ' + chartError.message, 20, yPosition);
            yPosition += 15;
        }

        // Check if we need new page for comprehensive score section
        if (yPosition > pageHeight - 100) {
            doc.addPage();
            yPosition = 20;
        }

        // Comprehensive Score Section (Performance Summary Table)
        const comprehensiveResult = generateComprehensiveScoreSection(doc, formData, yPosition);
        yPosition = comprehensiveResult.nextY;

        // Footer
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(
            `Generated on: ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString()}`, 
            20, 
            pageHeight - 10
        );

        // Save PDF dengan validation
        const candidateData = formData.data_candidate || {};
        const candidateName = candidateData.name_candidate || 'Candidate';
        const safeFileName = candidateName.replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `Interview_Assessment_${safeFileName}_${new Date().toISOString().split('T')[0]}.pdf`;
        
        doc.save(fileName);
        
        toast.success('PDF downloaded successfully!');
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        
        // Provide more specific error messages
        let errorMessage = 'Failed to generate PDF';
        if (error.message.includes('timeout')) {
            errorMessage = 'PDF generation timed out. Please try again.';
        } else if (error.message.includes('Library')) {
            errorMessage = 'Failed to load PDF libraries. Please refresh and try again.';
        } else if (error.message.includes('Chart')) {
            errorMessage = 'Chart generation failed, but PDF should still work.';
        }
        
        toast.error(errorMessage + ': ' + error.message);
        throw error;
    } finally {
        // Cleanup
        if (doc) {
            try {
                // Force cleanup any remaining resources
                doc = null;
            } catch (e) {
                console.warn('Cleanup warning:', e);
            }
        }
    }
};
// Main export function untuk compatibility dengan existing code
export const downloadInterviewPDF = async (formData) => {
    try {
        return await generatePDF(formData);
    } catch (error) {
        console.error('Download PDF failed:', error);
        
        if (error.message.includes('Library') || error.message.includes('timeout')) {
            resetLibrariesCache();
            
            try {
                return await generatePDF(formData);
            } catch (retryError) {
                console.error('Retry also failed:', retryError);
                toast.error('PDF generation failed after retry. Please refresh the page and try again.');
                throw retryError;
            }
        }
        
        throw error;
    }
};
