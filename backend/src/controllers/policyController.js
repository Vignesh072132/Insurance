const Policy = require('../models/Policy');

exports.createPolicy = async (req, res) => {
  try {
    const { policyType, coverageAmount, expiryDate } = req.body;

    const policy = await Policy.create({
      policyType,
      coverageAmount,
      expiryDate,
      user: req.user.id
    });

    res.status(201).json({ success: true, policy });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPolicies = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user.id };
    const policies = await Policy.find(query).populate('user', 'name email');
    res.status(200).json({ success: true, count: policies.length, policies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPolicy = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id).populate('user', 'name email');
    
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    if (req.user.role !== 'admin' && policy.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({ success: true, policy });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePolicy = async (req, res) => {
  try {
    let policy = await Policy.findById(req.params.id);

    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    if (req.user.role !== 'admin' && policy.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    policy = await Policy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, policy });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);

    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await policy.deleteOne();
    res.status(200).json({ success: true, message: 'Policy deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
