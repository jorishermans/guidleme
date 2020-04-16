<template>
  <button
    @click.prevent="signInFn"
    class="blockstack-button is-medium home-hero"
  ></button>
</template>

<script lang="ts">
import { signInWithBlockstack } from '../composition/sign-in-with-blockstack.function'

export default {
  name: 'SignInBlockstack',
  setup() {
    const signInFn = signInWithBlockstack()

    return {
      signInFn
    }
  }
}
</script>
<style lang="scss">
.blockstack-button {
  height: 54px;
  width: 254px;
  border: none;
  background: url('/blockstack/btn-blockstack-light-l.svg') no-repeat left top;
  cursor: pointer;
  &:hover {
    background: url('/blockstack/btn-blockstack-light-l-focus.svg') no-repeat
      left top;
  }
}
</style>
