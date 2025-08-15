// src/config/database.js - إعدادات قاعدة البيانات
const { Sequelize } = require('sequelize');
const pg = require('pg');

// إعدادات الاتصال
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'zaitoon_erp',
    username: process.env.DB_USER || 'zaitoon_admin',
    password: process.env.DB_PASSWORD || 'zaitoon@2024',
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        ssl: process.env.DB_SSL === 'true' ? {
            require: true,
            rejectUnauthorized: false
        } : false,
        timezone: '+02:00', // توقيت القاهرة
        charset: 'utf8'
    },
    timezone: '+02:00',
    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
        charset: 'utf8',
        collate: 'utf8_general_ci'
    }
};

// إنشاء اتصال Sequelize
const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
);

// اختبار الاتصال
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
        return true;
    } catch (error) {
        console.error('❌ فشل الاتصال بقاعدة البيانات:', error.message);
        throw error;
    }
};

// إنشاء قاعدة البيانات إذا لم تكن موجودة
const createDatabaseIfNotExists = async () => {
    const client = new pg.Client({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.username,
        password: dbConfig.password,
        database: 'postgres' // الاتصال بقاعدة البيانات الافتراضية
    });

    try {
        await client.connect();
        
        // التحقق من وجود قاعدة البيانات
        const res = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [dbConfig.database]
        );
        
        if (res.rows.length === 0) {
            // إنشاء قاعدة البيانات
            await client.query(`CREATE DATABASE ${dbConfig.database}`);
            console.log(`✅ تم إنشاء قاعدة البيانات: ${dbConfig.database}`);
        }
    } catch (error) {
        console.error('خطأ في إنشاء قاعدة البيانات:', error);
        throw error;
    } finally {
        await client.end();
    }
};

// دالة مساعدة لإجراء المعاملات
const transaction = async (callback) => {
    const t = await sequelize.transaction();
    
    try {
        const result = await callback(t);
        await t.commit();
        return result;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

// دالة مساعدة للاستعلامات المخصصة
const query = async (sql, options = {}) => {
    try {
        const [results, metadata] = await sequelize.query(sql, {
            type: Sequelize.QueryTypes.SELECT,
            ...options
        });
        return results;
    } catch (error) {
        console.error('خطأ في تنفيذ الاستعلام:', error);
        throw error;
    }
};

module.exports = {
    sequelize,
    Sequelize,
    testConnection,
    createDatabaseIfNotExists,
    transaction,
    query
};