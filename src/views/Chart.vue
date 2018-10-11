<template>
  <div class="container">
    <div class="function-input">{{startingPoint}}</div>
    <hr>
    <div class="keys">
      <button 
        v-for="key in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']"
        class="key" @click="keyPress(key)"
      >{{key}}</button>
      <button class="key clear" @click="keyPress('c')">C</button>
    </div>
    <!-- <input type="range" min="0" max="1" step="0.001" id="input-x1" @mousemove="draw()" style="width: 100%" v-model="startingPoint"> -->
    <hr>

    <div class="formula">
      X2 = X1 ( 1 - X1 ) * a
    </div>

    <div v-show="shown === 'graph'">
      <div class="charts-wrapper">
        <div 
          class="chart" 
          id="chart-left" 
          v-bind:class="{ active: selectedChart === 'left' }"
          @click='selectedChart = "left"'
        ></div>
        <div 
          class="chart" 
          id="chart-right" 
          v-bind:class="{ active: selectedChart === 'right' }"
          @click="selectedChart = 'right'"
        ></div>
      </div>
      <div class="flex pointers-wrapper">
        <div class="pointer-wrapper"><div class="pointer" v-bind:style="{ left: (6.73 * pointLeft) + 9.5 + 'px' }"></div></div>
        <div class="pointer-wrapper"><div class="pointer" v-bind:style="{ left: (6.73 * pointRight) + 9.5 + 'px' }"></div></div>
      </div>
      <div class="flex">
        <input type="range" min="0" max="49" step="1" id="point-left" v-model="pointLeft" @mousedown="selectedChart = 'left'">
        <input type="range" min="0" max="49" step="1" id="point-right" v-model="pointRight" @mousedown="selectedChart = 'right'">
      </div>
    </div>

    <div v-show="shown === 'drums'">
      <div class="sequence">
        <div>Tempo: 90 bpm</div> <!-- TODO -->
      </div>
      <div class="sequence drums" v-for="instr in ['kick', 'snare', 'clap', 'hihatClosed', 'hihatOpen']">
        <div>{{ instr }}</div>
        <span 
          v-for="i in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]" 
          class="col" 
          v-bind:class="{ active: currentCol === i, filled: sequence[instr][i] }"
        ></span>
      </div>
      <div class="sequence-margin">
        <span 
          v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]" 
          class="col" 
        >{{i}}</span>
      </div>
    </div>
    

    <div v-show="shown === 'melody'">
      <div class="sequence">
        <div>Tempo: 90 bpm</div>
      </div>
      <div class="sequence melody" v-for="instr in ['kick', 'snare', 'clap', 'hihatClosed', 'hihatOpen']">
        <div>{{ instr }}</div>
        <span 
          v-for="i in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]" 
          class="col" 
          v-bind:class="{ active: currentCol === i, filled: sequence[instr][i] }"
        ></span>
      </div>
      <div class="sequence-margin">
        <span 
          v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]" 
          class="col" 
        >{{i}}</span>
      </div>
    </div>

    <div class="function-output">{{ final }}</div>
    <div class="toggles">
      <button class="graph" v-bind:class="{ active: shown === 'graph' }" @click="shown='graph'">Graph</button>
      <button class="drums" v-bind:class="{ active: shown === 'drums' }" @click="shown='drums'">Drums</button>
      <button class="melody" v-bind:class="{ active: shown === 'melody' }" @click="shown='melody'">Melody</button>
    </div>
  </div>
</template>

<script>
import Tone from 'tone';
import getSequence from '../sequence.js'

const chartOpts = {
  showPoint: false,
  chartPadding: 10,
  fullWidth: true,
  axisX: {
    offset: 0,
    showGrid: false,
    showLabel: false
  },
  axisY: {
    offset: 0,
    showGrid: false,
    showLabel: false,
    line: '#606165',
  }
}

