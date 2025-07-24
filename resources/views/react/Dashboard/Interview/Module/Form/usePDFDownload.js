import { useState } from 'react';
import { downloadInterviewPDF } from './PDFInterviewReport';
import { toast } from 'react-toastify';

export const usePDFDownload = () => {
    const [isGenerating, setIsGenerating] = useState(false);

    const downloadPDF = async (formData) => {
        if (isGenerating) {
            toast.warning('PDF is already being generated...');
            return;
        }

        try {
            setIsGenerating(true);
            toast.info('Generating PDF report...', { autoClose: 2000 });
            
            await downloadInterviewPDF(formData);
            
        } catch (error) {
            console.error('Error downloading PDF:', error);
            toast.error('Failed to download PDF: ' + error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    return {
        downloadPDF,
        isGenerating
    };
};

export default usePDFDownload;
