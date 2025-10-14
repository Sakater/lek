import React, { use } from 'react';
import { Drawer, InputNumber } from 'antd';
import { FileContext } from '../../FileContext';
import { TaskView } from '../../view/TaskView';
import type { FillInTheBlanksTask } from '../../types';
import { BaseTaskFields } from '../BaseTaskFields';

type Props = {
    task: FillInTheBlanksTask;
    open: boolean;
    onClose: () => void;
};

export function FillInTheBlanksTaskForm({ task, open, onClose }: Props) {
    const { updateTask } = use(FileContext);

    return (
        <Drawer
            title="Lückentext Task bearbeiten"
            placement="top"
            open={open}
            onClose={onClose}
            height={'80%'}
            classNames={'fill-in-the-blanks-task-form'}
        >
            <TaskView task={task} />

            <BaseTaskFields task={task} />

            <div style={{ marginTop: 16 }}>
                <label>Optionen pro Zeile:</label>
                <InputNumber
                    min={1}
                    max={10}
                    value={task.optionsInARow}
                    onChange={(value) => {
                        if (value !== null) {
                            updateTask(task.id, { optionsInARow: value });
                        }
                    }}
                />
            </div>
        </Drawer>
    );
}
