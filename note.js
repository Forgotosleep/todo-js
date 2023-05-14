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



*/