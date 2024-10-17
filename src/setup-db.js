import db from './lib/db.js';

   // Insert some initial data
   const insertInitialData = () => {
     const products = [
       { name: 'Margherita Pizza', description: 'Classic tomato and mozzarella', price: 10.99, category: 'main-courses', image: 'margherita.jpg', is_available: true },
       { name: 'Caesar Salad', description: 'Romaine lettuce with Caesar dressing', price: 8.99, category: 'appetizers', image: 'caesar-salad.jpg', is_available: true },
       { name: 'Tiramisu', description: 'Classic Italian dessert', price: 6.99, category: 'desserts', image: 'tiramisu.jpg', is_available: true },
       { name: 'Iced Tea', description: 'Refreshing homemade iced tea', price: 2.99, category: 'drinks', image: 'iced-tea.jpg', is_available: true }
     ];

     const stmt = db.prepare('INSERT INTO products (name, description, price, category, image, is_available) VALUES (?, ?, ?, ?, ?, ?)');
     
     for (const product of products) {
       stmt.run(product.name, product.description, product.price, product.category, product.image, product.is_available ? 1 : 0);
     }

     console.log('Initial data inserted successfully');
   };

   // Check if products table is empty
   const isEmpty = db.prepare('SELECT COUNT(*) as count FROM products').get().count === 0;

   if (isEmpty) {
     insertInitialData();
   } else {
     console.log('Database already contains data. Skipping initial data insertion.');
   }

   console.log('Database setup complete.');