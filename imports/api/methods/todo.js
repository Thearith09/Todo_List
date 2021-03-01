import { Meteor } from 'meteor/meteor';
import Todos from '../collections/Todos.js';

Meteor.methods({
    'todo.find'() {
        return Todos.find().fetch();
    },
    'todo.findByCompleted'() {
        let todos = [];
        Todos.find().forEach((todo) => {
            if (todo.completed) todos.push(todo);
        });
        return todos;
    },
    'todo.findByOngoing'() {
        let todos = [];
        Todos.find().forEach((todo) => {
            if (!todo.completed) todos.push(todo);
        });
        return todos;
    },
    'todo.insert'(todo) {
        return Todos.insert(todo);
    },
    'todo.update'(todo) {
        return Todos.update({ _id: todo._id}, { $set: todo });
    },
    'todo.remove'(id) {
        return Todos.remove({ _id: id });
    }
});