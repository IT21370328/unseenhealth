import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function NewArticle() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');

  // ✅ BASE API URL (Render backend)
  const API_URL = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    title: '',
    teaser: '',
    body: '',
    imageUrl: '',
    readTime: '5 min read',
    date: new Date().toISOString().split('T')[0],
    published: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ LOAD ARTICLE FOR EDIT (FIXED)
  useEffect(() => {
    if (!isEdit) return;

    fetch(`${API_URL}/api/articles/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          title: data.title || '',
          teaser: data.teaser || '',
          body: data.body || '',
          imageUrl: data.image?.startsWith('http')
            ? data.image
            : '',
          readTime: data.readTime || '5 min read',
          date: data.date
            ? data.date.split('T')[0]
            : new Date().toISOString().split('T')[0],
          published: data.published ?? true,
        });
      })
      .catch((err) => console.error(err));
  }, [id]);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([k, v]) =>
        formData.append(k, v)
      );

      if (imageFile) formData.append('image', imageFile);

      const url = isEdit
        ? `${API_URL}/api/articles/${id}`
        : `${API_URL}/api/articles`;

      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || 'Failed to save');

      navigate('/articles');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{isEdit ? 'Edit Article' : 'New Article'}</h1>
          <p>
            {isEdit
              ? 'Update the article content.'
              : 'Write a new health article.'}
          </p>
        </div>
      </div>

      {error && (
        <p style={{ color: 'var(--danger)', marginBottom: 16 }}>
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          maxWidth: 860,
        }}
      >
        <div className="form-group">
          <label>Title *</label>
          <input
            value={form.title}
            onChange={set('title')}
            placeholder="Article headline..."
            required
          />
        </div>

        <div className="form-group">
          <label>Teaser *</label>
          <input
            value={form.teaser}
            onChange={set('teaser')}
            placeholder="One-line description..."
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Read Time</label>
            <input
              value={form.readTime}
              onChange={set('readTime')}
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={set('date')}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Image Upload</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImageFile(e.target.files[0])
            }
          />
        </div>

        <div className="form-group">
          <label>OR Image URL</label>
          <input
            value={form.imageUrl}
            onChange={set('imageUrl')}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="form-group">
          <label>Body *</label>
          <textarea
            value={form.body}
            onChange={set('body')}
            required
            style={{
              minHeight: 360,
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}
          />
        </div>

        <div
          className="form-group"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                published: e.target.checked,
              }))
            }
          />
          <label>Publish immediately</label>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Publish'}
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/articles')}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}