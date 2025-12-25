import {Button, Card, Col, Drawer, Empty, Pagination, Row, Spin} from 'antd';
import {use, useState} from 'react';
import {FileContext} from '../FileContext';
import {searchFiles} from '../services/fileService.ts';
import type {File, FileRequest} from '../types';
import {PDFFile} from '../view/PDFFile.tsx';
import {GenericSearchBar} from './GenericSearchBar.tsx';
import {fileSearchConfig} from './SearchConfigs.ts';

export function FileSearch() {
    const { updateFile, setOpenTemplateSearch, setOpenCustomizer, openTemplateSearch } =
        use(FileContext);

    const [foundFiles, setFoundFiles] = useState<File[]>([]);
    const [pageVariables, setPageVariables] = useState<{
        totalElements: number;
        totalPages: number;
        number: number;
        size: number;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [lastRequest, setLastRequest] = useState<FileRequest | null>(null);

    const handleSearch = async (request: FileRequest) => {
        setLoading(true);
        setLastRequest(request);
        try {
            const results = await searchFiles(request);

            setFoundFiles(results?.content || []);
            setPageVariables({
                totalElements: results?.page?.totalElements ?? 0,
                totalPages: results?.page?.totalPages ?? 0,
                number: results?.page?.number ?? 0,
                size: results?.page?.size ?? request.size ?? 20,
            });
        } catch (error) {
            console.error('Fehler bei der Suche:', error);
            setFoundFiles([]);
            setPageVariables(null);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number, pageSize?: number) => {
        if (!lastRequest) return;
        const newRequest: FileRequest = {
            ...lastRequest,
            page: page - 1,
            size: pageSize ?? lastRequest.size,
        };
        void handleSearch(newRequest);
    };

    const selectFile = (file: File) => {
        updateFile(file);
        setOpenTemplateSearch(false);
        setOpenCustomizer(true);
    };

    return (
        <div>
            <Drawer
                title={'Dokumente finden'}
                placement={'top'}
                onClose={() => setOpenTemplateSearch(false)}
                open={openTemplateSearch}
                key={'top'}
                height={'80%'}
                styles={{ body: { paddingBottom: 80 } }}
            >
                <div style={{ marginBottom: 24 }}>
                    <GenericSearchBar config={fileSearchConfig} onSearch={handleSearch} />
                </div>

                {loading && (
                    <div style={{ textAlign: 'center', padding: 20 }}>
                        <Spin />
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {!loading && foundFiles.length === 0 ? (
                        <Empty
                            description="Keine Dokumente gefunden"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ) : (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            <Pagination
                                current={(pageVariables?.number ?? 0) + 1}
                                pageSize={pageVariables?.size}
                                total={pageVariables?.totalElements}
                                onChange={handlePageChange}
                                onShowSizeChange={handlePageChange}
                                showSizeChanger={true}
                                pageSizeOptions={['10', '20', '50', '100']}
                                responsive={true}
                                showLessItems={true}
                            />
                            <div style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: '14px' }}>
                                {pageVariables &&
                                    `${Math.min(pageVariables.number * pageVariables.size + 1, pageVariables.totalElements)}-${Math.min((pageVariables.number + 1) * pageVariables.size, pageVariables.totalElements)} von ${pageVariables.totalElements} Treffern`}
                            </div>
                        </div>
                    )}
                    <Row gutter={24}>
                        {foundFiles.map((file) => (
                            <Col xs={24} xl={12} key={file.id}>
                                <div
                                    style={{
                                        padding: '15px',
                                        display: 'flex',
                                        justifyContent: 'space-evenly',
                                    }}
                                >
                                    <Card
                                        size="small"
                                        hoverable
                                        style={{ width: '810px', overflowY: 'auto' }}
                                        extra={
                                            <Button type="primary" onClick={() => selectFile(file)}>
                                                Auswählen
                                            </Button>
                                        }
                                    >
                                        <PDFFile file={file} scale={0.5} />
                                    </Card>
                                </div>
                            </Col>
                        ))}
                    </Row>

                    {!loading && foundFiles.length > 0 && (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            <Pagination
                                current={(pageVariables?.number ?? 0) + 1}
                                pageSize={pageVariables?.size}
                                total={pageVariables?.totalElements}
                                onChange={handlePageChange}
                                onShowSizeChange={handlePageChange}
                                showSizeChanger={true}
                                pageSizeOptions={['10', '20', '50', '100']}
                                responsive={true}
                                showLessItems={true}
                            />
                            <div style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: '14px' }}>
                                {pageVariables &&
                                    `${Math.min(pageVariables.number * pageVariables.size + 1, pageVariables.totalElements)}-${Math.min((pageVariables.number + 1) * pageVariables.size, pageVariables.totalElements)} von ${pageVariables.totalElements} Treffern`}
                            </div>
                        </div>
                    )}
                </div>
            </Drawer>
        </div>
    );
}
