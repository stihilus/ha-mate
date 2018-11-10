<template>
  <div class="instrument-wrapper">
    <div class="instrument-container">
      <div class="function-input">{{startingPoint}}</div>
      <hr>
      <div class="keys">
        <button
          v-for="key in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']"
          :key="key"
          class="key" @click="keyPress(key)"
        >{{key}}
        </button>
        <button class="key clear" @click="keyPress('c')">C</button>
      </div>
      <hr>

      <div class="navigation">
        <div v-show="selectedChart === 'right'"></div>
        <div>
          <div class="nav-button graph" @click="shown='graph'">
            <div id="chart-mini"></div>
            <div class="subtitle">Seed</div>
          </div>
          <div class="nav-button drums" @click="shown='drums'">
            <div
              class="mini-sequence"
              v-for="instr in ['kick', 'snare', 'clap', 'hihatClosed', 'hihatOpen']"
              :key="instr"
            >
                      <span
                        v-for="i in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]"
                        :key="i"
                        class="col"
                        v-bind:class="{ filled: sequence[instr][i] }"
                      ></span>
            </div>
            <div class="subtitle">Drums</div>
          </div>
          <div class="nav-button melody" @click="shown='melody'">
            <div class="mini-sequence" v-for="note in sequence.scale" :key="note">
                      <span
                        v-for="i in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]"
                        :key="i"
                        class="col"
                        v-bind:class="{ filled: sequence.synthSeq[note][i] }"
                      ></span>
            </div>
            <div class="subtitle">Melody</div>
          </div>
          <div class="nav-button melody" @click="shown='bass'">
            <div class="mini-sequence" v-for="note in sequence.scale" :key="note">
                      <span
                        v-for="i in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]"
                        :key="i"
                        class="col"
                        v-bind:class="{ filled: sequence.bassSeq[note][i] }"
                      ></span>
            </div>
            <div class="subtitle">Bass</div>
          </div>
        </div>

        <div v-show="selectedChart === 'left'"></div>
      </div>

      <div v-show="shown === 'graph'">
        <div class="charts-formula-wrapper">
          <div>
            <span>normal</span>
            <span>x<sub>2</sub> = x<sub>1</sub> · (1 - x<sub>1</sub>) · 1.7</span>
          </div>
          <div>
            <span>haos</span>
            <span>x<sub>2</sub> = x<sub>1</sub> · (1 - x<sub>1</sub>) · 3.78</span>
          </div>
        </div>
        <div class="charts-wrapper">
          <div
            class="chart"
            id="chart-left"
            v-bind:class="{ active: selectedChart === 'left' }"
            @click="selectChart('left')"
          ></div>
          <div
            class="chart"
            id="chart-right"
            v-bind:class="{ active: selectedChart === 'right' }"
            @click="selectChart('right')"
          ></div>
        </div>
        <div class="flex pointers-wrapper">
          <div class="pointer-wrapper">
            <div class="pointer" v-bind:style="{ left: (7.75 * pointLeft) + 11 + 'px' }"></div>
          </div>
          <div class="pointer-wrapper">
            <div class="pointer" v-bind:style="{ left: (7.75 * pointRight) + 11 + 'px' }"></div>
          </div>
        </div>
        <div class="flex">
          <input type="range" min="0" max="49" step="1" id="point-left" v-model="pointLeft"
                 @mousedown="selectChart('left')" @touchstart="selectChart('left')">
          <input type="range" min="0" max="49" step="1" id="point-right" v-model="pointRight"
                 @mousedown="selectChart('right')" @touchstart="selectChart('right')">
        </div>
      </div>

      <div v-show="shown === 'drums'">
        <div class="sequence">
          <div>
            {{ sequence.tempo }} bpm
          </div>
        </div>
        <div
          class="sequence drums"
          v-for="instr in ['kick', 'snare', 'clap', 'hihatClosed', 'hihatOpen']"
          :key="instr"
        >
          <div>{{ instr }}</div>
          <span
            v-for="i in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]"
            :key="i"
            class="col"
            v-bind:class="{ active: currentCol === i, filled: sequence[instr][i] }"
          ></span>
        </div>
        <div class="sequence-margin">
          <span
            v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]"
            :key="i"
            class="col"
          >{{i}}</span>
        </div>
      </div>


      <div v-show="shown === 'melody'">
        <div class="sequence">
          <div>
            {{ sequence.tempo }} bpm
          </div>
          <div>
            Skala
          </div>
        </div>
        <div class="sequence melody" v-for="note in sequence.scale" :key="note">
          <div>{{ note }}</div>
          <span
            v-for="i in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]"
            :key="i"
            class="col"
            v-bind:class="{ active: currentCol === i, filled: sequence.synthSeq[note][i] }"
          ></span>
        </div>
        <div class="sequence-margin">
          <span
            v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]"
            :key="i"
            class="col"
          >{{i}}</span>
        </div>
      </div>

      <div v-show="shown === 'bass'">
        <div class="sequence">
          <div>
            {{ sequence.tempo }} bpm
          </div>
          <div>
            Skala
          </div>
        </div>
        <div class="sequence melody" v-for="note in sequence.scale" :key="note">
          <div>{{ note }}</div>
          <span
            v-for="i in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]"
            :key="i"
            class="col"
            v-bind:class="{ active: currentCol === i, filled: sequence.bassSeq[note][i] }"
          ></span>
        </div>
        <div class="sequence-margin">
          <span
            v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]"
            :key="i"
            class="col"
          >{{i}}</span>
        </div>
      </div>

      <div class="function-output">{{ final }}</div>
      <!--<div class="toggles">-->
      <!--<button class="graph" v-bind:class="{ active: shown === 'graph' }" @click="shown='graph'">Graph</button>-->
      <!--<button class="drums" v-bind:class="{ active: shown === 'drums' }" @click="shown='drums'">Drums</button>-->
      <!--<button class="melody" v-bind:class="{ active: shown === 'melody' }" @click="shown='melody'">Melody</button>-->
      <!--</div>-->
      <div class="print-decoration"></div>
      <a @click="print()" class="print"></a>
    </div>
  </div>
