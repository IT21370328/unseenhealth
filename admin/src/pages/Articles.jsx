import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');

  const load = () => {
    fetch('/api/articles/admin/all', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setArticles(data); setLoading(false); })
      .catch(console.error);
  };

  useEffect(load, []);

  const deleteArticle = async (id) => {
    if (!confirm('Delete this article? This cannot be undone.')) return;
    await fetch(`/api/articles/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    load();
  };

  const togglePublish = async (article) => {
    await fetch(`/api/articles/${article._id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !article.published }),
    });
    load();
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Articles</h1>
          <p>Manage all your health articles.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/articles/new')}>+ New Article</button>
      </div>

      <div className="articles-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Date</th>
              <th>Read Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => {
              const imgSrc = a.image?.startsWith('http') ? a.image : a.image ? `http://localhost:5000${a.image}` : `https://picsum.photos/seed/${a._id}/120/80`;
              return (
                <tr key={a._id}>
                  <td><img src={imgSrc} alt="" className="article-thumb" onError={(e) => { e.target.src = 'https://picsum.photos/120/80'; }} /></td>
                  <td style={{ maxWidth: 260 }}><strong style={{ fontSize: '0.9rem' }}>{a.title}</strong><br /><span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{a.teaser?.slice(0, 60)}...</span></td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{new Date(a.date).toLocaleDateString()}</td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>{a.readTime}</td>
                  <td>
                    <span
                      className={`badge ${a.published ? 'badge-published' : 'badge-draft'}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => togglePublish(a)}
                      title="Click to toggle"
                    >
                      {a.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button className="btn-edit" onClick={() => navigate(`/articles/edit/${a._id}`)}>Edit</button>
                    <button className="btn-danger" onClick={() => deleteArticle(a._id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!loading && articles.length === 0 && (
          <div className="empty-state"><p>No articles yet.</p></div>
        )}
      </div>
    </>
  );
}
