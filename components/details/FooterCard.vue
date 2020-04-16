<template>
    <footer class="bottom">
        <div class="content has-text-centered">
            <p>
                {{state.step}} / {{state.total}} steps
            </p>
        </div>
    </footer>
</template>

<script lang="ts">
import { inject, onMounted, reactive, computed, watch, SetupContext } from '@vue/composition-api';

export interface StateFooterCard {
    total: number;
    step: number;
}

export default {
  name: 'FooterCard',
  props: {
    step: Number,
    total: Number
  },
  setup: (props: any, context: SetupContext) => {

      const state = reactive<StateFooterCard>({
        total: 0,
        step: 0,
      });

      watch<number>(() => props.step as number, async (step: number) => {
          state.step = step + 1;
      });
      watch<number>(() => props.total as number, async (total: number) => {
          state.total = total;
      });

      return {
          state,
      };
  },
}
</script>

<style lang="scss">
.bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #00d1b2;
    color: white;
    text-align: center;
    height: 60px;
    padding: 15px;
    font-size: 20px;
    font-weight: bolder;
}
</style>
