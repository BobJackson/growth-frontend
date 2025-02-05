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
                <label htmlFor="publishedAt" className="form-label">Published At:</label>
                <input type="date" className="form-control" id="publishedAt" name="publishedAt"
                       value={formData.publishedAt} onChange={handleChange}/>
            </div>
            <div className="mb-3">
                <label htmlFor="cover" className="form-label">Cover URL:</label>
                <input type="text" className="form-control" id="cover" name="cover" value={formData.cover}
                       onChange={handleChange} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="description" className="form-label">Description:</label>
                <textarea className="form-control" id="description" name="description" value={formData.description}
                          onChange={handleChange} required rows={3}/>
            </div>
            <div className="mb-3">
                <label htmlFor="authors" className="form-label">Authors (comma separated):</label>
                <input type="text" className="form-control" id="authors" name="authors"
                       value={formData.authors.join(', ')} onChange={(e) => setFormData({
                    ...formData,
                    authors: e.target.value.split(',').map(author => author.trim())
                })} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="category" className="form-label">Category:</label>
                <input type="text" className="form-control" id="category" name="category" value={formData.category}
                       onChange={handleChange} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="tags" className="form-label">Tags (comma separated):</label>
                <input type="text" className="form-control" id="tags" name="tags" value={formData.tags.join(', ')}
                       onChange={(e) => setFormData({
                           ...formData,
                           tags: e.target.value.split(',').map(tag => tag.trim())
                       })}/>
            </div>
            <div className="mb-3">
                <label htmlFor="press" className="form-label">Press:</label>
                <input type="text" className="form-control" id="press" name="press" value={formData.press}
                       onChange={handleChange} required/>
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
