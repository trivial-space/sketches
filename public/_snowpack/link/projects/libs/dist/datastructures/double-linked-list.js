class Node {
    constructor(val, list, recalculateNode) {
        this.next = null;
        this.prev = null;
        this.val = val;
        this.list = list;
        this.recalculateNode = recalculateNode;
    }
    setNext(newNext) {
        this.next = newNext || null;
    }
    setPrev(newPrev) {
        this.prev = newPrev || null;
    }
    set(val, recalculate) {
        this.val = val;
        this.recalculateNode(this, recalculate);
    }
}
export function createDoubleLinkedList(vals, { onNextUpdated, onPrevUpdated } = {}) {
    let size = 0;
    let first = null;
    let last = null;
    function recalculateNode(node, recalculate) {
        if (onNextUpdated && recalculate && node.prev) {
            onNextUpdated(node.prev);
        }
        if (onPrevUpdated && recalculate && node.next) {
            onPrevUpdated(node.next);
        }
    }
    function appendValAt(val, oldNode, recalculate) {
        const node = new Node(val, list, recalculateNode);
        const oldNext = oldNode.next;
        oldNode.setNext(node);
        node.setPrev(oldNode);
        node.setNext(oldNext);
        if (oldNext) {
            oldNext.setPrev(node);
        }
        else {
            last = node;
        }
        size++;
        recalculateNode(node, recalculate);
        return node;
    }
    function appendVal(val, recalculate) {
        const node = new Node(val, list, recalculateNode);
        if (!last) {
            first = last = node;
            size = 1;
        }
        else {
            last.setNext(node);
            node.setPrev(last);
            last = node;
            size++;
        }
        recalculateNode(node, recalculate);
    }
    function prependValAt(val, oldNode, recalculate) {
        const node = new Node(val, list, recalculateNode);
        const oldPrev = oldNode.prev;
        oldNode.setPrev(node);
        node.setNext(oldNode);
        node.setPrev(oldPrev);
        if (oldPrev) {
            oldPrev.setNext(node);
        }
        else {
            first = node;
        }
        size++;
        recalculateNode(node, recalculate);
        return node;
    }
    function prependVal(val, recalculate) {
        const node = new Node(val, list, recalculateNode);
        if (!first) {
            first = last = node;
            size = 1;
        }
        else {
            first.setPrev(node);
            node.setNext(first);
            first = node;
            size++;
        }
        recalculateNode(node, recalculate);
    }
    const list = {
        get size() {
            return size;
        },
        get first() {
            return first;
        },
        get last() {
            return last;
        },
        at(n) {
            const reverse = n < 0;
            let count = Math.abs(n);
            let prev = reverse ? last : first;
            let next = prev;
            while (count > 0 && next) {
                next = reverse ? prev && prev.prev : prev && prev.next;
                count--;
                if (next) {
                    prev = next;
                }
            }
            return prev;
        },
        append(val, recalculate) {
            appendVal(val, recalculate);
            return list;
        },
        appendAt(node, val, recalculate) {
            appendValAt(val, node, recalculate);
            return list;
        },
        appendAll(vals, recalculate) {
            for (const val of vals) {
                appendVal(val, recalculate);
            }
            return list;
        },
        prepend(val, recalculate) {
            prependVal(val, recalculate);
            return list;
        },
        prependAt(node, val, recalculate) {
            prependValAt(val, node, recalculate);
            return list;
        },
        prependAll(vals, recalculate) {
            for (const val of vals) {
                prependVal(val, recalculate);
            }
            return list;
        },
        drop(n = 1) {
            const reverse = n < 0;
            let count = Math.min(Math.abs(n), size);
            let node = reverse ? last : first;
            while (count > 0 && node) {
                node = reverse ? node.prev : node.next;
                count--;
                size--;
            }
            if (size === 0) {
                last = null;
                first = null;
            }
            else if (reverse) {
                last = node;
                node === null || node === void 0 ? void 0 : node.setNext();
            }
            else {
                first = node;
                node === null || node === void 0 ? void 0 : node.setPrev();
            }
            return list;
        },
        dropAt(node, n = 1) {
            const reverse = n < 0;
            let count = Math.abs(n);
            let currentNode = node;
            while (count > 0 && currentNode) {
                currentNode = reverse ? currentNode.prev : currentNode.next;
                count--;
                size--;
            }
            if (size === 0) {
                last = null;
                first = null;
            }
            else if (reverse) {
                if (node.next) {
                    node.next.setPrev(currentNode);
                }
                else {
                    last = currentNode;
                }
                if (currentNode) {
                    currentNode.setNext(node.next);
                }
                else {
                    first = node.next;
                }
            }
            else {
                if (node.prev) {
                    node.prev.setNext(currentNode);
                }
                else {
                    first = currentNode;
                }
                if (currentNode) {
                    currentNode.setPrev(node.prev);
                }
                else {
                    last = node.prev;
                }
            }
            return list;
        },
        empty() {
            size = 0;
            first = null;
            last = null;
            return list;
        },
        splitAt(node) {
            const list1 = createDoubleLinkedList();
            const list2 = createDoubleLinkedList();
            let current = first;
            while (current != node) {
                list1.append(current.val);
                current = current.next;
            }
            list1.append(node.val);
            current = node;
            while (current != last) {
                list2.append(current.val);
                current = current.next;
            }
            list2.append(last.val);
            return [list1, list2];
        },
        [Symbol.iterator]: function* () {
            let node = first;
            while (node) {
                yield node.val;
                node = node.next;
            }
        },
        reverted: {
            [Symbol.iterator]: function* () {
                let node = last;
                while (node) {
                    yield node.val;
                    node = node.prev;
                }
            },
        },
        nodes: {
            [Symbol.iterator]: function* () {
                let node = first;
                while (node) {
                    yield node;
                    node = node.next;
                }
            },
        },
        nodesReverted: {
            [Symbol.iterator]: function* () {
                let node = last;
                while (node) {
                    yield node;
                    node = node.prev;
                }
            },
        },
        nodesFrom(node) {
            return {
                [Symbol.iterator]: function* () {
                    while (node) {
                        yield node;
                        node = node.next;
                    }
                },
            };
        },
        nodesRevertedFrom(node) {
            return {
                [Symbol.iterator]: function* () {
                    while (node) {
                        yield node;
                        node = node.prev;
                    }
                },
            };
        },
    };
    if (vals && vals.length) {
        for (const val of vals)
            list.append(val);
    }
    return list;
}
//# sourceMappingURL=double-linked-list.js.map