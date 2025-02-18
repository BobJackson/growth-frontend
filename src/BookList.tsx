import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    Button,
    Flex,
    Image,
    Input,
    InputRef,
    message,
    Popconfirm,
    Space,
    Switch,
    Table,
    TableColumnType,
    TablePaginationConfig
} from 'antd';
import {CrownOutlined, DeleteOutlined, EditOutlined, SearchOutlined} from "@ant-design/icons";
import BookForm from './BookForm';
import {format} from 'date-fns';
import {FilterDropdownProps} from "antd/es/table/interface";
import Highlighter from 'react-highlight-words';

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
    publisher: string;
    hidden: boolean;
}

interface Pagination {
    current: number;
    pageSize: number;
    total: number;
}

type DataIndex = keyof Book;

const BookList: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [pagination, setPagination] = useState<Pagination>({current: 1, pageSize: 10, total: 0});
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [isAddingBook, setIsAddingBook] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<Book> => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
            <div style={{padding: 8}} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{width: 90}}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({closeDropdown: false});
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{color: filtered ? '#1677ff' : undefined}}/>
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const fetchBooks = useCallback(async (page: number, size: number) => {
        try {
            const response = await fetch(`/api/books?page=${page}&size=${size}`);
            if (response.ok) {
                const data = await response.json().then(t => t.data);
                setBooks(data.content);
                setPagination({
                    ...pagination,
                    total: data.totalElements,
                })
            } else {
                console.error('Failed to fetch books');
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }, [pagination.current, pagination.pageSize]);

    useEffect(() => {
        fetchBooks(pagination.current, pagination.pageSize).then();
    }, [fetchBooks, pagination.current, pagination.pageSize]);

    const handleTableChange = (newPagination: TablePaginationConfig) => {
        const {current, pageSize} = newPagination;
        setPagination({
            ...pagination,
            current: current ?? pagination.current,
            pageSize: pageSize ?? pagination.pageSize,
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

    const handleBeautify = useCallback(async (id: string) => {
        try {
            const response = await fetch(`/api/books/${id}/actions/remove-black-border`, {
                method: 'PATCH',
            });
            if (response.ok) {
                message.success('Book beautify successfully');
                fetchBooks(pagination.current, pagination.pageSize).then();
            } else {
                console.error('Failed to beautify book');
                message.error('Failed to beautify book');
            }
        } catch (error) {
            console.error('Error beautify book:', error);
            message.error('An error occurred while beautify the book');
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
                setEditingBook(null);
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
    };

    const handleCancel = () => {
        setEditingBook(null);
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            ...getColumnSearchProps('title'),
        },
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
        {title: 'Publisher', dataIndex: 'publisher', key: 'publisher'},
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
                <Flex gap="small">
                    <Button type="primary" icon={<EditOutlined/>} onClick={() => showModal(record)}/>
                    <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button type="primary" danger icon={<DeleteOutlined/>}/>
                    </Popconfirm>
                    <Popconfirm
                        title="Sure to beautify?"
                        onConfirm={() => handleBeautify(record.id)}
                    >
                        <Button color="yellow" icon={<CrownOutlined/>}/>
                    </Popconfirm>
                </Flex>
            ),
        },
    ];

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Book List</h2>
            <Flex justify="flex-end" align="flex-end">
                <Button type="primary" onClick={() => setIsAddingBook(true)} style={{marginBottom: '16px'}}>
                    Add New Book
                </Button>
            </Flex>

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
                        publisher: '',
                        hidden: false,
                    }}
                    mode="add"
                    onFinish={handleAdd}
                    onCancel={() => setIsAddingBook(false)}
                />
            )}
            {editingBook && (
                <BookForm
                    book={editingBook}
                    mode="edit"
                    onFinish={handleEdit}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
};

export default BookList;
