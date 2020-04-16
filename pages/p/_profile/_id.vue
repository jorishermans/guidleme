<template>
  <div>
    <div class="container" v-if="state.showable">
      <details-card :profile="state.profile" :id="state.uid" :editable="false"></details-card>
    </div>
    <div class="container" v-if="!state.showable">
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
import { checkIsSignIn } from '../../../composition/check-is-sign-in.function';

export default Vue.extend({
  components: {
    DetailsCard,
  },
  setup: (props: any, context: SetupContext) => {
      const profile = (<any>context.root).$route.params.profile;
      const showable = checkIsSignIn() || profile;
      const state = reactive({ uid: (<any>context.root).$route.params.id, showable, profile});
      return {
          state,
      };
  },
});
</script>
