CREATE TABLE regUser (
  id int PRIMARY KEY AUTO_INCREMENT,
  username varchar(50) NOT null UNIQUE,
  password_hash varchar(1000) NOT null,
  full_name varchar(100) NOT null 
  )
  
  
