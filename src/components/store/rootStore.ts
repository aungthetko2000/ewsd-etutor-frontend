import { userStore } from './user'

export class RootStore{
    userStore = userStore
}

export const rootStore = new RootStore();