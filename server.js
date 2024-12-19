import { connectDB } from './config/db.js';
import express from 'express';
import path from "path";
import userRoutes from './src/routes/v1/userRoutes.js'; // Use the alias
const app = express();
const port = 3002;

import cors from "cors";
import { userTermsAndConditionsHTML } from './src/pages/usertermsAndConditionsHTML.js';
import { userPrivacyPolicyHTML } from './src/pages/userPrivacyPolicyHTML.js';

// Middleware to parse JSON request bodies
app.use(cors());
// const corsOptions = {
//   origin: "http://localhost:3001", // Allow only this origin
//   methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
//   allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
//   credentials: true, // Allow cookies or credentials
// };
// app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Connect to MongoDB
connectDB();

app.use("/images", express.static(path.resolve("public/images")));
// Use user routes
app.use('/api/user', userRoutes);


app.get('/user/terms-and-conditions', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(userTermsAndConditionsHTML);
});

app.get('/user/privacy-policy', (req, res) => {
res.setHeader('Content-Type', 'text/html');
res.send(userPrivacyPolicyHTML);
});

app.get('/user/faq', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(userPrivacyPolicyHTML);
  });
  

  app.get('/user/about', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(userPrivacyPolicyHTML);
    });

    
app.get('/user/help', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(userPrivacyPolicyHTML);
  });
  

// Root route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
