import { tutorStore } from './tutor'
import { userStore } from './user'
import { studentStore } from './student'
import { staffStore } from './staff'
import { meetingStore } from './meeting'
import { notificationStore } from './notifiation'
import { blogStore } from './blog'
import { messageStore } from './chat'
import { commentStore } from './comment'

export class RootStore{
    tutorStore = tutorStore
    userStore = userStore
    studentStore = studentStore
    staffStore = staffStore
    meetingStore = meetingStore
    notificationStore = notificationStore
    blogStore = blogStore
    messageStore = messageStore
    commentStore = commentStore
}

export const rootStore = new RootStore();