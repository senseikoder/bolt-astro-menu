import { createOrder } from '../../lib/orders';

export async function post({ request }) {
   try {
      const orderData = await request.json();
      const orderId = await createOrder(orderData);

      return new Response(JSON.stringify({ orderId }), {
         status: 200,
         headers: {
            'Content-Type': 'application/json'
         }
      });
   } catch (error) {
      console.error('Error creating order:', error);
      return new Response(JSON.stringify({ error: 'Failed to create order' }), {
         status: 500,
         headers: {
            'Content-Type': 'application/json'
         }
      });
   }
}