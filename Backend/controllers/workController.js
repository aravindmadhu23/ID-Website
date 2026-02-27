const { sql, poolPromise } = require('../config/db');
const bonusService = require('./bonusService');

const submitWorkEntry = async (req, res) => {
    const { jobsCompleted, workDate } = req.body;
    const userId = req.user.id;

    try {
        const pool = await poolPromise;

        // Upsert work entry
        const entryResult = await pool.request()
            .input('userId', sql.Int, userId)
            .input('jobs', sql.Int, jobsCompleted)
            .input('date', sql.Date, workDate)
            .query(`
                DECLARE @InsertedId TABLE (Id INT);

                MERGE DailyWorkEntries AS target
                USING (SELECT @userId AS UserId, @date AS WorkDate) AS source
                ON (target.UserId = source.UserId AND target.WorkDate = source.WorkDate)
                WHEN MATCHED THEN
                    UPDATE SET JobsCompleted = @jobs, CreatedAt = GETDATE()
                WHEN NOT MATCHED THEN
                    INSERT (UserId, WorkDate, JobsCompleted)
                    VALUES (@userId, @date, @jobs)
                OUTPUT inserted.Id INTO @InsertedId;

                SELECT Id FROM @InsertedId;
            `);

        const entryId = entryResult.recordset[0].Id;

        // Trigger bonus calculation
        const bonus = await bonusService.calculateAndSaveBonus(userId, entryId, jobsCompleted, workDate);

        res.json({ message: 'Work entry submitted successfully', jobsCompleted, bonus });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getDashboardStats = async (req, res) => {
    const userId = req.user.id;
    try {
        const pool = await poolPromise;

        // Today's work
        const todayResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT JobsCompleted FROM DailyWorkEntries 
                WHERE UserId = @userId AND WorkDate = CAST(GETDATE() AS DATE)
            `);

        // Monthly stats from view
        const monthlyResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT TotalJobs, TotalBonus FROM MonthlyPerformance 
                WHERE UserId = @userId AND Year = YEAR(GETDATE()) AND Month = MONTH(GETDATE())
            `);

        // Leave count (Pending/Approved for this month)
        const leaveResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT COUNT(*) as LeaveCount FROM LeaveRequests 
                WHERE UserId = @userId AND MONTH(StartDate) = MONTH(GETDATE()) AND Status != 'Rejected'
            `);

        res.json({
            todayJobs: todayResult.recordset[0]?.JobsCompleted || 0,
            monthlyTotalJobs: monthlyResult.recordset[0]?.TotalJobs || 0,
            monthlyTotalBonus: monthlyResult.recordset[0]?.TotalBonus || 0,
            leaveCount: leaveResult.recordset[0]?.LeaveCount || 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { submitWorkEntry, getDashboardStats };
