import {use, useRef, useState} from "react";
import {Button, Col, Row} from "antd";
import {Form} from "./form/Form.tsx";
import {PDFFile} from "./view/PDFFile.tsx";
import {FileContext} from "./FileContext";
import html2pdf from "html2pdf.js";
import {sanitizeHtmlToRaw} from "./utils/sanitizeHtml.ts";
import {ToPdf} from "./assets";
import {DrawerContextProvider} from "./form/DrawerContext/DrawerContextProvider.tsx";

export function PDFCustomizer() {
    const {file} = use(FileContext);
    const reportTemplateRef = useRef<HTMLDivElement>(null as never);
    const [scale, setScale] = useState(1);

    const exportWithCSS = () => {
        const element = document.getElementById('pdf-content');

        const opt = {
            margin: 10,
            filename: sanitizeHtmlToRaw(file?.title) + '.pdf' || 'document' + '.pdf',
            html2canvas: {scale: 4},
            jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'},
            pagebreak: {mode: ['avoid-all', 'css', 'legacy']}
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
                <Button onClick={() => {
                    setScale(1);
                    exportWithCSS()
                }} type="primary" style={{marginTop: "20px", width: 'auto'}}>
                    <ToPdf width={30} fill={'white'}/> PDF generieren
                </Button>
            </Col>
        </Row>
    );
}