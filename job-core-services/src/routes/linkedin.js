import { Router } from "express";
const router = Router();

router.post("/apply", (req, res) => {
  res.json({ success: true, message: "LinkedIn automation success!" });
});

export default router;
