import type {SelectProps} from 'antd';
import {Button, Card, Col, Drawer, Row,} from "antd";
import {use, useState} from "react";
import {searchTasks} from '../services/taskService.ts';
import {TaskView} from "../view/TaskView.tsx";
import type {Task} from "../types";
import {Subject, TaskType} from "../types";
import {FileContext} from "../FileContext";
import {GenericSearchBar} from "./GenericSearchBar.tsx";
import {taskSearchConfig} from "./SearchConfigs.ts";

type Props = {
    open: boolean;
    onClose: () => void;
}

export function TaskSearch({open, onClose}: Props) {
    const {addTask} = use(FileContext);
    const [tasks] = useState<Task[]>();
    const options: SelectProps['options'] = Object.values(TaskType).map(type => ({
        label: '[Aufgabentyp] ' + type,
        value: type
    }))
    const subjectList = Object.values(Subject).map(subject => ({label: '[Fach] ' + subject, value: subject}));
    options.push(...subjectList);

    const addFromSearch = (task: Task) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {numeration, id, type, ...patch} = task;
        addTask(task.type, patch);

    };
    return (
        <div>
            <Drawer
                title={'Frage finden'}
                placement={'top'}
                closable={false}
                onClose={onClose}
                open={open}
                key={'top'}
                height={'80%'}>
                {/*<Input placeholder="Suchbegriff eingeben..." style={{marginBottom: '20px'}}/>*/}
                <GenericSearchBar
                    config={taskSearchConfig}
                    onSearch={searchTasks}
                />
                {tasks?.map(task => {
                    return (
                        <Row>
                            <Col>
                                <Card>
                                    <TaskView task={task}/>
                                </Card>
                            </Col>
                            <Col>
                                <Button type="default" onClick={() => {
                                    addFromSearch(task);
                                    onClose()
                                }}/>
                            </Col>
                        </Row>
                    )
                })}

            </Drawer>
        </div>
    )
}