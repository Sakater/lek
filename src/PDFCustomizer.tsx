import React, {use, useRef, useState} from "react";
import {Button, Col, Row} from "antd";
import {Form} from "./form/Form.tsx";
import {PDFFile} from "./view/PDFFile.tsx";
import {FileContext} from "./FileContext";
import {ToPdf} from "./assets";
import {DrawerContextProvider} from "./form/DrawerContext/DrawerContextProvider.tsx";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function PDFCustomizer() {
    const { file } = use(FileContext);
    const [scale, setScale] = useState(1);
    const [isExporting, setIsExporting] = useState(false);
    const [paginatedTasks, setPaginatedTasks] = useState([]);
    const pdfRef = useRef<HTMLDivElement>(null);

    const handlePaginationUpdate = (tasks) => {
        setPaginatedTasks(tasks);
    };

    const exportPDF = async () => {
        if (!pdfRef.current) return;

        setIsExporting(true);

        try {
            const element = pdfRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 0;

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save('export.pdf');
        } catch (error) {
            console.error('PDF Export failed:', error);
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
                    <div ref={pdfRef} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
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
            {/*<>{isExporting && (*/}
            {/*    <PDFExportContainer*/}
            {/*        file={file}*/}
            {/*        paginatedTasks={paginatedTasks}*/}
            {/*    />*/}
            {/*)}</>*/}
        </DrawerContextProvider>
    );
}
