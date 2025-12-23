import { useEffect, useState } from 'react';
import MetricCard from '../../components/admin/MetricCard.jsx';
import * as adminApi from '../../api/admin.js';

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryData, topData] = await Promise.all([adminApi.fetchSummary(), adminApi.fetchTopProducts(5)]);
        setSummary(summaryData);
        setTopProducts(topData);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      }
    };
    load();
  }, []);

  if (error) {
    return (
      <section className="panel">
        <p style={{ color: 'crimson' }}>{error}</p>
      </section>
    );
  }

  if (!summary) {
    return (
      <section className="panel">
        <p>Loading metrics...</p>
      </section>
    );
  }

  const metrics = [
    { label: 'Total Revenue', value: `$${summary.totalRevenue.toFixed(2)}` },
    { label: 'Total Orders', value: summary.totalOrders },
    { label: 'Total Users', value: summary.totalUsers },
    { label: 'Total Products', value: summary.totalProducts },
    { label: 'Revenue (7d)', value: `$${summary.revenueLast7Days.toFixed(2)}` },
    { label: 'Orders (7d)', value: summary.ordersLast7Days }
  ];

  return (
    <section className="grid" style={{ gap: '1rem' }}>
      {metrics.map((metric) => (
        <MetricCard key={metric.label} label={metric.label} value={metric.value} />
      ))}
      <div className="panel">
        <h3>Top Products</h3>
        {topProducts.length === 0 ? (
          <p className="muted">No orders yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Sold</th>
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
        )}
      </div>
    </section>
  );
};

export default AdminDashboard;
