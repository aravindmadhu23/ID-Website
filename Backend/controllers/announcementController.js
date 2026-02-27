const { sql, poolPromise } = require('../config/db');

const getAllAnnouncements = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT a.*, u.Name as AuthorName FROM Announcements a JOIN Users u ON a.AuthorId = u.Id ORDER BY a.IsPinned DESC, a.CreatedAt DESC');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createAnnouncement = async (req, res) => {
    const { title, content, isPinned } = req.body;
    const authorId = req.user.id;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('title', sql.NVarChar, title)
            .input('content', sql.NVarChar, content)
            .input('author', sql.Int, authorId)
            .input('pinned', sql.Bit, isPinned ? 1 : 0)
            .query(`
                INSERT INTO Announcements (Title, Content, AuthorId, IsPinned)
                VALUES (@title, @content, @author, @pinned)
            `);
        res.status(201).json({ message: 'Announcement created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getAllAnnouncements, createAnnouncement };
