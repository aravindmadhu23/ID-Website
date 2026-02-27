const { sql, poolPromise } = require('../config/db');

const bonusService = {
    calculateAndSaveBonus: async (userId, workEntryId, jobsCompleted, workDate) => {
        const pool = await poolPromise;

        // Get target and rate for the user's role
        const targetResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT dt.MinimumJobs, dt.BonusRate 
                FROM DailyTargets dt
                JOIN Users u ON dt.RoleId = u.RoleId
                WHERE u.Id = @userId
            `);

        const target = targetResult.recordset[0];
        if (!target) return 0;

        let bonus = 0;
        if (jobsCompleted > target.MinimumJobs) {
            bonus = (jobsCompleted - target.MinimumJobs) * target.BonusRate;
        }

        // Upsert daily bonus
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('workEntryId', sql.Int, workEntryId)
            .input('bonus', sql.Decimal(18, 2), bonus)
            .input('workDate', sql.Date, workDate)
            .query(`
                IF EXISTS (SELECT 1 FROM DailyBonus WHERE UserId = @userId AND WorkDate = @workDate)
                BEGIN
                    UPDATE DailyBonus SET BonusAmount = @bonus, WorkEntryId = @workEntryId 
                    WHERE UserId = @userId AND WorkDate = @workDate
                END
                ELSE
                BEGIN
                    INSERT INTO DailyBonus (UserId, WorkEntryId, BonusAmount, WorkDate)
                    VALUES (@userId, @workEntryId, @bonus, @workDate)
                END
            `);

        return bonus;
    }
};

module.exports = bonusService;
