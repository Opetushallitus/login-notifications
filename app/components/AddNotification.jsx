import React from 'react'

export default class AddNotification extends React.Component{

  constructor(props){
    super();
    this.state = props.data;
  }

  componentWillReceiveProps(props){
    this.state = props.data;
  }

  inputsValid(){
    return (this.state.text_fi && this.state.text_fi !== "") &&
           (this.state.text_sv && this.state.text_sv !== "")
  }

  render(){
    const editing = "id" in this.state;

    return(
      <div className="editNotification">
        <form className="editNotificationForm" onSubmit={(e) => {
          e.preventDefault();
          if(this.inputsValid()){
            this.props.onSubmit(this.state);
          }
        }}>
          <h3>{editing ? "Muokkaa tiedotetta" : "Lisää uusi tiedote"}</h3>
          <div>
            <label>Tiedote suomeksi:</label>
            <input name="text_fi" className="text-input" type="text" value={this.state.text_fi} onChange={e => this.setState({text_fi: e.target.value})}/>
          </div>
          <div>
            <label>Tiedote ruotsiksi:</label> <input name="text_sv" className="text-input" type="text" value={this.state.text_sv} onChange={e => this.setState({text_sv: e.target.value})}/>
          </div>
          <input type="submit" value={editing ? "Tallenna" : "Lisää"} className="btn-add"/>
          <button type="button" className="btn-add" onClick={this.props.back}>Takaisin</button>
       </form>
      </div>
    )
  }
}