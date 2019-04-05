import { ParticleWay } from "./ParticleWay";
import { Particle } from "./Particle";

/**
 * 一定間隔でパーティクルを生成し、アニメーションさせるクラス。
 * パーティクルインスタンスの生成と管理を行う。
 */
export class ParticleGenerator {
  public path: ParticleWay;
  protected _visible: boolean = true;

  protected particles: Particle[] = [];
  protected renderID = null;

  public particleInterval: number = 300;
  protected lastParticleTime: number = 0;
  protected lastAnimateTime: number = 0;
  public ease: (number) => number;
  private isDisposed: boolean = false;
  public speedPerSec: number = 0.07;

  /**
   * @param path
   */
  constructor(path: ParticleWay) {
    this.path = path;
  }

  public play(): void {
    if (this.renderID != null) return;
    this.lastParticleTime = this.lastAnimateTime = performance.now();
    this.renderID = requestAnimationFrame(this.animate);
  }

  public stop(): void {
    if (this.renderID == null) return;
    cancelAnimationFrame(this.renderID);
    this.renderID = null;
  }

  protected animate = (timestamp: number) => {
    if (this.isDisposed) return;

    //move particle
    const movement =
      ((timestamp - this.lastAnimateTime) / 1000) * this.speedPerSec;

    this.particles.forEach(p => {
      p.add(movement);
    });

    //remove particle
    this.removeCompletedParticles();

    //generate particle
    if (this.renderID != null) {
      while (timestamp > this.lastParticleTime + this.particleInterval) {
        const current = this.lastParticleTime;
        this.lastParticleTime += this.particleInterval;
        //すでに寿命切れのパーティクルは生成をスキップ。
        if (timestamp > current + (1.0 / this.speedPerSec) * 1000) {
          continue;
        }

        const particle = this.generate();
        const move = ((timestamp - current) * this.speedPerSec) / 1000;
        particle.add(move);
      }
    }

    this.lastAnimateTime = timestamp;
    this.renderID = requestAnimationFrame(this.animate);
  };

  protected generate(): Particle {
    const particle: Particle = this.generateParticle(this.path);
    this.particles.push(particle);
    particle.visible = this._visible;
    return particle;
  }

  /**
   * パーティクルを生成する。
   * generate関数の内部処理。
   * @param path
   */
  protected generateParticle(path: ParticleWay): Particle {
    const particle = new Particle(path);
    if (this.ease != null) {
      particle.ease = this.ease;
    }
    //TODO ここでコンテナに挿入。
    return particle;
  }

  public generateAll(): void {
    const move: number = (this.speedPerSec * this.particleInterval) / 1000;
    let pos: number = 0.0;

    while (pos < 1.0) {
      const particle = this.generate();
      particle.update(pos);
      pos += move;
    }
    this.removeCompletedParticles();
  }

  /**
   * 寿命切れのパーティクルを一括で削除する。
   */
  private removeCompletedParticles(): void {
    const removed = this.particles
      .filter(p => {
        return p.ratio >= 1.0;
      })
      .forEach(p => {
        p.dispose();
      });
    this.particles = this.particles.filter(p => {
      return p.ratio < 1.0;
    });
  }

  /**
   * 指定されたパーティクルを削除する。
   * @param particle
   */
  public removeParticle(particle: Particle): void {
    const i: number = this.particles.indexOf(particle);
    const popped: Particle[] = this.particles.splice(i, 1);
    popped.forEach(val => {
      val.dispose();
    });
  }

  /**
   * 全てのパーティクルを削除する。
   */
  public removeAllParticles(): void {
    this.particles.forEach(p => {
      p.dispose();
    });
    this.particles = [];
  }

  /**
   * パーティクル生成の停止とパーティクルの破棄を行う。
   */
  public dispose(): void {
    this.stop();
    this.isDisposed = true;

    this.removeAllParticles();
    this.particles = null;
    this.path = null;
  }

  get visible(): boolean {
    return this._visible;
  }
  set visible(value: boolean) {
    this._visible = value;
    for (let i in this.particles) {
      this.particles[i].visible = this._visible;
    }
  }
}
