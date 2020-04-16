<template>
  <div>
    <AppHeader />
    <nuxt />
  </div>
</template>

<script lang="ts">
import { SetupContext, inject } from '@vue/composition-api'
import {
  BlockStackApiService,
  BlockStackSymbol
} from '../services/blockstack.service'
import AppHeader from '@/components/AppHeader.vue' // @ is an alias to /src

export default {
  components: { AppHeader },
  setup: () => {
    const blockstackApi: BlockStackApiService | void = inject<
      BlockStackApiService
    >(BlockStackSymbol)

    if (blockstackApi) {
      const { session } = blockstackApi.lookForUserData()
      if (session.isUserSignedIn()) {
        // context.root.$router.push('dashboard');
      }
    }
    return {}
  }
}
</script>
