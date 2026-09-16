// // src/routes/routes.js
// import React from 'react';
// import { Route, Routes } from 'react-router-dom';
// import Home from '../pages/Home';
// import Suppliers from '../pages/purchase/Suppliers';
// import Manager from '../pages/purchase/Manager';
// import Quotations from '../pages/purchase/Quotations';
// import Order from '../pages/purchase/Order';
// import Delivery from '../pages/purchase/Delivery';
// import ReturnOut from '../pages/purchase/ReturnOut';
// import DamagePurchase from '../pages/purchase/DamagePurchase';
// import Inventory from '../pages/purchase/Inventory';
// import Product from '../pages/purchase/Product';
// import Customer from '../pages/sales/customers/Customer';
// import Invoice from '../pages/sales/Invoice';
// import AdvanceOrder from '../pages/sales/AdvanceOrder';
// import DamageSales from '../pages/sales/DamageSales';
// import ReturnIn from '../pages/sales/ReturnIn';
// import NotPage from '../components/NotPage';

// const AppRoutes = () => (
//   <Routes>
//     {/* Main Routes */}
//     <Route path="/" element={<Home />} />
//     <Route path="/suppliers" element={<Suppliers />} />
//     <Route path="/manager" element={<Manager />} />
//     <Route path="/quotations" element={<Quotations />} />
//     <Route path="/order" element={<Order />} />
//     <Route path="/delivery" element={<Delivery />} />
//     <Route path="/return-out" element={<ReturnOut />} />
//     <Route path="/damage-purchase" element={<DamagePurchase />} />
//     <Route path="/inventory" element={<Inventory />} />
//     <Route path="/product" element={<Product />} />

//     {/* Sales Routes */}
//     <Route path="/customer" element={<Customer />} />
//     <Route path="/invoice" element={<Invoice />} />
//     <Route path="/advance-order" element={<AdvanceOrder />} />
//     <Route path="/damage-sales" element={<DamageSales />} />
//     <Route path="/return-in" element={<ReturnIn />} />

//     {/* Catch-all for undefined routes */}
//     <Route path="*" element={<NotPage />} />
//   </Routes>
// );

// export default AppRoutes;
