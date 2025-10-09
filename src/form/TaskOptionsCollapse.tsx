import React, {use, useState} from 'react';
import {FileContext} from '../FileContext';
import {Button, Col, Drawer, Input, InputNumber, Row, Select} from 'antd';
import type {Task as TaskType} from '../types';
import {DeleteTwoTone, PlusCircleTwoTone} from "@ant-design/icons";
import {TasksView} from "../view/TasksView.tsx";

type Props = {
    task: TaskType;
}

export function TaskOptionsCollapse({task}: Props) {
    const {updateTask, updateOption, deleteOption} = use(FileContext);
    const [open, setOpen] = useState(false);


    return (
        <>
            <Button type="primary" onClick={() => setOpen(true)} size={"small"}>
                Details
            </Button>
            <Drawer
                title={`${task.numeration} ${task.question}`}
                placement={'top'}
                closable={false}
                onClose={() => setOpen(false)}
                open={open}
                key={'top'}
                size={'large'}
            >
                <Row gutter={24} className={'row task-options-container'}>
                    <Col xs={24} xxl={12}>
                        <Row gutter={24} className={'row task-options-container'}>
                            <Col span={8} style={{paddingTop: '20px'}}>
                                <Button size={"small"} className={'plus-circle-2-tone'}
                                        icon={<PlusCircleTwoTone/>} onClick={() => updateTask(task.id, {
                                    ...task,
                                    options: [...task.options, {id: crypto.randomUUID(), name: ''}]
                                })}
                                        disabled={task.options.length >= 10}
                                >
                                    Option</Button>
                            </Col>

                            <Col span={8}>
                                <label>Optionen pro Zeile: </label>
                                <InputNumber size="middle" min={1} max={10} defaultValue={1}
                                             onChange={(value: number | null) => {
                                                 if (value !== null) {
                                                     updateTask(task.id, {...task, optionsInARow: value});
                                                 }
                                             }}/>
                            </Col>
                            <Col span={24}>
                                {task.options.map((option) => (
                                    <Row gutter={24}>
                                        <Col span={22}>
                                            <Input key={option.id}
                                                   type="text"
                                                   value={option.name}
                                                   onChange={e => {
                                                       updateOption(task.id, option.id, e.target.value)
                                                   }}/>
                                        </Col>
                                        <Col span={1}>
                                            <Button className="icon-delete-2-tone" icon={<DeleteTwoTone/>}
                                                    onClick={() => deleteOption(task.id, option.id)}/>
                                        </Col>
                                    </Row>
                                ))}
                            </Col>
                            <Col span={8}>
                                <label>Hilfslinien pro Zeile: </label>
                                <Select

                                    defaultValue="0"
                                    style={{width: 140}}
                                    options={[
                                        {value: 0, label: 'Keine Hilfslinien'},
                                        {value: 1, label: '1 Hilfslinie'},
                                        {value: 2, label: '2 Hilfslinien'},
                                        {value: 3, label: '3 Hilfslinien'},
                                    ]}
                                    onChange={(value: number) => updateTask(task.id, {...task, lines: value})}
                                />
                            </Col>
                            <Col span={8}>
                                <label>Anzahl an Gesamtzeilen: </label>
                                <InputNumber size="middle" min={0} max={10} defaultValue={0}
                                             onChange={(value: number | null) => {
                                                 if (value !== null) {
                                                     updateTask(task.id, {...task, totalLines: value});
                                                 }
                                             }}/>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} xxl={12}>
                        <TasksView task={task}/>
                    </Col>
                </Row>

            </Drawer>

        </>
    )
}