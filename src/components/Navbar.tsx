import { useLocation } from 'react-router-dom';

const ACTIVE_NAV_LINK_CLASS = 'has-background-grey-lighter';

export const Navbar = () => {
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isPeople = location.pathname.startsWith('/people');

  return (
    <nav
      data-cy="nav"
      className="navbar is-fixed-top has-shadow"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <a
            className={`navbar-item ${isHome ? ACTIVE_NAV_LINK_CLASS : ''}`}
            href="#/"
          >
            Home
          </a>

          <a
            className={`navbar-item ${isPeople ? ACTIVE_NAV_LINK_CLASS : ''}`}
            href="#/people"
          >
            People
          </a>
        </div>
      </div>
    </nav>
  );
};
