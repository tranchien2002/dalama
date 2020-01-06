import React, { Component } from 'react';
import { Stitch, AnonymousCredential, RemoteMongoClient } from 'mongodb-stitch-browser-sdk';
import './App.css';
import { Button } from 'antd';

class App extends Component {
  constructor() {
    super();
    this.state = {
      todos: [],
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.displayTodos = this.displayTodos.bind(this);
    this.addTodo = this.addTodo.bind(this);
  }

  componentDidMount() {
    this.client = Stitch.initializeDefaultAppClient('ocean-assets-zduhd');
    const mongodb = this.client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas');
    this.db = mongodb.db('ocean');
    this.displayTodosOnLoad();
  }

  displayTodos() {
    this.db
      .collection('assets')
      .find({}, { limit: 1000 })
      .asArray()
      .then((todos) => {
        this.setState({
          todos
        });
      });
  }

  displayTodosOnLoad() {
    this.client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(this.displayTodos)
      .catch(console.error);
  }

  addTodo(event) {
    event.preventDefault();
    const { value } = this.state;

    this.db
      .collection('assets')
      .insertOne({
        owner_id: this.client.auth.user.id,
        item: value
      })
      .then(this.displayTodos);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <div className='App'>
        <h3>This is a todo app</h3>
        <hr />
        <p>Add a Todo Item:</p>
        <form onSubmit={this.addTodo}>
          <label>
            <input type='text' value={this.state.value} onChange={this.handleChange} />
          </label>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </form>
        <ul>
          {this.state.todos.map((todo) => {
            return <li key={todo._id}>{todo.item}</li>;
          })}
        </ul>
      </div>
    );
  }
}

export default App;
