import {use, useState} from 'react';
import {FileContext} from '../FileContext';
import {Button, Col, DatePicker, Pagination, Row} from 'antd';
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
import {AnimatePresence, Reorder} from "framer-motion";

export function Form() {
    const {drawerState, openDrawer, closeDrawer, selectedTaskId, setSelectedTaskId} = use(DrawerContext)
    const {file, updateFile} = use(FileContext);
    const selectedTask = selectedTaskId ? file?.tasks.find(task => task.id === selectedTaskId) ?? null : null;
    const [, setActive] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Berechne die Tasks für die aktuelle Seite
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentTasks = file?.tasks.slice(startIndex, endIndex) ?? [];
    return (
        <EditorProvider>

            <div className={'form-container'}>
                <CentralToolbar/>
                <Row gutter={24} className={'row'}>
                    <Col xs={12} sm={12} md={6} xl={6}>

                        <TextEditor content={sanitizeHtml(file?.createdBy)}
                                    onChange={e => updateFile({createdBy: sanitizeHtml(e)})} placeholder={'Autor'}/>
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
                </Row>{drawerState.searchOpen ?

                <TaskSearch open={drawerState.searchOpen} onClose={() => closeDrawer('searchOpen')}/> : null}
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 20}}>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={file?.tasks.length ?? 0}
                        onChange={(page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        }}
                        showSizeChanger={true}
                        pageSizeOptions={['3','4','5','6','7','8','9', '10','15', '20','25', '50']}
                    />
                    <div style={{color: 'rgba(0, 0, 0, 0.45)', fontSize: '14px'}}>
                        {file?.tasks.length ? `${startIndex + 1}-${Math.min(endIndex, file.tasks.length)} von ${file.tasks.length} Aufgaben` : 'Keine Aufgaben'}
                    </div>
                </div>
                <Reorder.Group
                    as={"span"}
                    values={currentTasks}
                    onReorder={(reorderedTasks) => {
                        // Erstelle eine Kopie der Gesamtliste
                        const newTasks = [...(file?.tasks ?? [])];

                        // Ersetze die Tasks der aktuellen Seite mit den neu angeordneten
                        reorderedTasks.forEach((task, index) => {
                            const globalIndex = startIndex + index;
                            newTasks[globalIndex] = task;
                        });

                        // Aktualisiere die komplette Liste
                        updateFile({tasks: newTasks});
                    }}
                >
                    <AnimatePresence>
                        {currentTasks.map((task, index) => (
                            <div key={task.id} className={"taskForm-container"}>
                                <Task task={task} setActive={setActive} index={startIndex + index}/>
                            </div>
                        ))}
                    </AnimatePresence>
                </Reorder.Group>

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


                {drawerState.taskTypeChoiceOpen ?
                    <TaskTypeChoice open={drawerState.taskTypeChoiceOpen}
                                    onClose={() => closeDrawer('taskTypeChoiceOpen')}/> : null}


            </div>
        </EditorProvider>
    );
}