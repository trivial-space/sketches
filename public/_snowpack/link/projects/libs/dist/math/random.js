export function randInt(int) {
    return Math.floor(Math.random() * int);
}
export function randIntInRange(from, to) {
    return randInt(to - from) + from;
}
export function normalRand() {
    return (Math.random() + Math.random() + Math.random()) / 3;
}
//# sourceMappingURL=random.js.map