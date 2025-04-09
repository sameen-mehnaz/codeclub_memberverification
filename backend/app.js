const express = require('express');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// CORS must be applied before session and routes
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
}));

// Required to parse incoming JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  name: 'sid', // optional, for naming the session ID cookie
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,       // only true in production with HTTPS
    httpOnly: true,      // can't be accessed via client-side JS
    sameSite: 'lax',     // allows sending cookies across domains (dev friendly)
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  }
}));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