</template>

<script>
  import Tone from 'tone';
  import getSequence from '../sequence';

  const chartOpts = {
    height: 200,
    width: 400,
    showPoint: false,
    chartPadding: 10,
    fullWidth: true,
    axisX: {
      offset: 0,
      showGrid: false,
      showLabel: false,
    },
    axisY: {
      offset: 0,
      showGrid: false,
      showLabel: false,
      line: '#606165',
    },
  };

  const miniChartOpts = {
    showPoint: false,
    chartPadding: 0,
    fullWidth: true,
    axisX: {
      offset: 0,
      showGrid: false,
      showLabel: false,
    },
    axisY: {
      offset: 0,
      showGrid: false,
      showLabel: false,
      line: '#fff',
    },
  };

  export default {
    data: () => ({
      startingPoint: '0.' + (new Date()).getHours() + '' + (new Date()).getMinutes(),
      pointLeft: 49,
      pointRight: 17,
      pointsLeft: [],
      pointsRight: [],
      selectedChart: 'right',
      currentCol: 0,
      shown: 'graph',
      timeout: null,
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
        this.resetTimeout();
        const seq = getSequence(this.final);
        Tone.Transport.bpm.value = seq.tempo;
        if (Tone.Transport.state !== "started") Tone.Transport.start();
        return seq;
      },
    },
    methods: {
      draw() {
        const a1 = 1.2;
        const a2 = 3.78;
        let x1 = this.startingPoint;
        let x2 = this.startingPoint;
        const pointsLeft = [];
        const pointsRight = [];
        for (let i = 0; i < 50; i++) {
          pointsLeft.push(x1);
          pointsRight.push(x2);
          x1 = x1 * (1 - x1) * a1;
          x2 = x2 * (1 - x2) * a2;
        }

        this.pointsLeft = pointsLeft;
        this.pointsRight = pointsRight;

        new window.Chartist.Line('#chart-left', { series: [pointsLeft] }, chartOpts);
        new window.Chartist.Line('#chart-right', { series: [pointsRight] }, chartOpts);
        new window.Chartist.Line('#chart-mini', { series: [this.selectedChart === 'left' ? pointsLeft : pointsRight] }, miniChartOpts);
      },
      selectChart(chart) {
        this.selectedChart = chart;
        new window.Chartist.Line('#chart-mini', { series: [chart === 'left' ? this.pointsLeft : this.pointsRight] }, miniChartOpts);
      },
      keyPress(key) {
        if (key === 'c') {
          if (this.startingPoint.length <= 2) return;
          this.startingPoint = this.startingPoint.substr(0, this.startingPoint.length - 1);
        } else {
          this.startingPoint += key;
        }
        this.draw();
      },
      resetTimeout() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.fadeOut, 30 * 1000);
      },
      fadeOut() {
        const bpm = transport.bpm.value;
        if (bpm > 10) {
          const newBpm = Math.floor(bpm / 2);
          transport.bpm.value = newBpm;
          const that = this;
          setTimeout(() => {
            if (Math.round(transport.bpm.value) === newBpm) // cancel fade out if sound changed
              that.fadeOut();
          }, 1000);
        } else {
          transport.stop();
        }
      },
      print() {
        const printWindow = window.open(
          '/#/print/' + this.startingPoint + '/' + (this.selectedChart === 'left' ? 1.7 : 3.78) + '/' + (this.selectedChart === 'left' ? this.pointLeft : this.pointRight),
          'Print your composition',
          'left=0,top=0,toolbar=0,scrollbars=0,status=0'
        );
        printWindow.focus();
      }
    },
    mounted() {
      this.draw();
      const keys = new Tone.Players({
        kick: '/sounds/kick.wav',
        snare: '/sounds/snare.wav',
        clap: '/sounds/clap.wav',
        hihatClosed: '/sounds/hihat-closed.wav',
        hihatOpen: '/sounds/hihat-open.wav',
      }, {
        "volume" : -20,
        // "fadeOut" : "64n",
      }).toMaster();

      const synth = new Tone.PolySynth(5, Tone.Synth).toMaster();

      const bass = new Tone.Synth({
        "oscillator" : {
          "type" : "amtriangle",
          "harmonicity" : 0.5,
          "modulationType" : "sine"
        },
      }).toMaster();

      window.synth = synth;
      window.transport = Tone.Transport;

      const that = this;

      Tone.Transport.start();
      const loop = new Tone.Sequence((time, col) => {
        that.currentCol = col;
        ['kick', 'snare', 'clap', 'hihatClosed', 'hihatOpen'].forEach((instr) => {
          if (that.sequence[instr] && that.sequence[instr][col]) keys.get(instr).start();
        });
        const melodyNotes = [];
        that.sequence.scale.forEach((note) => {
          if (that.sequence.synthSeq[note] && that.sequence.synthSeq[note][col]) melodyNotes.push(note + "3");
        });
        synth.triggerAttackRelease(melodyNotes, "16n");
        that.sequence.scale.forEach((note) => {
          if (that.sequence.bassSeq[note] && that.sequence.bassSeq[note][col]) bass.triggerAttackRelease(note + "2", "4n");
        });
      }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], '16n');

      loop.start();
    },
  };
