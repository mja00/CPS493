# Peeper

### Totally not like the *other* bird related social media platform.

## Table Of Contents
- [What is Peeper?](#what-is-peeper)
- [What isn't Peeper?](#what-isnt-peeper)
- [What is Peeper missing?](#what-is-peeper-missing)
- [What will Peeper have in the future?](#what-will-peeper-have-in-the-future)
- [Current Bugs and Issues](#current-bugs-and-issues)
- [Technologies Used](#technologies-used)
  - [Front-End](#front-end)
  - [Back-End](#back-end)
  - [Development Environment](#development-environment)
- [ERD Diagram](#erd-diagram)
  - [User Table](#user-table)
  - [Peep Table](#peep-table)
  - [Reply Table](#reply-table)
  - [Like Table](#like-table)
- [Installation](#installation)
- [Screenshots](#screenshots)

### What is Peeper?

Peeper is a social media platform written in JavaScript that allows you to create Peeps(posts), likes Peeps and reply to
them.
When a Peep is posted it's shown to all visitors of the website, sorted by newest Peep first.
Registered users can then like and/or reply to Peeps.

### What isn't Peeper?

Peeper is **not** a replacement for your favorite social media platform.
For one, it's missing a lot of the features that your favorite platform has.
However, you can still use it to post your favorite text based memes.

### What is Peeper missing?

Peeper is missing the following features:

- Image based Peeps
- Peeps with a link
- Peeps with a video
- Peeps with a quote
- Peeps with a code block
- Replies containing any of the above
- Peeps with a poll
- Profiles
- Notifications
- Search
- ...and more!

### What will Peeper have in the future?

Peeper will have the following features in the immediate future:

- Image based Peeps
- Peeps with a link
- Peeps with a video

## Current Bugs and Issues

- There is no security whatsoever.
- There is no front-end way to delete Peeps or replies.
- There is no way to edit Peeps or replies.
- Every so often the database will fail to return anything.

## Technologies Used

### Front-end

- [EJS](https://ejs.co/)
- [jQuery](https://jquery.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/)

### Back-end

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Express Sessions](https://www.npmjs.com/package/express-session)
- [Connect-Flash](https://www.npmjs.com/package/connect-flash)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)

### Development Environment

- [JetBrains WebStorm](https://www.jetbrains.com/webstorm/)
- [Postman](https://www.getpostman.com/)
- [Chrome DevTools](https://www.google.com/chrome/devtools/)
- [pgAdmin 4](https://www.pgadmin.org/)
- [GitHub](https://www.github.com)

## ERD Diagram

![ERD](screenshots/ERD.png)

### User Table

This table contains all the users that have registered with Peeper.

| Column    | Type         | Description       |
|-----------|--------------|-------------------|
| id        | integer      | Primary Key       |
| username  | varchar(255) | Username          |
| password  | varchar(255) | Password          |
| firstname | varchar(255) | User's first name |
| lastname  | varchar(255) | User's last name  |
| birthdate | varchar(255) | User's birthdate  |

#### Business Rules
A User may Like many Peeps but not the same Peep twice.  
A User may Reply to many Peeps.  
A User may post many Peeps.  

### Peep Table

This table contains all the Peeps that have been posted.

| Column     | Type      | Description                     |
|------------|-----------|---------------------------------|
| id         | integer   | Primary Key                     |
| user_id    | integer   | Foreign Key                     |
| message    | text      | The message in the Peep         |
| created_at | timestamp | The time the Peep was created   |
| updated_at | timestamp | The time the Peep was updated   |

#### Business Rules
A Peep may be liked by many Users.  
A Peep may be replied to by many Users.  
A Peep must be posted by a User.  

### Reply Table

This table contains all the replies to Peeps. This is a one-to-many relationship.
With one row being a single reply to a single Peep.

| Column     | Type    | Description                     |
|------------|---------|---------------------------------|
| id         | integer | Primary Key                     |
| peep_id    | integer | Foreign Key                     |
| user_id    | integer | Foreign Key                     |
| message    | text    | The message in the reply        |

#### Business Rules
A Reply must be posted by a User.  
A Reply must be posted to a Peep.  

### Like Table

This table contains all the likes to Peeps. This is a one-to-many relationship.
With one row being a single like to a single Peep.

| Column     | Type         | Description                     |
|------------|--------------|---------------------------------|
| id         | integer      | Primary Key                     |
| peep_id    | integer      | Foreign Key                     |
| user_id    | integer      | Foreign Key                     |

#### Business Rules
A Like must be created by a User.  
A Like must belong to a Peep.  
 

## Installation

These instructions will install Peeper on your machine. Some instructions will be specific to your operating system.

### General Dependencies
- [Node.js](https://nodejs.org/) (Required) - Backend server
- [npm](https://www.npmjs.com/) (Required) - Package manager
- [PostgreSQL](https://www.postgresql.org/) (Required) - Database
- [git](https://git-scm.com/) (Required) - Version control

### Cloning
To clone the Peeper repository, run the following command in your terminal:
```sh
git clone https://github.com/mja00/CPS493.git
# or if you prefer to use SSH
# git clone git@github.com:mja00/CPS493.git
```

**Note:** If you're using WSL2, clone this repo in your home directory. Mounted drives
in WSL2 have degraded performance.

### MacOS Installation
Installation is simple with [Homebrew](https://brew.sh/). First, we need to install node and npm.

```sh
brew install node
brew install npm
# Verify that node and npm are installed
node -v
npm -v
```

Then, we can install our dependencies.
```sh
# Graphical Postgres, if you do not want a graphical Postgres, you are on your own!
brew install --cask postgres-unofficial
# Then install the node dependencies
npm install
```

Afterwards you'll need to launcher Postgres.app and create a new database. By default we look for
`web-dev-project` and the username and password are `postgres`.

### Ubuntu Installation
Installation is simple with [apt](https://www.apt-get.com/). First, we need to install node and npm.

```sh
sudo apt-get install nodejs npm
```

Then, we can install our dependencies.

```sh
# Install Postgres
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql.service
# Then install the node dependencies
npm install
```
#### Configuring Postgres

After the installation, you'll most likely need to start Postgres.
```sh
sudo pg_ctlcluster 12 main start
```

We then need to setup users and databases.
Login to Postgres as the default user with the following command:
```sh
sudo -u postgres psql
```
When presented with the `postgres=#` prompt, you can run the following commands, with `postgres`
as the password.
```sh
postgres=# \password postgres
Enter new password:
Enter it again:
\quit
```
Then create your database.

### Configuring Peeper
The settings for the database are located in the `routes/queries.js` file.
Edit any of the `db` consts near the top to match your database settings.
These are the default settings:
```js
const dbUser = 'postgres'
const dbPassword = 'postgres'
const dbHost = 'localhost'
const dbPort = 5432
const dbName = 'web-dev-project'
```

### Running Peeper
To run Peeper, run either of the following commands in your terminal:
```sh
# For development
npm run dev
# For production
npm run start
```

Navigate to [localhost:3000](http://localhost:3000/) in your browser.
Upon the first loading of the index it will initalize the database.
You're ready to Peep!

## Screenshots

![Homepage](screenshots/homepage.png)
![Login](screenshots/login.png)
![Register](screenshots/register.png)
![New Peep](screenshots/newpeep.png)
![New Reply](screenshots/newreply.png)