<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
  html, body {
    height: 100vh;
    overflow: hidden;
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
  }

  * {
    user-select: none;
  }

  .flex {
    display: flex;
  }

  .flex * {
    flex: 1 1 50%;
  }
</style>
