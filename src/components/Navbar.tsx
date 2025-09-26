import { useLocation } from 'react-router-dom';
import { SearchLink } from './SearchLink';

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
          <SearchLink
            params={{}}
            className={`navbar-item ${isHome ? ACTIVE_NAV_LINK_CLASS : ''}`}
          >
            Home
          </SearchLink>

          <SearchLink
            params={{}}
            className={`navbar-item ${isPeople ? ACTIVE_NAV_LINK_CLASS : ''}`}
          >
            People
          </SearchLink>
        </div>
      </div>
    </nav>
  );
};
