import { useEffect, useState } from 'react';
import * as adminApi from '../../api/admin.js';

const AdminReports = () => {
  const [days, setDays] = useState(7);
  const [sales, setSales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [salesData, topData] = await Promise.all([
        adminApi.fetchSalesByDay(days),
        adminApi.fetchTopProducts(10)
      ]);
      setSales(salesData);
      setTopProducts(topData);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load reports');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  return (
    <section className="panel">
      <div className="admin-header">
        <h2>Reports</h2>
        <label>
          Days
          <input className="input" type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} />
        </label>
      </div>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <h3>Sales by day</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Orders</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((row) => (
            <tr key={row.date}>
              <td>{row.date}</td>
              <td>{row.ordersCount}</td>
              <td>${row.revenue.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Top products</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {topProducts.map((item) => (
            <tr key={item.productId}>
              <td>{item.title}</td>
              <td>{item.totalQuantity}</td>
              <td>${item.revenue.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default AdminReports;
