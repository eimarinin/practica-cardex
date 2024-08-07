import { Router } from 'express';
import { query } from './db/connection.js';

const router = Router();

// Получение всех запросов с присоединением таблицы offers
router.get('/requests', (req, res) => {
    const sql = `
        SELECT requests.*, offers.device AS device
        FROM requests
        LEFT JOIN offers ON requests.offerID = offers.id
    `;
    query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// Добавление нового запроса
router.post('/requests', (req, res) => {
    const { dealer, client, date, stage, status, comment, offerID } = req.body;
    const sql = 'INSERT INTO requests (dealer, client, date, stage, status, comment, offerID) VALUES (?, ?, ?, ?, ?, ?, ?)';
    query(sql, [dealer, client, date, stage, status, comment, offerID], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).send('Request added');
    });
});

// Удаление запроса по id
router.delete('/requests/:id', (req, res) => {
    const requestId = req.params.id;
    const sql = 'DELETE FROM requests WHERE id = ?';
    query(sql, [requestId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Request not found');
        }
        res.status(200).json();
    });
});
export default router;

// Обновление запроса по id
router.put('/requests/:id', (req, res) => {
    const requestId = req.params.id;
    const { dealer, client, date, stage, status, comment, offerID } = req.body;
    const sql = 'UPDATE requests SET dealer = ?, client = ?, date = ?, stage = ?, status = ?, comment = ?, offerID = ? WHERE id = ?';
    query(sql, [dealer, client, date, stage, status, comment, offerID, requestId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Request not found');
        }
        res.status(200).json();
    });
});
