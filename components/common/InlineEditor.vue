<template>
    <div class="inline-editor" v-if="state.enabled">
        <ckeditor ref="editorElement"
            @ready="onReady"
            :editor="editor"
            v-model="state.editorData"
            :config="editorConfig"
            @input="onEditorInput">
        </ckeditor>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { inject, onMounted, reactive, computed, watch, ref } from '@vue/composition-api';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

interface TextStep {
    text: string;
}

export default Vue.extend({
  name: 'InlineEditor',
  props: ['value'],
  setup: (props, { emit }) => {
      //const InlineEditor = require( '@ckeditor/ckeditor5-build-inline' );
      const InlineEditor = {};
      const editor = InlineEditor;
      const editorConfig = {};
      const editorElement = ref({});

      const state = reactive({
        enabled: false,
        editorData: '',
      });

      let focusMe = () => {};
      const onReady = ( editor: any ) => {
        focusMe = () => {editor.editing.view.focus()};
        focusMe();
      }

      const inputStream = new Subject();
      inputStream.pipe(debounceTime(500)).subscribe(x => emit('input', x));
      const onEditorInput = (input: string) => {
            inputStream.next(input);
      };

      watch<string>(() => props.value as string, async (value: string) => {
             state.enabled = true;
            if (value) {
                state.editorData = value;
                focusMe();
            }
      });
      return {
          editor,
          editorConfig,
          state,
          onEditorInput,
          editorElement,
          onReady,
      };
  },
});
</script>

