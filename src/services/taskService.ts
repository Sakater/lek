import type {File, Task, TaskRequest, Page} from '../types';
import {TaskType} from '../types';
import dummyFiles from '../dummy_files_gemini.json';

const BaseUrl = import.meta.env.VITE_BACKEND_URL || '';

export async function searchTasks(request: TaskRequest): Promise<Page<Task>> {
    const { page = 0, size = 20, sort = ['createdAt'], ...body } = request;

    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    sort.forEach(s => params.append('sort', s));

    const response = await fetch(`${BaseUrl}/api/search/tasks?${params.toString()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    if (!text) {
        return {
            content: [],
            page: {
                size: size,
                number: 0,
                totalElements: 0,
                totalPages: 0
            }
        };
    }

    return JSON.parse(text);
}

export async function searchFiles(queries: string[]): Promise<File[]> {
    console.log('Searching tasks with queries:', queries);

    /*const response = await fetch(BaseUrl+'/api/search/files', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ queries })
    });
    const data = await response.json();
    return data.tasks;*/

    // Type Guard zur Validierung
    function isFileArray(data: unknown): data is File[] {
        if (!Array.isArray(data)) return false;

        return data.every((item: File) =>
            Array.isArray(item.tasks)
        );
    }

    if (isFileArray(dummyFiles)) {
        return dummyFiles;
    }
    throw new Error('Invalid file structure in JSON');
}

export async function saveTask(task: Partial<Task>): Promise<void> {
    const taskToSave = {
        ...task,
        type: task.type ? Object.keys(TaskType).find(
            key => TaskType[key as keyof typeof TaskType] === task.type
        ) : undefined
    };
    await fetch(BaseUrl + '/api/save/task', {
        body: JSON.stringify(taskToSave),
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST'
    }).then(() => console.log('Task saved successfully')).catch(err => console.error('Error saving task:', err));
}