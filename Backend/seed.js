const { sql, poolPromise } = require('./config/db');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        const pool = await poolPromise;
        const hashedPassword = await bcrypt.hash('password123', 10);

        console.log('Seeding initial data...');

        // 1. Roles (checked in setup.sql, but ensuring here)
        // 2. Departments (checked in setup.sql)

        // 3. Create Sample Users
        // Art User (Dept ID 5)
        await pool.request()
            .input('name', sql.NVarChar, 'Art Designer')
            .input('email', sql.NVarChar, 'designer@id.com')
            .input('pass', sql.NVarChar, hashedPassword)
            .input('roleId', sql.Int, 4) // employee
            .input('deptId', sql.Int, 5) // Art
            .query(`
                IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = @email)
                INSERT INTO Users (Name, Email, PasswordHash, RoleId, DepartmentId)
                VALUES (@name, @email, @pass, @roleId, @deptId)
            `);

        // QA User (Dept ID 6)
        await pool.request()
            .input('name', sql.NVarChar, 'QA Specialist')
            .input('email', sql.NVarChar, 'qa@id.com')
            .input('pass', sql.NVarChar, hashedPassword)
            .input('roleId', sql.Int, 4) // employee
            .input('deptId', sql.Int, 6) // QA
            .query(`
                IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = @email)
                INSERT INTO Users (Name, Email, PasswordHash, RoleId, DepartmentId)
                VALUES (@name, @email, @pass, @roleId, @deptId)
            `);

        // Admin User (Dept ID 1)
        await pool.request()
            .input('name', sql.NVarChar, 'System Admin')
            .input('email', sql.NVarChar, 'admin@id.com')
            .input('pass', sql.NVarChar, hashedPassword)
            .input('roleId', sql.Int, 1) // admin
            .input('deptId', sql.Int, 1) // Admin (BUT portal restricted check usually blocks this)
            .query(`
                IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = @email)
                INSERT INTO Users (Name, Email, PasswordHash, RoleId, DepartmentId)
                VALUES (@name, @email, @pass, @roleId, @deptId)
            `);

        // 4. Sample Announcement
        await pool.request()
            .query(`
                IF NOT EXISTS (SELECT 1 FROM Announcements WHERE Title = 'Welcome to Nexus Portal')
                INSERT INTO Announcements (Title, Content, AuthorId, IsPinned)      
                SELECT 'Welcome to Nexus Portal', 'We are excited to launch the new Employee Self-Service Portal for Art and QA departments.', Id, 1
                FROM Users WHERE RoleId = 1
            `);

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seed();