export default {
  data: () => ({
    startingPoint: '0.46091',
    pointLeft: 49,
    pointRight: 17,
    pointsLeft: [],
    pointsRight: [],
    selectedChart: 'right',
    currentCol: 0,
    shown: 'graph',
  }),
  computed: {
    finalLeft() {
      return this.pointsLeft[this.pointLeft];
    },
    finalRight() {
      return this.pointsRight[this.pointRight];
    }, 
    final() {
      return parseFloat(this.selectedChart === 'left' ? this.finalLeft : this.finalRight).toFixed(10);
    },
    sequence() {
      return getSequence(this.final);
    }
  },
  methods: {
    draw() {
      let a1 = 1.2;
      let a2 = 3.78;
      let x1 = this.startingPoint;
      let x2 = this.startingPoint;
      let pointsLeft = [];
      let pointsRight = [];
      for (let i = 0; i < 50; i++) { 
        pointsLeft.push(x1); 
        pointsRight.push(x2); 
        x1 = x1 * (1-x1) * a1;
        x2 = x2 * (1-x2) * a2;
      }

      this.pointsLeft = pointsLeft;
      this.pointsRight = pointsRight;
      
      new Chartist.Line('#chart-left', {series:[pointsLeft]}, chartOpts);
      new Chartist.Line('#chart-right', {series:[pointsRight]}, chartOpts);
    },
    keyPress(key) {
      if (key === 'c') {
        if (this.startingPoint.length <= 2) return;
        this.startingPoint = this.startingPoint.substr(0, this.startingPoint.length - 1);
      } else {
        this.startingPoint += key;
      }
      this.draw();
    }
  },
  mounted() { 
    this.draw();
    var keys = new Tone.Players({
      "kick": "/sounds/kick.wav",
      "snare": "/sounds/snare.wav",
      "clap": "/sounds/clap.wav",
      "hihatClosed": "/sounds/hihat-closed.wav",
      "hihatOpen": "/sounds/hihat-open.wav"
    }, {
      // "volume" : -10,
      // "fadeOut" : "64n",
    }).toMaster();

    const that = this;

    Tone.Transport.start();
    var loop = new Tone.Sequence((time, col) => {
      that.currentCol = col;
      ['kick', 'snare', 'clap', 'hihatClosed', 'hihatOpen']
        .forEach((instr) => { if (that.sequence[instr] && that.sequence[instr][col]) keys.get(instr).start(); })
    }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");

    loop.start();
  },
};
</script>

<style lang="scss">
  .function-input, 
  .function-output {
    background: transparent;
    border: 0;
    outline: none;
    font-size: 60px;
    text-align: right;
    color: inherit;
    font-weight: 300;
    font-family: inherit;
    padding-right: 20px;
    position: relative;
    display: inline-block;
    &:before {
      position: absolute;
      right: 100%;
      font-size: 14px;
      top: 10px;
      padding-right: 10px;
    }
  }
  .function-output:before {
    content: 'output'
  }
  .function-input:before {
    content: 'input'
  }
  hr {
    border: 0;
    border-bottom: 1px solid #505155;
    margin: 5px 0;
  }
  .keys {
    display: flex;
    justify-content: space-evenly;
    padding: 15px 0;
    .key {
      width: 43px;
      height: 43px;
      border-radius: 50%;
      outline: none;
      font-size: 20px;
      font-family: inherit;
      color: #A8ABA5;
      background: radial-gradient(21.50px at 50% 50%, #5C5D61 0%, #57585C 100%);
      border: 1px solid rgba(35, 36, 38, 0.28);
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      position: relative;
      cursor: pointer;
      &.clear {
        background: radial-gradient(21.50px at 50% 50%, #BF0A14 0%, #C30D17 100%);
      }
      &:hover {
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
      }
      &:active {
        bottom: -2px;
      }
    }
  }
  .formula {
    font-size: 14px;
    text-align: left;
    padding: 15px 20px 20px;
  }
  .charts-wrapper {
    display: flex;
    border: 1px solid #505155;
  }
  .chart {
    height: 240px;
    width: 350px;
    background-color: #A1A1A1;
    cursor: pointer;
    &.active {
      background-color: #C5C5C5;
    }
  }
  #chart-left {
    border-right: 1px solid #505155;
  }
  .ct-series-a .ct-line {
    stroke: #606165 !important;
    stroke-width: 1px;
  }
  .pointers-wrapper {
    pointer-events: none;
    .pointer-wrapper {
      position: relative;
      .pointer {
        position: absolute;
        height: 240px;
        width: 1px;
        background: rgba(#48494F, .3);
        top: -240px;
      }
    }
  }
  .sequence {
    display: flex;
    background-color: #C5C5C5;
    border-top: 1px solid #AEAEAF;
    border-left: 1px solid #AEAEAF;
    &:last-child {
      border-bottom: 1px solid #AEAEAF;
    }
    div {
      width: 100px;
      text-align: left;
      border-right: 1px solid #AEAEAF;
      line-height: 38px;
      padding: 0 10px;
      font-size: 12px;
      color: #595A5D;
    }
    span {
      flex: 1 1 auto;
      border-right: 1px solid #AEAEAF;
      display: inline-block;
      height: 38px;
    }
    &.drums span.filled {
      background-color: #EEB72A;
      &.active {
        background-color: #FFC93E;
      }
    }
    &.melody span.filled {
      background-color: #219653;
      &.active {
        background-color: #29C16A;
      }
    }
  }
  .sequence-margin {
    display: flex;
    padding-left: 122px;
    span {
      flex: 1 1 100%;
      height: 30px;
      font-weight: 500;
      font-size: 12px;
      color: #C5C5C5;
      text-align: center;
      line-height: 30px;
      opacity: 0.3;
      &:nth-child(4n + 1) {
        opacity: 1;
      }
    }
  }
  .toggles {
    position: absolute;
    right: 100%;
    bottom: 50px;
    // display: flex;
    // flex-direction: column;
    button {
      width: 60px;
      border-radius: 5px 0 0 5px;
      border: 0;
      outline: none;
      color: white;
      padding: 10px 5px;
      margin: 5px 0;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
      cursor: pointer;
      text-align: left;
      &.active {
        width: 45px;
      }
      &.graph { background-color: #2F80ED; }
      &.drums { background-color: #F9C02C; }
      &.melody { background-color: #219653; }
    }
  }
</style>