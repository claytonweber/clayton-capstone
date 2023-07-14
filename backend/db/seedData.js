const client = require('./client');

async function dropTables() {
    try {
        console.log('Dropped Tables');
        await client.query(`
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS books;
        `);
    } catch(error) {
        console.log(error)
    }
}

async function createTables() {
    try {
        console.log('Building Tables');
        await client.query(`
        CREATE TABLE users(
            "userId" SERIAL PRIMRY KEY, 
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
        );
        CREATE TABLE books(
            "bookId" SERIAL PRIMARY KEY,
            "bookName" VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            genre VARCHAR(255) NOT NULL
        );
    `);
    } catch(error) {
        console.log(error);
    }
}

async function createBookData() {
    try {
        console.log('Creating Book Data');
        await client.query(`
        INSERT INTO users(username, password, email)
        VALUES ('claytonweber', 'greatpassword', 'clayton@gmail.com);
        INSERT INTO users(username, password, email)
        VALUES ('mike', 'badpassword', 'mike@gmail.com);
        INSERT INTO users(username, password, email)
        VALUES ('zach', 'mediumpassword', 'zach@gmail.com);`)
        await client.query(`
        INSERT INTO books('bookName', 'author', 'genre')
        VALUES ('The Golden Compass', 'Philip Pullman', 'fantasy');
        INSERT INTO books('bookName', 'author', 'genre')
        VALUES ('Game of Thrones', 'George RR Martin, 'fantasy');
        INSERT INTO books('bookName', 'author', 'genre')
        VALUES ('Haunting of Hill House', 'Shirley Jackson', 'horror');
        `)
    }
}

async function fetchAllBooks() {
    try {
        const {rows} = await client.query(`
            SELECT * FROM books;
        `);
        return rows;
    } catch(error) {
        console.log(error);
    }
}
//not sure if I shuold return password
async function createNewUser(user) {
    try {
        const { rows } = await client.query(
            `
                INSERT INTO users(username, name, password, email)
                VALUES ($1, $2, $3, $4)
                RETURNING "userId", username, password, amil
            `,
            [
                user.username,
                user.name,
                user.password,
                user.email
            ]
        );
        if(rows.length) {
            return rows[0];
        }
    } catch(error) {
        console.log(error);
    }
}

async function fetchAllUsers() {
    try {
        const { rows } = await client.query(`
            SELECT * FROM users;
        `
        );

        if(rows.length) {
            return rows;
        }
    } catch(error) {
        console.log(error);
    }
}

async function fetchUsersById(userId) {
    try {
        const { rows } = await client.query(`
                SELECT * FROM users
                WHERE username = $1;
        `, [userId])

        if(rows.length) {
            return rows[0];
        }
    } catch(error) {
        console.log(error);
    }
}

//new user (POST)
//fetch  user by username (GET)
//fetch all users(GET)
//fetch user by id (GET)

async function rebuildDB() {
    try {
        client.connect();
        await dropTables();
        await createTables();
        await createBookData();
        await fetchAllBooks();
        await createNewUser();
        await fetchAllUsers();
        await fetchUsersById();
    } catch(error) {
        console.log(error);
    }
}

module.exports = { 
    rebuildDB
};