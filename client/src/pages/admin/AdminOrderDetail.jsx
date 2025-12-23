import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as adminApi from '../../api/admin.js';

const statuses = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminApi.getOrder(id);
        setOrder(data);
        setStatus(data.orderStatus);
      } catch (err) {
        setError(err.message || 'Failed to load order');
      }
    };
    load();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const updated = await adminApi.updateOrderStatus(id, status);
      setOrder(updated);
      setStatus(updated.orderStatus);
    } catch (err) {
      setError(err.message || 'Failed to update');
    }
  };

  if (!order) {
    return (
      <section className="panel">
        {error ? <p style={{ color: 'crimson' }}>{error}</p> : <p>Loading...</p>}
      </section>
    );
  }

  return (
    <section className="panel">
      <button className="secondary-btn" type="button" onClick={() => navigate('/admin/orders')}>
        Back to orders
      </button>
      <h2>Order {order._id}</h2>
      <p>
        Customer: {order.customer.name} ({order.user?.email || 'guest'})
      </p>
      <p>Address: {order.customer.address}</p>
      <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
      <label>
        Status
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
          {statuses.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <button className="primary-btn" type="button" onClick={handleUpdate}>
        Update Status
      </button>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <h3>Items</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.productId}>
              <td>{item.title}</td>
              <td>{item.quantity}</td>
              <td>${item.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default AdminOrderDetail;
