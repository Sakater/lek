import {Button, Card, Col, Drawer, Input, Row, Select,} from "antd";
import type {SelectProps} from 'antd';
import React, {use, useEffect, useState} from "react";
import {searchTasks} from '../services/taskService.ts';
import {TaskView} from "../view/TaskView.tsx";
import type {Task} from "../types";
import {TaskType} from "../types";
import {Subject} from "../types";
import {FileContext} from "../FileContext";

type Props = {
    open: boolean;
    onClose: () => void;
}

export function TaskSearch({open, onClose}: Props) {
    const {addTask} = use(FileContext);
    const [inputValue, setInputValue] = useState<string[]>([]);
    const [tasks, setTasks] = useState<Task[]>();
    const options: SelectProps['options'] = Object.values(TaskType).map(type => ({
        label: '[Aufgabentyp] ' + type,
        value: type
    }))
    const subjectList = Object.values(Subject).map(subject => ({label: '[Fach] ' + subject, value: subject}));
    options.push(...subjectList);


    useEffect(() => {
        if (inputValue.length === 0) {
            setTasks([]); // Ergebnisse ausblenden, wenn keine Suchbegriffe
            return;
        }
        if (inputValue.length === 0 || !inputValue[0]) return;
        searchTasks(inputValue).then(setTasks);
    }, [inputValue]);

    const addFromSearch = (task: Task) => {
        switch (task.type) {
            case TaskType.WriteIn: {
                const {numeration, id, type, ...patch} = task as WriteInTask;
                addTask(TaskType.WriteIn, patch);
                break;
            }
            case TaskType.MultipleChoice: {
                const {numeration, id, type, ...patch} = task as MultipleChoiceTask;
                addTask(TaskType.MultipleChoice, patch);
                break;
            }
            case TaskType.Mixed: {
                const {numeration, id, type, ...patch} = task as MixedTask;
                addTask(TaskType.Mixed, patch);
                break;
            }
            case TaskType.FillInTheBlanks: {
                const {numeration, id, type, ...patch} = task as FillInTheBlanksTask;
                addTask(TaskType.FillInTheBlanks, patch);
                break;
            }
        }
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
                <Select
                    mode="tags"
                    style={{width: '100%'}}
                    placeholder="Suchbegriffe eingeben und Enter drücken"
                    onChange={(value: string[]) => setInputValue(value)}
                    options={options}
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