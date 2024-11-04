export const prerender = false
import type { APIRoute } from 'astro';
import { getAllProducts, createProduct } from '../../../lib/products.js';

export const GET: APIRoute = async({ request }) => {
   try {
      const products = getAllProducts();
      return new Response(JSON.stringify(products), {
         status: 200,
         headers: { 'Content-Type': 'application/json' },
      });
   } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
         status: 500,
         headers: { 'Content-Type': 'application/json' },
      });
   }
}

export const POST: APIRoute = async({ request }) => {
   try {
      const formData = await request.formData();
      const product = {
         name: formData.get('name'),
         description: formData.get('description'),
         price: formData.get('price'),
         category: formData.get('category'),
         is_available: formData.get('is_available') === 'true'
      };
      const imageFile = formData.get('image');

      const newProductId = createProduct(product, imageFile);

      return new Response(JSON.stringify({ id: newProductId }), {
         status: 201,
         headers: { 'Content-Type': 'application/json' },
      });
   } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to create product' }), {
         status: 500,
         headers: { 'Content-Type': 'application/json' },
      });
   }
}
