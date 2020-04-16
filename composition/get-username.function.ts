import { BlockStackApiService, BlockStackSymbol } from '@/services/blockstack.service';
import { inject } from '@vue/composition-api';

export function GetUserName() {
    const blockstackApi: BlockStackApiService | void = inject<BlockStackApiService>(BlockStackSymbol);
    if (blockstackApi) {
        console.log('get blockstack current user', blockstackApi.currentUser)
        return blockstackApi.currentUser ? blockstackApi.currentUser.username : '';
    }
    return '';
}
