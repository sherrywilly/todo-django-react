import React, { Component } from 'react';
import './App.css';
import CustomModel from './Modal' ;
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: false,
      viewCompleted: false,
      activeItem: {
        title: "",
        description: "",
        completed: false
      },
      taskList: [],
    };
  }
componentDidMount(){
  this.refreshList();
}

refreshList = ()=>{
  axios.get('http://localhost:8000/api/')
  .then(res=>this.setState({taskList:res.data}))
  .catch(error=>console.log(error));
};

  displayCompleted = status => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }
    return this.setState({ viewCompleted: false });
  }
  renderTabList = () => {
    return (
      <div className="my-5 tab-list d-flex justify-content-between">
        <span onClick={() => this.displayCompleted(true)} className={this.state.viewCompleted ? "active" : ""}>
          Completed
        </span>
        <span onClick={() => this.displayCompleted(false)} className={this.state.viewCompleted ? "" : "active"}>
          InCompleted
        </span>
      </div>
    )
  }
  // rendering items in the list incompleted or completed
  renderItems = () => {
    const { viewCompleted } = this.state
    const newItems = this.state.taskList.filter(item => item.completed === viewCompleted);
    return newItems.map(item => (
      <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
        <span className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : ""}`} title={item.title}>
          {item.title}
        </span>
        <span>
          <button className="btn btn-info m-2 text-light" onClick={() => this.editItem(item)}>Edit</button>
          <button className="btn btn-danger m-2" onClick = {()=>this.handleDelete(item)}>Delete</button>
        </span>
      </li>
    ))
  };
  toggle = () => {
    this.setState({ model: !this.state.model });
  };
  handleSubmit = item => {
    this.toggle();
    // alert("saved" + JSON.stringify(item));
    if (item.id){
      axios.put(`http://localhost:8000/api/${item.id}/`,item)
      .then(res=>this.refreshList());
      return;
    }
    axios
    .post("http://localhost:8000/api/", item)
    .then(res => this.refreshList());
    
  }
  handleDelete = item => {

    axios
    .delete(`http://localhost:8000/api/${item.id}/`)
    .then(res => this.refreshList());
  }

  createItem = ()=>{
    const item = {title:"",model:!this.state.model}
    this.setState({activeItem:item,model:!this.state.model})
  }
  editItem = item=>{
    this.setState({activeItem:item,model:!this.state.model})
  }

  render() {
    return (
      <main className="content p-3 mb-2 bg-info">
        <div className="text-black text-uppercase text-center my-4">
          <h1 className="row">
            <div className="col-md-6 col-sm-10 mx-auto p-0">
              <div className="card p-3">
                <div>
                  <button className="btn btn-warning text-dark" onClick={()=>this.createItem()}>Add Task</button>
                </div>
                {this.renderTabList()}
                <ul className="list-group list-group-flush">
                  {this.renderItems()}
                </ul>
              </div>
            </div>
          </h1>
        </div>
        {this.state.model?(<CustomModel  activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}/>):null}
      </main>
    )
  }

}
export default App;
