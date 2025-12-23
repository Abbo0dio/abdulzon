import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ loading: false });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true });
    try {
      const loggedIn = await login(form);
      const fallback = loggedIn.role === 'admin' ? '/admin' : '/';
      const nextPath = location.state?.from?.pathname || fallback;
      navigate(nextPath);
    } catch (_err) {
      setStatus({ loading: false });
    }
  };

  return (
    <section className="panel">
      <h2>Login</h2>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input className="input" name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input
            className="input"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <button type="submit" className="primary-btn" disabled={status.loading}>
          {status.loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
      <p className="muted">
        Need an account?{' '}
        <Link to="/register" onClick={() => setError('')}>
          Register
        </Link>
      </p>
    </section>
  );
};

export default Login;
