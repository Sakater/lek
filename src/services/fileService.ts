import type {File, Task, TaskRequest, Page} from '../types';
import {TaskType} from '../types';
import dummyFiles from '../dummy_files_gemini.json';

const BaseUrl = import.meta.env.VITE_BACKEND_URL || '';

export function saveFile(file: File): Promise<File> {