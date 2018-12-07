DROP TABLE task_possibility;
DROP TABLE comment_peer;
DROP TABLE user_group_members;
DROP TABLE submission;
DROP TABLE exam_task;
DROP TABLE task;
DROP TABLE teacher_exam;
DROP TABLE exam;
DROP TABLE user_group;
DROP TABLE user;

CREATE TABLE user(
  id VARCHAR(30) PRIMARY KEY,
  name VARCHAR(64),
  surname VARCHAR(64),
  email VARCHAR(128),
  born DATETIME,
  enrolled DATETIME
) ENGINE=InnoDB;

CREATE TABLE user_group(
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_creator VARCHAR(30) NOT NULL,
  name VARCHAR(64),
  CONSTRAINT `user_group_TO_creator` FOREIGN KEY (id_creator) REFERENCES user (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE user_group_members(
  id_user VARCHAR(30),
  id_group INT,
  PRIMARY KEY(id_user, id_group),
  CONSTRAINT `member_TO_user` FOREIGN KEY (id_user) REFERENCES user (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `group_TO_user_group` FOREIGN KEY (id_group) REFERENCES user_group (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE exam(
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_group INT,
  id_owner VARCHAR(30) NOT NULL,
  name VARCHAR(64),
  start_time DATETIME,
  deadline DATETIME,
  reviewable VARCHAR(30),
  num_shuffle INT,
  CONSTRAINT `exam_TO_owner` FOREIGN KEY (id_owner) REFERENCES user (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `exam_TO_group` FOREIGN KEY (id_group) REFERENCES user_group (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE teacher_exam(
  id_exam INT,
  id_teacher VARCHAR(30),
  PRIMARY KEY(id_exam, id_teacher),
  CONSTRAINT `teacher_exam_TO_exam` FOREIGN KEY (id_exam) REFERENCES exam (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teacher_exam_TO_user` FOREIGN KEY (id_teacher) REFERENCES user (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE task(
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_owner VARCHAR(30) NOT NULL,
  task_type VARCHAR(30),
  q_text VARCHAR(512),
  q_url VARCHAR(512),
  points INT,
  CONSTRAINT `task_TO_owner` FOREIGN KEY (id_owner) REFERENCES user (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE task_possibility(
  id_task INT,
  id_poss INT,
  q_possibility VARCHAR(256),
  PRIMARY KEY (id_task, id_poss),
  CONSTRAINT `qtask_pos_TO_qtask` FOREIGN KEY (id_task) REFERENCES task (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE exam_task(
  id_exam INT,
  id_task INT,
  PRIMARY KEY(id_exam, id_task),
  CONSTRAINT `exam_task_TO_exam` FOREIGN KEY (id_exam) REFERENCES exam (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `exam_task_TO_task` FOREIGN KEY (id_task) REFERENCES task (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE submission(
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_task INT NOT NULL,
  id_user VARCHAR(30) NOT NULL,
  id_exam INT NOT NULL,
  answer VARCHAR(512),
  completed BOOLEAN,
  comment VARCHAR(512),
  earned_points INT,
  CONSTRAINT `submission_TO_task` FOREIGN KEY (id_task) REFERENCES task (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `submission_TO_user` FOREIGN KEY (id_user) REFERENCES user (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `submission_TO_exam` FOREIGN KEY (id_exam) REFERENCES exam (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE comment_peer(
  id_submission INT,
  id_comment INT,
  comment VARCHAR(512),
  PRIMARY KEY(id_submission, id_comment),
  CONSTRAINT `comment_TO_submission` FOREIGN KEY (id_submission) REFERENCES submission (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
