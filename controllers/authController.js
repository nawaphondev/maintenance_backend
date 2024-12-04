const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize"); // เพิ่มการนำเข้า Op
const User = require("../models/User");

require("dotenv").config();

// สมัครสมาชิก
exports.register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    console.log("Received data:", {
      username,
      email,
      password,
      confirmPassword,
    }); // เพิ่มบันทึกข้อมูลที่ได้รับมา

    // ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // ตรวจสอบว่าอีเมลที่สมัครแล้วมีอยู่หรือไม่
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      status: "Active", // ควรเป็น 'Active' แทน 'active' เพื่อให้สอดคล้องกันกับ ENUM
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error during registration:", error); // เพิ่มบันทึกข้อผิดพลาด
    res.status(500).json({ message: "Server error", error });
  }
};

// เข้าสู่ระบบ
exports.login = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res.status(400).json({ message: "Please provide email/username and password" });
  }

  try {
    // ค้นหาผู้ใช้โดยใช้อีเมลหรือชื่อผู้ใช้
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ตรวจสอบรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // สร้าง JWT Token สำหรับการยืนยันตัวตน
    const token = jwt.sign(
      { userId: user.id, user_level: user.user_level },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ดึงข้อมูลผู้ใช้ทั้งหมด (เฉพาะแอดมินเท่านั้น)
exports.getUsers = async (req, res) => {
  try {
    // ตรวจสอบสิทธิ์ของผู้ใช้ (ต้องเป็น Admin เท่านั้น)
    if (req.user.user_level !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // ดึงข้อมูลผู้ใช้ทั้งหมด
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// เปลี่ยนรหัสผ่านของผู้ใช้โดยแอดมิน
exports.resetPasswordByAdmin = async (req, res) => {
  const { userId } = req.params; // userId ที่แอดมินต้องการเปลี่ยนรหัสผ่าน
  const { newPassword } = req.body; // รหัสผ่านใหม่ที่ต้องการตั้งให้ผู้ใช้
  try {
    // ค้นหาผู้ใช้ในฐานข้อมูล
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // เข้ารหัสรหัสผ่านใหม่
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // อัปเดตผู้ใช้ด้วยรหัสผ่านใหม่ที่เข้ารหัสแล้ว
    await user.update({ password: hashedPassword });

    res.status(200).json({ message: "Password reset successfully by admin" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// รีเซ็ตรหัสผ่านของผู้ใช้ด้วยการยืนยันรหัสผ่านเดิม
exports.resetPassword = async (req, res) => {
  const { userId } = req.params; // userId ของผู้ใช้ที่ต้องการเปลี่ยนรหัสผ่าน
  const { oldPassword, newPassword, confirmPassword } = req.body; // รหัสผ่านเดิม รหัสผ่านใหม่ และการยืนยันรหัสผ่านใหม่

  try {
    // ค้นหาผู้ใช้ในฐานข้อมูล
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ตรวจสอบรหัสผ่านเดิม
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // ตรวจสอบว่ารหัสผ่านใหม่ตรงกับการยืนยันหรือไม่
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // เข้ารหัสรหัสผ่านใหม่และอัปเดต
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
