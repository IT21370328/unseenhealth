import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function NewArticle() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');

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

  useEffect(() => {
    if (!isEdit) return;
    fetch(`/api/articles/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          title: data.title || '',
          teaser: data.teaser || '',
          body: data.body || '',
          imageUrl: data.image?.startsWith('http') ? data.image : '',
          readTime: data.readTime || '5 min read',
          date: data.date ? data.date.split('T')[0] : new Date().toISOString().split('T')[0],
          published: data.published ?? true,
        });
      });
  }, [id]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (imageFile) formData.append('image', imageFile);

      const url = isEdit ? `/api/articles/${id}` : '/api/articles';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
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
          <p>{isEdit ? 'Update the article content.' : 'Write a new health article.'}</p>
        </div>
      </div>

      {error && <p style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: 860 }}>
        <div className="form-group">
          <label>Title *</label>
          <input value={form.title} onChange={set('title')} placeholder="Article headline..." required />
        </div>

        <div className="form-group">
          <label>Teaser (shown on card) *</label>
          <input value={form.teaser} onChange={set('teaser')} placeholder="One-line description shown on article cards..." required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Read Time</label>
            <input value={form.readTime} onChange={set('readTime')} placeholder="5 min read" />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={form.date} onChange={set('date')} />
          </div>
        </div>

        <div className="form-group">
          <label>Image — Upload file</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
        </div>

        <div className="form-group">
          <label>— or paste an image URL</label>
          <input value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://example.com/image.jpg" />
        </div>

        <div className="form-group">
          <label>Body (HTML supported) *</label>
          <textarea
            value={form.body}
            onChange={set('body')}
            placeholder={`<p>Write your article here...</p>\n<h2>Section title</h2>\n<p>More content...</p>\n<ul>\n  <li>Point one</li>\n  <li>Point two</li>\n</ul>`}
            required
            style={{ minHeight: 360, fontFamily: 'monospace', fontSize: '0.875rem' }}
          />
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
            Use &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;/&lt;li&gt;, &lt;strong&gt; for formatting.
          </span>
        </div>

        <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <input
            type="checkbox"
            id="published"
            checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            style={{ width: 18, height: 18, cursor: 'pointer' }}
          />
          <label htmlFor="published" style={{ cursor: 'pointer', color: 'var(--text)' }}>Publish immediately (uncheck to save as draft)</label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Article' : 'Publish Article'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/articles')}>Cancel</button>
        </div>
      </form>
    </>
  );
}
