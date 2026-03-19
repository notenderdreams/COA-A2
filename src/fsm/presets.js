import { makeCache, simulateReq } from "./logic";


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


export function buildPresetRun(name) {
  let c = makeCache();
  let m = {};
  let allSteps = [];
  let allSnaps = [];
  let allMemSnaps = [];
  let qArr = [];

  const preset = PRESETS[name];
  if (!preset) {
    return {
      trace: [],
      cacheSnaps: [],
      memSnaps: [],
      cache: makeCache(),
      mem: {},
      queue: [],
    };
  }

  for (const req of preset) {
    const { steps, newCache, newMem } = simulateReq(
      { type: req.t, addr: req.a, data: req.d ?? 0 },
      c,
      m,
    );

    const reqIdx = qArr.length;

    const newSteps = steps.map((s, i) => ({
      ...s,
      cycle: allSteps.length + i + 1,
      reqIdx,
    }));

    const newSnaps = steps.map((_, i) =>
      i === steps.length - 1
        ? newCache.map((l) => ({
            ...l,
            data: Array.isArray(l.data) ? [...l.data] : new Array(4).fill(0),
          }))
        : c.map((l) => ({
            ...l,
            data: Array.isArray(l.data) ? [...l.data] : new Array(4).fill(0),
          })),
    );

    const newMemSnaps = steps.map((_, i) =>
      i === steps.length - 1 ? { ...newMem } : { ...m },
    );

    allSteps = [...allSteps, ...newSteps];
    allSnaps = [...allSnaps, ...newSnaps];
    allMemSnaps = [...allMemSnaps, ...newMemSnaps];

    qArr.push({
      type: req.t,
      addr: req.a,
      data: req.d ?? null,
      reqIdx,
    });

    c = newCache;
    m = newMem;
  }

  return {
    trace: allSteps,
    cacheSnaps: allSnaps,
    memSnaps: allMemSnaps,
    cache: c,
    mem: m,
    queue: qArr,
  };
}