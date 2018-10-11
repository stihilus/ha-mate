<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
  html, body { height: 100%; }
  body {
    background-color: #C6C2B8;
    font-family: 'Roboto', sans-serif;
    text-align: right;
    color: #A8ABA5;
    background: url('./assets/bg.png');
    background-size: cover;
    background-position: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .flex {
      display: flex;
  }
  .flex * {
    flex: 1 1 50%;
  }
  .container {
    position: relative;
    background-color: #5B5C5F;
    width: 700px;
    height: 600px;
    margin: auto;
    color: #A8ABA5;
    border-radius: 5px;
    padding: 10px 0;
    box-shadow: 0 10px 10px 1px rgba(0, 0, 0, .2);
  }
</style>
