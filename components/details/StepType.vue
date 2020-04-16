<template>
<v-switch :value="state.stepType">
    <template #empty>
        <div class="inline-edit">
            <h2>Choose your step type:</h2> <br />
            <p class="item" @click="changeType('html')">
                <span class="subtitle">text</span> <br />
                Use a wyswyg editor to explain your next step to the end-user.</p>
            <p class="item" @click="changeType('multiplechoice')">
                <span class="subtitle">multiple choice</span> <br/>
                Add a question with 3 or more possible answers, to test your audience.
            </p>
            <p class="item" @click="changeType('code')">
                <span class="subtitle">text + Code</span> <br/>
                Add some code examples as a next step.
            </p>
            <p class="item" @click="changeType('code_challenge')">
                <span class="subtitle">code challenge</span> <br/>
                Add a code challenge, let a user solve a code problem and verify with the correct answer.
            </p>
        </div>
    </template>
    <template #html>
        <gm-text-step :data="state.stepData" :editable="state.editable" v-on:update="updateStep">
        </gm-text-step>
    </template>
    <template #multiplechoice>
        <gm-multiple-choice :data="state.stepData"
                :editable="state.editable"
                v-on:next="next"
                v-on:update="updateStep">
        </gm-multiple-choice>
    </template>
    <template #code>
        <gm-code-editor-step :data="state.stepData"
                :editable="state.editable"
                v-on:update="updateStep">
        </gm-code-editor-step>
    </template>
    <template #code_challenge>
        <gm-code-editor-challenge :data="state.stepData"
                :editable="state.editable"
                v-on:next="next"
                v-on:update="updateStep">
        </gm-code-editor-challenge>
    </template>
</v-switch>
</template>

<script lang="ts">
import Vue from 'vue';
import { TutorialsService, TutorialsSymbol, Tutr } from '../../services/tutorial.service';
import { inject, onMounted, reactive, computed, watch } from '@vue/composition-api';
import GmTextStep from '@/components/details/steps/GmTextStep.vue';
import GmMultipleChoice from '@/components/details/steps/GmMultipleChoice.vue';
import GmCodeEditorStep from '@/components/details/steps/GmCodeEditorStep.vue';
import GmCodeEditorChallenge from '@/components/details/steps/GmCodeEditorChallenge.vue';
import VSwitch from '@/components/common/VSwitch.vue';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { uniqueID } from '../../utilities/unique-id';

export interface StepTypeState {
    tutr: Tutr | {};
    stepIndex: number;
    stepData: {};
    stepType: any;
    editable: boolean;
}

export default Vue.extend({
  props: ['id', 'index', 'tutr', 'editable'],
  components: {
      VSwitch,
      GmTextStep,
      GmMultipleChoice,
      GmCodeEditorStep,
      GmCodeEditorChallenge,
  },
  setup: (props, { emit }) => {
      const tutorialApi: TutorialsService | void = inject<TutorialsService>(TutorialsSymbol);

      const state: StepTypeState = reactive({
        tutr: {},
        stepIndex: props.stepIndex as number || 0,
        editable: props.editable as boolean,
        stepData: computed(() => {
            if ((state.tutr as Tutr).steps) {
                return (state.tutr as Tutr).steps[state.stepIndex].data;
            }
            return {text: ''};
        }),
        stepType: computed(() => {
            if ((state.tutr as Tutr).steps) {
                return (state.tutr as Tutr).steps[state.stepIndex].type;
            }
            return 'none';
        })
      });
      const updateTutr = (id: string, tutr: Tutr) => {
          if (tutorialApi) {
              tutorialApi.saveTutr(id, tutr);
          }
      };
      const updateStep = (data: any) => {
          const tutr = state.tutr as Tutr;
          tutr.steps[state.stepIndex].data = data;
          updateTutr(props.id as string, tutr);
      }
      const changeType = (type: string) => {
          const tutr = state.tutr as Tutr;
          tutr.steps[state.stepIndex].type = type;
      }
      const next = (correct: boolean) => { emit('next', correct); }
      watch<Tutr>(() => props.tutr as Tutr, async (tutr: Tutr) => {
            if (tutr.steps) {
                if (tutr.steps.length === 0) {
                    tutr.steps.push({
                        type: 'empty',
                        id: uniqueID()
                    });
                    updateTutr(props.id as string, tutr);
                }
                state.tutr = tutr;
            }
      });
      watch<number>(() => props.index as number, async (index: number) => {
        state.stepIndex = index;
      });
      return {
          state,
          next,
          updateStep,
          changeType,
      };
  },
});
</script>

<style lang="scss">
.inline-edit {
    .item {
        background-color: #f0f0f0;
        color: #333;
        margin: 10px 0;
        padding: 10px;
        border-radius: 3px;
        cursor: pointer;
        &:hover {
            background-color: #ddd;
        }
        &.coming {
            .subtitle { color: #ccc; }
            background-color: #f9f9f9;
            color: #ccc;
        }
    }
}
</style>
