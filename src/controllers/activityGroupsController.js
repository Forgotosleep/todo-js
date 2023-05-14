const { db } = require("../db");
const { responseMaker } = require("../helpers/helper");

class ActivityGroupController {
  static async getAll(req, res, next) {
    try {
      const data = await db.query(
        `
            SELECT *, activity_id as 'id' FROM activities
        `
      )
      return res.json(responseMaker('Success', data))
    } catch (err) {
      next(err)
    }
  }

  static async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const data = await db.query(
        `
            SELECT *, activity_id as 'id' FROM activities WHERE activity_id = ${id}
        `
      )
      if (!data[0].length) {  // If no data is found
        return res.status(404).json(responseMaker('Not Found', data[0], `Activity with ID ${id} Not Found`))
      }
      return res.json(responseMaker('Success', data[0]))
    } catch (err) {
      next(err)
    }
  }

  static async create(req, res, next) {
    try {
      const { title, email } = req.body;
      if (!title) {
        return res.status(400).json(responseMaker('Bad Request', {}, `title cannot be null`))
      }

      const connection = await db.getConnection();
      await connection.beginTransaction()

      const create = await connection.query(  // create new entry in table
        `
              INSERT INTO activities
                (title, email)
              VALUES
                ('${title}', '${email}')
          `)

      await connection.commit()

      const data = await connection.query(  // fetch last (created) entry from table
        `
          SELECT *, activity_id as 'id' FROM activities WHERE activity_id = LAST_INSERT_ID()
        `
      )
      return res.status(201).json(responseMaker('Success', data[0]))
    } catch (err) {
      next(err)
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { title } = req.body;
      if (!title) {
        return res.status(400).json(responseMaker('Bad Request', {}, `title cannot be null`))
      }

      const data = await db.query(
        `
            SELECT *, activity_id as 'id' FROM activities WHERE activity_id =  ${id}
        `
      )
      if (!data[0].length) {  // If no data is found
        return res.status(404).json(responseMaker('Not Found', data[0], `Activity with ID ${id} Not Found`))
      }

      const connection = await db.getConnection();
      await connection.beginTransaction()

      const update = await connection.query(
        `
        UPDATE activities
        SET title = '${title}'
        WHERE activity_id = ${id}
        `
      )

      await connection.commit()


      const updatedData = await db.query(
        `
            SELECT *, activity_id as 'id' FROM activities WHERE activity_id =  ${id}
        `
      )
      return res.json(responseMaker('Success', updatedData[0]))

    } catch (err) {
      next(err)
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const data = await db.query(
        `
            SELECT *, activity_id as 'id' FROM activities WHERE activity_id =  ${id}
        `
      )
      if (!data[0].length) {  // If no data is found
        return res.status(404).json(responseMaker('Not Found', data[0], `Activity with ID ${id} Not Found`))
      }

      const connection = await db.getConnection();
      await connection.beginTransaction()

      const deleteData = await connection.query(
        `
        DELETE FROM activities WHERE activity_id = ${id}

        `
      )

      await connection.commit()

      return res.json(responseMaker('Success', {}, 'Success', true))
    } catch (err) {
      next(err)
    }
  }
}

module.exports = ActivityGroupController;