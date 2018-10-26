export default (seed) => {
  const kickSeqs = [
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  ];
  const synthSeqs = [
    [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
    [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],
    [0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,0],
    [0,0,0,0,1,0,0,1,1,1,0,0,0,1,0,0],
    [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
  ];
  const scales = [
    ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'],
    ['D', 'E', 'F#', 'G', 'A', 'B', 'C#', 'D'],
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'A'],
    // ['B', 'C#', 'D', 'E', 'F#', 'G', 'A', 'B'],
    ['C', 'Eb', 'F', 'G', 'Bb', 'C'],
    ['D', 'F', 'G', 'A', 'C', 'D'],
  ];
  if (Number.isNaN(Number(seed))) {
    return {
      tempo: 90,
      kick: [],
      snare: [],
      clap: [],
      hihatClosed: [],
      hihatOpen: [],
      synth: {
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
      },
    };
  }
  const tempo = Math.floor(30 + 2.1 * seed.substr(2, 2));

  const kick = kickSeqs[Math.floor(seed.substr(2, 1) / 2)];
  const snare = kickSeqs[Math.floor(seed.substr(3, 1) / 2)];
  const clap = kickSeqs[Math.floor(seed.substr(4, 1) / 2)];
  const hihatClosed = kickSeqs[Math.floor(seed.substr(5, 1) / 2)];
  const hihatOpen = kickSeqs[Math.floor(seed.substr(6, 1) / 2)];

  console.log(seed.substr(2, 1), Math.floor(seed.substr(2, 1) / 2))
  const scale = scales[Math.floor(seed.substr(2, 1) / 2)].slice(0, 5);
  const octaves = [
    1 + Math.floor(seed.substr(4, 1) / 5),
    1 + Math.floor(seed.substr(5, 1) / 5),
  ];
  const synthSeq = {};
  console.log(scale)
  for (let i = 0; i < 5; i++) {
    synthSeq[scale[i]] = synthSeqs[Math.floor(seed.substr(2 + i, 1))];
  }
  console.log(synthSeq);
  return {
    tempo,
    kick,
    snare,
    clap,
    hihatClosed,
    hihatOpen,
    synthSeq,
    scale,
  };
};
