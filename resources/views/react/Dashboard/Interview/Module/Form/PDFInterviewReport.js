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
    const rowHeight = 8;
    const colNoWidth = 10;
    const colCompanyWidth = 22;
    const colAspectWidth = 70;
    const colQuestionWidth = 70;
    const colScoreWidth = 10;
    const colRemarksWidth = 30;
    
    // Header
    doc.setFillColor(2, 83, 165); // Header biru
    doc.rect(posisi_x, currentY, colNoWidth + colCompanyWidth + colAspectWidth + colQuestionWidth + colScoreWidth + colRemarksWidth, rowHeight, 'F');
    
    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('No.', posisi_x + 2, currentY + 5);
    doc.text('Company Value', posisi_x + colNoWidth + 2, currentY + 5);
    doc.text('Aspect', posisi_x + colNoWidth + colCompanyWidth + 2, currentY + 5);
    doc.text('Question/Answer', posisi_x + colNoWidth + colCompanyWidth + colAspectWidth + 2, currentY + 5);
    doc.text('Score', posisi_x + colNoWidth + colCompanyWidth + colAspectWidth + colQuestionWidth + 2, currentY + 5);
    doc.text('Remarks', posisi_x + colNoWidth + colCompanyWidth + colAspectWidth + colQuestionWidth + colScoreWidth + 2, currentY + 5);
    
    currentY += rowHeight;
    
    // Group data by company_value
    const groupedData = {};
    if (formData.interview && Array.isArray(formData.interview)) {
        formData.interview.forEach(item => {
            if (!groupedData[item.company_value]) {
                groupedData[item.company_value] = [];
            }
            groupedData[item.company_value].push(item);
        });
    }
    
    let questionNumber = 1;
    
    Object.keys(groupedData).forEach((companyValue, companyIndex) => {
        const items = groupedData[companyValue];
        let companyTotal = 0;
        const startY = currentY; // Record start position untuk company value
        
        items.forEach((item, index) => {
            const score = item.score || 0;
            companyTotal += score;
            
            // Determine remarks based on score
            let remarks = 'Poor';
            if (score >= 8) remarks = 'Excellent';
            else if (score >= 6) remarks = 'Good';
            else if (score >= 4) remarks = 'Average';
            
            // Alternate row colors untuk value
            if (index % 2 === 0) {
                doc.setFillColor(217, 225, 242); // Biru muda untuk value
            } else {
                doc.setFillColor(245, 248, 251); // Lebih terang untuk alternating
            }
            doc.rect(posisi_x, currentY, colNoWidth + colCompanyWidth + colAspectWidth + colQuestionWidth + colScoreWidth + colRemarksWidth, rowHeight, 'F');
            
            // Draw data
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'normal');
            
            // No.
            doc.text(questionNumber.toString(), posisi_x + 2, currentY + 5 , { align: 'center' });
            
            // Aspect
            const aspect = item.aspect || 'N/A';
            const wrappedAspect = doc.splitTextToSize(aspect, colAspectWidth - 4);
            doc.text(wrappedAspect, posisi_x + colNoWidth + colCompanyWidth + 2, currentY + 5);
            
            // Question/Answer
            const question = item.question || item.answer || 'N/A';
            const wrappedQuestion = doc.splitTextToSize(question, colQuestionWidth - 4);
            doc.text(wrappedQuestion, posisi_x + colNoWidth + colCompanyWidth + colAspectWidth + 2, currentY + 5);
            
            // Score
            doc.setFont('helvetica', 'bold');
            doc.text(score.toString(), posisi_x - 3 + colNoWidth + colCompanyWidth + colAspectWidth + colQuestionWidth + 8, currentY + 5, { align: 'center' });
            
            // Remarks
            doc.setFont('helvetica', 'normal');
            doc.text(remarks, posisi_x + colNoWidth + colCompanyWidth + colAspectWidth + colQuestionWidth + colScoreWidth + 2, currentY + 5);
            
            // Borders untuk kolom kecuali company value
            doc.setLineWidth(0.1);
            doc.setDrawColor(128, 128, 128);
            doc.rect(posisi_x, currentY, colNoWidth, rowHeight); // No
            doc.rect(posisi_x + colNoWidth + colCompanyWidth, currentY, colAspectWidth, rowHeight); // Aspect
            doc.rect(posisi_x + colNoWidth + colCompanyWidth + colAspectWidth, currentY, colQuestionWidth, rowHeight); // Question
            doc.rect(posisi_x + colNoWidth + colCompanyWidth + colAspectWidth + colQuestionWidth, currentY, colScoreWidth, rowHeight); // Score
            doc.rect(posisi_x + colNoWidth + colCompanyWidth + colAspectWidth + colQuestionWidth + colScoreWidth, currentY, colRemarksWidth, rowHeight); // Remarks
            
            currentY += rowHeight;
            questionNumber++;
        });
        
        // Setelah semua items, gambar company value di tengah dengan background dan border
        const companyRowHeight = items.length * rowHeight;
        const companyTextY = startY + (companyRowHeight / 2) + 2;
        
        // Background untuk company value (spanning multiple rows)
        doc.setFillColor(2, 83, 165); // Biru untuk company value
        doc.rect(posisi_x + colNoWidth, startY, colCompanyWidth, companyRowHeight, 'F');
        
        // Company Value text (di tengah)
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        const lines = doc.splitTextToSize(companyValue, colCompanyWidth - 4);
        const lineHeight = 3;
        let textStartY = companyTextY - ((lines.length - 1) * lineHeight / 2);
        
        lines.forEach((line, i) => {
            doc.text(line, posisi_x + colNoWidth + (colCompanyWidth / 2), textStartY + (i * lineHeight), { align: 'center' });
        });
        
        // Border untuk company value column
        doc.setLineWidth(0.1);
        doc.setDrawColor(128, 128, 128);
        doc.rect(posisi_x + colNoWidth, startY, colCompanyWidth, companyRowHeight);
        
        // Total row untuk setiap company value
        doc.setFillColor(2, 83, 165); // Biru untuk total
        doc.rect(posisi_x, currentY, colNoWidth + colCompanyWidth + colAspectWidth + colQuestionWidth + colScoreWidth + colRemarksWidth, rowHeight, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('TOTAL', posisi_x + colNoWidth + 2, currentY + 5);
        doc.text(companyTotal.toString(), posisi_x - 4 + colNoWidth + colCompanyWidth + colAspectWidth + colQuestionWidth + 8, currentY + 5);
        
        // Total row borders
        doc.setLineWidth(0.1);
        doc.setDrawColor(128, 128, 128);
        doc.rect(posisi_x, currentY, colNoWidth + colCompanyWidth + colAspectWidth + colQuestionWidth + colScoreWidth + colRemarksWidth, rowHeight);
        
        currentY += rowHeight; // Extra space after each company section
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
                { "company_value": "SDT", "total_score": 40 },
                { "company_value": "CSE", "total_score": 40 },
                { "company_value": "SIAH", "total_score": 0 },
                { "company_value": "7 Values", "total_score": 0 }
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

// Function untuk generate comprehensive score section seperti show score
const generateComprehensiveScoreSection = (doc, formData, yPosition) => {
    let currentY = yPosition;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    
    // Calculate scores
    const validMetrics = Array.isArray(formData.data_score) ? formData.data_score.filter(m => 
        m && 
        typeof m === 'object' && 
        typeof m.total_score === 'number' &&
        m.company_value
    ) : [];

    const total = validMetrics.reduce((sum, m) => sum + m.total_score, 0);
    
    const getEvaluation = (total) => {
        if (total <= 20) return { remark: "Very Poor", recommendation: "Reject", color: [220, 53, 69] };
        if (total <= 40) return { remark: "Poor", recommendation: "Reject", color: [255, 193, 7] };
        if (total <= 60) return { remark: "Average", recommendation: "Consideration - need comparison", color: [0, 123, 255] };
        if (total <= 80) return { remark: "Good", recommendation: "Next Process To be Hired", color: [40, 167, 69] };
        return { remark: "Excellent", recommendation: "Next Process To be Hired", color: [40, 167, 69] };
    };

    const { remark, recommendation, color } = getEvaluation(total);
    
    // 1. Total Score dengan Visual Indicator
    // doc.setFillColor(2, 83, 165);
    // doc.rect(20, currentY, pageWidth - 40, 15, 'F');
    
    // doc.setTextColor(255, 255, 255);
    // doc.setFontSize(14);
    // doc.setFont('helvetica', 'bold');
    // doc.text('TOTAL SCORE OVERVIEW', 25, currentY + 10);
    // currentY += 20;
    
    // // Score Circle/Bar dengan visual yang lebih menarik
    const scoreBarWidth = 120;
    const scoreBarHeight = 20;
    const scoreBarX = pageWidth / 4;
    
    // // Background bar dengan border
    // doc.setFillColor(240, 240, 240);
    // doc.rect(scoreBarX, currentY, scoreBarWidth, scoreBarHeight, 'F');
    // doc.setLineWidth(0.5);
    // doc.setDrawColor(180, 180, 180);
    // doc.rect(scoreBarX, currentY, scoreBarWidth, scoreBarHeight);
    
    // // Score bar (proportional to total) dengan gradient effect
    // const maxScore = 100; // Assumsi max score 100
    // const scorePercentage = Math.min(total / maxScore, 1);
    // doc.setFillColor(color[0], color[1], color[2]);
    // doc.rect(scoreBarX + 1, currentY + 1, (scoreBarWidth - 2) * scorePercentage, scoreBarHeight - 2, 'F');
    
    // Score text dengan styling yang lebih baik
    // doc.setTextColor(0, 0, 0);
    // doc.setFontSize(18);
    // doc.setFont('helvetica', 'bold');
    // doc.text(`${total}`, scoreBarX + scoreBarWidth + 15, currentY + 14);
    // doc.setFontSize(12);
    // doc.setFont('helvetica', 'normal');
    // doc.text('/ 100', scoreBarX + scoreBarWidth + 35, currentY + 14);
    
    // Score percentage
    doc.setFontSize(10);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(`(${Math.round(total)}%)`, scoreBarX + scoreBarWidth + 50, currentY + 14);
    
    currentY += 35;
    
    // // 2. Recommendation Section
    // doc.setFillColor(color[0], color[1], color[2]);
    // doc.rect(20, currentY, pageWidth - 40, 12, 'F');
    
    // doc.setTextColor(255, 255, 255);
    // doc.setFontSize(12);
    // doc.setFont('helvetica', 'bold');
    // doc.text('RECOMMENDATION', 25, currentY + 8);
    // currentY += 15;
    
    // // Enhanced recommendation section dengan visual indicators
    // doc.setFillColor(248, 249, 250);
    // doc.rect(25, currentY + 2, pageWidth - 50, 18, 'F');
    
    // // Border untuk recommendation box
    // doc.setLineWidth(0.5);
    // doc.setDrawColor(color[0], color[1], color[2]);
    // doc.rect(25, currentY + 2, pageWidth - 50, 18);
    
    // // Rating stars berdasarkan total score
    // let iconSymbol = "";
    // if (total >= 80) iconSymbol = "★★★★★"; // 5 stars
    // else if (total >= 60) iconSymbol = "★★★★☆"; // 4 stars
    // else if (total >= 40) iconSymbol = "★★★☆☆"; // 3 stars
    // else if (total >= 20) iconSymbol = "★★☆☆☆"; // 2 stars
    // else iconSymbol = "★☆☆☆☆"; // 1 star
    
    // doc.setTextColor(255, 193, 7); // Gold color untuk stars
    // doc.setFontSize(12);
    // doc.text(iconSymbol, 30, currentY + 8);
    
    // doc.setTextColor(0, 0, 0);
    // doc.setFontSize(11);
    // doc.setFont('helvetica', 'normal');
    // doc.text(`Overall Rating: ${remark}`, 30, currentY + 15);
    // currentY += 8;
    // doc.setTextColor(color[0], color[1], color[2]);
    // doc.setFont('helvetica', 'bold');
    // doc.text(`Recommendation: ${recommendation}`, 30, currentY + 15);
    // currentY += 20;
    
    // // 3. Performance Summary Detail
    // doc.setFillColor(2, 83, 165);
    // doc.rect(20, currentY, pageWidth - 40, 12, 'F');
    
    // doc.setTextColor(255, 255, 255);
    // doc.setFontSize(12);
    // doc.setFont('helvetica', 'bold');
    // doc.text('PERFORMANCE SUMMARY DETAIL', 25, currentY + 8);
    // currentY += 18;
    
    // Standard values untuk comparison
    const standard_value = [
        { "company_value": "SDT", "total_score": 40 },
        { "company_value": "CSE", "total_score": 40 },
        { "company_value": "SIAH", "total_score": 0 },
        { "company_value": "7 Values", "total_score": 0 }
    ];
    
    if (validMetrics.length > 0) {
        // Table header untuk detail
        const detailRowHeight = 8;
        const col1Width = 60;
        const col2Width = 30;
        const col3Width = 30;
        const col4Width = 40;
        
        // Enhanced table header dengan gradient effect
        doc.setFillColor(2, 83, 165); // Primary blue
        doc.rect(20, currentY, col1Width + col2Width + col3Width + col4Width, detailRowHeight, 'F');
        
        // Header border dengan shadow effect
        doc.setLineWidth(1);
        doc.setDrawColor(0, 51, 102); // Darker blue for border
        doc.rect(20, currentY, col1Width + col2Width + col3Width + col4Width, detailRowHeight);
        
        // Header text dengan better spacing
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Company Value', 22, currentY + 6);
        doc.text('Actual', 22 + col1Width + 5, currentY + 6);
        doc.text('Target', 22 + col1Width + col2Width + 5, currentY + 6);
        doc.text('Achievement', 22 + col1Width + col2Width + col3Width + 2, currentY + 6);
        
        // Vertical separators dalam header
        doc.setLineWidth(0.5);
        doc.setDrawColor(255, 255, 255);
        doc.line(20 + col1Width, currentY + 1, 20 + col1Width, currentY + detailRowHeight - 1);
        doc.line(20 + col1Width + col2Width, currentY + 1, 20 + col1Width + col2Width, currentY + detailRowHeight - 1);
        doc.line(20 + col1Width + col2Width + col3Width, currentY + 1, 20 + col1Width + col2Width + col3Width, currentY + detailRowHeight - 1);
        
        currentY += detailRowHeight;
        
        validMetrics.forEach((metric, index) => {
            const standard = standard_value.find(s => s.company_value === metric.company_value);
            const standardScore = standard ? standard.total_score : 0;
            const percentage = standardScore === 0 ? 100 : Math.round((metric.total_score / standardScore) * 100);
            
            // Enhanced alternating row colors dengan subtle gradients
            let rowBgColor;
            if (index % 2 === 0) {
                rowBgColor = [248, 249, 250]; // Light grey
            } else {
                rowBgColor = [255, 255, 255]; // White
            }
            
            // Row background dengan subtle border
            doc.setFillColor(rowBgColor[0], rowBgColor[1], rowBgColor[2]);
            doc.rect(20, currentY, col1Width + col2Width + col3Width + col4Width, detailRowHeight, 'F');
            
            // Row border dengan subtle color
            doc.setLineWidth(0.2);
            doc.setDrawColor(230, 230, 230);
            doc.rect(20, currentY, col1Width + col2Width + col3Width + col4Width, detailRowHeight);
            
            // Cell content dengan better alignment
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            
            // Company Value dengan emphasis
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(2, 83, 165); // Corporate blue
            doc.text(metric.company_value, 22, currentY + 6);
            
            // Actual Score dengan center alignment
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            const actualText = metric.total_score.toString();
            const actualWidth = doc.getTextWidth(actualText);
            doc.text(actualText, 20 + col1Width + (col2Width - actualWidth) / 2, currentY + 6);
            
            // Target Score dengan center alignment
            const targetText = standardScore.toString();
            const targetWidth = doc.getTextWidth(targetText);
            doc.text(targetText, 20 + col1Width + col2Width + (col3Width - targetWidth) / 2, currentY + 6);
            
            // Achievement color based on performance
            let achievementColor = [220, 53, 69]; // Red for poor
            if (percentage >= 80) achievementColor = [40, 167, 69]; // Green for good
            else if (percentage >= 60) achievementColor = [255, 193, 7]; // Yellow for average
            
            // Achievement percentage dengan enhanced progress bar mini
            const achievementBarWidth = 25;
            const achievementBarHeight = 4;
            const achievementBarX = 22 + col1Width + col2Width + col3Width + 2;
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
            doc.text(`${percentage}%`, achievementBarX + achievementBarWidth + 2, currentY + 6);
            
            // Vertical separators untuk cell consistency
            doc.setLineWidth(0.2);
            doc.setDrawColor(220, 220, 220);
            doc.line(20 + col1Width, currentY, 20 + col1Width, currentY + detailRowHeight);
            doc.line(20 + col1Width + col2Width, currentY, 20 + col1Width + col2Width, currentY + detailRowHeight);
            doc.line(20 + col1Width + col2Width + col3Width, currentY, 20 + col1Width + col2Width + col3Width, currentY + detailRowHeight);
            
            // Borders untuk final row consistency
            doc.setLineWidth(0.1);
            doc.setDrawColor(200, 200, 200);
            doc.rect(20, currentY, col1Width, detailRowHeight);
            doc.rect(20 + col1Width, currentY, col2Width, detailRowHeight);
            doc.rect(20 + col1Width + col2Width, currentY, col3Width, detailRowHeight);
            doc.rect(20 + col1Width + col2Width + col3Width, currentY, col4Width, detailRowHeight);
            
            currentY += detailRowHeight;
        });
        
        // Summary footer untuk tabel
        doc.setFillColor(2, 83, 165); // Corporate blue
        doc.rect(20, currentY, col1Width + col2Width + col3Width + col4Width, detailRowHeight, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('OVERALL TOTAL', 22, currentY + 6);
        
        const overallActual = validMetrics.reduce((sum, m) => sum + m.total_score, 0);
        const overallTarget = validMetrics.reduce((sum, m) => {
            const standard = standard_value.find(s => s.company_value === m.company_value);
            return sum + (standard ? standard.total_score : 0);
        }, 0);
        const overallPercentage = overallTarget === 0 ? 100 : Math.round((overallActual / overallTarget) * 100);
        
        doc.text(overallActual.toString(), 20 + col1Width + (col2Width / 2), currentY + 6);
        doc.text(overallTarget.toString(), 20 + col1Width + col2Width + (col3Width / 2), currentY + 6);
        doc.text(`${overallPercentage}%`, 20 + col1Width + col2Width + col3Width + (col4Width / 2), currentY + 6);
        
        currentY += detailRowHeight;
    }
    
    return currentY + 15;
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

        // Import Chart.js components dengan timeout
        const chartLoadPromise = import('chart.js');
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Chart.js loading timeout')), 15000)
        );
        
        const chartModule = await Promise.race([chartLoadPromise, timeoutPromise]);
        const ChartJS = chartModule.Chart;
        const { RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } = chartModule;
        
        ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

        // Prepare chart data
        const validMetrics = Array.isArray(formData.data_score) ? formData.data_score.filter(m => 
            m && 
            typeof m === 'object' && 
            typeof m.total_score === 'number' &&
            m.company_value
        ) : [];

        if (validMetrics.length === 0) {
            throw new Error('No valid metrics data available for chart');
        }

        const standard_value = [
            { "company_value": "SDT", "total_score": 40 },
            { "company_value": "CSE", "total_score": 40 },
            { "company_value": "SIAH", "total_score": 0 },
            { "company_value": "7 Values", "total_score": 0 }
        ];

        const companyValues = validMetrics.map(m => m.company_value);
        const actualScores = validMetrics.map(m => m.total_score);
        const standardScores = companyValues.map(companyValue => {
            const standardItem = standard_value.find(item => item.company_value === companyValue);
            return standardItem ? standardItem.total_score : 0;
        });

        // Create canvas element
        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 350;
        chartContainer.appendChild(canvas);

        // Create chart
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

        // Wait for chart to render dengan timeout
        await Promise.race([
            new Promise((resolve) => setTimeout(resolve, 2000)),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Chart render timeout')), 5000))
        ]);
        
        // Convert to image dengan timeout
        const canvasImagePromise = html2canvas(chartContainer, {
            backgroundColor: 'white',
            scale: 2,
            useCORS: true,
            allowTaint: true,
            foreignObjectRendering: false,
            timeout: 10000
        });
        
        const canvasTimeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Canvas conversion timeout')), 15000)
        );
        
        const canvasImage = await Promise.race([canvasImagePromise, canvasTimeoutPromise]);
        const imageData = canvasImage.toDataURL('image/png');
        
        return imageData;

    } catch (error) {
        console.error('Error generating chart image:', error);
        return null;
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
    // Selalu gunakan manual table untuk konsistensi
    return generateManualTable(doc, formData, yPosition);
};

export const generateAssessmentTable = (doc, formData, yPosition) => {
    // Selalu gunakan manual table untuk assessment dengan rowspan
    return generateManualAssessmentTable(doc, formData, yPosition);
};

export const generateSummaryTable = (doc, formData, yPosition) => {
    // Fallback jika autoTable tidak tersedia
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
        { "company_value": "SDT", "total_score": 40 },
        { "company_value": "CSE", "total_score": 40 },
        { "company_value": "SIAH", "total_score": 0 },
        { "company_value": "7 Values", "total_score": 0 }
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

        // Check if we need new page for comprehensive score section
        if (yPosition > pageHeight - 100) {
            doc.addPage();
            yPosition = 20;
        }

        // Comprehensive Score Section
        yPosition = generateComprehensiveScoreSection(doc, formData, yPosition);

        // Performance Chart Section dengan optional chart
        try {
            const chartPromise = generateChartImage(formData);
            const chartTimeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Chart generation timeout')), 30000)
            );
            
            const chartImage = await Promise.race([chartPromise, chartTimeoutPromise]);
            
            if (chartImage) {
                if (yPosition > pageHeight - 120) {
                    doc.addPage();
                    yPosition = 20;
                }

                // doc.setFillColor(2, 83, 165);
                // doc.rect(20, yPosition, pageWidth - 40, 12, 'F');
                // doc.setTextColor(255, 255, 255);
                // doc.setFontSize(12);
                // doc.setFont('helvetica', 'bold');
                // doc.text('PERFORMANCE RADAR CHART', 25, yPosition + 8);
                // yPosition += 18;

                const chartWidth = 160;
                const chartHeight = 100;
                const chartX = (pageWidth - chartWidth) / 2;

                doc.addImage(chartImage, 'PNG', chartX, yPosition, chartWidth, chartHeight);
                yPosition += chartHeight + 10;
                
            } else {
            }
        } catch (chartError) {
            console.warn('Chart generation failed:', chartError);
            // Continue without chart
        }

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
        
        // Jika error karena library loading, reset cache dan coba lagi sekali
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
