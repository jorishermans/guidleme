import { BlockStackApiService, BlockStackSymbol } from '@/services/blockstack.service';
import { inject } from '@vue/composition-api';

export const signInWithBlockstack = (fn: Function = () => {}) => {
    const blockstackApi: BlockStackApiService | void = inject<BlockStackApiService>(BlockStackSymbol);

    return () => {
        if (blockstackApi) {
            blockstackApi.addSignInNotify(fn);
            blockstackApi.signIn();
            // blockstackApi.redirectToSignIn();
        }
    };
};
