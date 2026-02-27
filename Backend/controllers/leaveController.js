const { sql, poolPromise } = require('../config/db');

const requestLeave = async (req, res) => {
    const { startDate, endDate, leaveType, reason } = req.body;
    const userId = req.user.id;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('start', sql.Date, startDate)
            .input('end', sql.Date, endDate)
            .input('type', sql.NVarChar, leaveType)
            .input('reason', sql.NVarChar, reason)
            .query(`
                INSERT INTO LeaveRequests (UserId, StartDate, EndDate, LeaveType, Reason)
                VALUES (@userId, @start, @end, @type, @reason)
            `);
        res.status(201).json({ message: 'Leave request submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getMyLeaves = async (req, res) => {
    const userId = req.user.id;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT * FROM LeaveRequests WHERE UserId = @userId ORDER BY StartDate DESC');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { requestLeave, getMyLeaves };
