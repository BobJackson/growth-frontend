import React, {useCallback, useEffect, useState} from 'react';
import {Button, Image, message, Modal, Popconfirm, Switch, Table, TablePaginationConfig} from 'antd';
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import BookForm from './BookForm';
import {format} from 'date-fns';

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
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [isAddingBook, setIsAddingBook] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

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

    const handleEdit = async (values: Book) => {
        try {
            const response = await fetch(`/api/books/${values.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                message.success('Book updated successfully');
                fetchBooks(pagination.current, pagination.pageSize).then();
                setIsModalVisible(false); // 关闭模态框
            } else {
                console.error('Failed to update book');
                message.error('Failed to update book');
            }
        } catch (error) {
            console.error('Error updating book:', error);
            message.error('An error occurred while updating the book');
        }
    };

    const handleAdd = async (values: Book) => {
        try {
            const response = await fetch('/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                message.success('Book added successfully');
                fetchBooks(pagination.current, pagination.pageSize).then();
                setIsAddingBook(false); // 关闭添加表单
            } else {
                console.error('Failed to add book');
                message.error('Failed to add book');
            }
        } catch (error) {
            console.error('Error adding book:', error);
            message.error('An error occurred while adding the book');
        }
    };

    const showModal = (book: Book) => {
        setEditingBook(book);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingBook(null);
    };

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
                    style={{width: '100px', height: 'auto', objectFit: 'contain', maxHeight: '100px'}}
                    preview={true}
                />
            ),
        },
        {title: 'Authors', dataIndex: 'authors', key: 'authors', render: (authors: string[]) => authors.join(', ')},
        {title: 'Published At', dataIndex: 'publishedAt', key: 'publishedAt', width: 120},
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
                        <Button type="primary" icon={<EditOutlined/>} onClick={() => showModal(record)}/>
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
            <Button type="primary" onClick={() => setIsAddingBook(true)} style={{marginBottom: '16px'}}>
                Add New Book
            </Button>
            <Table
                dataSource={books}
                columns={columns}
                rowKey="id"
                pagination={pagination}
                onChange={handleTableChange}
            />
            {isAddingBook && (
                <BookForm
                    book={{
                        id: '',
                        title: '',
                        subTitle: '',
                        publishedAt: format(new Date(), 'yyyy-MM'),
                        cover: '',
                        description: '',
                        authors: [],
                        category: '',
                        tags: [],
                        press: '',
                        hidden: false,
                    }}
                    mode="add"
                    onFinish={handleAdd}
                    onCancel={() => setIsAddingBook(false)}
                />
            )}
            <Modal
                title={editingBook ? 'Edit Book' : 'Add a New Book'}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={800}
            >
                {editingBook && (
                    <BookForm
                        book={editingBook}
                        mode="edit"
                        onFinish={handleEdit}
                        onCancel={handleCancel}
                    />
                )}
            </Modal>
        </div>
    );
};

export default BookList;
