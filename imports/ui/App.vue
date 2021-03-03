<template>
  <div>
    <q-layout
      view="lHh lpr lFf"
      container
      style="height: 100vh"
      class="shadow-2 rounded-borders"
    >
      <q-header bordered class="bg-white text-primary q-mt-sm">
        <q-toolbar>
          <q-toolbar-title class="text-center">
            <q-icon name="grading" style="font-size: 2em" />
            TODO LISTS
          </q-toolbar-title>
          <span class="text-blue-grey-4" style="font-size: 0.7em">
            {{ liveTimeStamp }}
          </span>
        </q-toolbar>
      </q-header>
      <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
        <q-page-container>
          <div class="row justify-center">
            <div class="col-lg-3 col-md-6 col-sm-6 col-xs-10 q-ma-md">
              <ValidationProvider
                name="Todo"
                rules="required"
                v-slot="{ errors, invalid, validated }"
              >
                <q-input
                  :error-message="errors[0]"
                  :error="invalid && validated"
                  input-class="text-indigo-12 text-bold"
                  color="blue-grey-4"
                  bottom-slots
                  v-model="todo.text"
                  label="NEW TODO"
                  @keyup.enter="handleSubmit(addTodo)"
                >
                  <template v-slot:append>
                    <q-icon
                      color="blue-grey-4"
                      v-if="todo.text !== ''"
                      name="close"
                      @click="todo.text = ''"
                      class="cursor-pointer"
                    />
                  </template>
                  <template v-slot:after>
                    <q-btn
                      color="blue-grey-4"
                      dense
                      flat
                      round
                      icon="send"
                      @click="handleSubmit(addTodo)"
                    />
                  </template>
                </q-input>
              </ValidationProvider>
            </div>
          </div>
          <div class="row justify-center">
            <div class="q-mr-md">
              <q-btn label="ALL" color="info" @click="queryAll" />
            </div>
            <div class="q-mr-md">
              <q-btn
                label="COMPLETED"
                color="positive"
                @click="queryByCompleted"
              />
            </div>
            <div class="q-mr-md">
              <q-btn label="ONGOING" color="negative" @click="queryByOngoing" />
            </div>
          </div>
          <template v-for="todo in todos">
            <div :key="todo._id" class="row justify-center">
              <q-card
                class="my-card col-lg-3 col-md-6 col-sm-6 col-xs-10 q-ma-md q-pa-lg borders-left card"
                :class="{ done: todo.completed, ongoing: !todo.completed }"
              >
                <div class="text-indigo-5 text-bold">
                  {{ todo.text }}
                </div>
                <div>
                  <q-btn
                    flat
                    dense
                    round
                    color="negative"
                    icon="delete"
                    @click="handleDelete(todo._id)"
                  />
                  <q-btn
                    round
                    flat
                    dense
                    :class="{ done: todo.completed, ongoing: !todo.completed }"
                    icon="done"
                    @click="handleDone(todo)"
                  />
                  <span>{{ moment(todo.date).fromNow() }}</span>
                </div>
              </q-card>
            </div>
          </template>
        </q-page-container>
      </ValidationObserver>
      <q-footer bordered class="bg-white text-primary">
        <q-toolbar class="text-center">
          <q-toolbar-title></q-toolbar-title>
        </q-toolbar>
      </q-footer>
    </q-layout>
  </div>
</template>
<script>
import moment from "moment";
import { Meteor } from "meteor/meteor";

export default {
  data() {
    return {
      liveTimeStamp: null,
      moment: moment,
      todo: {
        text: "",
        completed: false,
        date: new Date(),
      },
      todos: [],
    };
  },
  mounted() {
    setInterval(() => {
      this.liveTimeStamp = moment().format("ddd MMM Do YYYY, h:mm:ss A");
    }, 1000);

    return new Promise((resolve, reject) => {
      Meteor.call("todo.find", (err, res) => {
        if (err) reject(err.message);
        else {
          resolve(res);
          this.todos = res;
        }
      });
    });
  },
  methods: {
    clearInput() {
      this.$refs.observer.reset();
      this.todo.text = "";
    },
    addTodo() {
      return new Promise((resolve, reject) => {
        Meteor.call("todo.insert", this.todo, async (err, res) => {
          if (err) reject(err.message);
          else {
            resolve(res);
            let done = await this.queryAll();
            if (done) this.clearInput();
          }
        });
      });
    },
    handleDone(todo) {
      todo.completed = !todo.completed;
      return new Promise((resolve, reject) => {
        Meteor.call("todo.update", todo, (err, res) => {
          if (err) reject(err.message);
          else {
            resolve(res);
            this.queryAll();
          }
        });
      });
    },
    handleDelete(id) {
      return new Promise((resolve, reject) => {
        Meteor.call("todo.remove", id, (err, res) => {
          if (err) reject(err.message);
          else {
            resolve(res);
            this.queryAll();
          }
        });
      });
    },
    queryAll() {
      return new Promise((resolve, reject) => {
        Meteor.call("todo.find", (err, res) => {
          if (err) reject(err.message);
          else {
            resolve(res);
            this.todos = res;
          }
        });
      });
    },
    queryByCompleted() {
      return new Promise((resolve, reject) => {
        Meteor.call("todo.findByCompleted", (err, res) => {
          if (err) reject(err.message);
          else {
            resolve(res);
            this.todos = res;
          }
        });
      });
    },
    queryByOngoing() {
      return new Promise((resolve, reject) => {
        Meteor.call("todo.findByOngoing", (err, res) => {
          if (err) reject(err.message);
          else {
            resolve(res);
            this.todos = res;
          }
        });
      });
    },
  },
};
</script>

<style>
.done {
  color: rgb(68, 196, 68);
  /* background: rgb(68, 196, 68); */
  border-left: 4px solid rgb(68, 196, 68);
}
.card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ongoing {
  color: grey;
  border-left: 4px solid red;
}
</style>
