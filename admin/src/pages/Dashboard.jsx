import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    fetch('/api/articles/admin/all', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setArticles)
      .catch(console.error);
  }, []);

  const published = articles.filter((a) => a.published).length;
  const drafts = articles.length - published;
  const recent = articles.slice(0, 5);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back. Here's what's happening.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/articles/new')}>
          + New Article
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Articles</div>
          <div className="stat-value">{articles.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Published</div>
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{published}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Drafts</div>
          <div className="stat-value" style={{ color: 'var(--muted)' }}>{drafts}</div>
        </div>
      </div>

      <div className="articles-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((a) => {
              const imgSrc = a.image?.startsWith('http') ? a.image : a.image ? `http://localhost:5000${a.image}` : `https://picsum.photos/seed/${a._id}/120/80`;
              return (
                <tr key={a._id}>
                  <td><img src={imgSrc} alt="" className="article-thumb" onError={(e) => { e.target.src = 'https://picsum.photos/120/80'; }} /></td>
                  <td style={{ maxWidth: 280 }}><strong>{a.title}</strong></td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>{new Date(a.date).toLocaleDateString()}</td>
                  <td><span className={`badge ${a.published ? 'badge-published' : 'badge-draft'}`}>{a.published ? 'Published' : 'Draft'}</span></td>
                  <td><button className="btn-edit" onClick={() => navigate(`/articles/edit/${a._id}`)}>Edit</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {articles.length === 0 && (
          <div className="empty-state">
            <p>No articles yet. Create your first one!</p>
          </div>
        )}
      </div>
    </>
  );
}
