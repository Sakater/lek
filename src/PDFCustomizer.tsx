import {use, useRef, useState} from "react";
import {Button, Col, Row} from "antd";
import {Form} from "./form/Form.tsx";
import {PDFFile} from "./view/PDFFile.tsx";
import {FileContext} from "./FileContext";
import html2pdf from "html2pdf.js";
import {sanitizeHtmlToRaw} from "./utils/sanitizeHtml.ts";
import {ToPdf} from "./assets";
import {DrawerContextProvider} from "./form/DrawerContext/DrawerContextProvider.tsx";
import {PDFExportView} from "./view/PDFExportView.tsx";

export function PDFCustomizer() {
    const {file} = use(FileContext);
    const reportTemplateRef = useRef<HTMLDivElement>(null as never);
    const [scale, setScale] = useState(1);


    const exportWithCSS = async () => {
        // ✅ Warte kurz, damit PDFExportView gerendert wird
        await new Promise(resolve => setTimeout(resolve, 100));

        const element = document.getElementById('pdf-export-container');
        if (!element) {
            console.error('Export container nicht gefunden');
            return;
        }  // ✅ Klammer geschlossen

        const opt = {
            margin: 0,  // ✅ Auf 0 gesetzt
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
                mode: 'css',  // ✅ Vereinfacht
                after: '.pdf-page'  // ✅ Bezieht sich auf PDFExportView
            }
        };

        html2pdf().set(opt).from(element).save();
    };



    return (
        <Row gutter={24} className={"body-row"}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={12}>
                <DrawerContextProvider>
                    <Form/>
                </DrawerContextProvider>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={12}>
                <div style={{display: "flex", alignItems: "start", justifyContent: "center"}}>
                    <div className={"col avoid-break"} id={'pdf-content'}
                         style={{display: "flex", justifyContent: "center"}} ref={reportTemplateRef}>
                        {/* Steuerung für Skalierung */}
                        <div className="controls" style={{
                            position: 'fixed',
                            top: 10,
                            right: 10,
                            background: 'white',
                            padding: '10px',
                            borderRadius: '5px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                            zIndex: 1000
                        }}>
                            <label>
                                Zoom:
                                <input
                                    type="range"
                                    min="0.5"
                                    max="1.5"
                                    step="0.1"
                                    value={scale}
                                    onChange={(e) => {
                                        setScale(Number(e.target.value));
                                    }}
                                    style={{marginLeft: '10px'}}
                                />
                                <span style={{marginLeft: '10px'}}>{Math.round(scale * 100)}%</span>
                            </label>
                        </div>

                        {/* A4 Seite */}
                        <PDFFile file={file} scale={scale}/>
                    </div>

                </div>
            </Col>
            <Col>
                <Button onClick={exportWithCSS} type="primary" style={{marginTop: "20px", width: 'auto'}}>
                    <ToPdf width={30} fill={'white'}/> PDF generieren
                </Button>
            </Col>
            <PDFExportView file={file} maxPageHeight={1050}/>
        </Row>

    );
}