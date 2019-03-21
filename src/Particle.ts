import { ParticleWay } from "./ParticleWay";

export class Particle {
  private _pathPosition: number;
  protected path: ParticleWay;
  private _visible: boolean;

  constructor(path: ParticleWay) {
    this.path = path;
    this._pathPosition = 0.0;
  }

  update(t: number): void {
    this._pathPosition = t;
  }
  add(t: number): void {
    this._pathPosition += t;
    this.update(this._pathPosition);
  }
  get pathPosition(): number {
    return this._pathPosition;
  }
  set visible(value: boolean) {
    this._visible = value;
  }
  dispose(): void {}
}
