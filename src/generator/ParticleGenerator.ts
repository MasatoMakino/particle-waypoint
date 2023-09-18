import { RAFTicker, RAFTickerEventContext } from "@masatomakino/raf-ticker";
import { Particle, ParticleWay } from "../index.js";
import {
  GenerationMode,
  GenerationModeManager,
} from "./GenerationModeManager.js";
import { MultipleParticleWays } from "./MultipleParticleWays.js";
import { ParticleAnimator } from "./ParticleAnimator.js";
import { ParticleContainer } from "./ParticleContainer.js";
import { ParticleValve } from "./ParticleValve.js";

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

  public probability: number;

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
    option?: ParticleGeneratorOption,
  ) {
    this.modeManager = new GenerationModeManager();
    this.multipleWays = new MultipleParticleWays({ ways: path });
    this.particleContainer = new ParticleContainer(this.modeManager);
    this.valve = new ParticleValve(this.modeManager);
    this.animator = new ParticleAnimator(
      this.modeManager,
      this.particleContainer,
    );
    this.modeManager.on("change", (val: GenerationMode) => {
      if (this._isPlaying) {
        this.stop();
        this.play();
      }
    });

    option = ParticleGeneratorOption.initOption(option);
    this.modeManager.mode = option.generationMode;
    this.animator.updateEase(option.ease);
    this.probability = option.probability;
  }

  /**
   * パーティクルアニメーションを開始する。
   */
  public play(): void {
    if (this._isPlaying) return;
    this._isPlaying = true;

    switch (this.modeManager.mode) {
      case "loop":
        RAFTicker.addListener("tick", this.loop);
        break;
      case "sequential":
        RAFTicker.addListener("tick", this.animate);
        break;
    }
  }

  /**
   * パーティクルアニメーションを停止する。
   */
  public stop(): void {
    if (!this._isPlaying) return;
    this._isPlaying = false;
    RAFTicker.removeListener("tick", this.loop);
    RAFTicker.removeListener("tick", this.animate);
  }

  /**
   * パーティクルをアニメーションさせる。
   * @param e
   */
  private animate = (e: RAFTickerEventContext) => {
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
    if (!this.valve.isOpen) return;

    const anim = this.animator;
    this.elapsedFromGenerate += delta;

    while (this.elapsedFromGenerate > anim.generationInterval) {
      this.elapsedFromGenerate -= anim.generationInterval;
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
  private loop = (e: RAFTickerEventContext) => {
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
    if (this.probability !== 1.0) {
      if (Math.random() > this.probability) return null;
    }

    const path = this.multipleWays.getParticleWay();
    const particle: Particle = this.generateParticle(path);
    if (this.animator.ease != null) {
      particle.ease = this.animator.ease;
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
      lifeTime -= this.animator.generationInterval;
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
}

/**
 * パーティクル生成方法を指定するオプション
 */
export class ParticleGeneratorOption {
  generationMode?: GenerationMode;
  ease?: (number) => number;
  probability?: number;

  public static initOption(
    option?: ParticleGeneratorOption,
  ): ParticleGeneratorOption {
    option ??= {};
    option.generationMode ??= "sequential";
    option.probability ??= 1.0;
    return option;
  }
}
