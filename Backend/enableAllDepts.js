require('dotenv').config();
const { poolPromise } = require('./config/db');

poolPromise.then(async (pool) => {
    await pool.request().query(`
        UPDATE Departments SET IsPortalEnabled = 1 WHERE IsPortalEnabled = 0
    `);
    const result = await pool.request().query(`SELECT Id, Name, IsPortalEnabled FROM Departments`);
    console.log('Departments updated:');
    result.recordset.forEach(d => console.log(`  ${d.Id}. ${d.Name} - Enabled: ${d.IsPortalEnabled}`));
    process.exit(0);
}).catch(e => {
    console.error('Failed:', e.message);
    process.exit(1);
});
