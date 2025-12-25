import {Card, Col, Drawer} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {TaskType} from "../types";
import {use, useEffect} from "react";
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
        const newTask = addTask(taskType);

        setSelectedTaskId(newTask.id);
        openDrawer('taskFormOpen')
        onClose(); // Schließe TaskTypeChoice
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
                          onClick={() => handleTaskCreation(TaskType.MULTIPLE_CHOICE)}
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
                          onClick={() => handleTaskCreation(TaskType.WRITE_IN)}
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
                          onClick={() => handleTaskCreation(TaskType.MIXED)}
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
                              onClick={() => handleTaskCreation(TaskType.FILL_IN_THE_BLANKS)}
                        >
                            <Meta title="Lückentext" description="Erstelle einen Lückentext und lasse diese befüllen"/>
                        </Card>
                    </Col>
                    <Col>
                        <Card className={'card'}
                              type={'inner'}
                              hoverable
                              cover={
                                  <Puzzle
                                      style={{display: 'block', paddingTop: '20px',}}/>
                              }
                              onClick={() => handleTaskCreation(TaskType.LISTING)}
                        >
                            <Meta title="Auflistung" description="Erstelle eine Aufgabe zur Auflistung von Begriffen"/>
                        </Card>
                    </Col>
                    <Col>
                        <Card className={'card'}
                              type={'inner'}
                              hoverable
                              cover={
                                  <Puzzle
                                      style={{display: 'block', paddingTop: '20px',}}/>
                              }
                              onClick={() => handleTaskCreation(TaskType.MAPPING)}
                        >
                            <Meta title="Zuordnung" description="Lasse Wörter/Texte einander zuordnen"/>
                        </Card>
                    </Col>
                </div>

            </Drawer>
        </>
    );
}
