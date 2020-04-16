import { Person } from "blockstack";

export interface AppHeaderState {
  signOut: Function;
  signIn: Function;
  isSignIn: boolean;
  user?: { person?: Person; username: string };
}
