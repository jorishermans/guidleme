<template>
    <div ref="el" class="inline-edit-text-code" v-if="state.enabled">
        <client-only v-if="state.editable" placeholder="Loading inline editor ...">
            <inline-editor
              v-model="state.editorData"
              @input="onEditorInput"
            ></inline-editor>
        </client-only>
        <div v-if="!state.editable" v-html="state.editorData" class="step-code-content">test</div>
        <div class="challenge-code-editor-box">
          <b-select v-model="state.language" @input="onEditorInput" v-if="state.editable" placeholder="Select a language">
                  <option
                      v-for="option in state.languages"
                      :value="option"
                      :key="option">
                      {{ option }}
                  </option>
              </b-select> <br />
          <div class="highlite" v-if="state.correct"><span>You nailed it! Correct answer!</span></div>
          <label class="label">Code challenge</label>
          <CodeEditor
              :width="state.width"
              :height="state.editable ? 180 : 500"
              theme="vs-dark"
              :language="state.language"
              :value="state.code"
              :options="{}"
              @change="onCodeChange"
              ></CodeEditor>
          <div v-if="state.editable">
              <label class="label">Solution</label>
            <CodeEditor
                :width="state.width"
                height="180"
                theme="vs-dark"
                :language="state.language"
                :value="state.solution"
                :options="{}"
                @change="onCodeSolutionChange"
                ></CodeEditor>
          </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import InlineEditor from '../../../components/common/InlineEditor.vue';
import CodeEditor from '../../../components/common/CodeEditor.vue';
import { inject, onMounted, reactive, computed, watch, ref } from '@vue/composition-api';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import SimpleCrypto from "simple-crypto-js";

interface TextAndCodeStep {
    code: string;
    text: string;
    language: string;
    solution: string;
}

const DEFAULT_TEXT = 'Can you handle this code challenge ...';

export default Vue.extend({
  name: 'GmCodeEditorChallengeStep',
  props: ['data', 'editable'],
  components: {
    InlineEditor,
    CodeEditor
  },
  setup: (props, { emit }) => {
      const editorElement = ref({});
      const el = ref({});

      const elHtml = el.value as HTMLElement;
      const cryptoKey = new SimpleCrypto('gm-solution');

      const state = reactive({
        enabled: false,
        code: 'const noop = () => {}',
        solution: 'const noop = () => {}',
        correct: false,
        editorData: DEFAULT_TEXT,
        language: 'javascript',
        editable: props.editable as Boolean,
        width: elHtml.clientWidth - 10,
        languages: ['bat', 'kotlin', 'cpp', 'csharp', 'css', 'dockerfile', 'fsharp', 'go', 'html', 'java', 'javascript', 'json', 'less',
          'markdown', 'objective', 'elixir', 'php', 'powershell', 'python', 'r', 'graphql', 'ruby', 'rust', 'scheme', 'scss', 'shell', 'solidity', 'swift', 'typescript', 'xml', 'yaml']
      });
      emit('next', false);

      let focusMe = () => {};
      const onReady = ( editor: any ) => {
        focusMe = () => {editor.editing.view.focus()};
        focusMe();
      }

      const updateData = () => {
          const solution = cryptoKey.encrypt(state.solution);
          const data = { text: state.editorData, code: state.code, solution, language: state.language };
          inputStream.next(data);
      }

      const inputStream = new Subject();
      inputStream.pipe(debounceTime(500)).subscribe(x => emit('update', x));
      const onEditorInput = () => {
            updateData();
      };
      const onCodeChange = (code: any) => {
          state.code = code;
          if (state.editable) {
              updateData();
          } else {
              // check if code is = to solution
              if (code === state.solution) {
                  emit('next', true);
                  state.correct = true;
              }
          }
      };
      const onCodeSolutionChange = (code: any) => {
          state.solution = code;
          updateData();
      };

      watch<TextAndCodeStep>(() => props.data as TextAndCodeStep, async (data: TextAndCodeStep) => {
             state.enabled = true;
            if (data && data.text) {
                state.editorData = data.text;
                state.code = data.code;
                state.solution = `${cryptoKey.decrypt(data.solution)}`;
                state.language = data.language || 'javascript';
            }
      });
      return {
          state,
          onEditorInput,
          onCodeChange,
          onCodeSolutionChange,
          editorElement,
          onReady,
          el,
      };
  },
});
</script>

<style lang="scss">
.inline-edit-text-code-challenge {
    width: 100%;
    align-self: flex-start;
    .ck-content {
        padding: 1rem !important;
        border: 1px solid rgba(0, 0, 0, 0.15) !important;
        min-height: 60px;
    }
}
.challenge-code-editor-box {
  padding: 10px 0;
}
.editor {
  width: 100%;
  height: 800px;
  border:1px solid grey;
  .monaco-editor {
      width: 100% !important;
  }
}
</style>
