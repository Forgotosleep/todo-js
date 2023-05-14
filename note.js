/* 
  TODO LIST - JS version
    There are two models, 'Todo' and 'Activity Groups', I'm going to name their tables 'todo' and 'activityGroups'.
    Relation between the two models is probably one-to-many, one being Activity Group, many being Todo. That's the working theory atm.
    
    Todo:
      - id
      - activity_group_id
      - title
      - is_active (bool)
      - priority (enum?)
      - createdAt
      - updatedAt

    Activity Group:
      - id
      - title
      - email
      - createdAt
      - updatedAt

forgotosleep/todo-js
https://devcode.gethired.id/job/RIH732

docker run --name todo-js --network=host -e MYSQL_HOST=localhost -e MYSQL_USER=root -e MYSQL_PASSWORD=kucing94 -e MYSQL_DBNAME=todo -p 3030:3030 todo-js-brian:latest

sudo docker build --tag forgotosleep/todo-js:latest --network=host .
sudo docker push  forgotosleep/todo-js:latest

Todo JS - Brian
forgotosleep/todo-js

      const connection = await db.getConnection();
      await connection.beginTransaction()

      await connection.commit()

*/

/* 

{
    "status": "Success",
    "message": "Success",
    "data": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 14,
        "info": "",
        "serverStatus": 3,
        "warningStatus": 0
    }
}


*/