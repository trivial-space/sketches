export class M<A> {
	static of<A>(a: A) {
		return new M(a)
	}

	readonly value: A

	constructor(a: A) {
		this.value = a
	}

	of<B>(b: B): M<B> {
		return new M(b)
	}

	map<B>(fn: (a: A) => B): M<B> {
		return new M(fn(this.value))
	}

	ap<B>(m: M<(a: A) => B>): M<B> {
		return m.flatMap(this.map.bind(this)) as M<B> // TODO: check type error
	}

	flatMap<B>(fn: (a: A) => M<B>): M<B> {
		return fn(this.value)
	}

	combine<B>(fn: (a: A, b: B) => B, b: M<B>) {
		return this.flatMap((v1) => b.flatMap((v2) => M.of(fn(v1, v2))))
	}

	pull<B>(fn: (a: A, b: B) => B, b: B): M<B> {
		return this.flatMap((v1) => M.of(fn(v1, b)))
	}
}

export function alter<A, K extends number>(
	coll: A[],
	k: K,
	fn: (a: A) => A,
): A[]
export function alter<A, K extends string>(
	coll: Record<K, A>,
	k: string,
	fn: (a: A) => A,
): { [k: string]: A }
export function alter<A, K extends string>(
	coll: A[] | Record<K, A>,
	k: K | number,
	fn: (a: A) => A,
) {
	;(coll as any)[k] = fn((coll as any)[k])
	return coll
}
