import {Card, Col, Drawer} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {TaskType} from "../types";
import React, {use, useEffect} from "react";
import {FileContext} from "../FileContext";
import {EditNote, Puzzle, Quiz} from "../assets";
import {DrawerContext} from "./DrawerContext";

const {Meta} = Card;
type Props = {
    open: boolean;
    onClose: () => void;
}

export function TaskTypeChoice({open, onClose}: Props) {
    const {addTask} = use(FileContext);
    const {setSelectedTaskId, openDrawer} = use(DrawerContext);

    const handleTaskCreation = (taskType: TaskType) => {
        // addTask mit dem spezifischen Type aufrufen
        // TypeScript inferiert automatisch den korrekten Rückgabetyp
        const newTask = addTask(taskType);

        setSelectedTaskId(newTask.id);
        openDrawer('taskFormOpen')
        onClose(); // Schließe TaskTypeChoice
        // Öffne TaskFormSelector
    };
    useEffect(() => {
        setSelectedTaskId(null)
    }, []);

    return (
        <>
            <Drawer
                title={'Art der Aufgabe wählen'}
                placement={'top'}
                closable={false}
                onClose={onClose}
                open={open}
                key={'top'}
                size={'default'}
                height={'60%'}
            >
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '20px',
                    width: '100%',
                    justifySelf: 'center'
                }}>

                    <Card className={'card'}
                          type={'inner'}
                          hoverable
                          cover={
                              <Quiz
                                  style={{display: 'block', paddingTop: '20px',}}/>
                          }
                          onClick={() => handleTaskCreation(TaskType.MultipleChoice)}
                    >
                        <Meta title="Multiple-Choice" description="Erstelle eine Multiple-Choice Aufgabe"/>
                    </Card>

                    <Card className={'card'}
                          type={'inner'}
                          hoverable
                          cover={
                              <EditNote
                                  style={{display: 'block', paddingTop: '20px',}}/>
                          }
                          onClick={() => handleTaskCreation(TaskType.WriteIn)}
                    >
                        <Meta title="Freitext"
                              description="Erstelle eine Freitext-Aufgabe und lasse den Antworten freien Lauf"/>
                    </Card>

                    <Card className={'card'}
                          type={'inner'}
                          hoverable
                          cover={<div
                              style={{
                                  width: '40%',
                                  height: '60px',
                                  display: 'flex',
                                  flexDirection: 'row',
                                  justifySelf: 'center',
                                  alignItems: 'center',
                                  flex: 'fit-content',
                                  justifyContent: 'center'
                              }}>
                              <EditNote width={30} style={{fontSize: '50%', display: 'block'}}/>
                              <PlusOutlined width={20} style={{paddingTop: '10px', color: 'darkgoldenrod'}}/>
                              <Quiz width={30}
                                    style={{display: 'block'}}/></div>
                          }
                          onClick={() => handleTaskCreation(TaskType.Mixed)}
                    >
                        <Meta title="Aufgabenmix" description="Kombiniere Multiple-Choice und Freitext-Aufgaben"/>
                    </Card>

                    <Col>
                        <Card className={'card'}
                              type={'inner'}
                              hoverable
                              cover={
                                  <Puzzle
                                      style={{display: 'block', paddingTop: '20px',}}/>
                              }
                              onClick={() => handleTaskCreation(TaskType.FillInTheBlanks)}
                        >
                            <Meta title="Lückentext" description="Erstelle einen Lückentext und lasse diese befüllen"/>
                        </Card>
                    </Col>
                </div>

            </Drawer>
        </>
    );
}
