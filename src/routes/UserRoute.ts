import { Router } from "express";
import { createUser, getUsers } from "../controller/UserController";
import { limiter } from "../middleware/RateLimiter";

const router = Router();

router.post("/", limiter, createUser);
router.get("/", getUsers);
router.use(limiter);

export default router;
