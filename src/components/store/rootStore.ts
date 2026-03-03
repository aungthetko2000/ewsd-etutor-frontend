import { tutorStore } from './tutor'
import { userStore } from './user'
import { studentStore } from './student'
import { staffStore } from './staff'
import { meetingStore } from './meeting'

export class RootStore{
    tutorStore = tutorStore
    userStore = userStore
    studentStore = studentStore
    staffStore = staffStore
    meetingStore = meetingStore
}

export const rootStore = new RootStore();