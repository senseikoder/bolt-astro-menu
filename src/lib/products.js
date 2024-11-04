import db from './db.js';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = './public/uploads';

async function saveUploadedFile(file) {
  if (!file || !file.name) {
    return null;
  }

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  // Write the file buffer to the server
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return `/uploads/${fileName}`;
}

export const getAllProducts = () => {
  return db.prepare('SELECT * FROM products').all();
};

export const getProductById = (id) => {
  return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
};

export const createProduct = async (product, imageFile) => {
  
  const { name, description, price, category, is_available } = product;
  let image = null;

  if (imageFile) {
    image = await saveUploadedFile(imageFile);    
  }

  const stmt = db.prepare(`
    INSERT INTO products (name, description, price, category, image, is_available)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(name, description, price, category, image, is_available ? 1 : 0);
  return result.lastInsertRowid;
};

export const updateProduct = (id, product, imageFile) => {
  const { name, description, price, category, is_available } = product;
  let image = product.image;

  if (imageFile) {
    // Delete old image if exists
    const oldProduct = getProductById(id);
    if (oldProduct.image) {
      const oldImagePath = path.join(UPLOAD_DIR, path.basename(oldProduct.image));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    image = saveUploadedFile(imageFile);
  }

  const stmt = db.prepare(`
    UPDATE products
    SET name = ?, description = ?, price = ?, category = ?, image = ?, is_available = ?
    WHERE id = ?
  `);
  const result = stmt.run(name, description, price, category, image, is_available ? 1 : 0, id);
  return result.changes;
};

export const deleteProduct = (id) => {
  const product = getProductById(id);
  if (product.image) {
    const imagePath = path.join(UPLOAD_DIR, path.basename(product.image));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  const stmt = db.prepare('DELETE FROM products WHERE id = ?');
  const result = stmt.run(id);
  return result.changes;
};
