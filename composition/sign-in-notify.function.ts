import { BlockStackApiService, BlockStackSymbol } from '@/services/blockstack.service';
import { inject } from '@vue/composition-api';

export function addSignInNotify(fn: Function) {
    const blockstackApi: BlockStackApiService | void = inject<BlockStackApiService>(BlockStackSymbol);

    let isSignedIn = false;
    if (blockstackApi) {
        blockstackApi.addSignInNotify(fn);
    }
    return isSignedIn;
}
