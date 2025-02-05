// BookForm.tsx
import React, {useState} from 'react';

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
        publishedAt: '',
        cover: '',
        description: '',
        authors: [],
        category: '',
        tags: [],
        press: '',
        hidden: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
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
                    publishedAt: '',
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

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required/>
            </div>
            <div>
                <label>Sub Title:</label>
                <input type="text" name="subTitle" value={formData.subTitle} onChange={handleChange}/>
            </div>
            <div>
                <label>Published At:</label>
                <input type="date" name="publishedAt" value={formData.publishedAt} onChange={handleChange}/>
            </div>
            <div>
                <label>Cover URL:</label>
                <input type="text" name="cover" value={formData.cover} onChange={handleChange} required/>
            </div>
            <div>
                <label>Description:</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required/>
            </div>
            <div>
                <label>Authors (comma separated):</label>
                <input type="text" name="authors" value={formData.authors.join(', ')} onChange={(e) => setFormData({
                    ...formData,
                    authors: e.target.value.split(',').map(author => author.trim())
                })} required/>
            </div>
            <div>
                <label>Category:</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} required/>
            </div>
            <div>
                <label>Tags (comma separated):</label>
                <input type="text" name="tags" value={formData.tags.join(', ')} onChange={(e) => setFormData({
                    ...formData,
                    tags: e.target.value.split(',').map(tag => tag.trim())
                })}/>
            </div>
            <div>
                <label>Press:</label>
                <input type="text" name="press" value={formData.press} onChange={handleChange} required/>
            </div>
            <div>
                <label>Hidden:</label>
                <input type="checkbox" name="hidden" checked={formData.hidden}
                       onChange={(e) => setFormData({...formData, hidden: e.target.checked})}/>
            </div>
            <button type="submit">Add Book</button>
        </form>
    );
};

export default BookForm;
