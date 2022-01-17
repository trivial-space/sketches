let k = 0;
export function createObject() {
  let i = 0;
  let j = 0;
  k++;
  return {
    incJ() {
      j++;
      return j;
    },
    get j() {
      return j;
    },
    incI() {
      i++;
      return i;
    },
    get i() {
      return i;
    },
    get k() {
      return k;
    }
  };
}
console.log("loading module2 ff");
