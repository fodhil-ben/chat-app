const express = require('express')
const verifyAuth = require('../controllers/verifyAuth')
const db = require('../db')
const router = express.Router()
const jwt = require('jsonwebtoken')

router.use(verifyAuth)

router.get('/', (req, res) => {
    const authorization = req.headers.authorization
    const token = authorization.split(' ')[1]
    const { id } = jwt.verify(token, process.env.SECRET_KEY)
    sqlQuery = 'select * from groups where $1 = any(group_members);'
    db.query(sqlQuery, [id], (error, result) => {
        if (error) {
            console.log('Error getting the groups')
            res.status(500).json({ message: 'Internal Server Error !!' })
        }
        else {
            groups = result.rows
            res.json({ groups })
        }
    })
})

router.post('/', (req, res) => {
    const { group_name, group_members } = req.body
    const authorization = req.headers.authorization
    const token = authorization.split(' ')[1]
    const { id } = jwt.verify(token, process.env.SECRET_KEY)
    if (!id || !group_name || !group_members || !Array.isArray(group_members)) {
        console.log('Error: User does n')
        return res.status(400).json({ messageError: 'Parameter Missing !!' })
    }
    values = [... new Set(group_members)]
    areAllIntegers = values.every(value => Number.isInteger(value, 10));
    if (!areAllIntegers || values.length === 0) {
        console.log('Error: User does not exi')
        return res.status(400).json({ messageError: "Parameter Error !!!" })
    }
    sqlQuery = `select id from users where id in (${values});`
    db.query(sqlQuery, (error, result) => {
        if (error) {
            console.log('Error creating group !')
            console.log(sqlQuery)
            return res.status(501).json({ message: 'Internal Server Error !!', error })
        } else if (result.rows.length !== values.length) {
            console.log('Error: User does not exists !!')
            return res.status(400).json({ messageError: 'Error: User does not exists !!' })
        }
        else {
            sqlQuery = 'select group_id from groups where group_name = $1'
            db.query(sqlQuery, [group_name], (error, result) => {
                if (error) {
                    console.log(sqlQuery)
                    console.log('Error creating group !!', error)
                    res.status(502).json({ message: 'Internal Server Error !!' })
                } else if (result.rows.length !== 0) {
                    console.log('group already exists')
                    res.status(403).json({ messageError: 'group already exist !' })
                } else {
                    sqlQuery = 'insert into groups (group_name, group_members, owner) values ($1, $2, $3) returning *'

                    db.query(sqlQuery, [group_name, values, id], (error, result) => {
                        if (error) {
                            console.log(sqlQuery)
                            console.log('Error creating group !!!', error)
                            res.status(503).json({ message: 'Internal Server Error !!' })
                        } else {
                            res.json({ message: 'Group created Successfully !', group: result.rows })
                        }
                    })
                }
            })
        }
    })
})


router.delete('/', (req, res) => {
    const { group_id, group_name } = req.body
    const authorization = req.headers.authorization
    const token = authorization.split(' ')[1]
    const { id } = jwt.verify(token, process.env.SECRET_KEY)
    if (!id || !group_id || !group_name) {
        return res.status(400).json({ message: 'Parameter Missing !!' })
    }
    sqlQuery = 'select group_id, group_members, owner from groups where group_name = $1 and group_id = $2;'
    db.query(sqlQuery, [group_name, group_id], (error, result) => {
        if (error) {
            console.log('Error getting group !')
            return res.status(500).json({ message: 'Internal Server Error !!' })
        } else if (result.rows.length === 0) {
            return res.status(403).json({ messageError: 'group does not exist !' })
        } else if (!result.rows[0].group_members.includes(id)) {
            return res.status(403).json({ messageError: 'Unauthorized: You are not member in this group !!' })
        } else if (result.rows[0].owner !== id) {
            return res.status(403).json({ messageError: 'Unauthorized: You are not the owner of this group !!' })

        } else {
            sqlQuery = 'delete from groups where group_id = $1 and group_name = $2;'
            db.query(sqlQuery, [group_id, group_name], (error, result) => {
                if (error) {
                    console.log(error)
                    console.log('Error deleting group !!')
                    return res.status(500).json({ message: 'Internal Server Error !!' })
                }
                else {
                    return res.json({ message: 'Group deleted Successfully !!!', group_id })
                }
            })
        }
    })
})

