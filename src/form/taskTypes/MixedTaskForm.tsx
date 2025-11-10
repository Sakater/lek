// MixedTaskForm.tsx
import {use} from 'react';
import {Drawer, InputNumber, Select} from 'antd';
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
            title="Mixed-Aufgabe bearbeiten"
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
                                    updateTask(task.id, {optionsInARow: value} as Partial<Task>);
                                }
                            }}
                        />
                    </div>


                    <div style={{marginTop: 16}}>
                        <label>Hilfslinien pro Zeile: </label>
                        <Select

                            defaultValue={0}
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
                <TaskView task={task}/>
            </div>
        </Drawer>
    );
}
