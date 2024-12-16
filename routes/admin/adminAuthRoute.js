import { Router } from "express";
import { getSMSAdminAuth } from "../../controller/admin/adminAuthController.js";
const router = Router();

// here is the all routes for the admin authentication

router.post('/login', getSMSAdminAuth) // route for the login


export default router;