</script>

<style lang="scss">
  .instrument-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #C6C2B8;
    color: #A8ABA5;
    background: url('../assets/bg.png');
    background-size: cover;
    background-position: 50%;
    min-height: 100vh;
    .instrument-container {
      position: relative;
      background-color: #5B5C5F;
      width: 800px;
      height: 600px;
      margin: 10px auto 60px;
      color: #A8ABA5;
      border-radius: 5px;
      padding: 10px 0;
      box-shadow: 0 10px 10px 1px rgba(0, 0, 0, .2);
      text-align: right;
    }

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
      justify-content: flex-end;
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
        margin-left: 20px;
        &:last-child {
          margin-right: 25px;
        }
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

    .navigation {
      padding: 15px 10px 22px;
      justify-content: space-between;
      display: flex;
      align-items: center;
    }

    .charts-wrapper {
      display: flex;
      border: 1px solid #505155;
    }

    .charts-formula-wrapper {
      display: flex;
      position: absolute;
      width: 100%;
      > div {
        display: flex;
        flex: 1 1 100%;
        justify-content: space-between;
        padding: 15px;
        color: #606165;
      }
      .math {
        font-family: serif;
      }
    }

    .chart {
      padding-top: 40px;
      height: 200px;
      width: 400px;
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

    #chart-mini {
      width: 66px;
      height: 21px;
      .ct-series-a .ct-line {
        stroke: white !important;
        stroke-width: 1px;
      }
    }

    .pointers-wrapper {
      pointer-events: none;
      .pointer-wrapper {
        position: relative;
        .pointer {
          position: absolute;
          height: 200px;
          width: 1px;
          background: rgba(#48494F, .3);
          top: -200px;
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
        text-align: left;
        border-right: 1px solid #AEAEAF;
        line-height: 38px;
        padding: 0 10px;
        font-size: 12px;
        color: #595A5D;
        width: 100%;
        &:first-child {
          width: 100px;
          min-width: 100px;
        }
      }
      span {
        flex: 1 1 auto;
        border-right: 1px solid #AEAEAF;
        display: inline-block;
        height: 38px;
      }
      span.active {
        background-color: #D7D7D7;
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

    .print {
      position: absolute;
      bottom: -20px;
      right: 20px;
      border-radius: 0 0 5px 5px;
      border: 0;
      outline: none;
      color: white;
      height: 20px;
      width: 45px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
      cursor: pointer;
      text-align: left;
      background-color: #F9C02C;
      background: linear-gradient(to bottom, #BB9022, #F9C02C);
    }

    .print-decoration {
      position: absolute;
      bottom: -50px;
      right: 275px;
      width: 230px;
      border-radius: 0 0 5px 5px;
      border: 0;
      outline: none;
      color: white;
      height: 50px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
      cursor: pointer;
      text-align: left;
      background-color: white;
      background: linear-gradient(to bottom, #BBB, white, white, white);
    }

    .nav-button {
      padding: 5px;
      display: inline-block;
      border-radius: 5px;
      text-align: center;
      color: white;
      font-size: 10px;
      text-transform: lowercase;
      margin: 0 9px;
      border: 1px solid;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      position: relative;
      &:hover {
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
      }
      &:active {
        bottom: -2px;
      }

      &.graph {
        background-color: #2F80ED;
        border-color: darken(#2F80ED, 20%);
      }
      &.drums {
        background-color: #F9C02C;
        border-color: darken(#F9C02C, 20%);
      }
      &.melody {
        background-color: #219653;
        border-color: darken(#219653, 10%);
      }

      .subtitle {
        margin-top: 3px;
      }

      .mini-sequence {
        display: flex;
        span {
          flex: 1 1 auto;
          display: inline-block;
          height: 3px;
          width: 3px;
          margin: 0.5px;
          border-radius: 1px;
          &.filled {
            background-color: white;
          }
        }
      }
    }
  }
</style>
