import { Router } from "express";
import * as controller from "./demo.controller";

const router = Router();

router.post("/login", controller.demoLogin);
router.post("/reset", controller.demoReset);

export default router;

