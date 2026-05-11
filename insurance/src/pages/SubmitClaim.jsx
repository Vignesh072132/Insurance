import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const SubmitClaim = () => {
  const [policies, setPolicies] = useState([]);
  const [formData, setFormData] = useState({
    policy: '',
    description: '',
    claimAmount: ''
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const { data } = await api.get('/policies');
        setPolicies(data.policies);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPolicies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('policy', formData.policy);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('claimAmount', formData.claimAmount);
    
    for (let file of files) {
      formDataToSend.append('documents', file);
    }

    try {
      await api.post('/claims', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Claim submitted successfully!');
      setTimeout(() => navigate('/claims'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit claim');
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h1>Submit Claim</h1>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <select
            value={formData.policy}
            onChange={(e) => setFormData({...formData, policy: e.target.value})}
            required
          >
            <option value="">Select Policy</option>
            {policies.map((policy) => (
              <option key={policy._id} value={policy._id}>
                {policy.policyNumber} - {policy.policyType}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Claim Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
            rows="4"
          />
          <input
            type="number"
            placeholder="Claim Amount"
            value={formData.claimAmount}
            onChange={(e) => setFormData({...formData, claimAmount: e.target.value})}
            required
          />
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
          />
          <button type="submit" className="btn-primary">Submit Claim</button>
        </form>
      </div>
    </div>
  );
};

export default SubmitClaim;
