import { ParticleValve } from "./ParticleValve";
import { ParticleContainer } from "./ParticleContainer";
import { MultipleParticleWays } from "./MultipleParticleWays";
import { ParticleWay } from "./ParticleWay";
import { Particle } from "./Particle";
import { RAFTicker, RAFTickerEvent, RAFTickerEventType } from "raf-ticker";
import { ParticleGeneratorUtility } from "./ParticleGeneratorUtility";

/**
 * 一定間隔でパーティクルを生成し、アニメーションさせるクラス。
 * パーティクルインスタンスの生成と管理を行う。
 */
export class ParticleGenerator {
  public multipleWays: MultipleParticleWays;
  public particleContainer: ParticleContainer;
  public valve: ParticleValve;

  private _isPlaying: boolean = false;
  get isPlaying(): boolean {
    return this._isPlaying;
  }

  //animation setting
  private _particleInterval: number = 300;
  public speedPerSec: number = 0.07;
  private _ease: (number) => number;

  private _isLoop: boolean = false;
  get isLoop(): boolean {
    return this._isLoop;
  }
  set isLoop(value: boolean) {
    if (value === this._isLoop) return;

    this._isLoop = value;

    if (this._isLoop) {
      this.particleContainer.removeAll();
    }

    //再生中なら一旦停止して再度再生
    if (this._isPlaying) {
      this.stop();
      this.play();
    }
  }

  private _probability: number = 1.0;

  /**
   * 前回パーティクル生成時からの経過時間 単位ms
   * @private
   */
  private elapsedFromGenerate: number = 0;

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
    this.multipleWays = new MultipleParticleWays({ ways: path });
    this.particleContainer = new ParticleContainer();
    this.valve = new ParticleValve(this);

    if (option == null) return;
    this._isLoop = option.isLoop ?? this._isLoop;
    this._ease = option.ease ?? this._ease;
    this._probability = option.probability ?? this._probability;
  }

  /**
   * パーティクルアニメーションを開始する。
   */
  public play(): void {
    if (this._isPlaying) return;
    this._isPlaying = true;

    if (this._isLoop) {
      RAFTicker.addListener(RAFTickerEventType.tick, this.loop);
    } else {
      RAFTicker.addListener(RAFTickerEventType.tick, this.animate);
    }
  }

  /**
   * パーティクルアニメーションを停止する。
   */
  public stop(): void {
    if (!this._isPlaying) return;
    this._isPlaying = false;
    RAFTicker.removeListener(RAFTickerEventType.tick, this.loop);
    RAFTicker.removeListener(RAFTickerEventType.tick, this.animate);
  }

  /**
   * パーティクルをアニメーションさせる。
   * @param e
   */
  private animate = (e: RAFTickerEvent) => {
    if (this.isDisposed) return;

    this.move(e.delta);
    this.particleContainer.removeCompletedParticles();
    this.addParticle(e.delta);
  };

  /**
   * アニメーションに伴い、新規パーティクルを追加する。
   * @param delta
   */
  private addParticle(delta: number): void {
    if (!this.valve.isOpenValve) return;

    this.elapsedFromGenerate += delta;
    while (this.elapsedFromGenerate > this._particleInterval) {
      this.elapsedFromGenerate -= this._particleInterval;
      const move = (this.elapsedFromGenerate * this.speedPerSec) / 1000;
      //すでに寿命切れのパーティクルは生成をスキップ。
      if (move > Particle.MAX_RATIO) {
        continue;
      }

      const particle = this.generate();
      particle?.add(move);
    }
  }

  /**
   * パーティクルをループアニメーションさせる。
   * @param e
   */
  private loop = (e: RAFTickerEvent) => {
    if (this.isDisposed) return;

    if (this.particleContainer.particles.length === 0) {
      this.generateAll();
    }

    this.move(e.delta);
    this.particleContainer.rollupParticles();
  };

  /**
   * パーティクルの位置を経過時間分移動する。
   * @param delta 前回アニメーションが実行されてからの経過時間 単位ms
   */
  private move(delta: number): void {
    const movement = (delta / 1000) * this.speedPerSec;
    this.particleContainer.move(movement);
  }

  /**
   * パーティクルを1つ追加する。
   */
  private generate(): Particle | null {
    this.multipleWays.countUp();

    //発生確率に応じて生成の可否を判定する。
    if (this._probability !== 1.0) {
      if (Math.random() > this._probability) return null;
    }

    const path = this.multipleWays.getPath();
    const particle: Particle = this.generateParticle(path);
    if (this._ease != null) {
      particle.ease = this._ease;
    }
    this.particleContainer.add(particle);

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

    this.particleContainer.removeAll();
    this.particleContainer = null;
    this.multipleWays = null;
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
      this.particleContainer.overrideEase(ease);
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
