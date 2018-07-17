<template>
  <div class="page">
    <div class="container">
      <complex-form>
        <complex-input placeholder="Type text here" type="text" required-label="is required" required />
        <complex-input placeholder="Type email here" type="email" required-label="is required" required />
        <button type="submit">Submit</button>
      </complex-form>
    </div>
  </div>
</template>

<script>
import '../components/form'
import '../components/input'

export default {
  name: 'Index'
}
</script>


<style lang="less">
html,
body,
#__nuxt,
#__layout,
.page {
  height: 100%;
  overflow: auto;
}

.page {
  display: flex;
  justify-content: center;
  align-items: center;

  complex-input {
    margin: 20px;
  }

  complex-form button {
    margin: auto;
    display: block;
  }
}
</style>
