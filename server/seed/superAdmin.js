// seed/superAdmin.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

async function seedSuperAdmin() {
  try {
    // Step 1: Insert roles if not exists
    const roles = ['Super Admin', 'Admin', 'Manager', 'User'];

    for (const role of roles) {
      const res = await pool.query('SELECT * FROM roles WHERE name = $1', [role]);
      if (res.rowCount === 0) {
        await pool.query('INSERT INTO roles (name) VALUES ($1)', [role]);
        console.log(`Role "${role}" created.`);
      }
    }

    // Step 2: Check if Super Admin tenant exists
    const tenantName = 'Main Organization';
    let tenantRes = await pool.query('SELECT * FROM tenants WHERE name = $1', [tenantName]);
    let tenantId;

    if (tenantRes.rowCount === 0) {
      tenantRes = await pool.query(
        'INSERT INTO tenants (name) VALUES ($1) RETURNING id',
        [tenantName]
      );
      tenantId = tenantRes.rows[0].id;
      console.log(`Tenant "${tenantName}" created.`);
    } else {
      tenantId = tenantRes.rows[0].id;
    }

    // Step 3: Check if Super Admin user exists
    const email = 'superadmin@example.com';
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userCheck.rowCount === 0) {
      const hashedPassword = await bcrypt.hash('superadmin123', 10);
      const roleRes = await pool.query('SELECT id FROM roles WHERE name = $1', ['Super Admin']);
      const roleId = roleRes.rows[0].id;

      await pool.query(
        `INSERT INTO users (name, email, password, role_id, tenant_id)
         VALUES ($1, $2, $3, $4, $5)`,
        ['Super Admin', email, hashedPassword, roleId, tenantId]
      );

      console.log(`Super Admin user created with email: ${email} and password: superadmin123`);
    } else {
      console.log('Super Admin already exists.');
    }

  } catch (err) {
    console.error('Error seeding Super Admin:', err);
  }
}

module.exports = seedSuperAdmin;
