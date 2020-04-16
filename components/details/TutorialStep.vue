<template>
<div class="page">
    <div class="section">
        <div class="container">
            <div class="toolbar" v-if="state.editable" >
                <b-tooltip
                label="add a step before this step"
                position="is-top"
                multilined>
                    <span @click="addStep()"><b-icon type="is-primary" class="action" icon="plus"></b-icon></span>
                </b-tooltip>
                <b-tooltip
                label="delete this step"
                position="is-top"
                multilined>
                    <span @click="deleteStep()"><b-icon type="is-primary" class="action" icon="delete"></b-icon></span>
                </b-tooltip>
            </div>
            <div class="stepper">
                <span class="action left" v-if="state.stepIndex !== 0" @click="onLeft()">
                    <b-icon class="action" icon="menu-left" size="is-large" type="is-primary"></b-icon>
                </span>

                <step-type :id="id" :index="state.stepIndex" :tutr="state.tutr" :editable="state.editable" v-on:next="next"></step-type>

                <span class="action right" v-if="state.nextStep" @click="onRight()">
                    <b-icon class="action" icon="menu-right" size="is-large" type="is-primary"></b-icon>
                </span>
            </div>
        </div>
    </div>
    <consumer-notes v-if="!state.editable" :stepIndex="state.stepIndex" :stepId="state.stepId" :tutr="state.tutr" :id="id" :consumer="state.consumer">
    </consumer-notes>
    <footer-card :step="state.stepIndex" :total="state.total"></footer-card>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { TutorialsService, TutorialsSymbol, Tutr } from '../../services/tutorial.service';
import { inject, onMounted, reactive, computed, watch, onUnmounted, SetupContext } from '@vue/composition-api';
import FooterCard from '@/components/details/FooterCard.vue';
import ConsumerNotes from '@/components/details/ConsumerNotes.vue';
import StepType from '@/components/details/StepType.vue';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ConsumerService, ConsumerSymbol, Consumer } from '../../services/consumer.service';
import { uniqueID } from '../../utilities/unique-id';

export interface StepState {
    tutr: Tutr | {};
    consumer: Consumer | undefined;
    stepIndex: number;
    stepId: string | number;
    total: number;
    editable: boolean;
    canGoNext: boolean;
    nextStep: boolean;
}

