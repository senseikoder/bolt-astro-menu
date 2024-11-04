<template>
   <div class="section">
      <h2 class="title">Create Product</h2>
      <form @submit.prevent="createProduct">
         <div class="field">
            <label class="label">Name</label>
            <div class="control">
               <input
                  v-model="product.name"
                  class="input"
                  type="text"
                  required
               />
            </div>
         </div>
         <div class="field">
            <label class="label">Description</label>
            <div class="control">
               <textarea
                  v-model="product.description"
                  class="textarea"
               ></textarea>
            </div>
         </div>
         <div class="field">
            <label class="label">Price</label>
            <div class="control">
               <input
                  v-model="product.price"
                  class="input"
                  type="number"
                  step="0.01"
                  required
               />
            </div>
         </div>
         <div class="field">
            <label class="label">Category</label>
            <div class="control">
               <input
                  v-model="product.category"
                  class="input"
                  type="text"
                  required
               />
            </div>
         </div>
         <div class="field">
            <label class="label">Image</label>
            <div class="control">
               <input @change="handleFileUpload" class="input" type="file" />
            </div>
         </div>
         <div class="field">
            <label class="checkbox">
               <input v-model="product.is_available" type="checkbox" /> Is
               Available
            </label>
         </div>
         <div class="field is-grouped">
            <div class="control">
               <button class="button is-link" type="submit">Create</button>
            </div>
            <div class="control">
               <button
                  @click="$emit('close')"
                  class="button is-light"
                  type="button"
               >
                  Cancel
               </button>
            </div>
         </div>
      </form>
   </div>
</template>

<script>
import { ref } from "vue";

export default {
   setup(_, { emit }) {
      const product = ref({
         name: "",
         description: "",
         price: null,
         category: "",
         is_available: true,
      });
      const imageFile = ref(null);

      const handleFileUpload = (event) => {
         imageFile.value = event.target.files[0];
      };

      const createProduct = async () => {
         const formData = new FormData();
         formData.append("name", product.value.name);
         formData.append("description", product.value.description);
         formData.append("price", product.value.price);
         formData.append("category", product.value.category);
         formData.append("is_available", product.value.is_available);
         if (imageFile.value) {
            formData.append("image", imageFile.value);
         }

         await fetch("/api/products", {
            method: "POST",
            body: formData,
         });

         emit("product-created");
         emit("close");
      };

      return {
         product,
         handleFileUpload,
         createProduct,
      };
   },
};
</script>
