const Claim = require('../models/Claim');
const Policy = require('../models/Policy');

exports.createClaim = async (req, res) => {
  try {
    const { policy, description, claimAmount } = req.body;

    const policyExists = await Policy.findById(policy);
    if (!policyExists) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    if (policyExists.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to claim this policy' });
    }

    const documents = req.files ? req.files.map(file => file.path) : [];

    const claim = await Claim.create({
      user: req.user.id,
      policy,
      description,
      claimAmount,
      documents
    });

    res.status(201).json({ success: true, claim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClaims = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user.id };
    const claims = await Claim.find(query)
      .populate('user', 'name email')
      .populate('policy', 'policyNumber policyType');
    
    res.status(200).json({ success: true, count: claims.length, claims });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('user', 'name email')
      .populate('policy', 'policyNumber policyType coverageAmount');

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    if (req.user.role !== 'admin' && claim.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({ success: true, claim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateClaimStatus = async (req, res) => {
  try {
    const { status, rejectionReason, notes } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update claim status' });
    }

    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    claim.status = status;
    if (status === 'Rejected' && rejectionReason) {
      claim.rejectionReason = rejectionReason;
    }
    if (status === 'Approved') {
      claim.approvedBy = req.user.id;
      claim.approvedAt = new Date();
    }
    if (notes) {
      claim.notes = notes;
    }

    await claim.save();

    res.status(200).json({ success: true, claim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    if (req.user.role !== 'admin' && claim.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await claim.deleteOne();
    res.status(200).json({ success: true, message: 'Claim deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
