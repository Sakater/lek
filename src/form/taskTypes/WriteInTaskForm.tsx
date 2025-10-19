import React, {use} from 'react';
import {Drawer, InputNumber, Select} from 'antd';
import {FileContext} from '../../FileContext';
import {TaskView} from '../../view/TaskView';
import type {Task, WriteInTask} from '../../types';
import {BaseTaskFields} from '../BaseTaskFields';

type Props = {
    task: WriteInTask;
    open: boolean;
    onClose: () => void;
};

export function WriteInTaskForm({task, open, onClose}: Props) {
    const {updateTask} = use(FileContext);

    return (
        <Drawer
            title="Freitext-Aufgabe Task bearbeiten"
            placement="top"
            open={open}
            onClose={onClose}
            height={'80%'}
        >
            <div className={'task-form-grid'}>
                <div>
                    <BaseTaskFields task={task}/>

                    <div style={{marginTop: 16}}>
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
                            onChange={(value: number) => updateTask(task.id, {helpingLines: value})}
                        />
                    </div>

                    <div style={{marginTop: 16}}>
                        <label>Anzahl an Gesamtzeilen: </label>
                        <InputNumber
                            min={1}
                            max={20}
                            value={task.totalLines}
                            onChange={(value) => {
                                if (value !== null) {
                                    updateTask(task.id, {totalLines: value} as Partial<Task>);
                                }
                            }}
                        />
                    </div>
                </div>
                <TaskView task={task}/></div>
        </Drawer>
    );
}
