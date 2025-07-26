import { Router } from "express";
const router = Router();

router.post("/apply", (req, res) => {
  res.json({ success: true, message: "Naukri automation success!" });
});

export default router;
