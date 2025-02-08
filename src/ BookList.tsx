import React, {useCallback, useEffect, useState} from 'react';
import {Button, Image, message, Popconfirm, Switch, Table, TablePaginationConfig} from 'antd';
import {Link} from "react-router-dom";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

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

    const handleDelete = useCallback(async (id: string) => {
        try {
            const response = await fetch(`/api/books/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                message.success('Book deleted successfully');
                fetchBooks(pagination.current, pagination.pageSize).then();
            } else {
                console.error('Failed to delete book');
                message.error('Failed to delete book');
            }
        } catch (error) {
            console.error('Error deleting book:', error);
            message.error('An error occurred while deleting the book');
        }
    }, [fetchBooks, pagination]);

    const handleToggleHidden = useCallback(async (checked: boolean, id: string) => {
        try {
            const response = await fetch(`/api/books/${id}/hidden?hidden=${checked}`, {
                method: 'PATCH',
            });
            if (response.ok) {
                message.success(`Book hidden status updated to ${checked ? 'hidden' : 'visible'}`);
                // Update local state immediately
                setBooks(prevBooks => prevBooks.map(book =>
                    book.id === id ? {...book, hidden: checked} : book
                ));
            } else {
                console.error('Failed to update book hidden status');
                message.error('Failed to update book hidden status');
            }
        } catch (error) {
            console.error('Error updating book hidden status:', error);
            message.error('An error occurred while updating the book hidden status');
        }
    }, []);

    const columns = [
        {title: 'Title', dataIndex: 'title', key: 'title'},
        {title: 'Sub Title', dataIndex: 'subTitle', key: 'subTitle'},
        {
            title: 'Cover',
            dataIndex: 'cover',
            key: 'cover',
            render: (cover: string) => (
                <Image
                    src={cover}
                    alt="Book Cover"
                    style={{width: '50px', height: '50px', objectFit: 'cover'}}
                    preview={true}
                />
            ),
        },
        {title: 'Authors', dataIndex: 'authors', key: 'authors', render: (authors: string[]) => authors.join(', ')},
        {title: 'Published At', dataIndex: 'publishedAt', key: 'publishedAt'},
        {title: 'Category', dataIndex: 'category', key: 'category'},
        {title: 'Press', dataIndex: 'press', key: 'press'},
        {title: 'Tags', dataIndex: 'tags', key: 'tags', render: (tags: string[]) => tags.join(', ')},
        {
            title: 'Hidden',
            dataIndex: 'hidden',
            key: 'hidden',
            render: (hidden: boolean, record: Book) => (
                <Switch
                    checked={hidden}
                    onChange={(checked) => handleToggleHidden(checked, record.id)}
                />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (record: Book) => (
                <div className="row">
                    <div className="col-6">
                        <Link to={`/books/edit/${record.id}`} style={{marginRight: 8}}>
                            <Button type="primary" icon={<EditOutlined/>}/>
                        </Link>
                    </div>
                    <div className="col-6">
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => handleDelete(record.id)}
                        >
                            <Button type="primary" danger icon={<DeleteOutlined/>}/>
                        </Popconfirm>
                    </div>
                </div>
            ),
        },
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
