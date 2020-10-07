import { RAFTicker, RAFTickerEvent, RAFTickerEventType } from "raf-ticker";
import { Particle } from "../Particle";
import { ParticleWay } from "../ParticleWay";
import {
  GenerationMode,
  GenerationModeEventType,
  GenerationModeManager,
} from "./GenerationModeManager";
import { MultipleParticleWays } from "./MultipleParticleWays";
import { ParticleAnimator } from "./ParticleAnimator";
import { ParticleContainer } from "./ParticleContainer";
import { ParticleValve } from "./ParticleValve";

/**
 * 一定間隔でパーティクルを生成し、アニメーションさせるクラス。
 * パーティクルインスタンスの生成と管理を行う。
 */
export class ParticleGenerator {
  public multipleWays: MultipleParticleWays;
  public particleContainer: ParticleContainer;
  public valve: ParticleValve;
  public animator: ParticleAnimator;
  public modeManager: GenerationModeManager;

  private _isPlaying: boolean = false;
  get isPlaying(): boolean {
    return this._isPlaying;
  }

  private _ease: (number) => number;
  get ease(): (number) => number {
    return this._ease;
  }

  private _probability: number = 1.0;

  /**
   * 前回パーティクル生成時からの経過時間 単位ms
   * @private
   */
  private elapsedFromGenerate: number = 0;

  private _isDisposed: boolean = false;

  /**
   * コンストラクタ
   * @param path
   * @param option
   */
  constructor(
    path: ParticleWay | ParticleWay[],
    option?: ParticleGeneratorOption
  ) {
    this.modeManager = new GenerationModeManager();
    this.multipleWays = new MultipleParticleWays({ ways: path });
    this.particleContainer = new ParticleContainer(this.modeManager);
    this.valve = new ParticleValve(this.modeManager);
    this.animator = new ParticleAnimator(
      this.modeManager,
      this.particleContainer
    );
    this.modeManager.on(
      GenerationModeEventType.change,
      (val: GenerationMode) => {
        if (this._isPlaying) {
          this.stop();
          this.play();
        }
      }
    );

    if (option == null) return;
    this.modeManager.mode = option.generationMode ?? GenerationMode.SEQUENTIAL;
    this._ease = option.ease ?? this._ease;
    this._probability = option.probability ?? this._probability;
  }

  /**
   * パーティクルアニメーションを開始する。
   */
  public play(): void {
    if (this._isPlaying) return;
    this._isPlaying = true;

    switch (this.modeManager.mode) {
      case GenerationMode.LOOP:
        RAFTicker.addListener(RAFTickerEventType.tick, this.loop);
        break;
      case GenerationMode.SEQUENTIAL:
        RAFTicker.addListener(RAFTickerEventType.tick, this.animate);
        break;
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
    if (this._isDisposed) return;

    this.animator.move(e.delta);
    this.particleContainer.removeCompletedParticles();
    this.addParticle(e.delta);
  };

  /**
   * アニメーションに伴い、新規パーティクルを追加する。
   * @param delta
   */
  private addParticle(delta: number): void {
    if (!this.valve.isOpenValve) return;

    const anim = this.animator;
    this.elapsedFromGenerate += delta;

    while (this.elapsedFromGenerate > anim.particleInterval) {
      this.elapsedFromGenerate -= anim.particleInterval;
      const move = (this.elapsedFromGenerate * anim.speedPerSec) / 1000;
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
    if (this._isDisposed) return;

    if (this.particleContainer.particles.length === 0) {
      this.generateAll();
    }

    this.animator.move(e.delta);
    this.particleContainer.rollupParticles();
  };

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
    let lifeTime = 1000.0 / this.animator.speedPerSec;

    while (lifeTime > 0.0) {
      const particle = this.generate();
      if (particle)
        particle.update((lifeTime / 1000) * this.animator.speedPerSec);
      lifeTime -= this.animator.particleInterval;
    }
    this.elapsedFromGenerate = 0;
  }

  /**
   * パーティクル生成の停止とパーティクルの破棄を行う。
   */
  public dispose(): void {
    this.stop();
    this._isDisposed = true;

    this.particleContainer.removeAll();
    this.particleContainer = null;
    this.multipleWays = null;
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
    if (!override && this.modeManager.mode === GenerationMode.LOOP) {
      console.warn(
        "ParticleGenerator : ループ指定中にEase関数を再設定すると、既存のパーティクルのEase関数は常に上書きされます。"
      );
      console.trace();
    }
    if (override || this.modeManager.mode === GenerationMode.LOOP) {
      this.particleContainer.overrideEase(ease);
    }
  }
}

/**
 * パーティクル生成方法を指定するオプション
 */
export interface ParticleGeneratorOption {
  generationMode?: GenerationMode;
  ease?: (number) => number;
  probability?: number;
}
