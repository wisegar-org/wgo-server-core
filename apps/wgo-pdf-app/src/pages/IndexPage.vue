<template>
  <q-page class="row items-center justify-evenly">
    <q-uploader
      url="http://localhost:4444/upload"
      label="Restricted to images"
      accept=".jpg, image/*"
      style="max-width: 500px"
    ></q-uploader>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  components: {},
  setup() {
    return {};
  },
});
</script>
