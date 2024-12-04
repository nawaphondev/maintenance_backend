const express = require('express');
const cors = require('cors'); // นำเข้าไลบรารี CORS
const dotenv = require('dotenv');
const sequelize = require('./config/db'); // กำหนดการเชื่อมต่อฐานข้อมูลของคุณ
const authRoutes = require('./routes/authRoutes');
const productionLineRoutes = require('./routes/productionLineRoutes');
const machineRoutes = require('./routes/machineRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const reportRoutes = require('./routes/reportRoutes'); // เส้นทางสำหรับรายงาน
const notificationRoutes = require('./routes/notificationRoutes'); // เส้นทางสำหรับการแจ้งเตือน
const middlewares = require('./middlewares/middlewares');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ใช้ middleware cors เพื่ออนุญาตการร้องขอจากทุกที่ (หรือระบุโดเมน)
app.use(cors());

// Middleware
app.use(express.json()); // สำหรับ parse JSON
app.use(middlewares);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/production-lines', productionLineRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/maintenance-records', maintenanceRoutes);
app.use('/api/reports', reportRoutes); // เส้นทางสำหรับรายงาน
app.use('/api/notifications', notificationRoutes); // เส้นทางสำหรับการแจ้งเตือน

// การเชื่อมต่อฐานข้อมูลและการเริ่มต้นเซิร์ฟเวอร์
sequelize.authenticate().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});
