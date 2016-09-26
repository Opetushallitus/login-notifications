export function initController(dispatcher, events){

  function deleteNotification(id) {
    dispatcher.push(events.deleteNotification, id)
  }

  function addNotification(data) {
    dispatcher.push(events.addNotification, data)
  }

  function showEdit(show, data) {
    dispatcher.push(events.showEdit, {show: show,
                                      data: data})
  }

  function updateNotifications(data){
    dispatcher.push(events.updateNotifications, data)
  }

  return{
    deleteNotification : deleteNotification,
    addNotification :  addNotification,
    showEdit: showEdit,
    updateNotifications: updateNotifications
  }
}