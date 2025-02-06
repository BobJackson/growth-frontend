// BookForm.tsx
import React, {useState} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {format} from 'date-fns';
import {GetProp, Image, message, Upload, UploadFile, UploadProps} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import 'antd/dist/reset.css';
import client from './utils/ossClient';
import {UploadChangeParam} from "antd/es/upload";

interface BookRequest {
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

const BookForm: React.FC = () => {
    const [formData, setFormData] = useState<BookRequest>({
        id: '',
        title: '',
        subTitle: '',
        publishedAt: format(new Date(), 'yyyy-MM'), // 设置默认值为 yyyy-mm
        cover: '',
        description: '',
        authors: [],
        category: '',
        tags: [],
        press: '',
        hidden: false,
    });

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            const formattedDate = format(date, 'yyyy-MM');
            setFormData({
                ...formData,
                publishedAt: formattedDate,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert('Book added successfully!');
                setFormData({
                    id: '',
                    title: '',
                    subTitle: '',
                    publishedAt: format(new Date(), 'yyyy-MM'), // 重置默认值
                    cover: '',
                    description: '',
                    authors: [],
                    category: '',
                    tags: [],
                    press: '',
                    hidden: false,
                });
            } else {
                alert('Failed to add book.');
            }
        } catch (error) {
            console.error('Error adding book:', error);
            alert('An error occurred while adding the book.');
        }
    };

    const handleCoverUpload = async (info: UploadChangeParam) => {
        if (info.file.status === 'uploading') {
            message.loading('Uploading file...', 0);
            return;
        }
        if (info.file.status === 'done') {
            // 获取上传后的文件 URL
            const fileUrl = `https://growth-public.oss-cn-shanghai.aliyuncs.com.aliyuncs.com/books/it/${info.file.name}`;
            setFormData({
                ...formData,
                cover: fileUrl,
            });
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const handleCoverPreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const uploadButton = (
        <button style={{border: 0, background: 'none'}} type="button">
            <PlusOutlined/>
            <div style={{marginTop: 8}}>Upload</div>
        </button>
    );

    return (
        <form onSubmit={handleSubmit} className="container mt-5">
            <h2 className="mb-4">Add a New Book</h2>
            <div className="mb-3">
                <label htmlFor="title" className="form-label">Title:</label>
                <input type="text" className="form-control" id="title" name="title" value={formData.title}
                       onChange={handleChange} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="subTitle" className="form-label">Sub Title:</label>
                <input type="text" className="form-control" id="subTitle" name="subTitle" value={formData.subTitle}
                       onChange={handleChange}/>
            </div>
            <div className="mb-3">
                <div className="row">
                    <div className="col-4">
                        <div>
                            <label htmlFor="authors" className="form-label">Authors (comma separated):</label>
                            <input type="text" className="form-control" id="authors" name="authors"
                                   value={formData.authors.join(', ')} onChange={(e) => setFormData({
                                ...formData,
                                authors: e.target.value.split(',').map(author => author.trim())
                            })} required/>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="row">
                            <div className="col-6">
                                <label htmlFor="publishedAt" className="form-label">Published At:</label>
                                <div>
                                    <DatePicker
                                        selected={formData.publishedAt ? new Date(formData.publishedAt) : null}
                                        showIcon
                                        onChange={handleDateChange}
                                        showMonthYearPicker
                                        dateFormat="yyyy/MM"
                                        className="form-control"
                                        id="publishedAt"
                                        name="publishedAt"
                                    />
                                </div>
                            </div>
                            <div className="col-6">
                                <label htmlFor="category" className="form-label">Category:</label>
                                <input type="text" className="form-control" id="category" name="category"
                                       value={formData.category}
                                       onChange={handleChange} required/>
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <div>
                            <label htmlFor="press" className="form-label">Press:</label>
                            <input type="text" className="form-control" id="press" name="press" value={formData.press}
                                   onChange={handleChange} required/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="cover" className="form-label">Cover:</label>
                <Upload
                    name="cover"
                    className="ms-2"
                    listType="picture-card"
                    onPreview={handleCoverPreview}
                    beforeUpload={async (file) => {
                        try {
                            await client.put(file.name, file);
                            return false; // 阻止默认上传行为
                        } catch (error) {
                            console.error('Error uploading file:', error);
                            message.error('File upload failed.');
                            return false;
                        }
                    }}
                    onChange={handleCoverUpload}
                >
                    {uploadButton}
                </Upload>
                <div className="mt-2">
                    {previewImage && (
                        <Image
                            wrapperStyle={{display: 'none'}}
                            preview={{
                                visible: previewOpen,
                                onVisibleChange: (visible) => {
                                    setPreviewOpen(visible);
                                },
                                afterOpenChange: (visible) => !visible && setPreviewImage(''),
                            }}
                            src={previewImage}
                            alt="Preview"
                        />
                    )}
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="description" className="form-label">Description:</label>
                <textarea className="form-control" id="description" name="description" value={formData.description}
                          onChange={handleChange} required rows={10}/>
            </div>
            <div className="mb-3">
                <label htmlFor="tags" className="form-label">Tags (comma separated):</label>
                <input type="text" className="form-control" id="tags" name="tags" value={formData.tags.join(', ')}
                       onChange={(e) => setFormData({
                           ...formData,
                           tags: e.target.value.split(',').map(tag => tag.trim())
                       })}/>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="hidden" name="hidden" checked={formData.hidden}
                       onChange={(e) => setFormData({...formData, hidden: e.target.checked})}/>
                <label className="form-check-label" htmlFor="hidden">Hidden</label>
            </div>
            <button type="submit" className="btn btn-primary">Add Book</button>
        </form>
    );
};

export default BookForm;
