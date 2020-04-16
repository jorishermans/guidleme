import { IndexerMiddleware, HashTableIndex } from './indexer.middleware';
import { Observable, ReplaySubject } from 'rxjs';
import { ss } from '@storagestack/core';

export interface TutrSum {
   lastUpdated: Date;
   favorite: boolean;
   title: string;
   shortText: string;
   length: number;
   path: string;
}

export interface TutrDict {
    [name: string]: TutrSum;
}

export interface TutrIndex {
   paths: TutrDict;
}

export interface Tutr {
   title: string;
   author?: string;
   description: string;
   steps: TutrStep[];
}

export interface TutrStep {
   id: string;
   type: string;
   data?: any;
}

const nameToId = (name: string) => {
  return name.replace('tutr-', '').replace('.json', '');
};
const transformation = (name: string, t: Tutr) => {
      const transformed = {lastUpdated: new Date(),
      favorite: false,
      title: t.title,
      shortText: t.description.substr(0, 120),
      length: t.steps.length,
      path: name};
      return transformed;
};

export const TutorialsSymbol = Symbol();

export class TutorialsService {

    private indexerMiddleware: IndexerMiddleware<Tutr, TutrSum>;

    private _index$: ReplaySubject<HashTableIndex<TutrSum>> = new ReplaySubject<HashTableIndex<TutrSum>>(1);
    public get index$(): Observable<HashTableIndex<TutrSum>> {
        return this._index$;
    }

    constructor() {
      this.indexerMiddleware = new IndexerMiddleware(transformation, nameToId, 'my-tutr-index.json');
      this.indexerMiddleware.listen = (index: HashTableIndex<TutrSum>) => {
        this._index$.next(index);
      };
      ss.use('tutr-*', this.indexerMiddleware);
    }

    public reIndex() {
      this.indexerMiddleware = new IndexerMiddleware(transformation, nameToId, 'my-tutr-index.json');
      this.indexerMiddleware.listen = (index: HashTableIndex<TutrSum>) => {
        this._index$.next(index);
        };
      ss.use('tutr-*', this.indexerMiddleware);
    }

    public latestIndex() {

    }

    public async saveTutr(id: string, tutr: Tutr) {
        const path = `tutr-${id}.json`;
        await ss.set(path, tutr, {encrypt: false});
        return true;
    }

    public async getTutr(id: string) {
        const path = `tutr-${id}.json`;
        return this.getTutrByPath(path, { decrypt: false });
    }

    public async getTutrByProfileName(profileName: string, id: string) {
        const path = `tutr-${id}.json`;
        const options :any =  {username: profileName, zoneFileLookupURL: 'https://core.blockstack.org/v1/names/',
        decrypt: false};
        if(process.server) { options.app = 'http://localhost:3000'; }
        return this.getTutrByPath(path, options
           );
    }

    public async deleteTutr(id: string) {
        const path = `tutr-${id}.json`;
        await ss.delete(path);
    }

    private async getTutrByPath(path: string, options?: any) {
        const result = await ss.get(path, options);
        return result ? result.content : null;
    }

}
