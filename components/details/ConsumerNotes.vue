<template>
<div class="section container-notes" v-bind:class="{ shownotes: state.show }">
    <div class="container">
        <div class="header-notes" @click="toggle">
                Add private notes to this guidle
        </div>
        <div class="content-notes"> 
            <b-field>
                <b-input ref="input" maxlength="200" type="textarea" v-on:input="addNote" v-model="state.notes"></b-input>
            </b-field>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { inject, onMounted, reactive, computed, watch, ref } from '@vue/composition-api';
import { BlockStackApiService, BlockStackSymbol } from '@/services/blockstack.service';
import { ConsumerService, ConsumerSymbol, Consumer } from '@/services/consumer.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Tutr } from '@/services/tutorial.service';

export default Vue.extend({
  props: ['id', 'stepId', 'stepIndex', 'tutr', 'consumer'],
  setup: (props, { emit }) => {
      const input = ref({});
      const consumerApi: ConsumerService | void = inject<ConsumerService>(ConsumerSymbol);
      const state = reactive({ notes: '', show: false });
    
      const toggle = () => {
          state.show = !state.show;
          if (state.show) {
              const htmlInput: any = input.value;
              htmlInput.focus();
          }
      }
      const inputStream = new Subject<string>();
      inputStream.pipe(debounceTime(500)).subscribe((x: string) => {
          // save it as a consumer ...
          if (consumerApi) {
              const consumer = props.consumer as Consumer;
              consumer.steps[props.stepId as number] = { comment: x };
              consumerApi.save(props.id as string, consumer);
          }
      });
      const addNote = ($event: string) => {
          inputStream.next($event);
      }
      watch<number>(() => props.stepIndex as number, async (stepIndex: number) => {
         if (consumerApi) {
              const consumer = props.consumer as Consumer;
              const tutr = props.tutr as Tutr;
              consumer.stepIndex = stepIndex;
              consumer.length = tutr.steps.length;
              consumerApi.save( props.id as string, consumer );
          }
      });
      watch<number>(() => props.stepId as number, async (stepId: number) => {
          const consumer = props.consumer as Consumer;
          if (consumer.steps[props.stepId as number]) {
              state.notes = consumer.steps[props.stepId as number].comment;
              state.show = true;
          } else {
              state.notes = '';
              state.show = false;
          }
      });

      watch<Consumer>(() => props.consumer as Consumer, async (consumer: Consumer) => {
          if (consumer && consumer.steps[props.stepId as number]) {
              state.notes = consumer.steps[props.stepId as number].comment;
          }
      });

      return {
          input,
          toggle,
          state,
          addNote,
      };
  },
});
</script>

<style lang="scss">
.container-notes {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: -165px;
    // margin-bottom: 59px;
    transition: all .5s ease;
    
    .header-notes {
        position: absolute;
        display: inline-flex;
        background: #444;
        border: 2px solid #666;
        border-radius: 6px 6px 0 0;
        // box-shadow: 0 12px 18px 0 rgba(120, 93, 153, 0.1);
        bottom: 100%;
        right: 20px;
        padding: 0 0 0 8px;
        vertical-align: top;
        color: #fff;
        padding: 10px;
        font-weight: bold;
        cursor: pointer;
    }
    .content-notes {
        box-shadow: 0 12px 18px 0 rgba(120, 93, 153, 0.2);
        border: 1px solid #ccc;
        background: whitesmoke;
        padding: 1rem;
    }
}
.shownotes {
    bottom: 0;
}
</style>