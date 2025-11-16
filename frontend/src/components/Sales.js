import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);
  const [formData, setFormData] = useState({
    customerPhone: '',
    items: [{ productId: '', quantity: 1 }],
    discount: 0
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.filter(p => p.quantity > 0));
    } catch (error) {
      setMessage({ type: 'error', text: 'Error fetching products' });
    }
  };

  const fetchSales = async () => {
    try {
      const response = await api.get('/sales');
      setSales(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error fetching sales' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = formData.items.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    // Create a completely new object to ensure React detects the change
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
    // Force re-render to update calculations
    setForceUpdate(prev => prev + 1);
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: 1 }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => {
      const newItems = prev.items.filter((_, i) => i !== index);
      return {
        ...prev,
        items: newItems
      };
    });
  };

  // Calculate subtotal - updates in real-time (calculated on every render)
  const calculateSubtotal = () => {
    if (!formData.items || formData.items.length === 0) return 0;
    return formData.items.reduce((sum, item) => {
      if (!item || !item.productId || !item.quantity) return sum;
      const product = products.find(p => (p._id && p._id.toString() === item.productId.toString()) || (p.id && p.id.toString() === item.productId.toString()));
      if (product && product.price) {
        const quantity = parseInt(item.quantity) || 0;
        return sum + (product.price * quantity);
      }
      return sum;
    }, 0);
  };

  // Calculate total - updates in real-time
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = parseFloat(formData.discount) || 0;
    return Math.max(0, subtotal - discount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validate items
    const validItems = formData.items.filter(item => item.productId && item.quantity > 0);
    if (validItems.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one product' });
      return;
    }

    try {
      const saleData = {
        customerPhone: formData.customerPhone,
        items: validItems.map(item => ({
          productId: item.productId,
          quantity: parseInt(item.quantity)
        })),
        discount: parseFloat(formData.discount) || 0
      };

      const response = await api.post('/sales', saleData);
      setCurrentSale(response.data);
      setShowModal(false);
      setShowMemoModal(true);
      setFormData({
        customerPhone: '',
        items: [{ productId: '', quantity: 1 }],
        discount: 0
      });
      fetchProducts();
      fetchSales();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error creating sale' });
    }
  };

  const closeMemoModal = () => {
    setShowMemoModal(false);
    setCurrentSale(null);
  };

  const printMemo = () => {
    window.print();
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Sales & Cash Memos</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          New Sale
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type === 'error' ? 'error' : 'success'}`}>
          {message.text}
        </div>
      )}

      <div className="card">
        <h2>Recent Sales</h2>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Click on any row to view the cash memo
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Memo No.</th>
                <th>Date</th>
                <th>Customer Phone</th>
                <th>Items</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    No sales yet. Create your first sale!
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr 
                    key={sale._id || sale.id}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                  >
                    <td onClick={() => {
                      setCurrentSale(sale);
                      setShowMemoModal(true);
                    }}>{sale.memoNumber || sale.memo_number}</td>
                    <td onClick={() => {
                      setCurrentSale(sale);
                      setShowMemoModal(true);
                    }}>{new Date(sale.createdAt || sale.created_at).toLocaleDateString()}</td>
                    <td onClick={() => {
                      setCurrentSale(sale);
                      setShowMemoModal(true);
                    }}>{sale.customerPhone || sale.customer_phone}</td>
                    <td onClick={() => {
                      setCurrentSale(sale);
                      setShowMemoModal(true);
                    }}>{sale.items ? sale.items.length : 0} item(s)</td>
                    <td onClick={() => {
                      setCurrentSale(sale);
                      setShowMemoModal(true);
                    }}>₹{sale.total ? sale.total.toFixed(2) : '0.00'}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                        onClick={() => {
                          setCurrentSale(sale);
                          setShowMemoModal(true);
                        }}
                      >
                        View Memo
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2>New Sale</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Customer Phone Number *</label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter customer phone number"
                />
              </div>

              <div className="form-group">
                <label>Products</label>
                {formData.items.map((item, index) => {
                  const selectedProduct = products.find(p => 
                    (p._id && p._id.toString() === (item.productId || '').toString()) || 
                    (p.id && p.id.toString() === (item.productId || '').toString())
                  );
                  const itemSubtotal = selectedProduct && item.quantity 
                    ? selectedProduct.price * (parseInt(item.quantity) || 0) 
                    : 0;
                  
                  return (
                    <div key={`item-${index}-${item.productId}-${item.quantity}`} style={{ 
                      display: 'flex', 
                      gap: '0.5rem', 
                      marginBottom: '0.5rem',
                      alignItems: 'center',
                      padding: '0.5rem',
                      backgroundColor: '#f9f9f9',
                      borderRadius: '4px'
                    }}>
                      <select
                        value={item.productId || ''}
                        onChange={(e) => {
                          handleItemChange(index, 'productId', e.target.value);
                        }}
                        required
                        style={{ flex: 2 }}
                      >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                          <option key={product._id || product.id} value={product._id || product.id}>
                            {product.name} - ₹{product.price} (Stock: {product.quantity})
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={item.quantity || ''}
                        onChange={(e) => {
                          handleItemChange(index, 'quantity', e.target.value);
                        }}
                        min="1"
                        required
                        placeholder="Qty"
                        style={{ flex: 1, maxWidth: '80px' }}
                      />
                      {selectedProduct && item.quantity && (
                        <div style={{ 
                          flex: 1, 
                          textAlign: 'right',
                          fontWeight: 'bold',
                          color: '#28a745',
                          fontSize: '0.9rem'
                        }}>
                          ₹{itemSubtotal.toFixed(2)}
                        </div>
                      )}
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => removeItem(index)}
                          style={{ padding: '0.5rem 1rem' }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  );
                })}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={addItem}
                  style={{ marginTop: '0.5rem' }}
                >
                  Add Product
                </button>
              </div>

              <div className="form-group">
                <label>Subtotal</label>
                <div 
                  key={`subtotal-${forceUpdate}`}
                  style={{ 
                    padding: '0.75rem', 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    border: '1px solid #ddd',
                    minHeight: '20px'
                  }}
                >
                  ₹{calculateSubtotal().toFixed(2)}
                </div>
              </div>

              <div className="form-group">
                <label>Discount (₹)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={(e) => {
                    handleInputChange(e);
                    setForceUpdate(prev => prev + 1);
                  }}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label>Total</label>
                <div 
                  key={`total-${forceUpdate}`}
                  style={{ 
                    padding: '0.75rem', 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: '4px',
                    fontSize: '1.25rem', 
                    fontWeight: 'bold',
                    color: '#28a745',
                    border: '2px solid #28a745',
                    minHeight: '20px'
                  }}
                >
                  ₹{calculateTotal().toFixed(2)}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-success">
                  Complete Sale
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMemoModal && currentSale && (
        <div className="modal" onClick={closeMemoModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <span className="close" onClick={closeMemoModal}>&times;</span>
            <div id="memo-content">
              <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Cash Memo</h2>
              <div style={{ marginBottom: '1rem' }}>
                <p><strong>Memo Number:</strong> {currentSale.memoNumber || currentSale.memo_number}</p>
                <p><strong>Date:</strong> {new Date(currentSale.createdAt || currentSale.created_at).toLocaleString()}</p>
                <p><strong>Customer Phone:</strong> {currentSale.customerPhone || currentSale.customer_phone}</p>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {(currentSale.items || []).map((item, index) => (
                    <tr key={index}>
                      <td>{item.productName || item.product_name}</td>
                      <td>{item.quantity}</td>
                      <td>₹{(item.price || 0).toFixed(2)}</td>
                      <td>₹{(item.subtotal || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                <p><strong>Subtotal:</strong> ₹{(currentSale.subtotal || 0).toFixed(2)}</p>
                {(currentSale.discount || 0) > 0 && (
                  <p><strong>Discount:</strong> ₹{(currentSale.discount || 0).toFixed(2)}</p>
                )}
                <p style={{ fontSize: '1.25rem' }}>
                  <strong>Total:</strong> ₹{(currentSale.total || 0).toFixed(2)}
                </p>
              </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary" onClick={printMemo}>
                Print
              </button>
              <button className="btn btn-secondary" onClick={closeMemoModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;

