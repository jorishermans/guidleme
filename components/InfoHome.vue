<template>
  <div>
    <div class="bd-index center hero is-fullheight is-light">
      <div class="hero-body">
        <client-only>
          <div v-if="!state.isSignIn" class="container">
            <header class="bd-index-header">
              <h3 class="title is-3">
                <strong>Guidle.me</strong> your interactive learning platform
              </h3>
              <h4 class="subtitle is-4">
                Create guidle's or consume guidle's and see your progress.
              </h4>
            </header>

            <br />
            <SignInBlockstack />
            <p>
              Don't have blockstack yet, well you can learn more
              <a href="https://blockstack.org/try-blockstack" target="_blank"
                >here</a
              >
              ...
            </p>
          </div>
          <dashboard v-if="state.isSignIn"></dashboard>
        </client-only>
      </div>
      <div class="hero-foot">
        <div class="container">
          <div class="tabs is-centered">
            <ul>
              <li><a href="#info" class="more">Followed guidle's</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <section id="info" class="bd-info hero is-medium">
      <div class="hero-body">
        <div class="container">
          <div class="container explanation">
            <consumer-board></consumer-board>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import SignInBlockstack from '@/components/SignInBlockstack.vue'
import ConsumerBoard from '@/components/ConsumerBoard.vue'
import Dashboard from '@/components/Dashboard.vue'
import { checkIsSignIn } from '../composition/check-is-sign-in.function'
import { addSignInNotify } from '../composition/sign-in-notify.function'
import Vue from 'vue'
import { reactive } from '@vue/composition-api'

export default Vue.extend({
  name: 'InfoHome',
  components: {
    SignInBlockstack,
    ConsumerBoard,
    Dashboard
  },
  setup() {
    const isSignIn = checkIsSignIn()

    const state = reactive<any>({
      isSignIn: isSignIn
    })

    addSignInNotify(() => {
      state.isSignIn = true;
    })

    return {
      state
    }
  }
})
</script>

<style lang="scss">
.bd-index {
  margin-top: -75px;
}
.bd-index-header .title strong {
  color: #00d1b2;
}
.bd-index-header .subtitle {
  color: #b5b5b5 !important;
}
.more {
  font-weight: bold;
}
.bd-info {
  background-color: #00d1b2;
  position: relative;
  .bd-info-box {
    box-shadow: 0 2rem 2rem -1rem rgba(10, 10, 10, 0.2);
    padding: 3rem;
    background-color: #fff;
    border-radius: 6px;
    min-height: 300px;
  }
}
.explanation {
  .title {
    color: white;
  }
}
.center {
  text-align: center;
}
.link-examples {
  color: #fff !important;
  font-weight: bold;
}
.explanation {
  padding: 20px;
  margin: 2rem !important;
}
</style>
