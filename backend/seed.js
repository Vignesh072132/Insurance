require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'icms' });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String
}, { timestamps: true });

const PolicySchema = new mongoose.Schema({
  policyNumber: String,
  policyType: String,
  premium: Number,
  startDate: Date,
  coverageAmount: Number,
  expiryDate: Date,
  user: mongoose.Schema.Types.ObjectId,
  isActive: Boolean
}, { timestamps: true });

const ClaimSchema = new mongoose.Schema({
  claimNumber: String,
  user: mongoose.Schema.Types.ObjectId,
  policy: mongoose.Schema.Types.ObjectId,
  description: String,
  documents: [String],
  status: String,
  claimAmount: Number,
  rejectionReason: String,
  approvedBy: mongoose.Schema.Types.ObjectId,
  approvedAt: Date,
  notes: String
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Policy = mongoose.model('Policy', PolicySchema);
const Claim = mongoose.model('Claim', ClaimSchema);

const seedData = async () => {
  await connectDB();

  await User.deleteMany({});
  await Policy.deleteMany({});
  await Claim.deleteMany({});

  const hashedPassword = await bcrypt.hash('password123', 12);

  const users = await User.insertMany([
    { name: 'Admin User', email: 'admin@icms.com', password: hashedPassword, role: 'admin' },
    { name: 'Agent Smith', email: 'agent@icms.com', password: hashedPassword, role: 'agent' },
    { name: 'John Doe', email: 'john@example.com', password: hashedPassword, role: 'customer' },
    { name: 'Jane Smith', email: 'jane@example.com', password: hashedPassword, role: 'customer' },
    { name: 'Mike Johnson', email: 'mike@example.com', password: hashedPassword, role: 'customer' }
  ]);

  console.log('Users created:', users.length);

  const policies = await Policy.insertMany([
    {
      policyNumber: 'POL1001',
      policyType: 'Health',
      premium: 500,
      coverageAmount: 100000,
      expiryDate: new Date('2025-12-31'),
      user: users[2]._id,
      isActive: true
    },
    {
      policyNumber: 'POL1002',
      policyType: 'Life',
      premium: 800,
      coverageAmount: 500000,
      expiryDate: new Date('2026-06-30'),
      user: users[2]._id,
      isActive: true
    },
    {
      policyNumber: 'POL1003',
      policyType: 'Vehicle',
      premium: 300,
      coverageAmount: 50000,
      expiryDate: new Date('2025-03-15'),
      user: users[3]._id,
      isActive: true
    },
    {
      policyNumber: 'POL1004',
      policyType: 'Property',
      premium: 1200,
      coverageAmount: 300000,
      expiryDate: new Date('2026-01-20'),
      user: users[3]._id,
      isActive: true
    },
    {
      policyNumber: 'POL1005',
      policyType: 'Travel',
      premium: 150,
      coverageAmount: 25000,
      expiryDate: new Date('2025-08-10'),
      user: users[4]._id,
      isActive: true
    },
    {
      policyNumber: 'POL1006',
      policyType: 'Home',
      premium: 900,
      coverageAmount: 250000,
      expiryDate: new Date('2026-11-30'),
      user: users[4]._id,
      isActive: true
    },
    {
      policyNumber: 'POL1007',
      policyType: 'Business',
      premium: 2000,
      coverageAmount: 1000000,
      expiryDate: new Date('2025-09-15'),
      user: users[2]._id,
      isActive: true
    },
    {
      policyNumber: 'POL1008',
      policyType: 'Pet',
      premium: 100,
      coverageAmount: 10000,
      expiryDate: new Date('2025-05-20'),
      user: users[3]._id,
      isActive: true
    }
  ]);

  console.log('Policies created:', policies.length);

  const claims = await Claim.insertMany([
    {
      claimNumber: 'CLM2001',
      user: users[2]._id,
      policy: policies[0]._id,
      description: 'Medical treatment for surgery',
      claimAmount: 15000,
      status: 'Approved',
      approvedBy: users[0]._id,
      approvedAt: new Date(),
      notes: 'All documents verified. Claim approved.'
    },
    {
      claimNumber: 'CLM2002',
      user: users[2]._id,
      policy: policies[1]._id,
      description: 'Life insurance claim for critical illness',
      claimAmount: 50000,
      status: 'Pending'
    },
    {
      claimNumber: 'CLM2003',
      user: users[3]._id,
      policy: policies[2]._id,
      description: 'Vehicle accident damage repair',
      claimAmount: 8000,
      status: 'Rejected',
      rejectionReason: 'Accident occurred outside policy coverage area',
      notes: 'Policy does not cover international accidents'
    },
    {
      claimNumber: 'CLM2004',
      user: users[3]._id,
      policy: policies[3]._id,
      description: 'Property damage due to fire',
      claimAmount: 45000,
      status: 'Approved',
      approvedBy: users[0]._id,
      approvedAt: new Date(),
      notes: 'Fire department report verified'
    },
    {
      claimNumber: 'CLM2005',
      user: users[4]._id,
      policy: policies[4]._id,
      description: 'Travel cancellation due to medical emergency',
      claimAmount: 3000,
      status: 'Pending'
    },
    {
      claimNumber: 'CLM2006',
      user: users[4]._id,
      policy: policies[5]._id,
      description: 'Home water damage repair',
      claimAmount: 12000,
      status: 'Pending'
    },
    {
      claimNumber: 'CLM2007',
      user: users[2]._id,
      policy: policies[6]._id,
      description: 'Business equipment theft',
      claimAmount: 25000,
      status: 'Approved',
      approvedBy: users[0]._id,
      approvedAt: new Date(),
      notes: 'Police report filed. Claim approved.'
    },
    {
      claimNumber: 'CLM2008',
      user: users[3]._id,
      policy: policies[7]._id,
      description: 'Pet surgery for broken leg',
      claimAmount: 2500,
      status: 'Rejected',
      rejectionReason: 'Pre-existing condition not covered',
      notes: 'Medical records show condition existed before policy start date'
    }
  ]);

  console.log('Claims created:', claims.length);

  console.log('\n✅ Sample Data Created Successfully!\n');
  console.log('📧 Login Credentials:');
  console.log('Admin: admin@icms.com / password123');
  console.log('Agent: agent@icms.com / password123');
  console.log('Customer 1: john@example.com / password123');
  console.log('Customer 2: jane@example.com / password123');
  console.log('Customer 3: mike@example.com / password123\n');

  process.exit(0);
};

seedData();
