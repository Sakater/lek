import React, { use } from 'react';
import { Drawer, InputNumber } from 'antd';
import { FileContext } from '../../FileContext';
import { TaskView } from '../../view/TaskView';
import type {Task, WriteInTask} from '../../types';
import { BaseTaskFields } from '../BaseTaskFields';

type Props = {
    task: WriteInTask;
    open: boolean;
    onClose: () => void;
};

export function WriteInTaskForm({ task, open, onClose }: Props) {
    const { updateTask } = use(FileContext);

    return (
        <Drawer
            title="Textfeld Task bearbeiten"
            placement="top"
            open={open}
            onClose={onClose}
            height={'80%'}
        >
            <TaskView task={task} />

            <BaseTaskFields task={task} />

            <div style={{ marginTop: 16 }}>
                <label>Hilfslinien pro Zeile:</label>
                <InputNumber
                    min={0}
                    max={5}
                    value={task.helpingLines}
                    onChange={(value) => {
                        if (value !== null) {
                            updateTask(task.id, { helpingLines: value } as Partial<Task>);
                        }
                    }}
                />
            </div>

            <div style={{ marginTop: 16 }}>
                <label>Anzahl an Gesamtzeilen:</label>
                <InputNumber
                    min={1}
                    max={20}
                    value={task.totalLines}
                    onChange={(value) => {
                        if (value !== null) {
                            updateTask(task.id, { totalLines: value } as Partial<Task>);
                        }
                    }}
                />
            </div>
        </Drawer>
    );
}
