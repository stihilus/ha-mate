<template>
  <div>
    <div class="print-wrapper">
      <h3>x<sub>2</sub> = x<sub>1</sub> · (1 - x<sub>1</sub>) · {{lambda}}</h3>
      <h2>{{final}}</h2>
      <div class="graph">
        <div id="chart-print"></div>
        <div class="pointer" :style="{ left: (5.16 * point) + 'px' }"></div>
      </div>

      <div class="sequence">
        <div
          v-for="column in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]"
          :key="column"
          class="column"
        >
          <div
            v-for="row in [4, 3, 2, 1, 0]"
            :key="row"
            class="row"
            :class="{
              instrument: sequence[['kick', 'snare', 'clap', 'hihatClosed', 'hihatOpen'][row]][column],
              bass: sequence.bassSeq[Object.keys(sequence.bassSeq)[row]][column],
              melody: sequence.synthSeq[Object.keys(sequence.synthSeq)[row]][column],
            }"
          >
          </div>
        </div>
      </div>

      <h1>
        sekvenca<br>.<b>ostatka</b>
      </h1>
    </div>
  </div>
</template>

<script>
  import getSequence from '../sequence'

  export default {
    name: 'Print',
    props: ['seed', 'lambda', 'point'],
    computed: {
      points () {
        let x1 = this.seed;
        const points = [];
        for (let i = 0; i < 50; i++) {
          points.push(x1.toString());
          x1 = x1 * (1 - x1) * this.lambda;
        }
        return points
      },
      final () {
        return this.points[this.point]
      },
      sequence () {
        return getSequence(this.final)
      },
    },
    methods: {
      draw() {
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
          },
        };
        new window.Chartist.Line('#chart-print', { series: [this.points] }, miniChartOpts);
      }
    },
    mounted () {
      this.draw()
      window.print()
      window.close()
    },
  }
</script>

<style lang="scss">
  .print-wrapper {
    width: 255px;
    /*height: 1170px;*/
    padding: 10px 0;
    margin: 0 30px;
    box-sizing: border-box;
    border-top: 3px solid black;
    border-bottom: 3px solid black;

    h1 {
      text-align: right;
      font-size: 29px;
      font-weight: 300;
      margin: 10px 0;
      border-top: 3px solid black;
      padding: 15px 0 50px;
    }
    h3 {
      font-size: 18px;
      font-weight: 500;
      margin: 5px 0;
    }
    h2 {
      font-size: 26px;
      font-weight: bold;
      margin: 5px 0;
    }

    .graph {
      padding: 30px 0;
      position: relative;

      .ct-series-a .ct-line {
        stroke: black !important;
        stroke-width: 2px;
      }

      .pointer {
        position: absolute;
        height: 150px;
        width: 2px;
        background: black;
        top: 25px;
      }
    }

    .sequence {
      .column {
        width: 100%;
        height: 40px;
        display: flex;
        background: rgba(black, .15);
        .row {
          flex: 1 1 100%;
          &.instrument {
            background: rgba(black, .33);
          }
          &.bass {
            background: rgba(black, .33);
          }
          &.instrument.bass {
            background: rgba(black, .66);
          }
          &.melody:after {
            display: block;
            content: '';
            height: 30px;
            width: 30px;
            border-radius: 50%;
            background: rgba(black, .33);
            margin: 5px auto;
          }
        }
      }
    }
  }
</style>
