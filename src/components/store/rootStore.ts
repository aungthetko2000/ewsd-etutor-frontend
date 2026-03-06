import { tutorStore } from './tutor'
import { userStore } from './user'
import { studentStore } from './student'
import { staffStore } from './staff'
import { meetingStore } from './meeting'
import { notificationStore } from './notifiation'
import { blogStore } from './blog'

export class RootStore{
    tutorStore = tutorStore
    userStore = userStore
    studentStore = studentStore
    staffStore = staffStore
    meetingStore = meetingStore
    notificationStore = notificationStore
    blogStore = blogStore
}

export const rootStore = new RootStore();