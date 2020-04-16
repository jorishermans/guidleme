import {
  BlockStackApiService,
  BlockStackSymbol
} from '../services/blockstack.service'
import { TutorialsService, TutorialsSymbol } from '../services/tutorial.service'
import { ConsumerService, ConsumerSymbol } from '../services/consumer.service'
import { provide } from '@vue/composition-api'
import { ss } from '@storagestack/core';
import { JsonMiddleware } from '@storagestack/json-middleware';

export default ({ app }) => {
  // console.log('app inject combined')
  ss.use('*', new JsonMiddleware());
  app.setup = () => {
    const blockStackService = new BlockStackApiService()
    provide(BlockStackSymbol, blockStackService)
    provide(TutorialsSymbol, new TutorialsService())
    provide(ConsumerSymbol, new ConsumerService(blockStackService))
  }
}
