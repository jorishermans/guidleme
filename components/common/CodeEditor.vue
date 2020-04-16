<template>
    <div ref="root" class="monaco_editor_container" :style="style"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import { inject, onMounted, reactive, computed, watch, ref } from '@vue/composition-api';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

interface TextStep {
    text: string;
}

function noop() { }

export default Vue.extend({
  name: 'CodeEditor',
  props: {
    width: {type: [String, Number], default: '100%'},
    height: {type: [String, Number], default: '100%'},
    original: String,
    value: String,
    language: {type: String, default: 'javascript'},
    theme: {type: String, default: 'vs'},
    options: {type: Object, default() {return {};}},
    editorMounted: {type: Function, default: noop},
    editorBeforeMount: {type: Function, default: noop}
  },
  setup: (props, { emit }) => {
      const monaco = require( 'monaco-editor/esm/vs/editor/editor.api' );
      const root = ref(null);

      const style = computed(() => {
          const { width, height } = props;
          console.log(width, height);
          return {
            width: !/^\d+$/.test(width as string) ? width : `${width}px`,
            height: !/^\d+$/.test(height as string) ? height : `${height}px`
          }
        });

      let editor: any;
      const initMonaco = () => {
        console.log(root.value);
        const options = <any>props.options;
        editor = monaco.editor['create'](root.value, {
          value: props.value,
          language: props.language,
          theme: props.theme,
          ...options
        });
        // _setModel(props.value, props.original);
        // _setLanguage(props.language);
        _editorMounted(editor);

        console.log(`model language was changed to ${editor.getModel().getLanguageIdentifier().language}`);
      }

      const _setLanguage = (language: any) => {
          editor && monaco.editor.setModelLanguage(editor.getModel(), language);
      }

      const _editorMounted = (editor: any) => {
        editor.onDidChangeModelContent((event: any) => {
          const value = _getValue();
          _emitChange(value, event);
        });
        editor.onDidChangeModelLanguage((event: any) => {
          console.log(event);
        });
      }

      const _setValue = (value: string) => {
        if(editor) return editor.setValue(value);
      }

      const _getValue = () => {
        if(!editor) return '';
        return editor.getValue();
      }

      const _emitChange = (value: any, event: any) => {
          emit('change', value, event);
          emit('input', value);
      }

      onMounted(() => {
        console.log(root.value) // <div/>
        initMonaco();
      })

      watch<string>(() => props.options as any, async (options: any) => {
           editor && editor.updateOptions(options);
      });

      watch<string>(() => props.value as string, async (value: string) => {
          editor && value !== _getValue() && _setValue(value);
      });

      watch<string>(() => props.language as string, async (language: string) => {
          _setLanguage(language);
      });

      watch<string>(() => props.theme as string, async (theme: string) => {
          editor && monaco.editor.setTheme(theme);
      });
      return { style, root };
  },
});
</script>
