<template>
  <div>
    <q-layout
      view="lHh lpr lFf"
      container
      style="height: 100vh"
      class="shadow-2 rounded-borders"
    >
      <q-header bordered class="bg-white text-primary">
        <q-toolbar>
          <q-toolbar-title class="text-center">
            <q-icon name="grading" style="font-size: 2em" />
            TODO LISTS
          </q-toolbar-title>
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
            <div :key="todo.id" class="row justify-center">
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
                    @click="handleDelete(todo.id)"
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
          <q-toolbar-title>Created By: Who Am I</q-toolbar-title>
        </q-toolbar>
      </q-footer>
    </q-layout>
  </div>
</template>
<script>
import moment from "moment";

export default {
  data() {
    return {
      moment: moment,
      uri: "http://localhost:2000/todos",
      todo: {
        text: "",
        completed: false,
        date: new Date(),
      },
      todos: [],
    };
  },
  async mounted() {
    let result = await fetch(this.uri);
    let data = await result.json();
    this.todos = data;
  },
  methods: {
    clearInput() {
      this.todo.text = "";
    },
    async addTodo() {
      let done = await fetch(this.uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: this.todo.text,
          completed: this.todo.completed,
          date: this.todo.date,
        }),
      });
      if (done) {
        this.clearInput();
        this.queryAll();
      }
    },
    async handleDone(todo) {
      let done = await fetch(this.uri + `/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (done) this.queryAll();
    },
    async handleDelete(id) {
      let done = await fetch(this.uri + `/${id}`, { method: "DELETE" });
      if (done) this.queryAll();
    },
    async queryAll() {
      let result = await fetch(this.uri);
      let data = await result.json();
      this.todos = data;
    },
    async queryByCompleted() {
      let result = await fetch(this.uri);
      let data = await result.json();
      let temp = [];
      data.forEach((doc) => {
        if (doc.completed) temp.push(doc);
      });
      this.todos = temp;
    },
    async queryByOngoing() {
      let result = await fetch(this.uri);
      let data = await result.json();
      let temp = [];
      data.forEach((doc) => {
        if (!doc.completed) temp.push(doc);
      });
      this.todos = temp;
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
