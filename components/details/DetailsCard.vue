<template>
  <div>
      <section class="section" v-if="state.isLoading">
          <div class="container"><img class="loading-card" src="/img/loading.svg" alt="loading guidle me"
          /></div>
      </section>
      <template v-if="!state.isLoading">
        <section class="section top">
          <template v-if="state.tutorial">
              <div class="container">
              <h1 class="title">
                {{state.tutorial.title}}
                <span @click="edit"><b-icon v-if="state.editable" icon="pencil" type="is-primary"
                  class="action"></b-icon></span>
                <b-tooltip v-if="state.isStarted"
                  :label="state.tutorial.description | stripHtml"
                  position="is-bottom"
                  multilined>
                    <b-icon icon="alert-circle" type="is-primary" class="action"></b-icon>
                </b-tooltip>
                <b-tooltip
                  label="share this tutorial"
                  position="is-bottom"
                  multilined>
                    <span @click="isSharingActive = true"><b-icon
                      class="action" type="is-primary" icon="share"></b-icon></span>
                </b-tooltip>

              </h1>

              <b-modal :active.sync="isSharingActive" has-modal-card :width="800">
                    <div class="modal-card" style="width: auto">
                        <header class="modal-card-head">
                            <p class="modal-card-title">Share url</p>
                        </header>
                        <section class="modal-card-body">
                          <b-input v-model="state.shareUrl" class="shareUrl" />
                        </section>
                        <footer class="modal-card-foot">
                            <button class="button" type="button" @click="isSharingActive = false">Close</button>
                        </footer>
                    </div>
              </b-modal>
              <h2 v-if="!state.isStarted" class="subtitle" v-html="state.tutorial.description"></h2>
              <template v-if="!state.isLocal">
                  <p>By {{state.userName}}</p>
              </template>
              </div>
          </template>
        </section>
      </template>
      <start-tutorial v-if="!state.isLoading && !state.isStarted" v-on:start="start"></start-tutorial>
      <tutorial-step v-if="!state.isLoading && state.isStarted" :id="state.id" :tutr="state.tutorial"
                                        :consumer="state.consumer" :editable="state.editable"></tutorial-step>
    </div>
</template>

<script lang="ts">
import AppHeader from '@/components/AppHeader.vue'; // @ is an alias to /src
import TutorialStep from '@/components/details/TutorialStep.vue';
import StartTutorial from '@/components/details/StartTutorial.vue';
import { TutorialsService, TutorialsSymbol, Tutr } from '../../services/tutorial.service';
import { inject, onMounted, reactive, computed, watch, onServerPrefetch } from '@vue/composition-api';
import { BlockStackApiService, BlockStackSymbol } from '../../services/blockstack.service';
import { ConsumerService, ConsumerSymbol, Consumer } from '../../services/consumer.service';
import { formatDate, stripHtml } from '../../filters/';
import { GetUserName } from '../../composition/get-username.function';
import { useFetch } from 'nuxt-composition-api'

export default {
  props: ['id', 'profile', 'editable'],
  filters: {
    stripHtml,
  },
  components: {
      TutorialStep, StartTutorial,
  },
  /* head() {
        const self: any = this;
        // console.log((self.state.tutorial as Tutr).title)
        if (self.state.tutorial) {
            return {
              title: (self.state.tutorial as Tutr).title,
              meta: [{
                vmid: 'description',
                name: 'description',
                content: (self.state.tutorial as Tutr).description,
              },
              { charset: 'utf-8' },
              {
                property: 'og:title',
                content: (self.state.tutorial as Tutr).title,
                vmid: 'og:title',
              },
              {
                property: 'og:description',
                content: (self.state.tutorial as Tutr).title,
                vmid: 'og:description',
              }],
            };
        } else {
          return {}
        }

  }, **/
  setup: (props :any, context: any) => {
      const tutorialApi: TutorialsService | void = inject<TutorialsService>(TutorialsSymbol);
      const blockStackApi: BlockStackApiService | void = inject<BlockStackApiService>(BlockStackSymbol);
      const consumerApi: ConsumerService | void = inject<ConsumerService>(ConsumerSymbol);
      const author = GetUserName();
      let isSharingActive = false;
      const activateShare = () => { isSharingActive = true; };

      const state = reactive({
        isLoading: false,
        isStarted: false,
        tutorial: {title: '', description: '', author: '', steps: []},
        consumer: {},
        userName: '',
        id: '',
        shareUrl: '',
        editable: props.editable,
        isLocal: true,
      });

      const fetchData = async (id: any) =>  {
        const profile = props.profile as string;
          if (tutorialApi && consumerApi) {
            state.isLoading = true;
            state.id = id;

            state.isLocal = profile ? false : true;
            state.isStarted = props.editable as boolean;
            let userData;
            if (!profile) {
              state.tutorial = await tutorialApi.getTutr(id);

              if (state.tutorial) { state.tutorial.author = author; }
            } else if (blockStackApi) {
              userData = await blockStackApi.lookupProfile(profile);
              state.userName = userData.name;
              if (userData) {
                  state.tutorial = await tutorialApi.getTutrByProfileName(profile, id);
                  const {consumer, isStarted} = await consumerApi.initConsumer(id, state.tutorial);
                  state.isStarted = isStarted;
                  state.consumer = consumer;
              }
            }
            state.shareUrl = `https://app.guidle.me/p/${userData ? profile : author}/${props.id}`;
            state.isLoading = false;
            console.log('the end is here ...');
          }
      }



      watch<string>(() => props.id as string, async (id: string) => {
          useFetch(async () => {
            console.log('use fetch ...');
            await fetchData(props.id);
          });
          console.log('also here ...');
      });

      const edit = () => {
        const index = props.id as string;
        context.root.$router.push(`/edit/${index}`);
      };
      const start = (started: boolean) => { state.isStarted = started; };

      return {
          state,
          edit,
          start,
          isSharingActive,
          activateShare,
      };
  },
};
</script>

<style lang="scss">
.section.top {
  padding-bottom: 0;
}
.title, .sub-title {
  color: #666;
}
.shareUrl {
  min-width: 600px;
}
.action {
  cursor: pointer;
}
.loading-card {
  position: fixed;
  left: calc(50% - 50px);
  top: calc(50% - 50px);;
}
</style>
