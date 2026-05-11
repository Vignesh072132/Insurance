import { useEffect, useState } from 'react';
import api from '../utils/api';

const Admin = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const { data } = await api.get('/claims');
      setClaims(data.claims);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (claim, type) => {
    setSelectedClaim(claim);
    setModalType(type);
    setShowModal(true);
    setReason('');
    setNotes('');
  };

  const handleStatusUpdate = async () => {
    try {
      const payload = { 
        status: modalType === 'approve' ? 'Approved' : 'Rejected',
        notes
      };
      if (modalType === 'reject') {
        payload.rejectionReason = reason;
      }
      await api.put(`/claims/${selectedClaim._id}/status`, payload);
      setShowModal(false);
      fetchClaims();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <h1>Admin Panel - Manage Claims</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Claim #</th>
              <th>User</th>
              <th>Policy</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim._id}>
                <td>{claim.claimNumber}</td>
                <td>{claim.user?.name}</td>
                <td>{claim.policy?.policyNumber}</td>
                <td>${claim.claimAmount.toLocaleString()}</td>
                <td className="description-cell">{claim.description}</td>
                <td>
                  <span className={`badge-${claim.status.toLowerCase()}`}>
                    {claim.status}
                  </span>
                </td>
                <td>
                  {claim.status === 'Pending' && (
                    <div className="action-buttons">
                      <button
                        onClick={() => openModal(claim, 'approve')}
                        className="btn-success"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => openModal(claim, 'reject')}
                        className="btn-danger"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {claim.status === 'Rejected' && claim.rejectionReason && (
                    <small className="rejection-reason">Reason: {claim.rejectionReason}</small>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{modalType === 'approve' ? 'Approve Claim' : 'Reject Claim'}</h2>
            <p><strong>Claim:</strong> {selectedClaim?.claimNumber}</p>
            <p><strong>Amount:</strong> ${selectedClaim?.claimAmount.toLocaleString()}</p>
            
            {modalType === 'reject' && (
              <textarea
                placeholder="Rejection Reason (Required)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows="3"
              />
            )}
            
            <textarea
              placeholder="Additional Notes (Optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
            />
            
            <div className="modal-buttons">
              <button 
                onClick={handleStatusUpdate}
                className={modalType === 'approve' ? 'btn-success' : 'btn-danger'}
                disabled={modalType === 'reject' && !reason}
              >
                Confirm {modalType === 'approve' ? 'Approval' : 'Rejection'}
              </button>
              <button onClick={() => setShowModal(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
