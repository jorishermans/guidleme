<template>
    <div class="inline-edit" v-if="state.enabled">
        <client-only v-if="state.editable" placeholder="Loading inline editor ...">
            <inline-editor
              v-model="state.editorData"
              @input="onEditorInput"
            ></inline-editor>
          </client-only>
        <div v-if="!state.editable" v-html="state.editorData" class="step-content">test</div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { inject, onMounted, reactive, computed, watch, ref } from '@vue/composition-api';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import InlineEditor from '../../../components/common/InlineEditor.vue';

interface TextStep {
    text: string;
}

const DEFAULT_TEXT = 'This is a step that needs to come here ...';

export default Vue.extend({
  name: 'GmTextStep',
  props: ['data', 'editable'],
  components: { InlineEditor },
  setup: (props, { emit }) => {

      const state = reactive({
        enabled: false,
        editorData: 'This is a step that needs to come here ...',
        editable: props.editable as boolean,
      });

      const inputStream = new Subject();
      inputStream.pipe(debounceTime(500)).subscribe(x => emit('update', x));
      const onEditorInput = (input: string) => {
            const data = { text: input };
            inputStream.next(data);
      };

      watch<TextStep>(() => props.data as TextStep, async (data: TextStep) => {
             state.enabled = true;
            if (data && data.text) {
                state.editorData = data.text;
                // focusMe();
            }
      });
      return {
         onEditorInput,
         state,
      };
  },
});
</script>

<style lang="scss">
.inline-edit {
    width: 100%;
    align-self: flex-start;
    .ck-content {
        margin-bottom: 1rem;
        padding: 1rem !important;
        border: 1px solid rgba(0, 0, 0, 0.15) !important;
        min-height: 300px;
    }
    .step-content {
        margin-bottom: 1rem;
        min-height: 300px;
    }
}
</style>
