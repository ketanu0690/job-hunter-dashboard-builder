import { Router } from "express";
const router = Router();

router.post("/parse", (req, res) => {
  res.json({ success: true, message: "Resume parse success!" });
});

export default router;
