import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as adminApi from '../../api/admin.js';

const emptyProduct = {
  title: '',
  description: '',
  price: 0,
  category: '',
  imageUrl: '',
  stock: 0
};

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(emptyProduct);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await adminApi.getProduct(id);
        setProduct({
          title: data.title,
          description: data.description || '',
          price: data.price,
          category: data.category,
          imageUrl: data.imageUrl,
          stock: data.stock
        });
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      if (id) {
        await adminApi.updateProduct(id, product);
      } else {
        await adminApi.createProduct(product);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.message || 'Save failed');
    }
  };

  if (loading) {
    return (
      <section className="panel">
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>{id ? 'Edit Product' : 'New Product'}</h2>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input className="input" name="title" value={product.title} onChange={handleChange} required />
        </label>
        <label>
          Description
          <textarea className="input" rows="3" name="description" value={product.description} onChange={handleChange} />
        </label>
        <label>
          Category
          <input className="input" name="category" value={product.category} onChange={handleChange} required />
        </label>
        <label>
          Image URL
          <input className="input" name="imageUrl" value={product.imageUrl} onChange={handleChange} />
        </label>
        <label>
          Price
          <input className="input" type="number" step="0.01" name="price" value={product.price} onChange={handleChange} required />
        </label>
        <label>
          Stock
          <input className="input" type="number" name="stock" value={product.stock} onChange={handleChange} required />
        </label>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <button type="submit" className="primary-btn">
          Save
        </button>
      </form>
    </section>
  );
};

export default AdminProductForm;
