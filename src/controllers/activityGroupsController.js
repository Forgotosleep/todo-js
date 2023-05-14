const { db } = require("../db");
const { responseMaker } = require("../helpers/helper");

class ActivityGroupController {
  static async getAll(req, res, next) {
    try {
      const data = await db.query(
        `
            SELECT * FROM activityGroups
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
            SELECT * FROM activityGroups WHERE id = ${id}
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
      const create = await db.query(  // create new entry in table
        `            
              INSERT INTO activityGroups
                (title, email)
              VALUES
                ('${title}', '${email}')
          `)

      const data = await db.query(  // fetch last (created) entry from table
        `
          SELECT * FROM activityGroups WHERE id = LAST_INSERT_ID()
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
            SELECT * FROM activityGroups WHERE id =  ${id}
        `
      )
      if (!data[0].length) {  // If no data is found
        return res.status(404).json(responseMaker('Not Found', data[0], `Activity with ID ${id} Not Found`))
      }

      const update = await db.query(
        `
          UPDATE activityGroups
          SET title = '${title}'
          WHERE id = ${id}
        `
      )
      const updatedData = await db.query(
        `
            SELECT * FROM activityGroups WHERE id =  ${id}
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
            SELECT * FROM activityGroups WHERE id =  ${id}
        `
      )
      if (!data[0].length) {  // If no data is found
        return res.status(404).json(responseMaker('Not Found', data[0], `Activity with ID ${id} Not Found`))
      }

      const deleteData = await db.query(
        `
          DELETE FROM activityGroups WHERE id = ${id}
        `
      )
      return res.json(responseMaker('Success', {}, 'Success', true))
    } catch (err) {
      next(err)
    }
  }
}

module.exports = ActivityGroupController;