//edit the name 
router.put('/', (req, res) => {
    const { group_id, oldGroup_name, group_name } = req.body
    const authorization = req.headers.authorization
    const token = authorization.split(' ')[1]
    const { id } = jwt.verify(token, process.env.SECRET_KEY)
    if (!id || !group_id || !group_name || !oldGroup_name) {
        return res.status(404).json({ messageError: 'Parameter Missing !!' })
    }
    //check if is member
    sqlQuery = 'select group_id, group_members from groups where group_id = $1 and group_name=$2;'
    sqlQuery2 = 'select group_id, group_members from groups where group_name = $1;'

    db.query(sqlQuery2, [group_name], (error, result) => {
        if (error) {
            console.log(sqlQuery2)
            console.log('Error getting group !!!')
            return res.status(500).json({ message: 'Internal Server Error !!' })
        }
        else if (result.rows.length !== 0) {
            console.log(sqlQuery2, oldGroup_name)
            return res.status(403).json({ messageError: 'group already exist !' })
        } else {
            db.query(sqlQuery, [group_id, oldGroup_name], (error, result) => {
                if (error) {
                    console.log(sqlQuery, [group_id])
                    console.log('Error getting group !!')
                    return res.status(500).json({ message: 'Internal Server Error !!' })
                }
                else if (result.rows.length === 0) {
                    console.log(sqlQuery, [group_id], 'does not exist')
                    return res.status(403).json({ messageError: 'group does not exist !' })
                }
                else if (!result.rows[0].group_members.includes(id)) {
                    return res.status(403).json({ messageError: 'Unauthorized: You are not member in this group !!' })
                } else {

                    sqlQuery = 'update groups set group_name = $1 where group_id = $2 returning (group_name, group_members, owner);'
                    db.query(sqlQuery, [group_name, group_id], (error, result) => {
                        if (error) {
                            console.log('Error editing group !!')
                            return res.status(500).json({ message: 'Internal Server Error !!' })
                        }
                        else {
                            return res.json({ message: 'Group edited Successfully !', group: result.rows[0] })
                        }
                    })
                }

            })
        }
    })
})

router.put('/add_user', (req, res) => {
    const { newUserId, group_id } = req.body
    token = req.headers.authorization.split(' ')[1]
    const { id } = jwt.verify(token, process.env.SECRET_KEY)
    if (!id || !newUserId || !group_id || isNaN(newUserId)) {
        console.log(id, newUserId, group_id)
        return res.status(404).json({ messageError: 'Missing Parameter !!' })
    }
    sqlQuery = 'select group_members from groups where group_id = $1'
    db.query(sqlQuery, [group_id], (error, result) => {
        if (error) {
            console.log(sqlQuery2)
            console.log('Error getting group !!!')
            return res.status(500).json({ message: 'Internal Server Error !!' })
        } else if (result.rowCount === 0) {
            return res.status(404).json({ messageError: 'group does not exist !!' })
        } else if (!result.rows[0].group_members.includes(id)) {
            return res.status(403).json({ messageError: 'Unauthorized: You are not member in this group !!' })
        } else if (result.rows[0].group_members.includes(newUserId)) {
            return res.status(404).json({ messageError: 'User Already in groups !' })
        } else {
            sqlQuery = 'select id from users where id = $1'
            db.query(sqlQuery, [newUserId], (error, result) => {
                if (error) {
                    console.log(error)
                    console.log('Error adding group !!!')
                    return res.status(500).json({ message: 'Internal Server Error !!' })
                } else if (result.rowCount === 0) {
                    res.status(404).json({ messageError: 'User does not exist !' })
                } else {
                    sqlQuery = 'update groups set group_members = array_append(group_members, $1) where group_id = $2 returning (group_name, group_members, owner);'
                    db.query(sqlQuery, [newUserId, group_id], (error, result) => {
                        if (error) {
                            console.log(sqlQuery2)
                            console.log('Error adding group !!!')
                            return res.status(500).json({ message: 'Internal Server Error !!' })
                        } else {
                            return res.json({ message: 'user added successfully', group: result.rows[0] })
                        }
                    })

                }
            })
        }
    })

})

module.exports = router