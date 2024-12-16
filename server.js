// Import the Express module
import express from 'express';
import cors from 'cors';
import { config } from "dotenv";
import { connectDb } from "./config/database.js";
// importing route files here
import adminAuthRoute from './routes/admin/adminAuthRoute.js'
import adminSchoolSettings from './routes/admin/schoolSettingsRoutes.js'
import studentRoutes from './routes/admin/studentRoutes.js'

// Load environment variables from .env file
config();

// Create an Express application
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    })
);


// Setting up the route for admin authentication
app.use("/sms-api/admin/auth", adminAuthRoute);
// Setting up the route for admin dashboard
app.use("/sms-api/admin/school-settings", adminSchoolSettings);

app.use('/sms-api/admin/student-settings', studentRoutes);


//database 
connectDb()

const port = process.env.PORT || 8088;;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
