export function windowSize(callback) {
    function resize() {
        callback({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    }
    window.addEventListener('resize', resize);
    resize();
    return function stop() {
        window.removeEventListener('resize', resize);
    };
}
export function windowSizeObserver() {
    const state = {
        size: { width: 0, height: 0 },
    };
    const destroy = windowSize(s => (state.size = s));
    return { state, destroy };
}
//# sourceMappingURL=dom.js.map