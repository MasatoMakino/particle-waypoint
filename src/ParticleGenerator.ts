import { ParticleWay } from "./ParticleWay";
import { Particle } from "./Particle";
import { returnStatement } from "@babel/types";

/**
 * 一定間隔でパーティクルを生成し、アニメーションさせるクラス。
 * パーティクルインスタンスの生成と管理を行う。
 */
export class ParticleGenerator {
  public path: ParticleWay;
  protected _visible: boolean = true;

  protected particles: Particle[] = [];
  protected renderID = null;

  //animation setting
  public particleInterval: number = 300;
  public speedPerSec: number = 0.07;
  public ease: (number) => number;
  protected _isLoop: boolean = false;

  private lastParticleTime: number = 0;
  private lastAnimateTime: number = 0;

  private isDisposed: boolean = false;

  /**
   * @param path
   * @param option
   */
  constructor(path: ParticleWay, option?: ParticleGeneratorOption) {
    this.path = path;

    if (option == null) return;
    if (option.isLoop) this._isLoop = option.isLoop;
    if (option.ease) this.ease = option.ease;
  }

  public play(): void {
    if (this.renderID != null) return;
    this.lastParticleTime = this.lastAnimateTime = performance.now();

    if (this._isLoop) {
      this.renderID = requestAnimationFrame(this.loop);
    } else {
      this.renderID = requestAnimationFrame(this.animate);
    }
  }

  public stop(): void {
    if (this.renderID == null) return;
    cancelAnimationFrame(this.renderID);
    this.renderID = null;
  }

  /**
   * パーティクルをアニメーションさせる。
   * @param timestamp
   */
  protected animate = (timestamp: number) => {
    if (this.isDisposed) return;

    this.move(timestamp);
    this.removeCompletedParticles();

    //generate particle
    while (timestamp > this.lastParticleTime + this.particleInterval) {
      const current = this.lastParticleTime;
      this.lastParticleTime += this.particleInterval;
      //すでに寿命切れのパーティクルは生成をスキップ。
      if (timestamp > current + (1.0 / this.speedPerSec) * 1000) {
        continue;
      }

      const particle = this.generate();
      const move =
        ((timestamp - this.lastParticleTime) * this.speedPerSec) / 1000;
      particle.add(move);
    }

    this.renderID = requestAnimationFrame(this.animate);
  };

  /**
   * パーティクルをループアニメーションさせる。
   * @param timestamp
   */
  protected loop = (timestamp: number) => {
    if (this.isDisposed) return;

    if (this.particles.length === 0) {
      this.generateAll();
    }
    this.move(timestamp);
    this.rollupParticles();

    this.renderID = requestAnimationFrame(this.loop);
  };

  /**
   * パーティクルの位置を経過時間分移動する。
   * @param timestamp
   */
  protected move(timestamp: number): void {
    const movement =
      ((timestamp - this.lastAnimateTime) / 1000) * this.speedPerSec;
    this.particles.forEach(p => {
      p.add(movement);
    });
    this.lastAnimateTime = timestamp;
  }

  /**
   * パーティクルを1つ追加する。
   */
  protected generate(): Particle {
    const particle: Particle = this.generateParticle(this.path);
    this.particles.push(particle);
    particle.visible = this._visible;
    if (this.ease != null) {
      particle.ease = this.ease;
    }
    return particle;
  }

  /**
   * パーティクルを生成する。
   * generate関数の内部処理。
   * @param path
   */
  protected generateParticle(path: ParticleWay): Particle {
    const particle = new Particle(path);
    //TODO ここでコンテナに挿入。
    return particle;
  }

  /**
   * 経路上にパーティクルを敷き詰める。
   */
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

  private rollupParticles(): void {
    this.particles.forEach(p => {
      p.update(p.ratio % 1);
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

  public setSpeed(interval: number, particleNum: number): void {
    this.particleInterval = interval;
    this.speedPerSec = ParticleGeneratorUtility.getSpeed(interval, particleNum);
  }

  public setInterval(speed: number, particleNum: number): void {
    this.speedPerSec = speed;
    this.particleInterval = ParticleGeneratorUtility.getInterval(
      speed,
      particleNum
    );
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

export interface ParticleGeneratorOption {
  isLoop?: boolean;
  ease?: (number) => number;
}

export class ParticleGeneratorUtility {
  public static getSpeed(interval: number, particleNum: number): number {
    return (1.0 / (interval * particleNum)) * 1000;
  }

  public static getInterval(speed: number, particleNum: number): number {
    return (1.0 / speed / particleNum) * 1000;
  }
}
