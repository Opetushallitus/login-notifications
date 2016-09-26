import Bacon from 'baconjs'
import Promise from 'bluebird'
import Dispatcher from './dispatcher'
import axios from 'axios'
import {initController} from './controller'


const ax = Promise.promisifyAll(axios);
const dispatcher = new Dispatcher;
const noticeUrl = 'api/notifications';

const events = {
  addNotification: 'addNotification',
  deleteNotification: 'deleteNotification',
  showEdit: 'showEdit',
  updateNotifications : 'updateNotifications'
};

const controller = initController(dispatcher, events);

export function getController(){
  return controller;
}

export function initAppState() {

  const initialState = {notifications:[],
                        editing: false,
                        editedData: {}};

  const notificationsS = Bacon.fromPromise(ax.get(noticeUrl));

  function onGetNotifications(state, notifications) {
    return {...state, ['notifications']: notifications.data}
  }

  function deleteNotification(state, id) {
    ax({
      method:'delete',
      url: noticeUrl+'/'+id
    }).then(response => {
      console.log("Resp: "+ JSON.stringify(response));
      controller.updateNotifications(response)})
      .catch(e => console.log("Error deleting notification"));
   return {...state, editing: false}
  }


  function addNotification(state, notification){
    ax.post(noticeUrl+'/add', notification).then(response => controller.updateNotifications(response))
      .catch(e => console.log("Error adding notification"));
    return {...state, editing: false}
  }

  function showEdit(state, {show, data}){
    return {...state, ['editing']: show, ['editedData']: data}
  }

  return Bacon.update(initialState,
    [dispatcher.stream(events.addNotification)], addNotification,
    [dispatcher.stream(events.deleteNotification)], deleteNotification,
    [dispatcher.stream(events.showEdit)], showEdit,
    [dispatcher.stream(events.updateNotifications)], onGetNotifications,
    [notificationsS], onGetNotifications)
}