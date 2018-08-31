<template>
  <div class="page">
    <div class="container">
      <complex-form @onValid="onValid" @onError="onError">
        <complex-input
          placeholder="Text" 
          type="text" 
          required-label="is required" 
          required 
        />
        <complex-input
          placeholder="Email" 
          type="email" 
          required-label="is required" 
          required 
        />
        <complex-input
          field="Password"
          placeholder="Password" 
          required-label="is required"
          type="password"
          name="password"
          required 
        />
        <complex-input
          field="This field"
          placeholder="Password confirmation" 
          required-label="is required" 
          type="password" 
          match="password"
          name="passwordConfirmation"
          required 
        />
        <button type="submit">Submit</button>
      </complex-form>
    </div>
  </div>
</template>

<script>
import '../components/form'
import '../components/input'

export default {
  name: 'Index',
  methods: {
    /**
     * When the form is valid detail contain the values
     */
    onValid({ detail }) {
      console.log('%cForm is valid', 'background: green; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', detail);
    },
    onError() {
      console.log('%cForm has errors', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;');

    }
  }
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
