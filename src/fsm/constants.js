export const NUM_SETS = 1024, // 1024 blocks, direct-mapped
  BLOCK_BYTES = 16,       // 4 words × 4 bytes
  OFFSET_BITS = 4,        // log2(16)
  INDEX_BITS = 10,        // log2(1024)
  TAG_BITS = 18,          // 32 - 10 - 4
  MEM_LAT = 2,            // 2 cycles: 1 stall (mem_not_ready) + 1 done (mem_ready)
  ADDR_BITS = 32;

export const SC = {
  Idle:       { col: '#73daca', dim: 'rgba(115,218,202,.15)', bd: 'rgba(115,218,202,.3)' },
  Compare_Tag:{ col: '#7aa2f7', dim: 'rgba(122,162,247,.15)', bd: 'rgba(122,162,247,.3)' },
  Write_Back: { col: '#f7768e', dim: 'rgba(247,118,142,.15)', bd: 'rgba(247,118,142,.3)' },
  Allocate:   { col: '#e0af68', dim: 'rgba(224,175,104,.15)', bd: 'rgba(224,175,104,.3)' },
};

export const NP = {
  Idle:       { cx: 90, cy: 95 },
  Compare_Tag:{ cx: 310, cy: 95 },
  Write_Back: { cx: 310, cy: 275 },
  Allocate:   { cx: 90, cy: 275 }
};

export const NR = 46;

export const SDUR = {
  Idle: 600,
  Compare_Tag: 750,
  Write_Back: 1800,
  Allocate: 1800
};

export const TLC = {
  Idle:       { bg: 'rgba(115,218,202,.18)', bd: '#73daca', tx: '#73daca' },
  Compare_Tag:{ bg: 'rgba(122,162,247,.18)', bd: '#7aa2f7', tx: '#7aa2f7' },
  Write_Back: { bg: 'rgba(247,118,142,.18)', bd: '#f7768e', tx: '#f7768e' },
  Allocate:   { bg: 'rgba(224,175,104,.18)', bd: '#e0af68', tx: '#e0af68' }
};

export const SIGC = {
  stall_cpu:   { bg: 'rgba(247,118,142,.2)', bd: '#f7768e' },
  mem_read:    { bg: 'rgba(122,162,247,.2)', bd: '#7aa2f7' },
  mem_write:   { bg: 'rgba(224,175,104,.2)', bd: '#e0af68' },
  cache_write: { bg: 'rgba(115,218,202,.2)', bd: '#73daca' },
  mem_ready:   { bg: 'rgba(187,154,247,.2)', bd: '#bb9af7' }
};
