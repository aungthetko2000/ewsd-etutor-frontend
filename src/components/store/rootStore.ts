import { tutorStore } from './tutor'
import { userStore } from './user'

export class RootStore{
    tutorStore = tutorStore
    userStore = userStore
}

export const rootStore = new RootStore();