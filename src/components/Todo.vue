<template>
  <v-container>
    <v-form>
      <v-row>
        <v-col cols="9" md="4">
          <v-text-field label="Todo..." v-model="todoTitle"></v-text-field>
        </v-col>
        <v-col cols="3" md="2">
          <v-btn @click="createTodo">送信</v-btn>
        </v-col>
        <v-col cols="3">
          <v-btn @click="deleteTodos">全削除</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-row>
      <v-col cols="12">
        <v-expansion-panels>
          <v-expansion-panel
            v-for="todo in todos"
            :key="todo.id"
            @click="openTodo(todo)"
          >
            <v-expansion-panel-header>{{
              todo.title
            }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-container>
                <v-row>
                  <v-text-field
                    v-model="todoItemContent"
                    label="Todo Items.."
                  ></v-text-field>
                  <v-btn label="Todo Items.." @click="createTodoItem(todo)"
                    >追加</v-btn
                  >
                </v-row>
                <v-row>
                  <v-list-item v-for="item in todoItems" :key="item.id">
                    <v-list-item-content>
                      <v-checkbox
                        @change="doneTodoItem(item)"
                        :label="item.content"
                      ></v-checkbox>
                    </v-list-item-content>
                  </v-list-item>
                </v-row>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { DataStore, Predicates } from "aws-amplify";
import { Todo, TodoItem, TodoStatus } from "../models";

export default {
  name: "Todo",
  data() {
    return {
      todoTitle: "",
      todoItemContent: "",
      todos: null,
      todoItems: null
    };
  },
  async created() {
    DataStore.observe(Todo).subscribe(() => {
      this.fetchTodos();
    });
    await this.fetchTodos();
  },
  methods: {
    async fetchTodos() {
      this.todos = await DataStore.query(Todo, Predicates.ALL);
    },
    async fetchTodoItems(todo) {
      this.todoItems = (
        await DataStore.query(TodoItem, c => c.status("eq", TodoStatus.WAITING))
      ).filter(item => item.todo && item.todo.id === todo.id);
    },
    async createTodo() {
      await DataStore.save(
        new Todo({ title: this.todoTitle, status: TodoStatus.WAITING })
      );
    },
    async createTodoItem(todo) {
      if (!this.todoItemContent) {
        return;
      }

      await DataStore.save(
        new TodoItem({
          todo: todo,
          content: this.todoItemContent,
          status: TodoStatus.WAITING
        })
      );

      this.todoItemContent = "";
      await this.fetchTodoItems(todo);
    },
    async doneTodoItem(todoItem) {
      await DataStore.save(
        TodoItem.copyOf(todoItem, updated => {
          updated.status = TodoStatus.DONE;
        })
      );

      await this.fetchTodoItems(todoItem.todo);
    },
    async deleteTodos() {
      await DataStore.delete(Todo, Predicates.ALL);
    },
    async openTodo(todo) {
      await this.fetchTodoItems(todo);
    }
  }
};
</script>

<style scoped></style>
