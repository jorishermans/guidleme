<template>
  <div class="container">
    <section class="section">
      <div class="container">
        <h1 class="title">Followed guidle's</h1>
        <h2 class="subtitle">
          This is an overview of all the guided tutorials your are following.
        </h2>
      </div>
    </section>
    <overview-consuming :data="state.data"></overview-consuming> <br />
  </div>
</template>

<script lang="ts">
import OverviewConsuming from '@/components/overview/OverviewConsuming.vue'
import {
  ConsumerService,
  ConsumerSymbol,
  ConsumerDict
} from '../services/consumer.service'
import {
  inject,
  reactive,
  onMounted,
} from '@vue/composition-api'

export default {
  name: 'ConsumerBoard',
  components: {
    OverviewConsuming
  },
  setup: () => {
    const consumeApi: ConsumerService | void = inject<ConsumerService>(
      ConsumerSymbol
    )

    const state = reactive({
      isLoading: false,
      data: {}
    })
    onMounted(() => {
      if (consumeApi) {
        consumeApi.index$.subscribe((index: ConsumerDict) => {
          console.log(index);
          state.isLoading = false
          state.data = { ...index }
          state.isLoading = true
        })
      }
    })
    return {
      state
    }
  }
}
</script>

<style lang="scss"></style>
