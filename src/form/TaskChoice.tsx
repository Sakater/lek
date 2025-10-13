import React, {use} from 'react';
import {FileContext} from "../FileContext";
import {Card, Col, Drawer, Row} from "antd";
import {PlusCircleTwoTone, SearchOutlined} from "@ant-design/icons";
import {TaskSearch} from "../search/TaskSearch.tsx";
import {TaskType} from "../types";

const {Meta} = Card;
type Props = {
    open: boolean;
    onClose: () => void;
}

export function TaskChoice({open, onClose}: Props) {
    const {addTask} = use(FileContext);
    const [openSearch, setOpenSearch] = React.useState(false);

    return (
        <div>
            <Drawer
                title={'Aufgabenwahl'}
                placement={'top'}
                closable={false}
                onClose={onClose}
                open={open}
                key={'top'}
                size={'default'}
                height={'35%'}
            >
                <Row gutter={24} style={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '20px',
                    width: '50%',
                    justifySelf: 'center'
                }}>
                    <Col>
                        <Card
                            hoverable
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                width: '200px',
                                height: '180px'
                            }}
                            cover={
                                <SearchOutlined
                                    style={{fontSize: 40, display: 'block', paddingTop: '20px', color: 'darkblue'}}/>
                            }
                            onClick={() => {
                                setOpenSearch(true);
                                onClose()
                            }}
                        >
                            <Meta title="Frage finden" description="Suche nach Fragen und übernehme sie"/>
                        </Card> <TaskSearch open={openSearch} onClose={() => setOpenSearch(false)}/>
                    </Col>
                    <Col>
                        <Card
                            type={'inner'}
                            hoverable
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                width: '200px',
                                height: '180px'
                            }}
                            cover={
                                <PlusCircleTwoTone
                                    style={{fontSize: 40, display: 'block', paddingTop: '20px', color: 'darkblue'}}/>
                            }
                            onClick={() => {
                                addTask(TaskType.WriteIn);
                                onClose();
                            }}
                        >
                            <Meta title="Neue Frage erstellen"
                                  description="Erstelle deine eigene Frage"/>
                        </Card>

                    </Col>
                </Row>
            </Drawer>

        </div>
    );
}