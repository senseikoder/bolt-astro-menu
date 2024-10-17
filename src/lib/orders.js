import db from './db.js';

export const createOrder = (order) => {
  const { customer_name, customer_phone, customer_address, payment_method, shipping_method, total_amount, items } = order;

  const orderStmt = db.prepare(`
    INSERT INTO orders (customer_name, customer_phone, customer_address, payment_method, shipping_method, total_amount)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const itemStmt = db.prepare(`
    INSERT INTO order_items (order_id, product_id, quantity, price)
    VALUES (?, ?, ?, ?)
  `);

  const result = db.transaction(() => {
    const orderResult = orderStmt.run(customer_name, customer_phone, customer_address, payment_method, shipping_method, total_amount);
    const orderId = orderResult.lastInsertRowid;

    for (const item of items) {
      itemStmt.run(orderId, item.id, item.quantity, item.price);
    }

    return orderId;
  })();

  return result;
};

export const getAllOrders = () => {
  return db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
};

export const getOrderById = (id) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  if (order) {
    order.items = db.prepare(`
      SELECT oi.*, p.name as product_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(id);
  }
  return order;
};

export const updateOrderStatus = (id, status) => {
  const stmt = db.prepare('UPDATE orders SET status = ? WHERE id = ?');
  const result = stmt.run(status, id);
  return result.changes;
};