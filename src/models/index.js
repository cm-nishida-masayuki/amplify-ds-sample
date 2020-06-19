// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const TodoStatus = {
  "WAITING": "WAITING",
  "DONE": "DONE"
};

const { Todo, TodoItem } = initSchema(schema);

export {
  Todo,
  TodoItem,
  TodoStatus
};