import {use, useState} from "react";
import {Button, Col, Row} from "antd";
import {Form} from "./form/Form.tsx";
import {PDFFile} from "./view/PDFFile.tsx";
import {FileContext} from "./FileContext";
import {ToPdf} from "./assets";
import {DrawerContextProvider} from "./form/DrawerContext/DrawerContextProvider.tsx";
import {PDFExportView} from "./view/PDFExportView.tsx";
import type {Task} from "./types";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import "./PDFCustomizer.css";

export function PDFCustomizer() {
    const { file } = use(FileContext);
    const [isExporting, setIsExporting] = useState(false);
    const [paginatedTasks, setPaginatedTasks] = useState<Task[][]>([]);

    const handlePaginationUpdate = (tasks: Task[][]) => {
        setPaginatedTasks(tasks);
    };

    const exportPDF = async () => {
        const container = document.getElementById('pdf-export-view');
        if (!container) return;

        setIsExporting(true);

        try {
            const pages = container.querySelectorAll('.pdf-page');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            for (let i = 0; i < pages.length; i++) {
                const page = pages[i] as HTMLElement;

                const canvas = await html2canvas(page, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    width: 794,
                    windowWidth: 794
                });

                const imgData = canvas.toDataURL('image/png');

                if (i > 0) {
                    pdf.addPage();
                }

                pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
            }

            pdf.save(`${file?.title || 'export'}.pdf`);
        } catch (error) {
            console.error('PDF Export failed:', error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <DrawerContextProvider>
            <Row className="editor-layout">
                <Col xs={24} xxl={12} className="editor-form-col">
                    <Form />
                </Col>
                <Col xs={24} xxl={12} className="editor-preview-col">
                    <div className="editor-preview-header">
                        <span className="editor-preview-title">
                            <ToPdf/> PDF-Vorschau
                        </span>
                        <Button
                            onClick={exportPDF}
                            type="primary"
                            loading={isExporting}
                            disabled={paginatedTasks.length === 0}
                            className="editor-export-btn"
                            icon={<ToPdf/>}
                        >
                            {isExporting ? 'Generiere PDF...' : 'PDF exportieren'}
                        </Button>
                    </div>

                    <PDFFile
                        file={file}
                        onPaginationUpdate={handlePaginationUpdate}
                    />

                    {paginatedTasks.length > 0 && (
                        <div className="editor-page-count">
                            {paginatedTasks.length} {paginatedTasks.length === 1 ? 'Seite' : 'Seiten'}
                        </div>
                    )}
                </Col>
            </Row>

            <PDFExportView
                file={file}
                paginatedTasks={paginatedTasks}
            />
        </DrawerContextProvider>
    );
}
