const express = require('express')
const verifyAuth = require('../controllers/verifyAuth')
const db = require('../db')
const router = express.Router()
const jwt = require('jsonwebtoken')
router.use(verifyAuth)
const bcrypt = require('bcrypt')
router.get('/', (req, res) => {
    sqlQuery = 'select id, username, email from users;'
    db.query(sqlQuery, (error, result) => {
        if (error) {
            console.log('Error getting the users')
            res.status(500).json({ message: 'Internal Server Error !!' })
        }
        else {
            users = result.rows
            res.json({ users })
        }
    })
})


//for deleteing you account implement in the fron end later
//do i need to check before the deletion ???

// router.delete('/', (req, res) => {
//     const { username, email, password } = req.body
//     if (!username || !email || !password) {
//         return res.status(404).json({ message: 'Parameter Missing !!' })
//     }
//     sqlQuery = 'select * from users where username = $1 and email = $2 and password=$3;'
//     db.query(sqlQuery, [username, email, password], (error, result) => {
//         if (error) {
//             console.log('Error getting user !!')
//             return res.status(500).json({ message: 'Internal Server Error !!' })
//         } else if (result.rows.length === 0) {
//             return res.status(404).json({ message: 'Account does not exist !' })
//         } else {
//             sqlQuery = 'delete from users where username = $1 and email = $2 and password=$3;'
//             db.query(sqlQuery, [username, email, password], (error, result) => {
//                 if (error) {
//                     console.log('Error deleting user !!')
//                     return res.status(500).json({ message: 'Internal Server Error !!' })
//                 }
//                 else {
//                     return res.json({ message: 'Account deleted Successfully !!!' })
//                 }
//             })
//         }
//     })
// })



//edit the name put(/edit_name)

router.put('/editUsername', (req, res) => {
    const { oldUsername, username } = req.body
    if (!oldUsername || !username) {
        return res.status(404).json({ errorMessage: 'Parameter Missing !!' })
    }
    authorization = req.headers.authorization
    token = authorization.split(' ')[1]
    const { id } = jwt.verify(token, process.env.SECRET_KEY)
    sqlQuery = "select * from users where username = $1;"
    db.query(sqlQuery, [username.trim()], (error, result) => {

        if (error) {
            console.log(error)
            console.log('Error getting user')
            return res.status(500).json({ message: 'Internal Server Error !!!' })
        } else if (result.rows.length !== 0) {
            return res.status(404).json({ errorMessage: 'Username already used !' })
        } else {
            sqlQuery = 'update users set username=$1 where id=$2 and username=$3 returning username;'
            db.query(sqlQuery, [username, id, oldUsername], (error, result) => {
                if (error) {
                    console.log('error editing the user !')
                    console.log(error)
                    return res.status(500).json({ message: 'Internal Server Error !!' })
                } else if (result.rows.length === 0) {
                    console.log('Unauthorized !!')
                    return res.status(401).json({ errorMessage: 'Old Username Incorrect !!!' })
                }
                else {
                    console.log('edited successfully')
                    return res.json({ message: 'username edited successfully', username: result.rows[0] })
                }
            })
        }
    })
})

router.put('/editEmail', (req, res) => {
    const { oldEmail, email } = req.body
    if (!oldEmail || !oldEmail) {
        return res.status(404).json({ errorMessage: 'Parameter Missing !!' })
    }
    authorization = req.headers.authorization
    token = authorization.split(' ')[1]
    const { id } = jwt.verify(token, process.env.SECRET_KEY)
    sqlQuery = "select * from users where email = $1;"
    db.query(sqlQuery, [email.trim()], (error, result) => {

        if (error) {
            console.log(error)
            console.log('Error getting user')
            return res.status(500).json({ message: 'Internal Server Error !!!' })
        } else if (result.rows.length !== 0) {
            return res.status(404).json({ errorMessage: 'Email already used !' })
        } else {
            sqlQuery = 'update users set email=$1 where id=$2 and email=$3 returning email;'
            db.query(sqlQuery, [email, id, oldEmail], (error, result) => {
                if (error) {
                    console.log('error editing the email !')
                    console.log(error)
                    return res.status(500).json({ message: 'Internal Server Error !!' })
                } else if (result.rows.length === 0) {
                    return res.status(401).json({ errorMessage: 'Old Email Incorrect !!!' })
                }
                else {
                    console.log('edited successfully')
                    return res.json({ message: 'Email edited successfully', email: result.rows[0] })
                }
            })
        }
    })
})

router.put('/editPassword', (req, res) => {
    const { oldPassword, password } = req.body
    if (!oldPassword || !password) {
        return res.status(404).json({ errorMessage: 'Parameter Missing !!' })
    }
    authorization = req.headers.authorization
    token = authorization.split(' ')[1]
    const { id } = jwt.verify(token, process.env.SECRET_KEY)

    sqlQuery = 'select password from users where id = $1;'
    db.query(sqlQuery, [id], (error, result) => {
        if (error) {
            console.log('error editing the password !')
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error !!' })
        } else if (result.rowCount === 0) {
            return res.status(401).json({ errorMessage: 'Unauhorized you are not allowed to do that !!!' })
        } else {
            bcrypt.compare(oldPassword, result.rows[0].password, async (err, compareResult) => {
                if (err) {
                    console.log('error comparing the password !')
                    console.log(error)
                    return res.status(500).json({ message: 'Internal Server Error !!' })
                }
                else if (!compareResult) {
                    return res.status(401).json({ errorMessage: 'Old Password Incorrect' })
                }
                else {
                    sqlQuery = 'update users set password=$1 where id=$2'
                    const hashPwd = await bcrypt.hash(password, 10)
                    db.query(sqlQuery, [hashPwd, id], (error, result) => {
                        if (error) {
                            console.log('error editing the password !')
                            console.log(error)
                            return res.status(500).json({ message: 'Internal Server Error !!' })
                        }
                        else {
                            console.log('edited successfully')
                            return res.json({ message: 'Password edited successfully', password: password })
                        }
                    })
                }
            })
        }

    })


})

//edit the email put(/edit_email)
//edit the pass put(/edit_pass)


module.exports = router