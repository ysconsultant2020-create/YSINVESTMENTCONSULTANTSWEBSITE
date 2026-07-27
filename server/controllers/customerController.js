const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Insurance = require('../models/Insurance');
const MutualFund = require('../models/MutualFund');
const SipPlan = require('../models/SipPlan');
const LumpsumPlan = require('../models/LumpsumPlan');

// Get all clients (registered users + appointment contacts)
exports.getAll = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const filter = { role: 'client' };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch registered clients
    let registeredUsers = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    // Fetch appointment contacts who might not have registered accounts
    const appointmentFilter = {};
    if (search) {
      appointmentFilter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }
    const appointments = await Appointment.find(appointmentFilter).sort({ createdAt: -1 });

    // Combine unique customers by email
    const customerMap = new Map();

    registeredUsers.forEach(u => {
      customerMap.set(u.email.toLowerCase(), {
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        city: u.city || '',
        createdAt: u.createdAt,
        isRegistered: true
      });
    });

    appointments.forEach(a => {
      const email = a.email.toLowerCase();
      if (!customerMap.has(email)) {
        customerMap.set(email, {
          _id: a._id,
          name: a.fullName,
          email: a.email,
          phone: a.phone,
          city: a.city || '',
          createdAt: a.createdAt,
          isRegistered: false
        });
      }
    });

    const allCustomers = Array.from(customerMap.values());
    const total = allCustomers.length;
    const paginatedCustomers = allCustomers.slice(skip, skip + parseInt(limit));

    res.json({
      customers: paginatedCustomers,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)) || 1
    });
  } catch (error) {
    next(error);
  }
};

// Get single client details with appointments
exports.getById = async (req, res, next) => {
  try {
    let customer = await User.findById(req.params.id).select('-password');
    let appointments = [];

    if (customer) {
      appointments = await Appointment.find({
        $or: [{ customer: customer._id }, { email: customer.email.toLowerCase() }]
      }).sort({ createdAt: -1 });
    } else {
      // Might be an appointment contact ID
      const apt = await Appointment.findById(req.params.id);
      if (apt) {
        customer = {
          _id: apt._id,
          name: apt.fullName,
          email: apt.email,
          phone: apt.phone,
          city: apt.city || 'N/A'
        };
        appointments = await Appointment.find({ email: apt.email.toLowerCase() }).sort({ createdAt: -1 });
      }
    }

    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    res.json({ customer, appointments });
  } catch (error) {
    next(error);
  }
};

// Update customer (Manager only)
exports.update = async (req, res, next) => {
  try {
    const { name, email, phone, city } = req.body;
    let customer = await User.findById(req.params.id);

    if (customer && customer.role === 'client') {
      customer.name = name || customer.name;
      customer.email = email || customer.email;
      customer.phone = phone || customer.phone;
      customer.city = city !== undefined ? city : customer.city;
      await customer.save();

      // Also update any associated appointments with the new name/email/phone/city
      await Appointment.updateMany(
        { $or: [{ customer: customer._id }, { email: customer.email.toLowerCase() }] },
        { fullName: customer.name, email: customer.email, phone: customer.phone, city: customer.city }
      );

      return res.json({ message: 'Customer updated successfully', customer });
    } else {
      // Check if it's an appointment contact ID
      const apt = await Appointment.findById(req.params.id);
      if (apt) {
        await Appointment.updateMany(
          { email: apt.email.toLowerCase() },
          { fullName: name || apt.fullName, email: email || apt.email, phone: phone || apt.phone, city: city !== undefined ? city : apt.city }
        );
        return res.json({ message: 'Customer contact updated successfully' });
      }
    }

    return res.status(404).json({ message: 'Customer not found' });
  } catch (error) {
    next(error);
  }
};

// Delete customer (Manager only)
exports.remove = async (req, res, next) => {
  try {
    let customer = await User.findById(req.params.id);

    if (customer && customer.role === 'client') {
      await User.findByIdAndDelete(req.params.id);
      // Delete associated appointments as well
      await Appointment.deleteMany({
        $or: [{ customer: customer._id }, { email: customer.email.toLowerCase() }]
      });
      return res.json({ message: 'Customer deleted successfully' });
    } else {
      // Delete appointment contact
      const apt = await Appointment.findById(req.params.id);
      if (apt) {
        await Appointment.deleteMany({ email: apt.email.toLowerCase() });
        return res.json({ message: 'Customer contact deleted successfully' });
      }
    }

    return res.status(404).json({ message: 'Customer not found' });
  } catch (error) {
    next(error);
  }
};

