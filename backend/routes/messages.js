const express = require('express')
const verifyAuth = require('../controllers/verifyAuth')
const db = require('../db')
const router = express.Router()

router.use(verifyAuth)

//messages => msg_id p key, sender_id f key=> users(id), group_id f key=> users(id), message, timestamp
// specify a length to the message

router.get('/:group_id', (req, res) => {
    const { group_id } = req.params
    if (isNaN(group_id)) return res.status(400).json({ message: 'Error: group not valid !' })
    sqlQuery = 'select * from messages where group_id = $1;'
    db.query(sqlQuery, [group_id], (error, result) => {
        if (error) {
            console.log('Error getting the messages')
            return res.status(500).json({ message: 'Internal Server Error !!' })
        }
        else {
            return res.json({ messages: result.rows })
        }
    })
})

router.post('/', (req, res) => {
    const { sender_id, group_id, message } = req.body
    sqlQuery = 'insert into messages (sender_id, group_id, message, created_at) values($1, $2, $3, now()) returning *;'
    db.query(sqlQuery, [sender_id, group_id, message,], (error, result) => {
        if (error) {
            console.log('Error creating message !!')
            return res.status(500).json({ message: 'Internal Server Error !!' })
        } else {
            return res.json({ message: result.rows[0] })
        }
    })
})

module.exports = router