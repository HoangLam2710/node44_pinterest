CREATE DATABASE node44_pinterest;
use node44_pinterest;

CREATE TABLE users(
	uid VARCHAR(36) PRIMARY KEY,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	full_name VARCHAR(50) NOT NULL,
	age INT,
	avatar VARCHAR(255),
	bio TEXT,
	website VARCHAR(255),
	user_name VARCHAR(50),
	refresh_token VARCHAR(255)
);

CREATE TABLE posts(
	pid VARCHAR(36) PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	img_url VARCHAR(255) NOT NULL,
	description TEXT,
	additional_website VARCHAR(255),
	uid VARCHAR(36),
	FOREIGN KEY(uid) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE TABLE comments(
	cid VARCHAR(36) PRIMARY KEY,
	content TEXT NOT NULL,
	create_at DATETIME,
	uid VARCHAR(36),
	pid VARCHAR(36),
	FOREIGN KEY(uid) REFERENCES users(uid) ON DELETE CASCADE,
	FOREIGN KEY(pid) REFERENCES posts(pid) ON DELETE CASCADE
);

CREATE TABLE save_post(
	uid VARCHAR(36),
	pid VARCHAR(36),
	PRIMARY KEY (uid, pid),
	create_at DATETIME NOT NULL,
	FOREIGN KEY(uid) REFERENCES users(uid) ON DELETE CASCADE,
	FOREIGN KEY(pid) REFERENCES posts(pid) ON DELETE CASCADE
);

CREATE TABLE code_forgot_password(
	coid VARCHAR(36) PRIMARY KEY,
	code VARCHAR(6) NOT NULL,
	expire_at DATETIME NOT NULL,
	uid VARCHAR(36),
	FOREIGN KEY(uid) REFERENCES users(uid) ON DELETE CASCADE
);

DROP TABLE save_post
DROP TABLE comments
DROP TABLE posts
DROP TABLE users