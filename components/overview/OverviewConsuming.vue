<template>
  <div class="data-table">
    <table class="table-auto" aria-label="overview guidles">
      <thead>
        <tr>
          <th
            class="px-4 py-2"
            role="columnheader"
            scope="col"
          >
            Name
          </th>
          <th
            class="px-4 py-2"
            role="columnheader"
            scope="col"
          >
            Author
          </th>
          <th
            class="px-4 py-2"
            role="columnheader"
            scope="col"
          >
            Progress
          </th>
          <th
            class="px-4 py-2"
            role="columnheader"
            scope="col"
          >
            Last opened
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="line" v-if="!state.hasData">
          <td class="px-4 py-2" colspan="4">
            You have not consumed any guidle's yet.
          </td>
        </tr>
        <tr
          class="clickable line"
          v-for="(item, index) in state.data"
          v-bind:key="index"
          @click="goTo(item, index)"
        >
          <td class="border-t-1 px-4 py-2">{{ item.tutrRef.title }}</td>
          <td
            class="border-t-1 px-4 py-2"
            v-html="item.tutrRef.author"
          ></td>
          <td
            class="border-t-1 px-4 py-2 progress-minwidth"
          >
            <b-progress
              :value="((item.stepIndex + 1) / item.length) * 100"
              size="is-small"
              type="is-primary"
              show-value
            >
              {{ item.stepIndex + 1 }} / {{ item.length }}
            </b-progress>
          </td>
          <td class="border-t-1 px-4 py-2">
            {{ item.lastUpdated | formatDate }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  ref,
  onMounted,
  watch,
  reactive
} from '@vue/composition-api'
import { Tutr, TutrSum, TutrDict } from '../../services/tutorial.service'
import { formatDate } from '../../filters'
import { ConsumerDict, ConsumerSum } from '../../services/consumer.service'
import {
  OverviewConsumingProps,
  OverviewConsumingState
} from './OverviewConsuming'

export default {
  props: ['data'],
  filters: {
    formatDate,
  },
  setup(props: any, context: any) {
    const field = ref({})
    const state = reactive<OverviewConsumingState>({
      hasData: false,
      data: {},
      index: {}
    })
    const goTo = (consumerSum: ConsumerSum, index: string) => {
      (<any>context.root).$router.push(`/p/${consumerSum.tutrRef.author}/${index}`)
    }
    watch<ConsumerDict>(
      () => props.data,
      (data: ConsumerDict) => {
        console.log('data', data);
        if (data) {
          const values = Object.values(data)
          state.hasData = values.length > 0
          state.data = data
        }
      }
    )
    return {
      state,
      goTo
    }
  }
}
</script>

<style lang="scss">
.data-table {
  box-shadow: 0 4px 12px rgba(0,0,0,.08);
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(0,0,0,.12);
  background-color: white;
  table td, table th {
      /* vertical-align: top; */
      vertical-align: middle;
  }
  table { width: 100%; }
  .progress-minwidth {
      min-width: 200px;
      font-size: 12px;
  }
  .clickable {
    cursor: pointer;
  }
}
</style>
