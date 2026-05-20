import { useState, useEffect } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu when resizing to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 10);
  };

  const links = [
    { label: 'Home',     id: 'home'     },
    { label: 'About',    id: 'about'    },
    { label: 'Articles', id: 'articles' },
    { label: 'Contact',  id: 'contact'  },
  ];

  return (
    <nav className={scrolled ? 'nav-scrolled' : ''}>
      <a href="#" className="logo">Unseen Health</a>

      {/* Desktop links */}
      <ul className="nav-links">
        {links.map(l => (
          <li key={l.id}><a href={`#${l.id}`} onClick={scrollTo(l.id)}>{l.label}</a></li>
        ))}
      </ul>

      <div className="nav-right">
        <a
          href="https://www.facebook.com/profile.php?id=61588725643033"
          target="_blank" rel="noreferrer"
          className="facebook-icon"
        >
          <i className="fab fa-facebook-f"></i>
        </a>

        {/* Hamburger */}
        <button
          className={`hamburger ${open ? 'open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`mobile-menu ${open ? 'mobile-menu-open' : ''}`}>
        <ul>
          {links.map(l => (
            <li key={l.id}>
              <a href={`#${l.id}`} onClick={scrollTo(l.id)}>{l.label}</a>
            </li>
          ))}
        </ul>
        <a
          href="https://www.facebook.com/profile.php?id=61588725643033"
          target="_blank" rel="noreferrer"
          className="mobile-fb"
        >
          <i className="fab fa-facebook-f"></i> Follow on Facebook
        </a>
      </div>

      {/* Backdrop */}
      {open && <div className="menu-backdrop" onClick={() => setOpen(false)} />}
    </nav>
  );
}
