import jsPDF from 'jspdf';

export function PdfGenerator() {
    const doc: jsPDF = new jsPDF({unit: 'px', format: 'a4'});

    const savePdf = (html_element) => {
        doc.html(html_element, {
            async callback(doc) {
                await doc.save('pdf_name');
            },
        });
    }
    return (
        <div>
            <h1>PDF Generator</h1>
            <p>This is a placeholder for the PDF generation functionality.</p>
        </div>
    );
}