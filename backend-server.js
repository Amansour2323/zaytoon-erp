// server.js - نقطة البداية للخادم
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

// استيراد التطبيق
const app = require('./src/app');

// استيراد قاعدة البيانات
const { sequelize, testConnection } = require('./src/config/database');

// إعدادات الخادم
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware الأساسية
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Logging
if (NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    max: 100, // حد أقصى 100 طلب
    message: 'تم تجاوز حد الطلبات، يرجى المحاولة لاحقاً',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', limiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: NODE_ENV
    });
});

// API Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/products', require('./src/routes/productRoutes'));
app.use('/api/inventory', require('./src/routes/inventoryRoutes'));
app.use('/api/sales', require('./src/routes/salesRoutes'));
app.use('/api/invoices', require('./src/routes/invoiceRoutes'));
app.use('/api/branches', require('./src/routes/branchRoutes'));
app.use('/api/customers', require('./src/routes/customerRoutes'));
app.use('/api/loyalty', require('./src/routes/loyaltyRoutes'));
app.use('/api/expenses', require('./src/routes/expenseRoutes'));
app.use('/api/dashboard', require('./src/routes/dashboardRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'خطأ في البيانات المدخلة',
            errors: err.errors
        });
    }
    
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            success: false,
            message: 'غير مصرح بالوصول'
        });
    }
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'حدث خطأ في الخادم',
        ...(NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'الصفحة المطلوبة غير موجودة'
    });
});

// إنشاء خادم HTTP
const server = createServer(app);

// إعداد Socket.io للتحديثات الفورية
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Socket.io events
io.on('connection', (socket) => {
    console.log('مستخدم جديد متصل:', socket.id);
    
    socket.on('join-branch', (branchId) => {
        socket.join(`branch-${branchId}`);
        console.log(`المستخدم ${socket.id} انضم للفرع ${branchId}`);
    });
    
    socket.on('disconnect', () => {
        console.log('مستخدم قطع الاتصال:', socket.id);
    });
});

// تصدير io للاستخدام في أجزاء أخرى
app.set('io', io);

// بدء الخادم
const startServer = async () => {
    try {
        // اختبار اتصال قاعدة البيانات
        await testConnection();
        
        // مزامنة قاعدة البيانات
        if (NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('✅ تمت مزامنة قاعدة البيانات');
        }
        
        // بدء الاستماع
        server.listen(PORT, () => {
            console.log(`
╔════════════════════════════════════════════╗
║                                            ║
║     🌿 زيتون ستور - نظام ERP 🌿          ║
║                                            ║
║     الخادم يعمل على المنفذ: ${PORT}        ║
║     البيئة: ${NODE_ENV}                    ║
║     قاعدة البيانات: متصلة ✅              ║
║                                            ║
╚════════════════════════════════════════════╝
            `);
        });
    } catch (error) {
        console.error('❌ فشل بدء الخادم:', error);
        process.exit(1);
    }
};

// التعامل مع إيقاف الخادم بشكل آمن
process.on('SIGTERM', async () => {
    console.log('📦 إيقاف الخادم بشكل آمن...');
    
    server.close(() => {
        console.log('✅ تم إغلاق جميع الاتصالات');
    });
    
    try {
        await sequelize.close();
        console.log('✅ تم إغلاق اتصال قاعدة البيانات');
        process.exit(0);
    } catch (error) {
        console.error('❌ خطأ أثناء إغلاق قاعدة البيانات:', error);
        process.exit(1);
    }
});

// بدء الخادم
startServer();