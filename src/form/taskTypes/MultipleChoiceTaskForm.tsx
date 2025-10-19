// MultipleChoiceTaskForm.tsx
import React, {use} from 'react';
import {Drawer, InputNumber} from 'antd';
import {FileContext} from '../../FileContext';
import {TaskView} from '../../view/TaskView';
import type {MultipleChoiceTask, Task} from '../../types';
import {BaseTaskFields} from '../BaseTaskFields';

type Props = {
    task: MultipleChoiceTask;
    open: boolean;
    onClose: () => void;
};

export function MultipleChoiceTaskForm({task, open, onClose}: Props) {
    const {updateTask} = use(FileContext);

    return (
        <Drawer
            title="Multiple-Choice-Aufgabe Task bearbeiten"
            placement="top"
            open={open}
            onClose={onClose}
            height={'80%'}
        >
            <div className={'task-form-grid'}>
                <div>

                    <BaseTaskFields task={task}/>

                    <div style={{marginTop: 16}}>
                        <label>Optionen pro Zeile: </label>
                        <InputNumber
                            min={1}
                            max={10}
                            value={task.optionsInARow}
                            onChange={(value) => {
                                if (value !== null) {
                                    updateTask(task.id, {...task, optionsInARow: value} as Partial<Task>);
                                }
                            }}
                        />
                    </div>
                </div>
                <TaskView task={task}/>
            </div>
        </Drawer>
    );
}
