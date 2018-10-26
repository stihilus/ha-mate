export default (seed) => {
  const kickSeqs = [
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
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
  const kick = kickSeqs[Math.floor(seed.substr(2, 1) / 2)];
  const snare = kickSeqs[Math.floor(seed.substr(3, 1) / 2)];
  const clap = kickSeqs[Math.floor(seed.substr(4, 1) / 2)];
  const hihatClosed = kickSeqs[Math.floor(seed.substr(5, 1) / 2)];
  const hihatOpen = kickSeqs[Math.floor(seed.substr(6, 1) / 2)];
  const synth = {
    A: kickSeqs[Math.floor(seed.substr(7, 1) / 2)],
    B: kickSeqs[Math.floor(seed.substr(8, 1) / 2)],
    C: kickSeqs[Math.floor(seed.substr(9, 1) / 2)],
    D: kickSeqs[Math.floor(seed.substr(10, 1) / 2)],
    E: kickSeqs[Math.floor(seed.substr(11, 1) / 2)],
  };
  const tempo = Math.floor(30 + 2.1 * seed.substr(2, 2));
  return {
    tempo,
    kick,
    snare,
    clap,
    hihatClosed,
    hihatOpen,
    synth,
  };
};
