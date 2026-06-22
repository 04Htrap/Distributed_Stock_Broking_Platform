class PriorityQueue {
  constructor(compareFn) {
    this.heap = [];   // 🔥 renamed from data → heap
    this.compare = compareFn;
  }

  size() {
    return this.heap.length;
  }

  peek() {
    return this.heap[0];
  }

  push(item) {
    this.heap.push(item);
    this._heapifyUp();
  }

  pop() {
    if (this.size() === 0) return null;

    const top = this.heap[0];
    const last = this.heap.pop();

    if (this.size() > 0) {
      this.heap[0] = last;
      this._heapifyDown();
    }

    return top;
  }

  _heapifyUp() {
    let i = this.size() - 1;

    while (i > 0) {
      let parent = Math.floor((i - 1) / 2);

      if (this.compare(this.heap[i], this.heap[parent])) {
        [this.heap[i], this.heap[parent]] =
          [this.heap[parent], this.heap[i]];
        i = parent;
      } else break;
    }
  }

  _heapifyDown() {
    let i = 0;

    while (true) {
      let left = 2 * i + 1;
      let right = 2 * i + 2;
      let best = i;

      if (left < this.size() &&
          this.compare(this.heap[left], this.heap[best])) {
        best = left;
      }

      if (right < this.size() &&
          this.compare(this.heap[right], this.heap[best])) {
        best = right;
      }

      if (best !== i) {
        [this.heap[i], this.heap[best]] =
          [this.heap[best], this.heap[i]];
        i = best;
      } else break;
    }
  }
}

module.exports = PriorityQueue;