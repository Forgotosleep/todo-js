const { db } = require("./db");

// migrasi database
const seed = async () => {
  try {
    const activityGroups = await db.query(
      `            
            INSERT INTO activities
              (title, email)
            VALUES
              ('group1', 'test@mail.com'),
              ('group2', 'tset@mial.com'),
              ('group3', 'ttse@mlia.com')
        `
    );

    const todos = await db.query(
      `
              INSERT INTO todos
                (activity_group_id, title, is_active, priority)
              VALUES
                ('1', 'Watch Starwars', true, 'very-high'),
                ('2', 'Code something new', true, 'very-high'),
                ('3', 'Create more pylons', true, 'high'),
                ('1', 'Perform cuttlefish surgery', false, 'medium')
              
            `
    )
    console.log('Running Seeder Successfully!');
  } catch (err) {
    throw err;
  }
};

module.exports = { seed };