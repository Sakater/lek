import {use, useState} from 'react';
import {FileContext} from '../FileContext';
import {Button, DatePicker, Pagination} from 'antd';
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
import "./Form.css";

export function Form() {
    const {drawerState, openDrawer, closeDrawer, selectedTaskId, setSelectedTaskId} = use(DrawerContext)
    const {file, updateFile} = use(FileContext);
    const selectedTask = selectedTaskId ? file?.tasks.find(task => task.id === selectedTaskId) ?? null : null;
    const [, setActive] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentTasks = file?.tasks.slice(startIndex, endIndex) ?? [];
    return (
        <EditorProvider>
            <div className="form-container">
                <div className="form-header-card">
                    <div className="form-header-fields">
                        <div className="form-author">
                            <span className="form-field-label">Autor</span>
                            <TextEditor content={sanitizeHtml(file?.createdBy)}
                                        onChange={e => updateFile({createdBy: sanitizeHtml(e)})} placeholder={'Autor'}/>
                        </div>
                        <div className="form-title">
                            <span className="form-field-label">Titel</span>
                            <TextEditor content={sanitizeHtml(file?.title)}
                                        onChange={e => updateFile({title: sanitizeHtml(e)})} placeholder={'Titel'}/>
                        </div>
                        <div className="form-date">
                            <span className="form-field-label">Datum</span>
                            <DatePicker
                                style={{width: '100%'}}
                                value={file?.date ? dayjs(file.date, 'DD.MM.YY') : null}
                                format="DD.MM.YY"
                                onChange={d => updateFile({date: d ? d.format('DD.MM.YY') : ''})}
                            />
                        </div>
                    </div>
                    <div className="form-toolbar-wrapper">
                        <CentralToolbar/>
                    </div>
                </div>

                <div className="form-add-task-section">
                    <Button
                        onClick={() => openDrawer('taskOpen')}
                        className="form-add-task-btn"
                        icon={<PlusCircleTwoTone/>}
                    >
                        Aufgabe hinzufügen
                    </Button>
                </div>

                {drawerState.searchOpen ?
                    <TaskSearch open={drawerState.searchOpen} onClose={() => closeDrawer('searchOpen')}/> : null}

                <div className="form-pagination-section">
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
                    <span className="form-pagination-info">
                        {file?.tasks.length ? `${startIndex + 1}-${Math.min(endIndex, file.tasks.length)} von ${file.tasks.length} Aufgaben` : 'Keine Aufgaben'}
                    </span>
                </div>

                <Reorder.Group
                    as={"span"}
                    values={currentTasks}
                    onReorder={(reorderedTasks) => {
                        const newTasks = [...(file?.tasks ?? [])];
                        reorderedTasks.forEach((task, index) => {
                            const globalIndex = startIndex + index;
                            newTasks[globalIndex] = task;
                        });
                        updateFile({tasks: newTasks});
                    }}
                    className="form-task-list"
                >
                    <AnimatePresence>
                        {currentTasks.map((task, index) => (
                            <div key={task.id} className="taskForm-container">
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
