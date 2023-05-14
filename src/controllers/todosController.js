const { db } = require("../db");
const { responseMaker } = require("../helpers/helper");

class TodoController {
  static async getAll(req, res, next) {
    try {
      const { activity_group_id } = req.query;
      const data = await db.query(  // added condition to add a WHERE condition depending on the request's query
        `
              SELECT *, todo_id as 'id' FROM todos ${activity_group_id ? `WHERE activity_group_id = ${activity_group_id}` : ''}
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
            SELECT *, todo_id as 'id'
            FROM todos t 
            WHERE todo_id = ${id}
        `
      )

      if (!data[0].length) {  // If no data is found
        return res.status(404).json(responseMaker('Not Found', data[0], `Todo with ID ${id} Not Found`))
      }

      data[0][0].is_active = data[0][0].is_active ? true : false  // change value of is_active to bool instead of binary. It's pretty much nitpicking at this point.
      return res.json(responseMaker('Success', data[0]))
    } catch (err) {
      next(err)
    }
  }

  static async create(req, res, next) {
    try {
      const { title, activity_group_id, is_active = true } = req.body;
      if (!title) {
        return res.status(400).json(responseMaker('Bad Request', {}, `title cannot be null`))
      }
      else if (!activity_group_id) {
        return res.status(400).json(responseMaker('Bad Request', {}, `activity_group_id cannot be null`))
      }


      const connection = await db.getConnection();
      await connection.beginTransaction()

      const create = await connection.query(  // create new entry in table
        ` 
          INSERT INTO todos
          (title, activity_group_id, is_active, priority)
          VALUES
          ('${title}', '${activity_group_id}', ${is_active}, 'very-high')
          `
      )
      await connection.commit()

      const data = await connection.query(  // fetch last (created) entry from table
        `
          SELECT *, todo_id as 'id' FROM todos WHERE todo_id = ?
        `,
        create[0].insertId
      )

      data[0][0].is_active = data[0][0].is_active ? true : false  // change value of is_active to bool instead of binary. It's pretty much nitpicking at this point.

      return res.status(201).json(responseMaker('Success', data[0]))
    } catch (err) {
      next(err)
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { title, activity_group_id, is_active, priority } = req.body;

      const data = await db.query(
        `
            SELECT *, todo_id as 'id' FROM todos WHERE todo_id =  ${id}
        `
      )
      if (!data[0].length) {  // If no data is found
        return res.status(404).json(responseMaker('Not Found', data[0], `Todo with ID ${id} Not Found`))
      }

      const connection = await db.getConnection();
      await connection.beginTransaction()
      const update = await connection.query(
        `
        UPDATE todos
        SET title = '${title ?? data[0][0].title}', activity_group_id = ${activity_group_id ?? data[0][0].activity_group_id}, is_active = ${(is_active ?? data[0][0].is_active) ? 1 : 0}, priority = '${priority ?? data[0][0].priority}' WHERE todo_id = ${id}; 
        `
      )
      await connection.commit()

      const updatedData = await connection.query(
        `
            SELECT *, todo_id as 'id' FROM todos WHERE todo_id =  ${id}
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
            SELECT *, todo_id as 'id' FROM todos WHERE todo_id =  ${id}
        `
      )
      if (!data[0].length) {  // If no data is found
        return res.status(404).json(responseMaker('Not Found', data[0], `Todo with ID ${id} Not Found`))
      }

      const connection = await db.getConnection();
      await connection.beginTransaction()

      const deleteData = await connection.query(
        `
        DELETE FROM todos WHERE todo_id = ${id}
        `
      )
      await connection.commit()

      return res.json(responseMaker('Success', {}, 'Success', true))
    } catch (err) {
      next(err)
    }
  }
}

module.exports = TodoController 