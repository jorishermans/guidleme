<template>
    <div ref="el" class="inline-edit-text-code" v-if="state.enabled">
        <client-only v-if="state.editable" placeholder="Loading inline editor ...">
            <inline-editor
              v-model="state.editorData"
              @input="onEditorInput"
            ></inline-editor>
        </client-only>
        <div v-if="!state.editable" v-html="state.editorData" class="step-code-content">test</div>
        <div class="code-editor-box">
          <b-select v-model="state.language" @input="onEditorInput" v-if="state.editable" placeholder="Select a language">
                  <option
                      v-for="option in state.languages"
                      :value="option"
                      :key="option">
                      {{ option }}
                  </option>
              </b-select>
          <client-only placeholder="Loading code editor ...">
              <CodeEditor
              :width="state.width"
              height="400"
              theme="vs-dark"
              :language="state.language"
              :value="state.code"
              :options="{}"
              @change="onCodeChange"
              ></CodeEditor>
          </client-only>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { inject, onMounted, reactive, computed, watch, ref } from '@vue/composition-api';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import CodeEditor from '../../../components/common/CodeEditor.vue';
import InlineEditor from '../../../components/common/InlineEditor.vue';

interface TextAndCodeStep {
    code: string;
    text: string;
    language: string;
}

const DEFAULT_TEXT = 'A code example for you ...';

export default Vue.extend({
  name: 'GmCodeEditorStep',
  props: ['data', 'editable'],
  components: {
    CodeEditor,
    InlineEditor
  },
  setup: (props, { emit }) => {
      const el = ref({})

      const elHtml = el.value as HTMLElement;
      const state = reactive({
        enabled: false,
        code: 'const noop = () => {}',
        editorData: DEFAULT_TEXT,
        language: 'javascript',
        editable: props.editable as Boolean,
        width: elHtml.clientWidth - 10,
        languages: ['bat', 'kotlin', 'cpp', 'csharp', 'css', 'dockerfile', 'fsharp', 'go', 'html', 'java', 'javascript', 'json', 'less', 'nim',
          'markdown', 'objective', 'elixir', 'php', 'powershell', 'python', 'r', 'graphql', 'ruby', 'rust', 'scheme', 'scss', 'shell', 'solidity', 'swift', 'typescript', 'xml', 'yaml']
      });

      const inputStream = new Subject();
      inputStream.pipe(debounceTime(500)).subscribe(x => emit('update', x));
      const onEditorInput = () => {
            const data = { text: state.editorData, code: state.code, language: state.language };
            inputStream.next(data);
      };
      const onCodeChange = (code: any) => {
          state.code = code;
          const data = { text: state.editorData, code: state.code, language: state.language };
          inputStream.next(data);
      }

      watch<TextAndCodeStep>(() => props.data as TextAndCodeStep, async (data: TextAndCodeStep) => {
             state.enabled = true;
            if (data && data.text) {
                state.editorData = data.text;
                state.code = data.code;
                state.language = data.language || 'javascript';
            }
      });
      return {
          state,
          onEditorInput,
          onCodeChange,
          el,
      };
  },
});
</script>

<style lang="scss">
.inline-edit-text-code {
    width: 100%;
    align-self: flex-start;
    .ck-content {
        padding: 1rem !important;
        border: 1px solid rgba(0, 0, 0, 0.15) !important;
        min-height: 60px;
    }
}
.code-editor-box {
  padding: 15px 0;
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
