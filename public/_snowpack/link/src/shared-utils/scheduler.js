let updateOnce = null;
const updateRepeat = {};
let willUpdate = false;
let uidCounter = 0;
let oldTime = 0;
function processUpdates(time) {
  const tpf = oldTime ? time - oldTime : oldTime;
  oldTime = time;
  if (updateOnce) {
    for (const id in updateOnce) {
      updateOnce[id](tpf);
    }
    updateOnce = null;
  }
  let updates = 0;
  for (const id in updateRepeat) {
    updates++;
    updateRepeat[id](tpf);
  }
  if (!updates) {
    willUpdate = false;
    oldTime = 0;
  } else {
    requestAnimationFrame(processUpdates);
  }
}
export function once(fn, id) {
  id = id || fn.name || uidCounter++;
  updateOnce = updateOnce || {};
  updateOnce[id] = fn;
  if (!willUpdate) {
    requestAnimationFrame(processUpdates);
    willUpdate = true;
  }
}
export function repeat(fn, id) {
  id = id || fn.name || uidCounter++;
  updateRepeat[id] = fn;
  if (!willUpdate) {
    requestAnimationFrame(processUpdates);
    willUpdate = true;
  }
  return id;
}
export function stop(id) {
  if (typeof id === "function") {
    id = id.name;
  }
  delete updateRepeat[id];
}
