import React, {useCallback, useEffect, useState} from 'react';
import {Table, TablePaginationConfig} from 'antd';

interface Book {
    id: string;
    title: string;
    subTitle: string;
    publishedAt: string;
    cover: string;
    description: string;
    authors: string[];
    category: string;
    tags: string[];
    press: string;
    hidden: boolean;
}

const BookList: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});

    const fetchBooks = useCallback(async (page: number, size: number) => {
        try {
            const response = await fetch(`/api/books?page=${page}&size=${size}`);
            if (response.ok) {
                const data = await response.json().then(t => t.data);
                setBooks(data.content);
            } else {
                console.error('Failed to fetch books');
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }, []);

    useEffect(() => {
        fetchBooks(pagination.current, pagination.pageSize).then();
    }, [fetchBooks, pagination]);

    const handleTableChange = (newPagination: TablePaginationConfig) => {
        setPagination({
            ...pagination,
            current: newPagination.current ?? pagination.current,
            pageSize: newPagination.pageSize ?? pagination.pageSize,
        });
    };

    const columns = [
        {title: 'Title', dataIndex: 'title', key: 'title'},
        {title: 'Sub Title', dataIndex: 'subTitle', key: 'subTitle'},
        {title: 'Authors', dataIndex: 'authors', key: 'authors', render: (authors: string[]) => authors.join(', ')},
        {title: 'Published At', dataIndex: 'publishedAt', key: 'publishedAt'},
        {title: 'Category', dataIndex: 'category', key: 'category'},
        {title: 'Press', dataIndex: 'press', key: 'press'},
        {title: 'Hidden', dataIndex: 'hidden', key: 'hidden', render: (hidden: boolean) => hidden ? 'Yes' : 'No'},
    ];

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Book List</h2>
            <Table
                dataSource={books}
                columns={columns}
                rowKey="id"
                pagination={pagination}
                onChange={handleTableChange}
            />
        </div>
    );
};

export default BookList;
