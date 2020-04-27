import { UserSession, Person, lookupProfile, AppConfig } from 'blockstack';
import { ss } from '@storagestack/core';
import { BlockstackProvider } from '@storagestack/blockstack-provider';
import { showBlockstackConnect } from '@blockstack/connect';

export const BlockStackSymbol = Symbol();
export class BlockStackApiService {

    private user: {person: Person, username: string} | undefined = undefined;
    private userSession: UserSession;
    private signInNotify: Function[];
    private blockStackProvider: BlockstackProvider;

    constructor() {
        const appConfig = new AppConfig(['store_write', 'publish_data'])
        this.userSession = new UserSession({ appConfig: appConfig });
        this.signInNotify = [];

        this.blockStackProvider = new BlockstackProvider(this.userSession);
        ss.registerProvider(this.blockStackProvider);
    }

    public getAuthOptions() {
      return {
        finished: (u: { userSession: UserSession }) => {
          this.userSession = u.userSession;
          if (this.userSession.isUserSignedIn()) {
            let userData = this.userSession.loadUserData();
            const person = new Person(userData.profile);
            const username = userData.username;
            // console.log(userData, person.givenName);
            this.user = { person, username };
          }
          // console.log('finished', this.signInNotify, this.signInNotify.length);
          this.signInNotify.forEach(fn => {
            fn();
          });
          this.blockStackProvider.userSession = u.userSession;
        },
        appDetails: {
          name: 'Guidle Me',
          icon: 'https://app.guidle.me/img/icons/favicon.png',
        },
        userSession: this.userSession
      }
    }

    public addSignInNotify(fn: Function) {
      this.signInNotify.push(fn);
    }

    public signIn() {
      showBlockstackConnect(this.getAuthOptions());
    }

    public lookForUserData() {
        const session = this.userSession;
        let userData;
        if (typeof window !== 'undefined') {
          console.log('is user signed in', session.isUserSignedIn())
          if (session.isUserSignedIn()) {
              userData = session.loadUserData();
              const person = new Person(userData.profile);
              const username = userData.username;
              console.log(userData, person.name());
              this.user = { person, username };
              // context.root.$router.push('dashboard');
          } else if (session.isSignInPending()) {
              session.handlePendingSignIn()
                  .then((x: any) => {
                      window.location = window.location.origin as any;
                  });
          }
        }
        const user = this.user;
        return { userData, user, session };
    }

    public redirectToSignIn() {
        const origin = window.location.origin;
        this.userSession.redirectToSignIn(origin, origin + '/manifest.json', ['store_write', 'publish_data']);
    }

    public signUserOut() {
        const origin = window.location.origin;
        this.userSession.signUserOut(origin);
    }

    public isUserSignedIn() {
        return this.userSession.isUserSignedIn();
    }

    public signOut(redirectUrl?: string) {
        this.userSession.signUserOut(redirectUrl);
    }

    public async lookupProfile(userName: string) {
        return await lookupProfile(userName);
    }

    public get currentUser() { return this.user; }
 }
