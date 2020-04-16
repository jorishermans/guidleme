<template>
  <div>
    <InfoHome />
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
