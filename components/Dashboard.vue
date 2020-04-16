<template>
  <div class="container">
      <section class="section">
            <div class="container">
            <h1 class="title">My guidle's</h1>
            <h2 class="subtitle">
                This is an overview of all my guidle's.
            </h2>
            </div>
      </section>
      <overview-table :data="state.data" v-on:delete="deleteItem"></overview-table> <br />
      <div class="add-guidle">
        <router-link to="/add">add a guildle</router-link>
      </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ConsumerBoard from '@/components/ConsumerBoard.vue';
import OverviewTable from '@/components/overview/OverviewTable.vue';
import { TutorialsService, TutorialsSymbol, TutrDict, Tutr } from '../services/tutorial.service';
import { inject, reactive, onMounted } from '@vue/composition-api';
import { addSignInNotify } from '../composition/sign-in-notify.function';

export default {
  name: 'Dashboard',
  components: {
    OverviewTable, ConsumerBoard
  },
  setup: () => {
    const tutorialApi: TutorialsService | void = inject<TutorialsService>(TutorialsSymbol);

    const state = reactive({
      isLoading: false,
      data: {}
    })

    onMounted(async () => {
      if (tutorialApi) {
         // tutorialApi.reIndex()
         tutorialApi.index$.subscribe((index: TutrDict) => {
           // index.
           console.log('give me the current index', index);
           state.isLoading = false;
           state.data = {...index};
           state.isLoading = true;
         })
      }
    })
    let deleteItem = (id: string) => {
      if (tutorialApi) {
        tutorialApi.deleteTutr(id);
      }
    }
    return {
      state,
      deleteItem,
    };
  },
}
</script>

<style lang="scss">
.add-guidle {
  padding: 0.5rem;
  a {
    color: #00d1b2;
    font-weight: bold;
  }
}
</style>
