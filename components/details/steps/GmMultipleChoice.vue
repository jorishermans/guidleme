<template>
    <div class="inline-edit">
        <div v-if="state.editable">
                <b-input placeholder="question" v-model="state.data.question" v-on:input="update" class="f-textfield-full" />
                <h3 class="answers">answers:</h3>
                <div class="t-answers">
                  <div class="answer" v-for="(a, index) in state.data.answers" v-bind:key="index + a.correct">
                      <b-radio name="answers" :id="index" :native-value="index" v-model="state.checked"
                                    @input="changeCorrect({value: $event, id: index})" class="f-answer">
                      </b-radio>
                      <b-input placeholder="answer" v-model="a.answer" v-on:input="update" class="f-textfield-full" />
                  </div>
                </div>
                <div class="add">
                    <b-button class="action" @click="add()">add</b-button>
                </div>
        </div>
        <div v-if="!state.editable" class="step-content">
            <h2 v-html="state.data.question"></h2>
            <h3 class="answers">Choose your answer:</h3>
            <div v-for="(a, index) in state.data.answers" class="answer item"
                v-bind:class="{ 'active': (index === state.active) }"
                v-bind:key="index" @click="choose(a.correct, index)">
                {{a.answer}}
            </div>
            <div class="highlite" v-if="state.correct"><span>You nailed it! Correct answer!</span></div>
            <div class="error" v-if="state.error">Please try again, this is not correct.</div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { inject, onMounted, reactive, computed, watch } from '@vue/composition-api';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

interface MultipleChoiceStep {
    question: string;
    answers: Answer[];
}
interface Answer {
    answer: string;
    correct: boolean;
}

export default Vue.extend({
  name: 'GmMultipleChoice',
  props: ['data', 'editable'],
  setup: (props, { emit }) => {
      const state = reactive({
        data: {question: '', answers: [ { answer: '', correct: true }, { answer: '', correct: false } ]},
        editable: <boolean>props.editable,
        correct: false,
        error: false,
        active: -1,
        checked: 0
      });

      emit('next', false);

      watch<any>(() => <any>props.data, async (data: any) => {
            if (data && data.question) {
                state.data = data;
                state.checked = state.data.answers.findIndex( x => x.correct === true);
            }
      });
      const inputStream = new Subject();
      inputStream.pipe(debounceTime(500)).subscribe(x => {
          if (state.editable) {
              emit('update', x);
          }});
      const add = () => {
          state.data.answers.push({ answer: '', correct: false });
      }
      const update = () => {
          inputStream.next(state.data);
      }
      const changeCorrect = (e: {value: boolean, id: number}) => {
          state.data.answers.forEach(a => a.correct = false);
          state.data.answers[e.id].correct = true;

          console.log(state.data);
          inputStream.next(state.data);
      }
      const choose = (correct: boolean, index: number) => {
            state.correct = correct;
            state.error = !correct;
            state.active = index;
            emit('next', correct);
      }
      return {
          state,
          add,
          update,
          changeCorrect,
          choose,
      };
  },
});
</script>

<style lang="scss">
$baseColor: #009E7F;
$backgroundFormFields: #fff;

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
        .answer.item {
            background-color: #f0f0f0;
            height: 25px;
            margin: 10px 0;
            padding: 0 10px;
            border-radius: 5px;
            cursor: pointer;
            &:hover {
                background-color: $baseColor;
                color: $backgroundFormFields;
            }
            &.active {
                border: 2px solid $baseColor;
            }
        }
        .error, .highlite { margin-top: 30px; }
        .error { color: #D8000C; }
        .highlite span { font-weight: bold; background-color: #FFFF00; }
    }
}
.answers {
    border-bottom: 1px solid #c0c0c0;
    margin: 25px 0px;
    color: #c0c0c0;
}
.t-answers {
  display: table;
  width: 100%;
  .answer {
      margin: 0 5px;
      display: table-row;
      width: 100%;
      .f-answer {
        display: table-cell;
      }
      .f-textfield-full, .f-textfield-full label { display: table-cell; top: -20px; }
    }

}
.add {margin: 25px;}
.f-textfield-full, .f-textfield-full label {width: 90%;}
</style>
