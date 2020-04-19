<template>
  <div class="card-container">
    <img class="oj-icon-img" :src="data.logoUrl" alt="没有LOGO">
    <span class="name-span">{{ data.name }}</span>
  </div>
</template>

<script>
export default {
  name: 'OJSiteCard',
  props: {
    data: undefined
  },
  watch: {
    data(val) {
      this.data = val
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.card-container {
  &:hover {
    cursor: pointer;
    .name-span {
      color: blue;
      font-weight: bold;
    }
  }
  width: 50px;
  .oj-icon-img {
    width: 50px;
    height: 50px;
  }
}
</style>
