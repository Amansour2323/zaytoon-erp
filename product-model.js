// src/models/Product.js - نموذج المنتج
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Product extends Model {
    // دالة للبحث عن المنتجات منخفضة المخزون
    static async findLowStock(branchId = null) {
        const whereClause = branchId ? { branch_id: branchId } : {};
        
        const query = `
            SELECT 
                p.*,
                i.quantity,
                i.branch_id,
                b.name as branch_name
            FROM products p
            INNER JOIN inventory i ON p.id = i.product_id
            INNER JOIN branches b ON i.branch_id = b.id
            WHERE i.quantity <= p.minimum_stock
            ${branchId ? 'AND i.branch_id = :branchId' : ''}
            ORDER BY i.quantity ASC
        `;
        
        const replacements = branchId ? { branchId } : {};
        
        return await sequelize.query(query, {
            replacements,
            type: sequelize.QueryTypes.SELECT
        });
    }
    
    // دالة للحصول على المنتجات الأكثر مبيعاً
    static async getTopSelling(limit = 10, period = '30 days') {
        const query = `
            SELECT 
                p.*,
                COUNT(si.id) as sales_count,
                SUM(si.quantity) as total_quantity,
                SUM(si.total) as total_revenue
            FROM products p
            INNER JOIN sale_items si ON p.id = si.product_id
            INNER JOIN sales s ON si.sale_id = s.id
            WHERE s.sale_date >= NOW() - INTERVAL '${period}'
            GROUP BY p.id
            ORDER BY total_quantity DESC
            LIMIT :limit
        `;
        
        return await sequelize.query(query, {
            replacements: { limit },
            type: sequelize.QueryTypes.SELECT
        });
    }
    
    // دالة لحساب قيمة المخزون
    async calculateInventoryValue(branchId = null) {
        const whereClause = branchId ? { branch_id: branchId, product_id: this.id } : { product_id: this.id };
        
        const inventory = await sequelize.models.Inventory.findAll({
            where: whereClause,
            attributes: [
                [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity']
            ]
        });
        
        const totalQuantity = inventory[0]?.dataValues?.total_quantity || 0;
        return totalQuantity * this.cost_price;
    }
    
    // دالة لإضافة سيريال نمبر
    async addSerialNumber(serialNumber, branchId, additionalData = {}) {
        return await sequelize.models.SerialNumber.create({
            serial_number: serialNumber,
            product_id: this.id,
            branch_id: branchId,
            status: 'available',
            ...additionalData
        });
    }
    
    // دالة للتحقق من توفر المنتج
    async checkAvailability(quantity, branchId) {
        const inventory = await sequelize.models.Inventory.findOne({
            where: {
                product_id: this.id,
                branch_id: branchId
            }
        });
        
        return inventory && inventory.quantity >= quantity;
    }
}

Product.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    sku: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    name_ar: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    description_ar: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    category_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'categories',
            key: 'id'
        }
    },
    brand: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    model: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    cost_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    tax_rate: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 15.00,
        validate: {
            min: 0,
            max: 100
        }
    },
    warranty_months: {
        type: DataTypes.INTEGER,
        defaultValue: 12,
        validate: {
            min: 0
        }
    },
    minimum_stock: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
        validate: {
            min: 0
        }
    },
    barcode: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: true
    },
    qr_code: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: true
    },
    image_url: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            isUrl: true
        }
    },
    is_serialized: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'هل المنتج يحتاج رقم تسلسلي'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    specifications: {
        type: DataTypes.JSONB,
        defaultValue: {},
        comment: 'مواصفات إضافية للمنتج'
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        comment: 'كلمات مفتاحية للبحث'
    }
}, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
    underscored: true,
    paranoid: true, // Soft delete
    indexes: [
        {
            fields: ['sku']
        },
        {
            fields: ['barcode']
        },
        {
            fields: ['name']
        },
        {
            fields: ['name_ar']
        },
        {
            fields: ['category_id']
        },
        {
            fields: ['is_active']
        },
        {
            type: 'FULLTEXT',
            fields: ['name', 'name_ar', 'description', 'description_ar']
        }
    ],
    hooks: {
        beforeCreate: async (product) => {
            // توليد SKU تلقائي إذا لم يكن موجود
            if (!product.sku) {
                const prefix = 'PROD';
                const timestamp = Date.now().toString(36).toUpperCase();
                const random = Math.random().toString(36).substring(2, 5).toUpperCase();
                product.sku = `${prefix}-${timestamp}-${random}`;
            }
            
            // توليد باركود إذا لم يكن موجود
            if (!product.barcode) {
                product.barcode = `EAN${Date.now()}`;
            }
        },
        
        beforeUpdate: async (product) => {
            // التحقق من أن سعر البيع أكبر من سعر التكلفة
            if (product.unit_price && product.cost_price) {
                if (product.unit_price < product.cost_price) {
                    throw new Error('سعر البيع يجب أن يكون أكبر من سعر التكلفة');
                }
            }
        },
        
        afterCreate: async (product) => {
            // إنشاء سجل مخزون أولي لجميع الفروع
            const branches = await sequelize.models.Branch.findAll({ where: { is_active: true } });
            
            for (const branch of branches) {
                await sequelize.models.Inventory.create({
                    product_id: product.id,
                    branch_id: branch.id,
                    quantity: 0,
                    reserved_quantity: 0
                });
            }
        }
    }
});

// العلاقات
Product.associate = (models) => {
    Product.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
    });
    
    Product.hasMany(models.SerialNumber, {
        foreignKey: 'product_id',
        as: 'serialNumbers'
    });
    
    Product.hasMany(models.Inventory, {
        foreignKey: 'product_id',
        as: 'inventory'
    });
    
    Product.hasMany(models.SaleItem, {
        foreignKey: 'product_id',
        as: 'saleItems'
    });
    
    Product.hasMany(models.InventoryMovement, {
        foreignKey: 'product_id',
        as: 'movements'
    });
};

module.exports = Product;