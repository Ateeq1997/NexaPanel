const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

const demoUser = {
  id: 1,
  email: 'superadmin@example.com',
  password: 'superadmin123',
  name: 'Faiz Ahmed',
  role: 'Creative Director',
  tenant: 'Northstar Studio',
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email !== demoUser.email || password !== demoUser.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const payload = {
      id: demoUser.id,
      email: demoUser.email,
      role: demoUser.role,
      tenant: demoUser.tenant,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role,
        tenant: demoUser.tenant,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDemoCredentials = (_req, res) => {
  res.json({
    email: demoUser.email,
    password: demoUser.password,
    hint: 'Portfolio demo account',
  });
};
