<template>
  <div class="appheader">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="container">
        <div class="navbar-brand">
          <router-link to="/"
            ><img class="logo" src="/img/logo.png" alt="guidle me"
          /></router-link>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
          <div class="navbar-start">
            <router-link
              class="navbar-item navbar-menu-link"
              to="/"
              >Overview</router-link>
            <router-link
              class="navbar-item navbar-menu-link"
              to="/#info"
              >Followed guidle's</router-link>
          </div>

          <div class="navbar-end">
            <div v-if="state.isSignIn" class="navbar-item">{{ state.user.username }}</div>
            <div v-if="state.isSignIn" class="navbar-item">
              <div class="buttons">
                <a v-on:click="state.signOut()" class="button is-primary"
                  >log out</a
                >
              </div>
            </div>
            <div v-if="!state.isSignIn" class="navbar-item">
              <div class="buttons">
                <a v-on:click="state.signIn()" class="button is-primary"
                  >log in</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import {
  inject,
  onMounted,
  reactive
} from '@vue/composition-api'
import {
  BlockStackApiService,
  BlockStackSymbol
} from '../services/blockstack.service'
import { AppHeaderState } from './AppHeaderTypes'
import { signInWithBlockstack } from '../composition/sign-in-with-blockstack.function'
import { addSignInNotify } from '../composition/sign-in-notify.function'
import { TutorialsService, TutorialsSymbol } from '../services/tutorial.service'

export default {
  name: 'AppHeader',
  setup() {
    const blockstackApi: BlockStackApiService | void = inject<
      BlockStackApiService
    >(BlockStackSymbol)
    const tutorialApi: TutorialsService | void = inject<TutorialsService>(TutorialsSymbol);

    const state = reactive<AppHeaderState>({
      user: { username: '' },
      signOut: () => {},
      signIn: signInWithBlockstack(),
      isSignIn: false
    })

    addSignInNotify(() => {
        state.isSignIn = true;
        if (tutorialApi) {
          tutorialApi.reIndex();
        }
    })

    onMounted(() => {
      if (blockstackApi) {
        state.user = blockstackApi.currentUser
          ? blockstackApi.currentUser
          : { username: '' }
        state.signOut = () => blockstackApi.signOut('/')
        state.isSignIn = blockstackApi.isUserSignedIn()
      }
    })

    return {
      state
    }
  }
} // #009E7F
</script>

<style lang="scss">
.appheader {
  .navbar {
    box-shadow: 0 1rem 1rem -1rem rgba(10, 10, 10, 0.2);
    background-color: #fff;
    color: #009e7f;
    border-bottom: 1px solid #f0f0f0;
  }
  .navbar-item,
  .navbar-link {
    color: #aaa;
  }
  .navbar-menu-link {
    &:hover {
      background-color: #00d1b2;
      color: #fff;
    }
    &:focus,
    &.is-active,
    &:focus-within {
      background-color: #00d1b2;
      color: #fff;
    }
  }
}

@media only screen and (max-width: 1050px) {
  .logo {
    padding-left: 1.5rem;
  }
}
</style>
