<template>
  <div>
    <div class="container">
      <section class="section">
        <div class="container" v-if="state.first">
          <h1 class="title">Add a guidle</h1>
          <h2 class="subtitle">
            First create a title and description for your guidle.
          </h2>
        </div>
        <div class="container" v-if="!state.first">
          <h1 class="title">Edit a guidle</h1>
          <h2 class="subtitle">
            Edit a title and description for your guidle.
          </h2>
        </div>
      </section>
      <section class="section">
        <div class="add-new">
          <div>
            <b-input placeholder="Title" v-model="state.title"></b-input>
          </div>
          <br />
          <div class="add-edit-tutorial">
            <client-only placeholder="Loading inline editor ...">
              <inline-editor
                v-model="state.editorData"
              ></inline-editor>
            </client-only>
          </div>
          <b-button type="is-primary" @click="create(state.title, state.editorData)">Save</b-button>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import {
  reactive,
  inject,
  onMounted,
  SetupContext
} from '@vue/composition-api'
import { TutorialsService, TutorialsSymbol } from '../services/tutorial.service'
import { uniqueID } from '../utilities/unique-id'
import {
  BlockStackApiService,
  BlockStackSymbol
} from '../services/blockstack.service'
import { GetUserName } from '../composition/get-username.function'
import InlineEditor from '../components/common/InlineEditor.vue';

export default {
  components: {
    InlineEditor
   },
  setup: (props: any, context: SetupContext) => {
    const state = reactive({
      title: '',
      editorData: '<p>Description of the guidle me ...</p>',
      steps: [],
      first: true
    })
    const tutorialApi: TutorialsService | void = inject<TutorialsService>(
      TutorialsSymbol
    )
    const blockStackApi: BlockStackApiService | void = inject<
      BlockStackApiService
    >(BlockStackSymbol)
    const id = (<any>context.root).$route.params.id
    const uid = id ? id : uniqueID()
    const author = GetUserName()
    onMounted(() => {
      if (tutorialApi && blockStackApi && id) {
        tutorialApi.getTutr(id).then((tutr) => {
          state.title = tutr.title
          state.editorData = tutr.description
          state.steps = tutr.steps
          state.first = false
        })
      }
    })
    const create = (title: string, editorData: string) => {
      if (tutorialApi && blockStackApi) {
        tutorialApi
          .saveTutr(uid, {
            title,
            author,
            description: editorData,
            steps: state.steps
          })
          .then((x) => {
            // go to page and read out id in url ...
            (<any>context.root).$router.push(`/details/${uid}`);
          })
      }
    }
    return {
      state,
      create
    }
  }
}
</script>

<style lang="scss">
.add-edit-tutorial {
  width: 100%;
  align-self: flex-start;
  .ck-content {
    margin-bottom: 1rem;
    padding: 1rem !important;
    border: 1px solid rgba(0, 0, 0, 0.15) !important;
    min-height: 200px;
  }
}
.add-new {
    position: relative;
    align-items: center;
    padding: 15px;
    border-bottom: 1px none #000;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #f0f0f0;
    background-color: #fff;
    box-shadow: 0 12px 18px 0 rgba(120, 93, 153, 0.1);
}
</style>
