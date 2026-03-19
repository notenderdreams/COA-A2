import {
  NUM_SETS,
  BLOCK_BYTES,
  OFFSET_BITS,
  INDEX_BITS,
  TAG_BITS,
  MEM_LAT,
} from "./constants";

export function makeCache() {
  return Array.from({ length: NUM_SETS }, (_, i) => ({
    valid: 0,
    dirty: 0,
    tag: -1,
    data: [0, 0, 0, 0],
    set: i,
  }));
}

export function addr2offset(a) {
  return a & (BLOCK_BYTES - 1);
}
export function addr2index(a) {
  return (a >> OFFSET_BITS) & (NUM_SETS - 1);
}
export function addr2tag(a) {
  return a >>> (OFFSET_BITS + INDEX_BITS);
}
export function blockBase(a) {
  return a & ~(BLOCK_BYTES - 1);
}
export function addr2set(a) {
  return addr2index(a);
}

export function memDef(a) {
  return ((a * 0x6d + 0x11) >>> 0) & 0xffffffff;
}

export function simulateReq(req, cache, mem) {
  const steps = [];
  const c = cache.map((l) => ({
    ...l,
    data: Array.isArray(l.data) ? [...l.data] : [0, 0, 0, 0],
  }));
  const m = { ...mem };

  const idx = addr2index(req.addr);
  const tag = addr2tag(req.addr);
  const wi = Math.floor(addr2offset(req.addr) / 4);
  const base = blockBase(req.addr);
  const line = c[idx];
  const isHit = line.valid && line.tag === tag;
  let hitFlag = false,
    wbFlag = false;

  const hxVal = (v) =>
    "0x" + (v >>> 0).toString(16).toUpperCase().padStart(8, "0");
  const hx8 = (v) =>
    "0x" + (v >>> 0).toString(16).toUpperCase().padStart(8, "0");

  const push = (state, note, sigs, as = -1) => {
    steps.push({
      state,
      note,
      sigs: {
        stall_cpu: 0,
        mem_read: 0,
        mem_write: 0,
        cache_write: 0,
        mem_ready: 0,
        ...sigs,
      },
      activeSet: as,
      addr: req.addr,
      rtype: req.type,
      _isHit: isHit,
      _isWB: false,
    });
  };

  push(
    "Idle",
    `CPU ${req.type === "W" ? "WRITE" : "READ"} @ ${hx8(req.addr)}  idx=${idx} word=${wi}`,
    { stall_cpu: 0 },
  );

  push(
    "Compare_Tag",
    isHit
      ? `HIT — tag ${hxVal(tag)} matches, valid=1${req.type === "W" ? " → write word " + wi + " set dirty" : " → read word " + wi}`
      : `MISS — ${line.valid ? (line.dirty ? `dirty eviction needed (old tag=${hxVal(line.tag)})` : "clean, old block discarded") : "invalid slot"}`,
    { stall_cpu: 1 },
    idx,
  );

  if (isHit) {
    hitFlag = true;
    if (req.type === "W") {
      c[idx].data[wi] = req.data >>> 0;
      c[idx].dirty = 1;
    }
    push(
      "Idle",
      req.type === "W"
        ? `Write hit done — W${wi} ← ${hxVal(req.data)}, dirty=1`
        : `Read hit done — W${wi} = ${hxVal(c[idx].data[wi])}`,
      { stall_cpu: 0, cache_write: req.type === "W" ? 1 : 0, mem_ready: 1 },
    );
  } else {
    if (line.valid && line.dirty) {
      wbFlag = true;
      const wbBase =
        ((line.tag << (OFFSET_BITS + INDEX_BITS)) | (idx << OFFSET_BITS)) >>> 0;
      const wbBlock = [...line.data];
      for (let i = 0; i < MEM_LAT - 1; i++) {
        push(
          "Write_Back",
          `WB stall ${i + 1}/${MEM_LAT - 1} — flushing block ${hx8(wbBase)} to memory`,
          { stall_cpu: 1, mem_write: 1 },
          idx,
        );
      }
      m[wbBase] = { data: wbBlock, op: "WB" };
      push(
        "Write_Back",
        `WB done — ${hx8(wbBase)} [${wbBlock.map(hxVal).join(" ")}] written to mem`,
        { stall_cpu: 1, mem_write: 1, mem_ready: 1 },
        idx,
      );
    }

    for (let i = 0; i < MEM_LAT - 1; i++) {
      push(
        "Allocate",
        `Alloc stall ${i + 1}/${MEM_LAT - 1} — fetching block ${hx8(base)} from memory`,
        { stall_cpu: 1, mem_read: 1 },
        idx,
      );
    }

    const existing = m[base] ? m[base].data : null;
    const fetched = [0, 1, 2, 3].map((w) =>
      existing ? existing[w] : memDef(base + w * 4) >>> 0,
    );

    c[idx] = { valid: 1, dirty: 0, tag, data: [...fetched], set: idx };
    m[base] = { data: [...fetched], op: "RD" };

    push(
      "Allocate",
      `Alloc done — block ${hx8(base)} [${fetched.map(hxVal).join(" ")}] → set ${idx}`,
      { stall_cpu: 1, mem_read: 1, mem_ready: 1 },
      idx,
    );

    if (req.type === "W") {
      c[idx].data[wi] = req.data >>> 0;
      c[idx].dirty = 1;
      push(
        "Compare_Tag",
        `Re-compare: HIT — W${wi} ← ${hxVal(req.data)}, tag set, dirty=1`,
        { stall_cpu: 0, cache_write: 1, mem_ready: 1 },
        idx,
      );
    } else {
      push(
        "Compare_Tag",
        `Re-compare: HIT — W${wi} = ${hxVal(fetched[wi])}, tag set, valid=1`,
        { stall_cpu: 0, cache_write: 1, mem_ready: 1 },
        idx,
      );
    }
    push(
      "Idle",
      `Done — ${req.type === "W" ? `W${wi} = ${hxVal(req.data)}` : `read ${hxVal(fetched[wi])}`}, CPU unblocked`,
      { mem_ready: 1, cache_write: 0 },
    );
  }

  steps.forEach((s) => {
    s._isHit = hitFlag;
    s._isWB = wbFlag;
  });

  return { steps, newCache: c, newMem: m, hit: hitFlag, wb: wbFlag };
}
