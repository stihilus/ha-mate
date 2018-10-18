export default (seed) => {
  const kickSeqs = [
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  ];
  if (Number.isNaN(seed)) {
    return {
      kick: [],
      snare: [],
      clap: [],
      hihatClosed: [],
      hihatOpen: [],
    };
  }
  const kick = kickSeqs[Math.floor(seed.substr(2, 1) / 2)];
  const snare = kickSeqs[Math.floor(seed.substr(3, 1) / 2)];
  const clap = kickSeqs[Math.floor(seed.substr(4, 1) / 2)];
  const hihatClosed = kickSeqs[Math.floor(seed.substr(5, 1) / 2)];
  const hihatOpen = kickSeqs[Math.floor(seed.substr(6, 1) / 2)];
  return {
    kick,
    snare,
    clap,
    hihatClosed,
    hihatOpen,
  };
};
