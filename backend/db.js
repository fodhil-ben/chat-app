const { Client } = require('pg')
const dotenv = require("dotenv");
dotenv.config();

if (process.env.NODE_ENV === 'production') {

    const client = new Client({
        connectionString: process.env.POSTGRES_URL + "?sslmode=require",
    })
}
else {
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    })

}



module.exports = client

//tables

//users => id p key , username, email, password
//groups => group_id p key, group_name, group_members
//messages => msg_id p key, sender_id f key=> users(id), group_id f key=> users(id), message, created_at


// create table messages(message_id serial primary key, sender_id int references users(id), group_id int references groups(group_id) ON DELETE CASCADE, message varchar(255), created_at timestamp);

// create table users(id serial primary key, username varchar(60), email varchar (60), password varchar(60));
// create table groups(group_id serial primary key, owner integer references users(id), group_name varchar(60), group_members INTEGER[]) ;