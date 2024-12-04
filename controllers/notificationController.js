const MaintenanceRecord = require("../models/MaintenanceRecord");
const Machine = require("../models/Machine");
const nodemailer = require("nodemailer");

// แจ้งเตือนเมื่อถึงกำหนดการบำรุงรักษา
exports.sendMaintenanceReminder = async (req, res) => {
  try {
    const upcomingMaintenance = await MaintenanceRecord.findAll({
      where: {
        maintenance_date: {
          [sequelize.Op.lte]: new Date(
            new Date().getTime() + 7 * 24 * 60 * 60 * 1000
          ), // แจ้งเตือนล่วงหน้า 7 วัน
        },
      },
      include: [{ model: Machine, attributes: ["name"] }],
    });

    // ส่งอีเมลแจ้งเตือน
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    upcomingMaintenance.forEach(async (record) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "nawaphonphophom55@gmail.com", // เปลี่ยนเป็นอีเมลของผู้ใช้
        subject: `Maintenance Reminder for ${record.Machine.name}`,
        text: `This is a reminder that maintenance for ${record.Machine.name} is scheduled on ${record.maintenance_date}`,
      };

      await transporter.sendMail(mailOptions);
    });

    res
      .status(200)
      .json({ message: "Maintenance reminders sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
