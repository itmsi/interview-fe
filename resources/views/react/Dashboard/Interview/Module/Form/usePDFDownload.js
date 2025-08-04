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

        setIsGenerating(true);

        const pdfPromise = downloadInterviewPDF(formData);

        toast.promise(
            pdfPromise,
            {
                pending: 'Generating PDF report...',
                success: {
                    render() {
                        return 'PDF downloaded successfully!';
                    },
                    autoClose: 3000,
                },
                error: {
                    render({data}) {
                        console.error('Error downloading PDF:', data);
                        return `Failed to download PDF: ${data?.message || 'Unknown error'}`;
                    }
                }
            }
        );

        try {
            await pdfPromise;
        } catch (error) {
            // Error sudah ditangani oleh toast.promise
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
