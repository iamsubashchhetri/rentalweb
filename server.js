const express = require('express');
const app = express();
const Book = require('./models/book')
const bodyParser = require('body-parser');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const mongoose = require('mongoose');
const session = require("express-session");

const exphbs = require('express-handlebars');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to the database');
}).catch((err) => {
  console.log(`Error connecting to the database: ${err}`);
});

// Set up Handlebars
// Set up Handlebars
const hbs = exphbs.create({
    extname: 'hbs',
    helpers: {
      json: (context) => {
        return JSON.stringify(context);
      },
    },
    partialsDir: path.join(__dirname, '/views/partials')
  });
  

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  }));


// Set up middleware
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set up middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: false,
}));

// Set up views
app.set("views", path.join(__dirname, "views"));


// Set up routes
// const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const booksRouter = require("./routes/books");
const usersRouter = require("./routes/users");
app.get('/', (req, res) => {
  const books = [
    // Book data
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      image: 'https://via.placeholder.com/150',
      available: true,
      borrower: null
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      image: 'https://via.placeholder.com/150',
      available: true,
      borrower: null
    },
    {
      id: 3,
      title: '1984',
      author: 'George Orwell',
      image: 'https://via.placeholder.com/150',
      available: true,
      borrower: null
    }
  ];

  res.render('home', {
    pageTitle: 'Home',
    currentUser: req.session.user,
    books: books
  });
});

app.get('/login', (req, res) => {
  const currentUser = req.user; // Assuming user authentication middleware sets the user object in the request
  const errorMessage = req.query.errorMessage; // Get the error message from the query parameter, if any


  res.render('login');
});

  app.post('/login', (req, res) => {
    const cardNumber = req.body.cardNumber;
    
    // Check if the cardNumber is valid or not
    if (cardNumber === '1234' || cardNumber=='0000') {
      // If the cardNumber is valid, set the user session and redirect to home page
      req.session.user = {
        cardNumber: cardNumber
      };
      res.redirect('/');
    } else {
      // If the cardNumber is invalid, show error message on login page
    
      res.redirect('/login');
    }
  });
  app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
  
      res.redirect('/');
    });
  });
  app.get('/profile', (req, res) => {
    
    res.render('profile')
  });
  

  app.post('/borrow/:id', async (req, res) => {
    const bookId = req.params.id;
    const userId = req.session.userId; // Assuming you're using express-session to store the user ID
  
    try {
      // Update the book's borrowedBy field in the database
      const book = await Book.findByIdAndUpdate(bookId, { borrowedBy: userId });
      res.redirect('/borrowed'); // Redirect to the Borrowed page
    } catch (err) {
      console.error(err);
      res.status(500).send('Error borrowing book');
    }
  });

app.get('/borrowed', (req, res) => {
  const userId = req.session.userId; // Assuming you're using express-session to store the user ID

  // Find all books that are borrowed by the current user
  Book.find({ borrowedBy: userId }, (err, books) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching borrowed books');
    } else {
      res.render('borrowed', { books });
    }
  });
});
// Define a POST route to return a borrowed book
app.post('/return/:id', (req, res) => {
  const bookId = req.params.id;

  // Update the book's borrowedBy field in the database
  Book.findByIdAndUpdate(bookId, { borrowedBy: '' }, (err, book) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error returning book');
    } else {
      res.redirect('/borrowed');
    }
  });
});

// app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/books", booksRouter);
app.use("/users", usersRouter);
// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
