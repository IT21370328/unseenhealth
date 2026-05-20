import { useEffect, useCallback } from 'react';

export default function ArticleModal({ article, onClose }) {
  const handleClose = useCallback(onClose, [onClose]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && handleClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [handleClose]);

  const BASE_URL = import.meta.env.VITE_API_URL ?? '';

  const imageUrl = article.image?.startsWith('http')
    ? article.image
    : article.image
    ? `${BASE_URL}${article.image}`
    : `https://picsum.photos/id/292/800/500`;

  // Sanitize HTML to prevent XSS — strip <script> tags
  const safeBody = (article.body ?? '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/javascript:/gi, '');

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="modal-box">
        <button className="modal-close" onClick={handleClose}>×</button>

        <h1>{article.title}</h1>

        <p className="modal-meta">
          {article.date
            ? new Date(article.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : 'Unknown date'}
          {article.readTime ? ` • ${article.readTime}` : ''}
        </p>

        <img
          src={imageUrl}
          alt={article.title}
          onError={(e) => { e.target.src = 'https://picsum.photos/800/500'; }}
        />

        <div dangerouslySetInnerHTML={{ __html: safeBody }} />
      </div>
    </div>
  );
}
