// MixedTaskForm.tsx
import React, {use} from 'react';
import {Drawer, InputNumber} from 'antd';
import {FileContext} from '../../FileContext';
import {TaskView} from '../../view/TaskView';
import type {MixedTask, Task} from '../../types';
import {BaseTaskFields} from '../BaseTaskFields';

type Props = {
    task: MixedTask;
    open: boolean;
    onClose: () => void;
};

export function MixedTaskForm({task, open, onClose}: Props) {
    const {updateTask} = use(FileContext);

    return (
        <Drawer
            title="Mixed Task bearbeiten"
            placement="top"
            open={open}
            onClose={onClose}
            height={'80%'}
        >


            <BaseTaskFields task={task}/>

            <div style={{marginTop: 16}}>
                <label>Optionen pro Zeile:</label>
                <InputNumber
                    min={1}
                    max={10}
                    value={task.optionsInARow}
                    onChange={(value) => {
                        if (value !== null) {
                            updateTask(task.id, {optionsInARow: value} as Partial<Task>);
                        }
                    }}
                />
            </div>
            <TaskView task={task}/>

            <div style={{marginTop: 16}}>
                <label>Hilfslinien pro Zeile:</label>
                <InputNumber
                    min={0}
                    max={5}
                    value={task.helpingLines}
                    onChange={(value) => {
                        if (value !== null) {
                            updateTask(task.id, {...task, helpingLines: value} as Partial<Task>);
                        }
                    }}
                />
            </div>

            <div style={{marginTop: 16}}>
                <label>Anzahl an Gesamtzeilen:</label>
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
        </Drawer>
    );
}
