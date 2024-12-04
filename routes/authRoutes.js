const express = require("express");
const router = express.Router();
const { register, login, getUsers } = require("../controllers/authController");
const authenticate = require("../middlewares/authenticate");
const authController = require("../controllers/authController");

// เส้นทางสำหรับการสมัครสมาชิก
router.post("/register", register);

// เส้นทางสำหรับการเข้าสู่ระบบ
router.post("/login", login);

// เส้นทางสำหรับการดึงข้อมูลผู้ใช้ (Admin Only)
router.get("/users", authenticate, getUsers);

// แอดมินรีเซ็ตรหัสผ่านของผู้ใช้
router.patch("/admin-reset-password/:userId", authController.resetPasswordByAdmin);

// ผู้ใช้รีเซ็ตรหัสผ่านของตัวเอง
router.patch("/user-reset-password/:userId", authController.resetPassword);

module.exports = router;
