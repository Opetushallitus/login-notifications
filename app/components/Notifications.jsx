import React from 'react';

import AddNotification from './AddNotification'


export class Notification extends React.Component{
  render(){
    const n = this.props.notification;
    const del = this.props.del;
    const edit = this.props.edit;
    return(
      <div className="notification" key={n.id}>
        <div className="details">
          <div><label>fi:</label>{n.text_fi}</div>
          <div><label>sv:</label>{n.text_sv}</div>
        </div>
        <div className="controls">
          <button className="btn btn-edit" onClick={() => edit(true, n)}><span className="glyphicon glyphicon-pencil"/></button>
          <button className="btn btn-delete" onClick={() => del(n.id)}><span className="glyphicon glyphicon-remove"/></button>
        </div>
      </div>)
  }
}

export default class Notifications extends React.Component {

  render(){

    const notifications = this.props.state.notifications;
    const editing = this.props.state.editing;
    const controller = this.props.controller;
    const editedData = this.props.state.editedData;

    const rendered = notifications.map(n =><Notification key={n.id} notification={n} del={controller.deleteNotification} edit={controller.showEdit}/>);
    return(
      <div>
        <h2>Opintopolun kirjautumissivun tiedotteet</h2>
        {(notifications === undefined || notifications.length == 0) ?
          <h3>Ei aktiivisia tiedotteita</h3> :
          <div>{rendered}</div>
        }
        {editing ?
          <AddNotification data={editedData} onSubmit={controller.addNotification} back={() => controller.showEdit(false, {})}/> :
          <div className="editNotification">
            <button className="btn btn-add" onClick={() => controller.showEdit(true, {})}>Lisää uusi</button>
          </div>
        }
      </div>)
  }
}