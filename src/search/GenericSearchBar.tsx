import { useState } from 'react';
import { Select, Button, Space, Row, Col, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

// --- Typ-Definitionen für die Konfiguration ---

export type FilterType = 'select' | 'tags';

export interface FilterDefinition<T> {
    label: string;
    type: FilterType;
    options?: { label: string; value: any }[]; // Nur bei 'select'
    placeholder?: string;
    // Optional: Transformer, z.B. um Strings in Zahlen zu wandeln (für IDs)
    transform?: (values: string[]) => any;
}

// Das ist die Map, die du übergeben musst: Key = Feldname im Request
export type SearchConfig<T> = Partial<Record<keyof T, FilterDefinition<T>>>;

// --- Die Komponente ---

interface GenericSearchBarProps<T> {
    config: SearchConfig<T>;
    onSearch?: (request: T) => void;
    placeholderAdd?: string;
}

// <T extends object> macht die Komponente generisch
export const GenericSearchBar = <T extends object>({
                                                       config,
                                                       onSearch,
                                                       placeholderAdd = "Filter hinzufügen"
                                                   }: GenericSearchBarProps<T>) => {

    // Wir speichern nur die Keys der aktiven Filter
    interface ActiveFilter {
        field: keyof T;
        values: any[];
    }

    const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

    const triggerSearch = (currentFilters: ActiveFilter[]) => {
        if (!onSearch) return;

        // Wir bauen das generische Objekt T zusammen
        const req = {} as T;

        currentFilters.forEach(filter => {
            if (filter.values && filter.values.length > 0) {
                const def = config[filter.field];

                // Transformations-Logik (z.B. "1" -> 1)
                if (def?.transform) {
                    req[filter.field] = def.transform(filter.values);
                } else {
                    req[filter.field] = filter.values as any;
                }
            }
        });

        onSearch(req);
    };

    const addFilter = (field: string) => { // String hier, weil Select value string ist
        const key = field as keyof T;
        if (activeFilters.find(f => f.field === key)) return;

        const newFilters = [...activeFilters, { field: key, values: [] }];
        setActiveFilters(newFilters);
    };

    const updateFilterValue = (index: number, newValues: any[]) => {
        const updated = [...activeFilters];
        updated[index].values = newValues;
        setActiveFilters(updated);
        triggerSearch(updated);
    };

    const removeFilter = (index: number) => {
        const updated = activeFilters.filter((_, i) => i !== index);
        setActiveFilters(updated);
        triggerSearch(updated);
    };

    // Dropdown Optionen bauen (nur verfügbare Configs)
    const addFilterOptions = Object.entries(config).map(([key, def]) => {
        const definition = def as FilterDefinition<T>;
        return {
            label: definition.label,
            value: key,
            disabled: activeFilters.some(f => f.field === key)
        };
    });

    return (
        <div style={{ padding: 12, background: '#f9f9f9', borderRadius: 8, border: '1px solid #eee' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {activeFilters.map((filter, index) => {
                    const def = config[filter.field];
                    if (!def) return null;

                    return (
                        <Row key={String(filter.field)} align="middle" gutter={[8, 8]}>
                            <Col xs={24} sm={6} md={4}>
                                <Text strong style={{ color: '#555' }}>{def.label}:</Text>
                            </Col>
                            <Col xs={22} sm={16} md={18}>
                                <Select
                                    mode={def.type === 'select' ? 'multiple' : 'tags'}
                                    style={{ width: '100%' }}
                                    placeholder={def.placeholder}
                                    options={def.options}
                                    value={filter.values}
                                    onChange={(vals) => updateFilterValue(index, vals)}
                                    open={def.type === 'tags' ? false : undefined}
                                    suffixIcon={def.type === 'tags' ? null : undefined}
                                    tokenSeparators={[',']}
                                />
                            </Col>
                            <Col xs={2} sm={2} md={2}>
                                <Button
                                    type="text" danger icon={<DeleteOutlined />}
                                    onClick={() => removeFilter(index)}
                                />
                            </Col>
                        </Row>
                    );
                })}

                <Row>
                    <Col span={24}>
                        <Select
                            value={null}
                            placeholder={<span><PlusOutlined /> {activeFilters.length === 0 ? "Suche starten..." : placeholderAdd}</span>}
                            style={{ width: activeFilters.length === 0 ? '100%' : 200 }}
                            onChange={addFilter}
                            options={addFilterOptions}
                            variant={activeFilters.length === 0 ? 'outlined' : 'borderless'}
                        />
                    </Col>
                </Row>
            </Space>
        </div>
    );
};
