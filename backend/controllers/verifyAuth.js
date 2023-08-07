const db = require('../db')
const jwt = require('jsonwebtoken')

const verifyAuth = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: 'Unauthorized: Authorization  required' })
    }

    token = authorization.split(' ')[1]
    try {
        const { id } = jwt.verify(token, process.env.SECRET_KEY)
        sqlQuery = 'select username, password from users where id=$1'
        db.query(sqlQuery, [id], (error, result) => {
            if (error) {
                console.log(`Error getting username and password`)
                res.status(500).json({ message: 'Interbal Server Error !!' })
            }
            else if (result.rows.length !== 0) {
                req.username = result.rows[0].username
                req.password = result.rows[0].password
                next()
            }
        })
    }
    catch (err) {
        res.status(401).json({ error: 'Unauthorized: Authorization  required' })
    }
}

//to use to prevent access to chat

module.exports = verifyAuth