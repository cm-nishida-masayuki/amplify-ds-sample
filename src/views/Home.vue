<template>
  <div class="home">
    <Todo></Todo>
  </div>
</template>

<script>
// @ is an alias to /src

import Todo from "../components/Todo";
export default {
  name: "Home",
  components: { Todo }
};
</script>
