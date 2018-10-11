<template>
  <div class="container">
    <input type="" v-model="startingPoint" class="function-input" @keyup="draw()">
    <!-- <input type="range" min="0" max="1" step="0.001" id="input-x1" @mousemove="draw()" style="width: 100%" v-model="startingPoint"> -->
    <hr>
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
    <div class="function-output">{{ final }}</div>
    <!-- <div class="function-output">{{ sequence }}</div> -->
    <div class="sequence" v-for="instr in ['kick', 'snare', 'clap', 'hihatClosed', 'hihatOpen']">
      <div>{{ instr }}</div>
      <span 
        v-for="i in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]" 
        class="col" 
        v-bind:class="{ active: currentCol === i, filled: sequence[instr][i] }"
      ></span>
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
    startingPoint: 0.46091,
    pointLeft: 49,
    pointRight: 49,
    pointsLeft: [],
    pointsRight: [],
    selectedChart: 'left',
    currentCol: 0,
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
    padding: 0;
  }
  hr {
    border: 0;
    border-bottom: 1px solid #505155;
  }
  .charts-wrapper {
    display: flex;
    border: 1px solid #505155;
  }
  .chart {
    height: 240px;
    width: 350px;
    background-color: #A1A1A1;
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
      line-height: 30px;
      padding: 0 10px;
      font-size: 12px;
      color: #595A5D;
    }
    span {
      flex: 1 1 auto;
      border-right: 1px solid #AEAEAF;
      display: inline-block;
      height: 30px;
      &.filled {
        background-color: #EEB72A;
        &.active {
          background-color: #FFC93E;
        }
      }
    }
  }
</style>