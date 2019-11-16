import { ParticleWay } from "./ParticleWay";
import { Particle } from "./Particle";
import { RAFTicker, RAFTickerEvent, RAFTickerEventType } from "raf-ticker";
import { ParticleGeneratorUtility } from "./ParticleGeneratorUtility";

/**
 * 一定間隔でパーティクルを生成し、アニメーションさせるクラス。
 * パーティクルインスタンスの生成と管理を行う。
 */
export class ParticleGenerator {
  public path: ParticleWay[] = [];
  public pathSelectType: PathSelectType = PathSelectType.Sequential;
  private pathSelectionCount: number = 0;
  private _visible: boolean = true;

  private particles: Particle[] = [];
  private isPlaying: boolean = false;

  //animation setting
  private _particleInterval: number = 300;
  public speedPerSec: number = 0.07;
  private _ease: (number) => number;
  private _isLoop: boolean = false;
  private _probability: number = 1.0;
  private _isOpenValve: boolean = true;

  private elapsedFromGenerate: number = 0; //前回パーティクル生成時からの経過時間　単位ms

  private isDisposed: boolean = false;

  /**
   * コンストラクタ
   * @param path
   * @param option
   */
  constructor(
    path: ParticleWay | ParticleWay[],
    option?: ParticleGeneratorOption
  ) {
    if (Array.isArray(path)) {
      this.path = path;
    } else {
      this.path = [path];
    }

    if (option == null) return;
    if (option.isLoop) this._isLoop = option.isLoop;
    if (option.ease) this._ease = option.ease;
    if (option.probability) this._probability = option.probability;
  }

  /**
   * パーティクルアニメーションを開始する。
   */
  public play(): void {
    if (this.isPlaying) return;
    this.isPlaying = true;

    if (this._isLoop) {
      RAFTicker.addEventListener(RAFTickerEventType.tick, this.loop);
    } else {
      RAFTicker.addEventListener(RAFTickerEventType.tick, this.animate);
    }
  }

  /**
   * パーティクルアニメーションを停止する。
   */
  public stop(): void {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    RAFTicker.removeEventListener(RAFTickerEventType.tick, this.loop);
    RAFTicker.removeEventListener(RAFTickerEventType.tick, this.animate);
  }

  /**
   * パーティクル生成を開始する。
   */
  public openValve(): void {
    if (this._isOpenValve) return;

    this._isOpenValve = true;
    this.warnValve();
  }

  /**
   * パーティクル生成を停止する。
   * アニメーションは続行される。
   */
  public closeValve(): void {
    if (!this._isOpenValve) return;

    this._isOpenValve = false;
    this.warnValve();
  }

  private warnValve(): void {
    if (!this._isLoop) return;
    console.warn(
      "ParticleGenerator : ループ指定中にバルブ開閉操作を行いました。この操作はループ指定中には反映されません。"
    );
    console.trace();
  }

  /**
   * パーティクルをアニメーションさせる。
   * @param e
   */
  private animate = (e: RAFTickerEvent) => {
    if (this.isDisposed) return;

    this.move(e.delta);
    this.removeCompletedParticles();
    this.addParticle(e.delta);
  };

  /**
   * アニメーションに伴い、新規パーティクルを追加する。
   * @param delta
   */
  private addParticle(delta: number): void {
    if (!this._isOpenValve) return;

    this.elapsedFromGenerate += delta;
    while (this.elapsedFromGenerate > this._particleInterval) {
      this.elapsedFromGenerate -= this._particleInterval;
      //すでに寿命切れのパーティクルは生成をスキップ。
      if (this.elapsedFromGenerate > (1.0 / this.speedPerSec) * 1000) {
        continue;
      }

      const particle = this.generate();
      const move = (this.elapsedFromGenerate * this.speedPerSec) / 1000;
      if (particle) particle.add(move);
    }
  }

  /**
   * パーティクルをループアニメーションさせる。
   * @param e
   */
  private loop = (e: RAFTickerEvent) => {
    if (this.isDisposed) return;

    if (this.particles.length === 0) {
      this.generateAll();
    }

    this.move(e.delta);
    this.rollupParticles();
  };

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
    this.pathSelectionCount = (this.pathSelectionCount + 1) % this.path.length;

    //発生確率に応じて生成の可否を判定する。
    if (this._probability !== 1.0) {
      if (Math.random() > this._probability) return null;
    }

    const path = this.getPath(this.pathSelectionCount);
    const particle: Particle = this.generateParticle(path);

    this.particles.push(particle);
    particle.visible = this._visible;
    if (this._ease != null) {
      particle.ease = this._ease;
    }
    return particle;
  }

  private getPath(count: number): ParticleWay {
    let index;
    switch (this.pathSelectType) {
      case PathSelectType.Sequential:
        index = count;
        break;
      case PathSelectType.Random:
        index = Math.floor(Math.random() * this.path.length);
        break;
    }
    return this.path[index];
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
    //パーティクルの最大生存期間 単位ミリ秒
    let lifeTime = 1000.0 / this.speedPerSec;

    while (lifeTime > 0.0) {
      const particle = this.generate();
      if (particle) particle.update((lifeTime / 1000) * this.speedPerSec);
      lifeTime -= this._particleInterval;
    }
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
   * 終端にたどり着いたパーティクルを始点に巻き戻す。
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
    this._particleInterval = interval;
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
    this._particleInterval = ParticleGeneratorUtility.getInterval(
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

  get particleInterval(): number {
    return this._particleInterval;
  }

  set particleInterval(value: number) {
    if (this._particleInterval === value) return;

    this._particleInterval = value;
    if (this._isLoop) {
      console.warn(
        "ParticleGenerator : ループ指定中にパーティクル生成間隔を再設定しても反映されません。設定を反映するためにパーティクルを削除して再生成してください。"
      );
      console.trace();
    }
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
    if (this.isPlaying) {
      this.stop();
      this.play();
    }
  }

  get ease(): (number) => number {
    return this._ease;
  }

  get probability(): number {
    return this._probability;
  }

  set probability(value: number) {
    this._probability = value;
  }

  /**
   * 各パーティクルのEase関数を更新する。
   * @param ease イージング関数。
   * @param override 現存するパーティクルのEase関数を上書きするか否か。規定値はtrue。
   */
  updateEase(ease: (number) => number, override: boolean = true) {
    this._ease = ease;
    if (!override && this._isLoop) {
      console.warn(
        "ParticleGenerator : ループ指定中にEase関数を再設定すると、既存のパーティクルのEase関数は常に上書きされます。"
      );
      console.trace();
    }
    if (override || this._isLoop) {
      this.particles.forEach(p => {
        p.ease = ease;
      });
    }
  }
}

/**
 * パーティクル生成方法を指定するオプション
 */
export interface ParticleGeneratorOption {
  isLoop?: boolean; //パーティクルを随時生成する = true , 終端にたどり着いたパーティクルを巻き戻して再利用する = false. デフォルトはtrue.
  ease?: (number) => number;
  probability?: number;
}

export enum PathSelectType {
  Random,
  Sequential
}
