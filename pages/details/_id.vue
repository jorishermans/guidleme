<template>
  <div>
    <div class="container" v-if="state.isSignIn">
      <details-card :id="state.uid" :editable="true"></details-card>
    </div>
    <div class="container" v-if="!state.isSignIn">
      <client-only>
        Not able to view this, please login.
      </client-only>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { inject, onMounted, reactive, computed, SetupContext } from '@vue/composition-api';
import DetailsCard from '@/components/details/DetailsCard.vue';
import { checkIsSignIn } from '../../composition/check-is-sign-in.function';

export default {
  components: {
    DetailsCard,
  },
  setup: (props: any, context: SetupContext) => {
      // check if this route is correct
      const isSignIn = checkIsSignIn();
      const state = reactive({ uid: (<any>context.root).$route.params.id, isSignIn});
      return {
          state,
      };
  },
}
</script>
