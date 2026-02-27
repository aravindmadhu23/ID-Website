const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sql, poolPromise } = require('../config/db');

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query(`
                SELECT u.*, r.Name as RoleName, d.IsPortalEnabled 
                FROM [Users] u
                JOIN [Roles] r ON u.RoleId = r.Id
                JOIN [Departments] d ON u.DepartmentId = d.Id
                WHERE u.Email = @email AND u.IsActive = 1
            `);

        const user = result.recordset[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        if (!user.IsPortalEnabled) {
            return res.status(403).json({ message: 'Access denied. Your department does not have access to this portal.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET is not set in .env file!');
            return res.status(500).json({ message: 'Server configuration error.' });
        }

        const token = jwt.sign(
            { id: user.Id, role: user.RoleName, departmentId: user.DepartmentId },
            secret,
            { expiresIn: '8h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 8 * 60 * 60 * 1000 // 8 hours
        });

        res.json({
            message: 'Login successful',
            user: {
                id: user.Id,
                name: user.Name,
                email: user.Email,
                role: user.RoleName,
                departmentId: user.DepartmentId
            }
        });
    } catch (err) {
        console.error('LOGIN ERROR:', err.message);
        console.error('Stack:', err.stack);
        res.status(500).json({ message: 'Internal server error', detail: err.message });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

module.exports = { login, logout };
