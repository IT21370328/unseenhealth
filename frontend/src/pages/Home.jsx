import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import ArticleModal from '../components/ArticleModal.jsx';
import Video from '../assets/video.mp4';  
import AboutImage from '../assets/image1.jpg';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/articles')
      .then((r) => r.json())
      .then((data) => { setArticles(data); setLoading(false); })
      .catch(() => { setError('Could not load articles.'); setLoading(false); });
  }, []);

  const handleContact = (e) => {
    e.preventDefault();
    alert('Thank you! Your message has been received.');
    e.target.reset();
  };

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section id="home" className="hero">
        <video autoPlay muted loop playsInline>
          <source src={Video} type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Health, lived <span className="highlight">fully.</span></h1>
          <p>Clear, practical, and honest articles to help you feel better every day.</p>
          <a href="#articles" className="btn" onClick={(e) => { e.preventDefault(); document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' }); }}>
            Explore Articles
          </a>
        </div>
      </section>

      {/* About */}
      <div className="about">
        <section id="about" className="section">
          <div className="about-content">
            <div className="about-text">
              <h2>We believe everyone deserves <span className="highlight">simple, honest health guidance</span>.</h2>
              <p>Unseen Health started as a small Facebook page in Sri Lanka with one goal: to make reliable health information easy to understand for ordinary people.</p>
              <div className="quote-box">
                <p style={{ fontStyle: 'italic', color: '#ccc', fontSize: '1.25rem' }}>
                  "Health shouldn't be a luxury or a mystery. It should be simple, accessible, and full of hope."
                </p>
                <p style={{ marginTop: '1rem', color: 'var(--accent)', fontWeight: 500 }}>— Founder, Unseen Health</p>
              </div>
            </div>
            <div className="about-image">
              <img src={AboutImage} alt="Our Story" onError={(e) => { e.target.src = 'https://picsum.photos/id/1025/600/500'; }} />
              <div className="stats-badge">
                <div style={{ fontSize: '2.4rem', fontWeight: 700, color: 'var(--accent)' }}>{articles.length > 0 ? `${articles.length}+` : '500+'}</div>
                <div style={{ color: '#aaa', fontSize: '1rem' }}>Health Articles</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Articles */}
      <div className="articles-section">
        <section id="articles" className="section">
          <h2>Latest <span className="highlight">Reads</span></h2>
          {loading && <p className="loading">Loading articles...</p>}
          {error && <p className="error-msg">{error}</p>}
          {!loading && !error && (
            <div className="articles-grid">
              {articles.map((article) => {
                const imageUrl = article.image?.startsWith('http')
                  ? article.image
                  : article.image
                  ? `https://your-render-url.onrender.com${article.image}`
                  : `https://picsum.photos/seed/${article._id}/800/500`;
                return (
                  <div key={article._id} className="article-card" onClick={() => setSelected(article)}>
                    <img src={imageUrl} alt={article.title} onError={(e) => { e.target.src = 'https://picsum.photos/800/500'; }} />
                    <div className="card-content">
                      <div className="article-date">
                        {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <h3>{article.title}</h3>
                      <p>{article.teaser}</p>
                      <span className="read-more">Read →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Contact */}
      <div className="contact-section">
        <section id="contact" className="section">
          <h2>Let's <span className="highlight">Talk</span></h2>
          <div className="contact-grid">
            <div>
              <h3>Have a topic suggestion or question?</h3>
              <p>We read every message and love hearing from our readers.</p>
            </div>
            <form onSubmit={handleContact}>
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea rows="6" placeholder="Your Message" required />
              <button type="submit" className="btn btn-accent">Send Message</button>
            </form>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer>
        <p style={{ fontSize: '1.1rem' }}>© 2026 Unseen Health • Sri Lanka</p>
        <p style={{ marginTop: '12px' }}>
          <a href="https://www.facebook.com/profile.php?id=61588725643033" target="_blank" rel="noreferrer">Follow us on Facebook</a>
        </p>
      </footer>

      {/* Modal */}
      {selected && <ArticleModal article={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
