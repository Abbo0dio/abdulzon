import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as adminApi from '../../api/admin.js';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '' });
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadProducts = async (page = 1) => {
    setLoading(true);
    try {
      const data = await adminApi.fetchProducts({ ...filters, page });
      setProducts(data.items);
      setPagination({ page: data.page, pages: data.pages });
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await adminApi.deleteProduct(id);
      await loadProducts(pagination.page);
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  return (
    <section className="panel">
      <div className="admin-header">
        <h2>Products</h2>
        <button className="primary-btn" type="button" onClick={() => navigate('/admin/products/new')}>
          New Product
        </button>
      </div>
      <div className="filters">
        <input
          className="input"
          placeholder="Search"
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        />
        <input
          className="input"
          placeholder="Category"
          value={filters.category}
          onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
        />
      </div>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.title}</td>
                <td>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  <div className="table-actions">
                    <Link to={`/admin/products/${product._id}/edit`} className="secondary-btn">
                      Edit
                    </Link>
                    <button type="button" className="secondary-btn" onClick={() => handleDelete(product._id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="pagination">
        <button type="button" className="secondary-btn" disabled={pagination.page <= 1} onClick={() => loadProducts(pagination.page - 1)}>
          Prev
        </button>
        <span>
          Page {pagination.page} / {pagination.pages}
        </span>
        <button
          type="button"
          className="secondary-btn"
          disabled={pagination.page >= pagination.pages}
          onClick={() => loadProducts(pagination.page + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default AdminProducts;
