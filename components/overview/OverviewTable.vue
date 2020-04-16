<template>
    <div class="data-table">
        <table class="table-auto" aria-label="overview guidles">
            <thead>
            <tr>
                <th class="px-4 py-2" role="columnheader" scope="col">Name</th>
                <th class="px-4 py-2 is-hidden-touch" role="columnheader" scope="col">Description</th>
                <th class="px-4 py-2" role="columnheader" scope="col">Total steps</th>
                <th class="px-4 py-2" role="columnheader" scope="col">Last opened</th>
                <th class="px-4 py-2" role="columnheader" scope="col"></th>
            </tr>
            </thead>
            <tbody>
            <tr class="line" v-if="!state.hasData">
                <td class="px-4 py-2" colspan="5">You have no guidle's yet, start create some.</td>
            </tr>
            <tr class="clickable line" v-for="(item, index) in state.data" v-bind:key="index" @click="goTo(item, index)">
                <td class="border-t-1 px-4 py-2">{{item.title}}</td>
                <td class="border-t-1 px-4 py-2 description is-hidden-touch" v-html="item.shortText"></td>
                <td class="border-t-1 px-4 py-2">{{item.length}}</td>
                <td class="border-t-1 px-4 py-2">{{item.lastUpdated | formatDate}}</td>
                <td class="border-t-1 px-4 py-2">
                  <b-icon type="is-primary" class="action" icon="delete" @click="$emit('delete', index)">delete</b-icon>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ref, onMounted, watch, reactive } from '@vue/composition-api';
import { Tutr, TutrSum, TutrDict } from '../../services/tutorial.service';
import { formatDate } from '../../filters';

export default {
  props: ['data'],
  filters: {
    formatDate,
  },
  setup(props: any, context: any) {
    const state = reactive({
        hasData: false,
        data: {},
        index: {},
    });
    watch<TutrDict>(() => props.data as TutrDict, async (data: TutrDict) => {
          if (data) {
              const values = Object.values(data);
              state.hasData = values.length > 0;
              state.data = data;
          }
    });
    const goTo = (tutr: TutrSum, index: string) => {
      (<any>context.root).$router.push(`/details/${index}`);
    };
    return {
      state,
      goTo,
    };
  },
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
