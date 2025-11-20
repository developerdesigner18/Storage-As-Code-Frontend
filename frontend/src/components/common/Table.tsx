import React from 'react';
import './Table.css';

interface Column<T> {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    emptyMessage?: string;
}

/**
 * Table Component
 * Reusable data table with custom column rendering
 */
export function Table<T extends Record<string, any>>({
    data,
    columns,
    loading = false,
    emptyMessage = 'No data available',
}: TableProps<T>) {
    if (loading) {
        return (
            <div className="table-loading">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="table-empty">
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key}>{column.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={item.id || index}>
                            {columns.map((column) => (
                                <td key={column.key}>
                                    {column.render ? column.render(item) : item[column.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
