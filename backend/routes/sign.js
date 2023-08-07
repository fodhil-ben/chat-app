const express = require('express')
const bcrypt = require('bcrypt')
const db = require('../db')

const router = express.Router()

router.post('/', async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Parameter missing !' })
    }
    try {
        const hashPwd = await bcrypt.hash(password, 10)
        sqlQuery = 'select username from users where username=$1;'

        db.query(sqlQuery, [username], (error, result) => {
            if (error) {
                console.log(`Error getting username: ${error}`)
                return res.status(500).json({ message: 'Internal Server Error !!' })
            }
            else if (result.rows.length !== 0) {
                res.status(403).json({ message: 'user already exist !' })
            }
            else {
                sqlQuery = 'insert into users (username, email, password) values ($1, $2, $3);'
                db.query(sqlQuery, [username, email, hashPwd], (err, result) => {
                    if (err) {
                        console.log(err)
                        console.log('Error inserting a new user')

                        res.status(500).json({ message: 'Internal Server Error !!' })
                    }
                    else res.json({ message: 'Success: user created' })
                })
            }
        })
    }
    catch (errors) {
        res.status(500).json({ message: 'internal server error' })
        return console.log('Error: ', errors)
    }
})

module.exports = router