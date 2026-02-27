require('dotenv').config();
const { poolPromise, sql } = require('./config/db');

poolPromise.then(async (pool) => {
    try {
        // Test the exact fixed login query
        const result = await pool.request()
            .input('email', sql.NVarChar, 'art@nexus.com')
            .query(`
                SELECT u.*, d.IsPortalEnabled 
                FROM [Users] u
                JOIN [Departments] d ON u.DepartmentId = d.Id
                WHERE u.Email = @email AND u.IsActive = 1
            `);
        if (result.recordset.length > 0) {
            const u = result.recordset[0];
            console.log('SUCCESS: User found!');
            console.log('Name:', u.Name, '| Role:', u.Role, '| PortalEnabled:', u.IsPortalEnabled);
        } else {
            console.log('No user found with art@nexus.com - run npm run seed first!');
        }
    } catch (e) {
        console.error('Query still failing:', e.message);
    }
    process.exit(0);
}).catch(e => {
    console.error('Connection failed:', e.message);
    process.exit(1);
});
