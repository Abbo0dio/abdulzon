import { Outlet, Navigate, useLocation } from 'react-router-dom';
import AdminNav from '../../components/admin/AdminNav.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const AdminLayout = () => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <section className="panel">
        <p>Loading...</p>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return (
      <section className="panel">
        <h2>Not authorized</h2>
        <p>You must be an admin to view this page.</p>
      </section>
    );
  }

  return (
    <section>
      <AdminNav />
      <div className="admin-content">
        <Outlet />
      </div>
    </section>
  );
};

export default AdminLayout;
