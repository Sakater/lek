import type {File, FileRequest, Page} from '../types';

const BaseUrl = import.meta.env.VITE_BACKEND_URL || '';

export async function searchFiles(request: FileRequest): Promise<Page<File>> {
    const { page = 0, size = 20, sort = ['createdAt'], ...body } = request;

    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    sort.forEach((s) => params.append('sort', s));

    const response = await fetch(`${BaseUrl}/api/search/files?${params.toString()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
                totalPages: 0,
            },
        };
    }

    return JSON.parse(text);
}
