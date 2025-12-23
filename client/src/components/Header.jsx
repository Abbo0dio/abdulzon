import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Header = () => {
  const { cartCount } = useCart();
  const { user, logout, likes, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <NavLink to="/" className="brand">
          Abdulzon
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/likes" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Likes ({likes.length})
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Cart ({cartCount})
          </NavLink>
          <NavLink to="/checkout" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Checkout
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Admin
            </NavLink>
          )}
          {user ? (
            <>
              <span className="nav-user">Hi, {user.name.split(' ')[0]}</span>
              <button type="button" className="nav-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
