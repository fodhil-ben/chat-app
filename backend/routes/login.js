const express = require('express')
const bcrypt = require('bcrypt')
const db = require('../db')
const jwt = require('jsonwebtoken')
const router = express.Router()

const craeteToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '1d' })
}

router.post('/', async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: 'Parameter missing !' })
    }
    sqlQuery = 'select * from users where username=$1;'
    db.query(sqlQuery, [username], (error, result) => {
        if (error) {
            console.log(`Error getting username: ${error}`)
            return res.status(500).json({ message: 'Internal Server Error !!' })
        }
        else if (result.rows.length !== 0) {
            bcrypt.compare(password, result.rows[0].password, (e, compareResult) => {
                if (e) {
                    console.log(`Error comparing the passwords ${e}`)
                    return res.send('Internal Server Error !!')
                }
                else if (compareResult) {
                    user = result.rows[0]
                    const token = craeteToken(user.id)
                    res.status(200).json({ message: { id: user.id, email: user.email, username: user.username, token } })
                }
                else {
                    res.status(401).json({ message: 'Authentication Failed !' })
                }
            })
        } else {
            return res.status(400).json({ message: 'Invalid user' })
        }
    })


})

module.exports = router