# PDF Interview Report Component

## Komponen untuk generate PDF interview report dengan functional architecture

### File Structure
```
- PDFInterviewReport.js    # Main PDF generator dengan export const functions
- usePDFDownload.js       # React hook untuk manage PDF download
```

### ✅ **Refactored to Functional Programming:**
```javascript
// Before: Class-based approach
class PDFInterviewReport {
    async generatePDF(formData) { ... }
}

// After: Export const functions
export const generatePDF = async (formData) => { ... }
export const generateChartImage = async (formData) => { ... }
export const generateCandidateInfoTable = (doc, formData, yPosition) => { ... }
export const generateAssessmentTable = (doc, formData, yPosition) => { ... }
export const generateSummaryTable = (doc, formData, yPosition) => { ... }
```

### Usage Example

#### Basic Usage:
```javascript
import { usePDFDownload } from './usePDFDownload';

function InterviewComponent() {
    const { downloadPDF, isGenerating } = usePDFDownload();
    
    const handleDownload = () => {
        downloadPDF(formData);
    };
    
    return (
        <button 
            onClick={handleDownload} 
            disabled={isGenerating}
        >
            {isGenerating ? 'Generating...' : 'Download PDF'}
        </button>
    );
}
```

#### Direct Import:
```javascript
import { downloadInterviewPDF, generatePDF } from './PDFInterviewReport';

// Direct function call
await downloadInterviewPDF(formData);
// or
await generatePDF(formData);
```

#### Individual Function Usage:
```javascript
import { 
    generateChartImage, 
    generateCandidateInfoTable, 
    generateAssessmentTable,
    generateSummaryTable 
} from './PDFInterviewReport';

// Use individual functions
const chartImage = await generateChartImage(formData);
const yPos = generateCandidateInfoTable(doc, formData, 20);
```

### Data Structure Expected

```javascript
const formData = {
    candidate: {
        name: "John Doe",
        email: "john@example.com",
        phone: "081234567890",
        position: "Software Engineer"
    },
    interview: {
        form_interviews: [
            {
                interviewer: {
                    name: "Jane Smith"
                },
                questions: [
                    {
                        company_value: "SIAH",
                        question: "Question text",
                        total_score: 85,
                        target_standard: 80
                    }
                ]
            }
        ]
    }
};
```

### Features

1. **Candidate Information Table**: Basic candidate details
2. **Assessment Table**: Grouped by company values with totals
3. **Summary Table**: Evaluation results and recommendations
4. **Chart Integration**: Visual representation of scores
5. **Professional Layout**: Clean, professional PDF format

### Dependencies

- jsPDF: PDF generation
- jspdf-autotable: Table formatting
- html2canvas: Chart rendering
- Chart.js: Chart generation

### Error Handling

The component includes comprehensive error handling:
- Library loading failures
- Chart generation errors
- PDF creation issues
- User feedback via toast notifications

### Maintenance

The modular architecture ensures:
- Easy testing of individual functions
- Simple debugging of specific features
- Clean separation of concerns
- Reusable across different components
