import { BlockStackApiService } from '@/services/blockstack.service';
import { Observable, ReplaySubject } from 'rxjs';
import { Tutr } from './tutorial.service';
import { LocalStorageProvider } from '@storagestack/localstorage-provider';
import { MemoryProvider, ss } from '@storagestack/core';
import { IndexerMiddleware, HashTableIndex } from './indexer.middleware';

export interface ConsumerSum {
   lastUpdated: Date;
   favorite?: boolean;
   tutrRef: TutrRef;
   path: string;
   length: number;
   stepIndex: number;
}

export interface ConsumerDict {
    [name: string]: ConsumerSum;
}

export interface ConsumerIndex {
   paths: ConsumerDict;
}

export interface Consumer {
   tutrRef: TutrRef;
   length: number;
   stepIndex: number;
   steps: ConsumerStep[];
}

export interface TutrRef {
    title: string;
    author: string;
    id: string;
}

export interface ConsumerStep {
   comment: string;
}

export const ConsumerSymbol = Symbol();
const indexFileName = 'consumer-index.json';

export class ConsumerService {

    public privately = false;
    private indexerMiddleware: IndexerMiddleware<Consumer, ConsumerSum>;

    private _index$: ReplaySubject<HashTableIndex<ConsumerSum>> = new ReplaySubject<HashTableIndex<ConsumerSum>>(1);
    public get index$(): Observable<HashTableIndex<ConsumerSum>> {
        return this._index$;
    }

    constructor(blockStackApiService: BlockStackApiService) {
        ss.registerProvider(new MemoryProvider(), 'consumer-*', () =>  this.privately);
        if (!process.server) {
            ss.registerProvider(new LocalStorageProvider(), 'consumer-*', () => {
                return !blockStackApiService.isUserSignedIn() && !this.privately;
            });
        }

        const nameToId = (name: string) => {
            return name.replace('consumer-', '').replace('.json', '');
        };
        const transformation = (name: string, t: Consumer) => {
            const transformed = {lastUpdated: new Date(),
                tutrRef: t.tutrRef,
                length: t.length,
                stepIndex: t.stepIndex,
                path: name};
            return transformed;
        };
        this.indexerMiddleware = new IndexerMiddleware<Consumer, ConsumerSum>(transformation, nameToId, indexFileName);
        this.indexerMiddleware.listen = (index: HashTableIndex<ConsumerSum>) => this._index$.next(index);
        ss.use('consumer-*', this.indexerMiddleware);
    }

    public async save(id: string, consumer: Consumer) {
        const path = `consumer-${id}.json`;

        await ss.set(path, consumer, {encrypt: true});
        return true;
    }

    public async getConsumer(id: string) {
        const path = `consumer-${id}.json`;
        return this.getConsumerByPath(path, { decrypt: true });
    }

    public async initConsumer(id: string, tutr: Tutr | null) {
        const path = `consumer-${id}.json`;
        let consumer = await this.getConsumerByPath(path, { decrypt: true });
        let isStarted = true;
        if (!tutr) return {consumer, isStarted};
        if (!consumer) {
            consumer = { stepIndex: 0, steps: [], length: tutr.steps.length,
                            tutrRef: { author: tutr.author, title: tutr.title, id} };
            isStarted = false;
        } else if (!consumer.tutrRef.author) {
            consumer.tutrRef.author = tutr.author;
        }
        return {consumer, isStarted};
    }

    public async delete(id: string) {
        const path = `consumer-${id}.json`;
        ss.delete(path);
    }

    private async getConsumerByPath(path: string, options?: any) {
        const result = await ss.get(path, options);
        return result.content;
    }

}
