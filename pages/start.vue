<template>
  <div>
    You are succesfull logged in, start yourself with creating a <router-link to="/add">guildle</router-link>.
  </div>
</template>

<script lang="ts">
import InfoHome from '@/components/InfoHome.vue'
import { checkIsSignIn } from '../composition/check-is-sign-in.function'

export default {
  name: 'home',
  components: {
    InfoHome,
  },
  setup() {
    const isSignIn = checkIsSignIn()

    console.log('are we signed in?', isSignIn);

    return {
      isSignIn
    }
  }
}
</script>

<style lang="scss">
.center {
  text-align: center;
}
</style>
