export class M {
  static of(a) {
    return new M(a);
  }
  constructor(a) {
    this.value = a;
  }
  of(b) {
    return new M(b);
  }
  map(fn) {
    return new M(fn(this.value));
  }
  ap(m) {
    return m.flatMap(this.map.bind(this));
  }
  flatMap(fn) {
    return fn(this.value);
  }
  combine(fn, b) {
    return this.flatMap((v1) => b.flatMap((v2) => M.of(fn(v1, v2))));
  }
  pull(fn, b) {
    return this.flatMap((v1) => M.of(fn(v1, b)));
  }
}
export function alter(coll, k, fn) {
  ;
  coll[k] = fn(coll[k]);
  return coll;
}
