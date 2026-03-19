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

export const PRESETS = {
  'rd hits':   [{t:'R',a:0x00000000},{t:'R',a:0x00000004},{t:'R',a:0x00000008},{t:'R',a:0x00000000}],
  'rd misses': [{t:'R',a:0x00000000},{t:'R',a:0x00000010},{t:'R',a:0x00000020},{t:'R',a:0x00000030}],
  'wr hits':   [{t:'R',a:0x00000000},{t:'W',a:0x00000000,d:0xBB},{t:'W',a:0x00000004,d:0xCC},{t:'R',a:0x00000000}],
  'dirty WB':  [{t:'R',a:0x00000000},{t:'W',a:0x00000000,d:0xDE},{t:'R',a:0x00004000},{t:'R',a:0x00000000}],
  'data change':[
    {t:'R',a:0x00000000},
    {t:'W',a:0x00000000,d:0xAA},
    {t:'W',a:0x00000004,d:0xBB},
    {t:'W',a:0x00000008,d:0xCC},
    {t:'W',a:0x0000000C,d:0xDD},
    {t:'R',a:0x00000000},
    {t:'R',a:0x0000000C},
  ],
  'all states':[
    {t:'R',a:0x00000000},
    {t:'W',a:0x00000004,d:0x42},
    {t:'R',a:0x00004000},
    {t:'W',a:0x00000010,d:0x77},
    {t:'R',a:0x00000010},
    {t:'R',a:0x00008000},
  ],
  'data changes':[
    {t:'R',a:0x00000000},
    {t:'W',a:0x00000000,d:0xAA},
    {t:'W',a:0x00000004,d:0xBB},
    {t:'W',a:0x00000008,d:0xCC},
    {t:'W',a:0x0000000C,d:0xDD},
    {t:'R',a:0x00000000},
    {t:'R',a:0x0000000C},
    {t:'R',a:0x00004000},
  ],
  'conflict thrashing (dirty eviction loop)':[
    {t:'R',a:0x00000000},
    {t:'W',a:0x00000000,d:0xAA}, // Dirty set 0
    {t:'R',a:0x00004000},        // Map to set 0, evicts dirty 0x0
    {t:'W',a:0x00004000,d:0xBB}, // Dirty set 0 again with 0x4000
    {t:'R',a:0x00000000},        // Evicts dirty 0x4000, loads 0x0 back
    {t:'W',a:0x00000000,d:0xCC}, // Dirty 0x0 again
    {t:'R',a:0x00004000},        // Evicts dirty 0x0, loads 0x4000
    {t:'R',a:0x00004004},        // Read hit
  ],
  'spatial locality demo':[
    {t:'R',a:0x00001000}, // Load block [1000-100F]
    {t:'R',a:0x00001004}, // Hit
    {t:'R',a:0x00001008}, // Hit
    {t:'W',a:0x0000100C,d:0x11}, // Write Hit
    {t:'R',a:0x00001010}, // Miss! Load next block [1010-101F]
    {t:'R',a:0x00001014}, // Hit
  ],
  'random access stress':[
    {t:'W',a:0x00000AE0,d:0x12},
    {t:'R',a:0x00000C04},
    {t:'W',a:0x00000AE4,d:0x34},
    {t:'R',a:0x00000AE4},
    {t:'R',a:0x00000C00},
    {t:'W',a:0x00008C00,d:0x99}, // Conflict with C00
    {t:'W',a:0x0000AC00,d:0x55}, // Conflict with 8C00
    {t:'R',a:0x00000C00}, // Re-load C00, dirty eviction
  ]
};
