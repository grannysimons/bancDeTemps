# Express app setup

### 1. Express.js

`express --view=hbs <projectname>`

Sets up express.js app boilerplate with Handlebars as view engine.

##### In project folder:

`npm i`

Installs dependencies.

### 2. nodemon

`npm i -D nodemon`

##### In package.json:

```json
"scripts": {
  "watch": "nodemon ./bin/www"
  }
```

##### In app.js:

`const mongoose = require('mongoose');`

### 3. mongoose

Mongoose allows us to communicate with the mongoDB database.

`npm i mongoose`

##### In app.js:

```javascript
const mongoose = require('mongoose');
```

##### To connect to database:

```javascript
mongoose.connect('mongodb://localhost/<dbName>');
```

### 4. bcrypt

`npm i bcrypt`

##### In auth.js:

```javascript
const bcrypt = require('bcrypt');
const bcryptSalt = <number>;
```

##### To encrypt password:

```javascript
const salt = bcrypt.genSaltSync(bcryptSalt);
const encryptedPassword = bcrypt.hashSync(<passwordToEncrypt>, salt);
```

##### To check if password is correct:

```javascript
bcrypt.compareSync(<password>, <user.password>);
```

##### express-session & connect-mongo

express-session allows for all the session functionality.
connect-mongo allows us to save sessions in database.

`npm i express-session connect-mongo`

##### In app.js:

```javascript
const session = require('express-session');
```

```javascript
const MongoStore = require('connect-mongo')(session);
```

```javascript
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60,
  }),
  secret: '<string>',
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  }
}));
```

```javascript
app.use((req, res, next) => {
app.locals.currentUser = req.session.currentUser;
next();
})
```

### 5. express-flash

connect-flash lets us send messages through sessions/cookies.

`npm i express-flash`

##### In app.js:

```javascript
const flash = require('express-flash);
app.use(flash());
```

##### To send messages:

```javascript
req.flash('<messageName>', '<message>');
```