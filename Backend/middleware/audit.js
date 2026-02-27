const { sql, poolPromise } = require('../config/db');

const auditLogger = async (req, res, next) => {
    // Only log state-changing or critical actions
    const criticalPaths = ['/auth/login', '/work/submit', '/leaves/request'];
    const path = req.originalUrl.replace('/api', '');

    if (!criticalPaths.includes(path) && req.method === 'GET') {
        return next();
    }

    // Capture the original send to log after response
    const oldSend = res.send;
    res.send = async function (data) {
        res.send = oldSend;
        const result = oldSend.apply(res, arguments);

        // Only log if successful or if it's a login attempt (even failed ones should ideally be logged, but keeping it simple)
        if (res.statusCode < 400 || path === '/auth/login') {
            try {
                const pool = await poolPromise;
                const userId = req.user?.id || null; // For login, id is in result.data if successful, but we'll try to get it from request body email if not auth'd
                const action = `${req.method} ${path}`;

                await pool.request()
                    .input('userId', sql.Int, userId)
                    .input('action', sql.NVarChar, action)
                    .query('INSERT INTO AuditLogs (UserId, Action) VALUES (@userId, @action)');
            } catch (err) {
                console.error('Audit Logging Failed:', err);
            }
        }
        return result;
    };

    next();
};

module.exports = auditLogger;
