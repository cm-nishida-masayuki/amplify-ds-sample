import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum TodoStatus {
  WAITING = "WAITING",
  DONE = "DONE"
}



export declare class Todo {
  readonly id: string;
  readonly owner?: string;
  readonly title?: string;
  readonly items?: TodoItem[];
  readonly status?: TodoStatus | keyof typeof TodoStatus;
  constructor(init: ModelInit<Todo>);
  static copyOf(source: Todo, mutator: (draft: MutableModel<Todo>) => MutableModel<Todo> | void): Todo;
}

export declare class TodoItem {
  readonly id: string;
  readonly owner?: string;
  readonly content?: string;
  readonly todo?: Todo;
  readonly status?: TodoStatus | keyof typeof TodoStatus;
  constructor(init: ModelInit<TodoItem>);
  static copyOf(source: TodoItem, mutator: (draft: MutableModel<TodoItem>) => MutableModel<TodoItem> | void): TodoItem;
}