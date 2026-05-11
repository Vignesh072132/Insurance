import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CreatePolicy = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    user: '',
    policyType: '',
    coverageAmount: '',
    premium: '',
    expiryDate: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/auth/users');
        setUsers(data.users || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/policies', formData);
      setSuccess('Policy created successfully!');
      setTimeout(() => navigate('/policies'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create policy');
    }
  };

  const policyTypes = ['Health', 'Life', 'Vehicle', 'Property', 'Travel', 'Home', 'Business', 'Pet', 'Dental', 'Vision'];

  return (
    <div className="page-container">
      <div className="form-card">
        <h1>Create New Policy</h1>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <select
            value={formData.policyType}
            onChange={(e) => setFormData({...formData, policyType: e.target.value})}
            required
          >
            <option value="">Select Policy Type</option>
            {policyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Coverage Amount"
            value={formData.coverageAmount}
            onChange={(e) => setFormData({...formData, coverageAmount: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Premium Amount"
            value={formData.premium}
            onChange={(e) => setFormData({...formData, premium: e.target.value})}
            required
          />
          <input
            type="date"
            placeholder="Expiry Date"
            value={formData.expiryDate}
            onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
            required
          />
          <button type="submit" className="btn-primary">Create Policy</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePolicy;
