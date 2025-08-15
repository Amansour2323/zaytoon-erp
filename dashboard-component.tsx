import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  
  // بيانات تجريبية للإحصائيات
  const stats = {
    totalSales: 45670,
    totalRevenue: 125430,
    totalCustomers: 342,
    totalProducts: 156,
    lowStockItems: 12,
    pendingInvoices: 8
  };

  // بيانات تجريبية للرسوم البيانية
  const salesData = [
    { name: 'الأحد', sales: 4000, revenue: 2400 },
    { name: 'الإثنين', sales: 3000, revenue: 1398 },
    { name: 'الثلاثاء', sales: 2000, revenue: 9800 },
    { name: 'الأربعاء', sales: 2780, revenue: 3908 },
    { name: 'الخميس', sales: 1890, revenue: 4800 },
    { name: 'الجمعة', sales: 2390, revenue: 3800 },
    { name: 'السبت', sales: 3490, revenue: 4300 },
  ];

  const categoryData = [
    { name: 'أجهزة كمبيوتر', value: 35, color: '#FFD700' },
    { name: 'هواتف ذكية', value: 30, color: '#FFA500' },
    { name: 'إكسسوارات', value: 20, color: '#FF6347' },
    { name: 'أخرى', value: 15, color: '#4169E1' },
  ];

  const lowStockProducts = [
    { id: 1, name: 'لابتوب Dell XPS 13', stock: 2, minimum: 5 },
    { id: 2, name: 'iPhone 15 Pro', stock: 3, minimum: 10 },
    { id: 3, name: 'سماعات AirPods Pro', stock: 1, minimum: 5 },
    { id: 4, name: 'شاشة Samsung 27"', stock: 4, minimum: 8 },
  ];

  const recentSales = [
    { id: 1, customer: 'أحمد محمد', product: 'iPhone 15 Pro', amount: 4500, time: 'منذ 10 دقائق' },
    { id: 2, customer: 'فاطمة علي', product: 'لابتوب HP', amount: 3200, time: 'منذ 25 دقيقة' },
    { id: 3, customer: 'محمد حسن', product: 'شاشة Samsung', amount: 1800, time: 'منذ ساعة' },
    { id: 4, customer: 'مريم أحمد', product: 'AirPods Pro', amount: 950, time: 'منذ ساعتين' },
  ];

  const menuItems = [
    { icon: '🏠', label: 'الرئيسية', active: true },
    { icon: '📦', label: 'المنتجات' },
    { icon: '🛒', label: 'المبيعات' },
    { icon: '📄', label: 'الفواتير' },
    { icon: '👥', label: 'العملاء' },
    { icon: '🏪', label: 'الفروع' },
    { icon: '💰', label: 'المصروفات' },
    { icon: '📊', label: 'التقارير' },
    { icon: '⚙️', label: 'الإعدادات' },
  ];

  // Custom Arrow Icon Component
  const ArrowIcon = ({ direction = 'up', className = '' }) => (
    <svg 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      style={{ transform: direction === 'down' ? 'rotate(180deg)' : 'none' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  );

  // Custom Menu Icon Component
  const MenuIcon = ({ className = '' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  // Custom Close Icon Component
  const CloseIcon = ({ className = '' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  // Custom Bell Icon Component
  const BellIcon = ({ className = '' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Cairo, Tajawal, sans-serif', direction: 'rtl' }}>
      {/* Sidebar */}
      <aside 
        className={`fixed right-0 top-0 z-40 h-screen transition-transform bg-black text-white ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0`} 
        style={{ width: '250px' }}
      >
        <div className="h-full overflow-y-auto">
          {/* Logo */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                <span style={{ color: '#FFD700' }}>زيتون</span> ستور
              </h1>
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-white hover:text-gray-300"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-1">نظام إدارة الموارد</p>
          </div>

          {/* Menu Items */}
          <nav className="p-4">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                  item.active 
                    ? 'bg-yellow-500 text-black shadow-lg' 
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Info */}
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                <span className="text-black font-bold">م</span>
              </div>
              <div>
                <p className="text-sm font-medium">مدير النظام</p>
                <p className="text-xs text-gray-400">admin@zaitoon.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:mr-[250px]' : ''}`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-700 hover:text-gray-900"
              >
                <MenuIcon className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-bold text-gray-800">لوحة التحكم</h2>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Period Selector */}
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
              >
                <option value="today">اليوم</option>
                <option value="week">هذا الأسبوع</option>
                <option value="month">هذا الشهر</option>
                <option value="year">هذه السنة</option>
              </select>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <BellIcon className="h-6 w-6 text-gray-700" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {/* Total Sales Card */}
            <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">🛒</span>
                <span className="text-green-500 text-sm flex items-center gap-1">
                  <ArrowIcon direction="up" className="h-3 w-3" />
                  12%
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalSales.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">إجمالي المبيعات</p>
            </div>

            {/* Revenue Card */}
            <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">💰</span>
                <span className="text-green-500 text-sm flex items-center gap-1">
                  <ArrowIcon direction="up" className="h-3 w-3" />
                  8%
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalRevenue.toLocaleString()} ج.م</p>
              <p className="text-gray-500 text-sm">إجمالي الإيرادات</p>
            </div>

            {/* Customers Card */}
            <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">👥</span>
                <span className="text-green-500 text-sm flex items-center gap-1">
                  <ArrowIcon direction="up" className="h-3 w-3" />
                  5%
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalCustomers}</p>
              <p className="text-gray-500 text-sm">عدد العملاء</p>
            </div>

            {/* Products Card */}
            <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">📦</span>
                <span className="text-blue-500 text-sm">نشط</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
              <p className="text-gray-500 text-sm">المنتجات المتاحة</p>
            </div>

            {/* Low Stock Alert Card */}
            <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">⚠️</span>
                <span className="text-orange-500 text-sm">تنبيه</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.lowStockItems}</p>
              <p className="text-gray-500 text-sm">نقص مخزون</p>
            </div>

            {/* Pending Invoices Card */}
            <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">📄</span>
                <span className="text-yellow-500 text-sm">معلق</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.pendingInvoices}</p>
              <p className="text-gray-500 text-sm">فواتير معلقة</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Sales Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">📈 المبيعات والإيرادات</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#FFD700" strokeWidth={2} name="المبيعات" />
                  <Line type="monotone" dataKey="revenue" stroke="#000000" strokeWidth={2} name="الإيرادات" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">📊 توزيع المبيعات حسب الفئة</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Low Stock Products */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
                <span>⚠️</span> منتجات تحتاج إعادة تخزين
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-2 px-2">المنتج</th>
                      <th className="text-center py-2 px-2">المخزون</th>
                      <th className="text-center py-2 px-2">الحد الأدنى</th>
                      <th className="text-center py-2 px-2">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-2">{product.name}</td>
                        <td className="text-center py-2 px-2">{product.stock}</td>
                        <td className="text-center py-2 px-2">{product.minimum}</td>
                        <td className="text-center py-2 px-2">
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                            نقص حاد
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Sales */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
                <span>🛒</span> آخر المبيعات
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-2 px-2">العميل</th>
                      <th className="text-right py-2 px-2">المنتج</th>
                      <th className="text-center py-2 px-2">المبلغ</th>
                      <th className="text-center py-2 px-2">الوقت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSales.map((sale) => (
                      <tr key={sale.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-2">{sale.customer}</td>
                        <td className="py-2 px-2">{sale.product}</td>
                        <td className="text-center py-2 px-2">{sale.amount} ج.م</td>
                        <td className="text-center py-2 px-2">
                          <span className="text-gray-500 text-xs">{sale.time}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;