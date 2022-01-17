export const Buttons = {
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2,
};
export function pointer(opts, callback) {
    const cb = callback || opts;
    const { element = document, enableRightButton, holdDelay = 400, holdRadius = 5, } = opts;
    const state = {
        pressed: {},
        drag: { x: 0, y: 0, dX: 0, dY: 0, xMax: 0, yMax: 0 },
        dragging: false,
        holding: false,
    };
    let x = 0, y = 0, oX = 0, oY = 0, timeout = null;
    function onPointerDown(e) {
        if (e.isPrimary) {
            state.pressed[e.button] = e;
            x = oX = e.clientX;
            y = oY = e.clientY;
            state.dragging = true;
            timeout != null && clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (state.drag.xMax < holdRadius && state.drag.yMax < holdRadius) {
                    state.holding = true;
                    cb(state);
                }
            }, holdDelay);
        }
        else {
            state.pressed[Buttons.RIGHT] = e;
        }
        cb(state);
    }
    function onPointerUp(_e) {
        state.pressed = {};
        delete state.drag.event;
        state.drag.x = 0;
        state.drag.y = 0;
        state.drag.dX = 0;
        state.drag.dY = 0;
        state.drag.xMax = 0;
        state.drag.yMax = 0;
        state.dragging = false;
        state.holding = false;
        timeout != null && clearTimeout(timeout);
        timeout = null;
        cb(state);
    }
    function onPointerMove(e) {
        if (state.dragging && e.isPrimary) {
            state.drag.event = e;
            state.drag.x = x - e.clientX;
            state.drag.y = y - e.clientY;
            state.drag.dX = oX - e.clientX;
            state.drag.dY = oY - e.clientY;
            state.drag.xMax = Math.max(Math.abs(state.drag.x), state.drag.xMax);
            state.drag.yMax = Math.max(Math.abs(state.drag.y), state.drag.yMax);
            oX = e.clientX;
            oY = e.clientY;
            cb(state);
        }
    }
    function preventDefault(e) {
        e.preventDefault();
    }
    element.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointerleave', onPointerUp);
    document.addEventListener('pointercancel', onPointerUp);
    if (enableRightButton) {
        element.addEventListener('contextmenu', preventDefault);
    }
    cb(state);
    return function destroy() {
        element.removeEventListener('pointerdown', onPointerDown);
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
        document.removeEventListener('pointerleave', onPointerUp);
        document.removeEventListener('pointercancel', onPointerUp);
        if (enableRightButton) {
            element.removeEventListener('contextmenu', preventDefault);
        }
    };
}
export function pointerObserver(opts = {}) {
    const observer = {
        Buttons,
        state: {},
        destroy: () => { },
    };
    function callback(state) {
        observer.state = state;
    }
    observer.destroy = pointer(opts, callback);
    return observer;
}
//# sourceMappingURL=pointer.js.map