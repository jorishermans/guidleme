<template>
  <div class="columns starting-screen">
    <div class="column">
        <p class="info">Start this tutorial anonymous. <br /> Your progress will not be saved for you.</p>
        <b-button type="is-primary" @click="start(true)">Start</b-button>
    </div>
    <div v-if="state.isSignIn" class="column">
        <p class="info end">Start this tutorial by storing your progress in your blockstack storage.</p>
        <b-button type="is-primary" @click="start(false)">Start</b-button>
    </div>
    <div v-if="!state.isSignIn" class="column">
        <p class="info">Save your progress in your browser.  <br />
        When you return to this tutorial later in time you can start from where you 're ended.</p>
        <b-button type="is-primary" @click="start(false)">Start</b-button>
    </div>
    <div v-if="!state.isSignIn" class="column">
        <p class="info end">Save your progress in your own storage provided by Blockstack.  <br />
        This will be saved privately for you.</p>
        <SignInBlockstack />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SignInBlockstack from '@/components/SignInBlockstack.vue';
import { inject, onMounted, reactive, computed, watch } from '@vue/composition-api';
import { BlockStackApiService, BlockStackSymbol } from '../../services/blockstack.service';
import { checkIsSignIn } from '../../composition/check-is-sign-in.function';
import { signInWithBlockstack } from '../../composition/sign-in-with-blockstack.function';
import { ConsumerService, ConsumerSymbol } from '../../services/consumer.service';

export default Vue.extend({
  components: {
      SignInBlockstack,
  },
  setup: (props, { emit }) => {
      const consumerApi: ConsumerService | void = inject<ConsumerService>(ConsumerSymbol);

      const isSignIn = checkIsSignIn();
      const state = reactive({ isSignIn });

      const start = (privately: boolean) => {
         if (consumerApi) {
             consumerApi.privately = privately;
         }
         emit('start', true);
      }
      const signInFn = signInWithBlockstack(() => {
        state.isSignIn = checkIsSignIn()
      });

      return {
          state,
          start,
          signInFn,
      };
  },
});
</script>

<style lang="scss">
.starting-screen {
  margin-top: 50px;
  border-top: 1px solid #f0f0f0;
  padding: 20px;
  border-bottom: 1px none #000;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #f0f0f0;
  background-color: #fff;
  box-shadow: 0 12px 18px 0 rgba(120,93,153,0.1);
}
.info {
    min-height: 100px;
    border-right: 1px solid #f0f0f0;
}
.end { border: none; }
</style>
