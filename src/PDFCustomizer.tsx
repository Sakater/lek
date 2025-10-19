import React, { use, useState } from "react";
import ReactDOM from 'react-dom/client';
import { Button, Col, Row } from "antd";
import { Form } from "./form/Form.tsx";
import { PDFFile } from "./view/PDFFile.tsx";
import { PDFExportContainer } from "./view/PDFFile.tsx"; // Neue Import
import { FileContext } from "./FileContext";
import html2pdf from "html2pdf.js";
import { sanitizeHtmlToRaw } from "./utils/sanitizeHtml.ts";
import { ToPdf } from "./assets";
import { DrawerContextProvider } from "./form/DrawerContext/DrawerContextProvider.tsx";

export function PDFCustomizer() {
    const { file } = use(FileContext);
    const [scale, setScale] = useState(1);
    const [isExporting, setIsExporting] = useState(false);
    const [paginatedTasks, setPaginatedTasks] = useState([]);

    const handlePaginationUpdate = (tasks) => {
        setPaginatedTasks(tasks);
    };

    const exportPDF = async () => {
        setIsExporting(true);

        try {
            const tempContainer = document.createElement('div');
            tempContainer.id = 'pdf-temp-container';
            tempContainer.style.position = 'fixed';
            tempContainer.style.top = '0';
            tempContainer.style.left = '0';
            tempContainer.style.width = '210mm';
            tempContainer.style.zIndex = '9999';
            tempContainer.style.backgroundColor = 'white';

            document.body.appendChild(tempContainer);

            // ✅ Verwende createRoot hier
            const root = ReactDOM.createRoot(tempContainer);
            root.render(
                <PDFExportContainer
                    file={file}
                    paginatedTasks={paginatedTasks}
                /> as React.ReactNode
            );

            await new Promise(resolve => setTimeout(resolve, 1000));

            const element = tempContainer.querySelector('#pdf-export-container');

            const opt = {
                margin: 0,
                filename: (sanitizeHtmlToRaw(file?.title) || 'document') + '.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait'
                },
                pagebreak: {
                    mode: 'css',
                    after: '.pdf-page'
                }
            };

            await html2pdf().set(opt).from(element).save();

            // Cleanup
            root.unmount();
            document.body.removeChild(tempContainer);

        } catch (error) {
            console.error('PDF Export Fehler:', error);
        } finally {
            setIsExporting(false);
        }
    };
    return (
        <DrawerContextProvider>
            <Row style={{ padding: '20px' }}>
                <Col xs={24} xxl={12}>
                    <Form />
                </Col>
                <Col xs={24} xxl={12}>
                    {/* Zoom Control */}
                    <div style={{ marginBottom: '20px' }}>
                        Zoom:
                        <input
                            type="range"
                            min="0.5"
                            max="1.5"
                            step="0.1"
                            value={scale}
                            onChange={(e) => setScale(Number(e.target.value))}
                            style={{ marginLeft: '10px', width: '200px' }}
                        />
                        {Math.round(scale * 100)}%
                    </div>

                    {/* Sichtbare PDF Preview */}
                    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                        <PDFFile
                            file={file}
                            scale={scale}
                            onPaginationUpdate={handlePaginationUpdate}
                        />
                    </div>

                    {/* Export Button */}
                    <div style={{ marginTop: '20px' }}>
                        <Button
                            onClick={exportPDF}
                            type="primary"
                            loading={isExporting}
                            disabled={paginatedTasks.length === 0}

                        >
                            <ToPdf />{isExporting ? 'Generiere PDF...' : 'PDF exportieren'}
                        </Button>

                        {paginatedTasks.length > 0 ? (
                            <span style={{ marginLeft: '10px', color: '#666' }}>
                                ({paginatedTasks.length} Seiten)
                            </span>
                        ) : null}
                    </div>
                </Col>
            </Row>

            {/* Hidden Container für Export - Wird nur gerendert wenn Export läuft */}
            <>{isExporting && (
                <PDFExportContainer
                    file={file}
                    paginatedTasks={paginatedTasks}
                />
            )}</>
        </DrawerContextProvider>
    );
}
