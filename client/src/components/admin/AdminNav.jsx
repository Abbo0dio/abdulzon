import { NavLink } from 'react-router-dom';

const AdminNav = () => {
  const links = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/products', label: 'Products' },
    { to: '/admin/orders', label: 'Orders' },
    { to: '/admin/reports', label: 'Reports' }
  ];

  return (
    <div className="admin-nav">
      {links.map((link) => (
        <NavLink key={link.to} to={link.to} end={link.to === '/admin'} className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
          {link.label}
        </NavLink>
      ))}
    </div>
  );
};

export default AdminNav;
