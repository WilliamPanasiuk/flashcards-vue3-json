<template>
  <div class="marks">
    <div class="field has-addons has-addons-centered">
      <div class="control">
        <button @click="putMark('n')" class="button is-danger">no</button>
      </div>
      <div class="control">
        <button @click="putMark('a')" class="button is-info">average</button>
      </div>
      <div class="control">
        <button @click="putMark('o')" class="button is-primary">
          ok&nbsp;<span v-if="isRemebered">(remeber)</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Marks",
  props: {
    isRemebered: Boolean,
  },
  methods: {
    putMark(mark) {
      this.$emit("callMark", mark);
    },
  },
};
</script>