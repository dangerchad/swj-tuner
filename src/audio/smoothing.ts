export class MedianFilter {
  private window: number[] = [];
  private size: number;

  constructor(size = 5) {
    this.size = size;
  }

  push(value: number): number {
    this.window.push(value);
    if (this.window.length > this.size) this.window.shift();
    const sorted = [...this.window].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  }

  reset() {
    this.window = [];
  }
}
