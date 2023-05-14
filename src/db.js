const mysql = require('mysql2/promise');

// koneksi ke database
const db = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'root',
  database: process.env.MYSQL_DBNAME || 'hello',
  password: process.env.MYSQL_PASSWORD || 'root',
  waitForConnections: true,
  connectionLimit: 5000,
  queueLimit: 5000,
});

// migrasi database
const migration = async () => {
  try {
    const activityGroups = await db.query(
      `
            CREATE TABLE IF NOT EXISTS activities (
              activity_id int not null auto_increment,
              title varchar(255) not null,
              email varchar(255) not null,
              createdAt TIMESTAMP default current_timestamp,
              updatedAt TIMESTAMP default current_timestamp,
              primary key (activity_id)
              )
        `
    );

    const todos = await db.query(
      `
            CREATE TABLE IF NOT EXISTS todos (
              todo_id int not null auto_increment,
              activity_group_id int not null,
              title varchar(255) not null,
              is_active bool,
              priority varchar(255),
              createdAt TIMESTAMP default current_timestamp,
              updatedAt TIMESTAMP default current_timestamp,
              primary key (todo_id),
              CONSTRAINT fk_group
              FOREIGN KEY(activity_group_id)
                REFERENCES activities(activity_id)
                ON UPDATE CASCADE
                ON DELETE CASCADE
              );`

    )
    console.log('Running Migration Successfully!');
  } catch (err) {
    throw err;
  }
};

module.exports = { db, migration };