export default {
  props: ['id', 'tutr', 'consumer', 'editable'],
  components: {
      FooterCard,
      StepType,
      ConsumerNotes,
  },
  setup: (props: any, context: SetupContext) => {
      const tutorialApi: TutorialsService | void = inject<TutorialsService>(TutorialsSymbol);
      const consumerApi: ConsumerService | void = inject<ConsumerService>(ConsumerSymbol);

      const state: StepState = reactive({
        tutr: {},
        stepIndex: 0,
        editable: props.editable as boolean,
        consumer: props.consumer as Consumer,
        canGoNext: true,
        nextStep: computed(() => {
            if ((state.tutr as Tutr).steps) {
                return ((state.stepIndex + 1 < (state.tutr as Tutr).steps.length) && state.canGoNext) || state.editable
            }
            return false;
        }),
        stepId: computed(() => {
            const tutr = state.tutr as Tutr;
            if (tutr.steps && state.stepIndex) {
                const step = tutr.steps[state.stepIndex];
                return step.id ? step.id : state.stepIndex;
            }
            return 0;
        }),
        total: computed(() =>  {
            if ((state.tutr as Tutr).steps) {
                return (state.tutr as Tutr).steps.length;
            }
            return 0;
        }),
      });
      const onLeft = () => {
          const tutr = state.tutr as Tutr;
          if (state.stepIndex !== 0) {
              state.stepIndex -= 1;
          }
          state.canGoNext = true;
      };
      const onRight = () => {
          const tutr = state.tutr as Tutr;
          if (state.stepIndex === (tutr.steps.length -1) && state.editable) {
              tutr.steps.push({
                  type: 'empty',
                  id: uniqueID()
              });
          }
          state.stepIndex++;
      };
      const addStep = () => {
          const tutr = state.tutr as Tutr;
          if (state.editable) {
              tutr.steps.splice(state.stepIndex, 0, {
                  type: 'empty',
                  id: uniqueID()
              });
          }
      };
      const deleteStep = () => {
          const tutr = state.tutr as Tutr;
          if (tutr.steps.length > 1 &&
                tutr.steps.length !== state.stepIndex) {
              tutr.steps.splice(state.stepIndex, 1);
              state.stepIndex = state.stepIndex !== 0 ? state.stepIndex - 1 : 0;
          }
      }
      const updateTutr = (id: string, tutr: Tutr) => {
          if (tutorialApi) {
              tutorialApi.saveTutr(id, tutr);
          }
      };
      const next = (n: boolean) => {
          state.canGoNext = n; }
      watch<Consumer>(() => props.consumer as Consumer, async (consumer: Consumer) => {
          if (!state.editable && consumer) {
              state.consumer = consumer;
              state.stepIndex = consumer.stepIndex;
          }
      });
      watch<Tutr>(() => props.tutr as Tutr, async (tutr: Tutr) => {
            if (tutr) {
                state.tutr = tutr;
            }
      });
      const keyPressed = (e: any) => {
        e = e || window.event;

        if ( e.target.type ) return;
        if (!state.editable) {
             if (e.keyCode == '37') { onLeft(); }
             else if (e.keyCode == '39') { onRight(); }
        }

      };
      onMounted(() => {window.addEventListener('keyup', keyPressed);});
      onUnmounted(() => {window.removeEventListener('keyup', keyPressed);});
      return {
          state,
          onLeft,
          onRight,
          deleteStep,
          addStep,
          next,
      };
  },
}
</script>

<style lang="scss">
.toolbar {
        position: absolute;
        display: inline-flex;
        background: #fafafa;
        border: 1px solid #f0f0f0;
        border-bottom: 0;
        border-radius: 3px 3px 0 0;
        // box-shadow: 0 12px 18px 0 rgba(120, 93, 153, 0.1);
        bottom: 100%;
        right: 20px;
        padding: 0 0 0 3px;
        vertical-align: top;
        color: #fff;
        padding: 2px 5px;
        font-weight: bold;
        cursor: pointer;
    }
.stepper {
    display: flex;
    justify-content: flex-start;
    position: relative;
    align-items: center;
    padding: 15px;
    padding-bottom: 0px;
    flex-direction: column;
    flex: 1;
    border-bottom: 1px none #000;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #f0f0f0;
    background-color: #fff;
    box-shadow: 0 12px 18px 0 rgba(120,93,153,0.1);
    .action {
        // max-width: 50%;
        &.left {
            left: -40px;
            position: absolute;
        }
        &.right {
            right: -40px;
            position: absolute;
        }
    }
    h2 { font-size: 1.5em; }
    h3 { font-size: 1.2em; }
    h2, h3 { margin-bottom: 1rem; }
    ul { list-style: square inside; margin: 1em; }
}
@media only screen and (max-width: 1050px) {
  .stepper {
    .action {
        max-width: 50%;
        &.left {
            left: -40px;
            position: absolute;
        }
        &.right {
            right: -40px;
            position: absolute;
        }
    }
  }
}
.inline-edit {
    width: 100%;
    align-self: flex-start;
    .ck-content {
        margin-bottom: 1rem;
        padding: 1rem;
        border: 1px solid rgba(0, 0, 0, 0.15);
        min-height: 300px;
    }
    .step-content {
        margin-bottom: 1rem;
        min-height: 300px;
        blockquote {
            overflow: hidden;
            padding-right: 1.5em;
            padding-left: 1.5em;
            margin-left: 0;
            margin-right: 0;
            font-style: italic;
            border-left: 5px solid #ccc;
        }
        table {
            border-collapse: collapse;
            border-spacing: 0;
            border: 1px double #b3b3b3;
        }
    }
}
.action {
  cursor: pointer;
}
</style>