// Seed initial sample data if DB is empty
exports.seedData = async (req, res, next) => {
  try {
    // Seed Sample Clients if empty
    const clientCount = await User.countDocuments({ role: 'client' });
    if (clientCount === 0) {
      await User.create([
        { name: 'Rahul Sharma', email: 'rahul.sharma@example.com', password: 'Password@123', phone: '9876543210', city: 'Delhi', role: 'client' },
        { name: 'Priya Patel', email: 'priya.patel@example.com', password: 'Password@123', phone: '9812345678', city: 'Mumbai', role: 'client' },
        { name: 'Amit Verma', email: 'amit.verma@example.com', password: 'Password@123', phone: '9988776655', city: 'Bangalore', role: 'client' }
      ]);
    }

    // Seed Sample Insurance if empty
    const insCount = await Insurance.countDocuments();
    if (insCount === 0) {
      await Insurance.create([
        {
          title: 'Comprehensive Health Protect Shield',
          category: 'Health Insurance',
          description: 'Full medical coverage including pre & post hospitalization, ICU charges, and cashless treatment across 10,000+ network hospitals.',
          benefits: 'Zero co-pay, 100% restoration of sum insured, free annual health checkups.',
          premium: '₹12,500 / year',
          coverage: '₹10 Lakhs',
          features: 'No claim bonus up to 100%, day care treatment coverage.',
          eligibility: '18 to 65 Years',
          isActive: true
        },
        {
          title: 'Premium Motor Zero-Dep Plan',
          category: 'Motor Insurance',
          description: 'All-round vehicle protection with zero depreciation cover, roadside assistance, and bumper-to-bumper claim clearance.',
          benefits: '24x7 towing support, engine protection, key replacement cover.',
          premium: '₹8,900 / year',
          coverage: 'IDV based value',
          features: 'Cashless garage repairs, instant digital claim processing.',
          eligibility: 'Private 4-wheeler owners',
          isActive: true
        },
        {
          title: 'Commercial Property & Business Protect',
          category: 'Non-Motor Insurance',
          description: 'Secures your commercial building, stock, machinery, and business assets against fire, theft, flood, and natural calamities.',
          benefits: 'Business interruption cover, burglary protection, stock loss compensation.',
          premium: '₹18,000 / year',
          coverage: '₹50 Lakhs',
          features: 'Flexible sum insured options, tenant liability cover.',
          eligibility: 'Business owners & shopkeepers',
          isActive: true
        },
        {
          title: 'ICICI Prudential iProtect Smart Shield',
          category: 'ICICI Insurance',
          description: 'Comprehensive term life & critical illness cover with lump sum payout on 34 critical illnesses and accidental death protection.',
          benefits: 'Tax benefits under Sec 80C & 10(10D), terminal illness acceleration benefit.',
          premium: '₹9,600 / year',
          coverage: '₹1 Crore',
          features: 'Multiple payout options (Lump sum / Monthly Income), life stage cover upgrade.',
          eligibility: '18 to 65 Years',
          isActive: true
        }
      ]);
    }

    // Seed Sample Mutual Funds if empty
    const mfCount = await MutualFund.countDocuments();
    if (mfCount === 0) {
      await MutualFund.create([
        {
          fundName: 'YS Bluechip Largecap Opportunities Fund',
          amc: 'YS Asset Management',
          riskLevel: 'Moderate',
          category: 'Equity Large Cap',
          returns: '15.4% p.a. (3Y)',
          description: 'Invests in top 100 market-leading companies with proven growth records and strong corporate governance.',
          minInvestment: '1000',
          isActive: true
        },
        {
          fundName: 'YS Emerging Midcap Alpha Builder',
          amc: 'YS Asset Management',
          riskLevel: 'High',
          category: 'Equity Mid Cap',
          returns: '21.8% p.a. (3Y)',
          description: 'Targets fast-growing mid-sized companies with strong competitive moats and high capital efficiency.',
          minInvestment: '500',
          isActive: true
        },
        {
          fundName: 'YS Dynamic Hybrid Wealth Allocator',
          amc: 'YS Asset Management',
          riskLevel: 'Low',
          category: 'Hybrid / Balanced',
          returns: '11.2% p.a. (3Y)',
          description: 'Dynamically balances equity and debt instruments to deliver steady growth with minimized downside risk.',
          minInvestment: '500',
          isActive: true
        }
      ]);
    }

    // Seed Sample SIP Plans if empty
    const sipCount = await SipPlan.countDocuments();
    if (sipCount === 0) {
      await SipPlan.create([
        {
          planName: 'Wealth Multiplier Monthly SIP',
          minAmount: '1000',
          expectedReturns: '15-18% p.a.',
          duration: '5 to 15 Years',
          risk: 'Moderate',
          description: 'Disciplined monthly investment strategy focused on compounding high-quality equity funds.',
          isActive: true
        },
        {
          planName: 'Tax Saver ELSS Monthly SIP',
          minAmount: '500',
          expectedReturns: '14-16% p.a.',
          duration: '3 Years Lock-in',
          risk: 'Moderate',
          description: 'Save up to ₹46,800 under Section 80C while building long-term equity wealth with the shortest lock-in.',
          isActive: true
        },
        {
          planName: 'Early Retirement Freedom SIP',
          minAmount: '2000',
          expectedReturns: '16-20% p.a.',
          duration: '10+ Years',
          risk: 'High',
          description: 'Aggressive growth SIP tailored for achieving financial independence and early retirement goals.',
          isActive: true
        }
      ]);
    }

    // Seed Sample Lumpsum Plans if empty
    const lumpCount = await LumpsumPlan.countDocuments();
    if (lumpCount === 0) {
      await LumpsumPlan.create([
        {
          planName: 'Capital Growth Lumpsum Plan',
          minAmount: '25000',
          expectedReturns: '14-16% p.a.',
          duration: '3 to 5 Years',
          risk: 'Moderate',
          description: 'One-time investment portfolio aimed at capital appreciation over a medium-term horizon.',
          isActive: true
        },
        {
          planName: 'High Yield Equity Lumpsum Builder',
          minAmount: '50000',
          expectedReturns: '18-22% p.a.',
          duration: '5+ Years',
          risk: 'High',
          description: 'Lumpsum allocation into high-conviction growth equities for maximum wealth creation.',
          isActive: true
        },
        {
          planName: 'Conservative Wealth Shield Lumpsum',
          minAmount: '10000',
          expectedReturns: '10-12% p.a.',
          duration: '1 to 3 Years',
          risk: 'Low',
          description: 'Low-risk lump sum allocation focusing on capital preservation and steady interest returns.',
          isActive: true
        }
      ]);
    }

    res.json({ message: 'Sample data seeded successfully!' });
  } catch (error) {
    next(error);
  }
};
