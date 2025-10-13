import {Button, Card, Col, Row} from "antd";
import React, {use, useEffect} from "react";
import {FileContext} from "./FileContext";
import {HomeFilled} from "@ant-design/icons";
import {AddNotes, DocumentSearch} from "./assets";
import {FileSearch} from "./search/FileSearch.tsx";
import {PDFCustomizer} from "./PDFCustomizer.tsx";

const {Meta} = Card;

export function Homepage() {
    const {
        openTemplateSearch, setOpenTemplateSearch,
        openCustomizer, setOpenCustomizer
    } = use(FileContext);
    useEffect(() => {
        setOpenTemplateSearch(false);
        setOpenCustomizer(false);
    }, []);
    return (
        <>
            <div className={'home-button'}>
                <Button onClick={() => {
                    setOpenCustomizer(false);
                    setOpenTemplateSearch(false);
                }} icon={<HomeFilled/>}/></div>
            {!openTemplateSearch && !openCustomizer &&
                <Row gutter={24} className={'App'} style={{
                    height: '100vh',
                    alignContent: 'space-evenly',
                    margin: '0',
                    width: '60%',
                    justifySelf: 'center'
                }}>
                    <Col xs={24} xl={12} style={{justifyContent: 'center', display: 'flex'}}>
                        <Card
                            hoverable
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                width: '300px',
                                height: '200px'
                            }}
                            cover={
                                <DocumentSearch fill={'black'} style={{
                                    height: '40px',
                                    display: 'block',
                                    paddingTop: '20px',
                                    color: 'darkblue'
                                }}/>
                            }
                            onClick={() => {
                                setOpenTemplateSearch(true);
                                console.log('templatesearch: ', openTemplateSearch, 'Customizer: ', openCustomizer);

                            }}
                        >
                            <Meta style={{textWrap: 'pretty'}} title="Vorhandene Dokumente"
                                  description="Suche nach vorhandenen Dokumenten, übernehme sie und passe sie nach Bedarf an"/>
                        </Card>
                    </Col>
                    <Col xs={24} xl={12} style={{justifyContent: 'center', display: 'flex'}}>
                        <Card
                            hoverable
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                width: '300px',
                                height: '200px'
                            }}
                            cover={
                                <AddNotes fill={'black'}
                                          style={{display: 'block', paddingTop: '20px', color: 'darkblue'}}/>
                            }
                            onClick={() => {
                                setOpenCustomizer(true);
                            }}
                        >
                            <Meta title="Neues Dokument erstellen"
                                  description="Erstelle ein neues Dokument und gestalte es von null an"/>
                        </Card>
                    </Col>
                </Row>
            }
            {openTemplateSearch && <FileSearch/>}
            {openCustomizer && <PDFCustomizer/>}
        </>
    )
}