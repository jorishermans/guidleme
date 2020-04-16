import { BlockStackApiService, BlockStackSymbol } from '@/services/blockstack.service';
import { inject } from '@vue/composition-api';

export function checkIsSignIn() {
    const blockstackApi: BlockStackApiService | void = inject<BlockStackApiService>(BlockStackSymbol);

    let isSignedIn = false;
    if (blockstackApi) {
        isSignedIn = blockstackApi.isUserSignedIn();
    }
    return isSignedIn;
}
