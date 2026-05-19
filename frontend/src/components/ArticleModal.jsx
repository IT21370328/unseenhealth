import { useEffect } from 'react';

export default function ArticleModal({ article, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const imageUrl = article.image?.startsWith('http')
    ? article.image
    : article.image
    ? `https://your-render-url.onrender.com${article.image}`
    : `https://picsum.photos/id/292/800/500`;

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>×</button>
        <h1>{article.title}</h1>
        <p className="modal-meta">
          {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          {' • '}{article.readTime}
        </p>
        <img src={imageUrl} alt={article.title} />
        <div dangerouslySetInnerHTML={{ __html: article.body }} />
      </div>
    </div>
  );
}
