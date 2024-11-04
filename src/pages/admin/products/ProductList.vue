<template>
  <div>
    <h1 class="title">Product List</h1>
    <button @click="showCreateForm = true" class="button is-primary mb-4">Create Product</button>

    <div v-if="showCreateForm">
      <CreateProduct @product-created="fetchProducts" @close="showCreateForm = false" />
    </div>

    <div v-if="products.length">
      <table class="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.name }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.category }}</td>
            <td>
               <div class="buttons">
                  <button @click="editProduct(product)" class="button is-small is-info">Edit</button>
                  <button @click="deleteProduct(product.id)" class="button is-small is-danger">Delete</button>
               </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showEditForm">
      <EditProduct :product="currentProduct" @product-updated="fetchProducts" @close="showEditForm = false" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import CreateProduct from './CreateProduct.vue';
// import EditProduct from './EditProduct.vue';

export default {
  components: {
    CreateProduct,
   //  EditProduct,
  },
  setup() {
    const products = ref([]);
    const showCreateForm = ref(false);
    const showEditForm = ref(false);
    const currentProduct = ref(null);

    const fetchProducts = async () => {
      const response = await fetch('/api/products');
      products.value = await response.json();
    };

    const editProduct = (product) => {
      currentProduct.value = product;
      showEditForm.value = true;
    };

    const deleteProduct = async (id) => {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    };

    onMounted(fetchProducts);

    return {
      products,
      showCreateForm,
      showEditForm,
      currentProduct,
      fetchProducts,
      editProduct,
      deleteProduct,
    };
  },
};
</script>
