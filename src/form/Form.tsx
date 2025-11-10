import {use} from 'react';
import {FileContext} from '../FileContext';
import {Button, Col, DatePicker, Row} from 'antd';
import {Task} from "./Task.tsx";
import {PlusCircleTwoTone} from "@ant-design/icons";
import dayjs from 'dayjs';
import {TaskChoice} from "./TaskChoice.tsx";
import {EditorProvider} from '../editor/EditorContext'
import {CentralToolbar} from '../editor/CentralToolbar'
import {TextEditor} from '../editor/TextEditor'
import {sanitizeHtml} from "../utils/sanitizeHtml.ts";
import {TaskTypeChoice} from "./TaskTypeChoice.tsx";
import {TaskSearch} from "../search/TaskSearch.tsx";
import {DrawerContext} from "./DrawerContext";
import {TaskFormSelector} from "./TaskFormSelector.tsx";

export function Form() {
    const {drawerState, openDrawer, closeDrawer, selectedTaskId, setSelectedTaskId} = use(DrawerContext)
    const {file, updateFile} = use(FileContext);
    const selectedTask = selectedTaskId ? file?.tasks.find(task => task.id === selectedTaskId) ?? null : null;
    return (
        <EditorProvider>

            <div className={'form-container'}>
                <CentralToolbar/>
                <Row gutter={24} className={'row'}>
                    <Col xs={12} sm={12} md={6} xl={6}>

                        <TextEditor content={sanitizeHtml(file?.author)}
                                    onChange={e => updateFile({author: sanitizeHtml(e)})} placeholder={'Autor'}/>
                    </Col>
                    <Col xs={18} sm={18} md={18} xl={12}>
                        <TextEditor content={sanitizeHtml(file?.title)}
                                    onChange={e => updateFile({title: sanitizeHtml(e)})} placeholder={'Autor'}/>
                    </Col>
                    <Col xs={12} sm={12} md={6} xl={6}>
                        <DatePicker
                            style={{width: '100%'}}
                            value={file?.date ? dayjs(file.date, 'DD.MM.YY') : null}
                            format="DD.MM.YY"
                            onChange={d => updateFile({date: d ? d.format('DD.MM.YY') : ''})}
                        />
                    </Col>
                </Row>
                <Row className={'row'} style={{width: '100%', justifyContent: 'center'}}>
                    <Col>
                        <Button onClick={() => openDrawer('taskOpen')} className={'plus-circle-2-tone'}
                                icon={<PlusCircleTwoTone/>}>Aufgabe</Button>
                    </Col>
                </Row>
                {file?.tasks.map(task => (<>
                    <div key={task.id} className={"taskForm-container"}>
                        <Task task={task}/>
                    </div>

                </>))}
                {drawerState.taskFormOpen && selectedTask &&
                    <TaskFormSelector
                        task={selectedTask}
                        onClose={() => {
                            closeDrawer('taskFormOpen');
                            setSelectedTaskId(null)
                        }}
                        open={drawerState.taskFormOpen}
                    />
                }
                {drawerState.taskOpen ?
                    <TaskChoice open={drawerState.taskOpen} onClose={() => closeDrawer('taskOpen')}/> : null}
                {drawerState.searchOpen ?
                    <TaskSearch open={drawerState.searchOpen} onClose={() => closeDrawer('searchOpen')}/> : null}
                {drawerState.taskTypeChoiceOpen ?
                    <TaskTypeChoice open={drawerState.taskTypeChoiceOpen}
                                    onClose={() => closeDrawer('taskTypeChoiceOpen')}/> : null}


            </div>
        </EditorProvider>
    );
}