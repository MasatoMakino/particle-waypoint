import { ParticleWay } from "./ParticleWay";
import { Particle } from "./Particle";

/**
 * 一定間隔でパーティクルを生成し、アニメーションさせるクラス。
 * パーティクルインスタンスの生成と管理を行う。
 */
export class ParticleGenerator {
  public path: ParticleWay;
  private _visible: boolean = true;

  private particles: Particle[] = [];
  private renderID = null;

  //animation setting
  public particleInterval: number = 300;
  public speedPerSec: number = 0.07;
  public ease: (number) => number;
  private _isLoop: boolean = false;

  private elapsedFromGenerate: number = 0; //前回パーティクル生成時からの経過時間　単位ms
  private lastAnimateTime: number = 0; //アニメーションを最後に実行した時点のタイムスタンプ　単位ms

  private isDisposed: boolean = false;

  /**
   * コンストラクタ
   * @param path
   * @param option
   */
  constructor(path: ParticleWay, option?: ParticleGeneratorOption) {
    this.path = path;

    if (option == null) return;
    if (option.isLoop) this._isLoop = option.isLoop;
    if (option.ease) this.ease = option.ease;
  }

  /**
   * パーティクルの生成を開始する。
   */
  public play(): void {
    if (this.renderID != null) return;
    this.lastAnimateTime = performance.now();

    if (this._isLoop) {
      this.renderID = requestAnimationFrame(this.loop);
    } else {
      this.renderID = requestAnimationFrame(this.animate);
    }
  }

  /**
   * パーティクルの生成を停止する。
   */
  public stop(): void {
    if (this.renderID == null) return;
    cancelAnimationFrame(this.renderID);
    this.renderID = null;
  }

  /**
   * パーティクルをアニメーションさせる。
   * @param timestamp requestAnimationFrameのタイムスタンプ。単位ミリ秒。
   */
  private animate = (timestamp: number) => {
    if (this.isDisposed) return;

    const delta = this.getDelta(timestamp);
    this.move(delta);
    this.removeCompletedParticles();

    //generate particle
    this.elapsedFromGenerate += delta;
    while (this.elapsedFromGenerate > this.particleInterval) {
      this.elapsedFromGenerate -= this.particleInterval;
      //すでに寿命切れのパーティクルは生成をスキップ。
      if (this.elapsedFromGenerate > (1.0 / this.speedPerSec) * 1000) {
        continue;
      }

      const particle = this.generate();
      const move = (this.elapsedFromGenerate * this.speedPerSec) / 1000;
      particle.add(move);
    }

    this.renderID = requestAnimationFrame(this.animate);
  };

  /**
   * パーティクルをループアニメーションさせる。
   * @param timestamp requestAnimationFrameのタイムスタンプ。単位ミリ秒。
   */
  private loop = (timestamp: number) => {
    if (this.isDisposed) return;

    if (this.particles.length === 0) {
      this.generateAll();
    }

    const delta = this.getDelta(timestamp);
    this.move(delta);
    this.rollupParticles();

    this.renderID = requestAnimationFrame(this.loop);
  };

  /**
   * 前回アニメーション実行時からの経過時間を取得する。
   * @param timestamp
   */
  private getDelta(timestamp: number): number {
    const delta = timestamp - this.lastAnimateTime;
    this.lastAnimateTime = timestamp;
    return delta;
  }

  /**
   * パーティクルの位置を経過時間分移動する。
   * @param delta 前回アニメーションが実行されてからの経過時間
   */
  private move(delta: number): void {
    const movement = (delta / 1000) * this.speedPerSec;
    this.particles.forEach(p => {
      p.add(movement);
    });
  }

  /**
   * パーティクルを1つ追加する。
   */
  private generate(): Particle {
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
    this.elapsedFromGenerate = 0;
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
   * 終端にたどり着いたパーティクルを視点に巻き戻す。
   */
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

  /**
   * 生成インターバルと経路上のパーティクル数から移動スピードを算出し設定する。
   * loop時に破綻しない値が得られる。
   * @param interval
   * @param particleNum
   */
  public setSpeed(interval: number, particleNum: number): void {
    this.particleInterval = interval;
    this.speedPerSec = ParticleGeneratorUtility.getSpeed(interval, particleNum);
  }

  /**
   * 移動スピードと経路上のパーティクル数から生成インターバルを算出し設定する。
   * loop時に破綻しない値が得られる。
   * @param speed
   * @param particleNum
   */
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

  get isLoop(): boolean {
    return this._isLoop;
  }

  set isLoop(value: boolean) {
    if (value === this._isLoop) return;

    this._isLoop = value;

    if (this._isLoop) {
      this.removeAllParticles();
    }

    //再生中なら一旦停止して再度再生
    if (this.renderID != null) {
      this.stop();
      this.play();
    }
  }
}

/**
 * パーティクル生成方法を指定するオプション
 */
export interface ParticleGeneratorOption {
  isLoop?: boolean; //パーティクルを随時生成する = true , 終端にたどり着いたパーティ栗を巻き戻して再利用する = false. デフォルトはtrue.
  ease?: (number) => number;
}

/**
 * ParticleGeneratorで利用する各種の値を算出するヘルパークラス
 */
export class ParticleGeneratorUtility {
  /**
   * パーティクルの生成インターバルと経路上の数から、移動速度を算出する
   * @param interval
   * @param particleNum
   */
  public static getSpeed(interval: number, particleNum: number): number {
    return (1.0 / (interval * particleNum)) * 1000;
  }

  /**
   * パーティクルの移動速度と経路上の数から、生成インターバルを算出する
   * @param speed
   * @param particleNum
   */
  public static getInterval(speed: number, particleNum: number): number {
    return (1.0 / speed / particleNum) * 1000;
  }
}
