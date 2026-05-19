export default function Navbar() {
  const scrollTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav>
      <a href="#" className="logo">Unseen Health</a>
      <ul className="nav-links">
        <li><a href="#home" onClick={scrollTo('home')}>Home</a></li>
        <li><a href="#about" onClick={scrollTo('about')}>About</a></li>
        <li><a href="#articles" onClick={scrollTo('articles')}>Articles</a></li>
        <li><a href="#contact" onClick={scrollTo('contact')}>Contact</a></li>
      </ul>
      <a href="https://www.facebook.com/profile.php?id=61588725643033" target="_blank" rel="noreferrer" className="facebook-icon">
        <i className="fab fa-facebook-f"></i>
      </a>
    </nav>
  );
}
