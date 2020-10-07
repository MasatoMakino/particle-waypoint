import { ParticleContainer } from "./ParticleContainer";
import { GenerationMode, GenerationModeManager } from "./GenerationModeManager";
import { ParticleGeneratorUtility } from "./ParticleGeneratorUtility";

export class ParticleAnimator {
  private _particleInterval: number = 300;
  get particleInterval(): number {
    return this._particleInterval;
  }
  set particleInterval(value: number) {
    if (this._particleInterval === value) return;
    this._particleInterval = value;

    if (this._modeManager.mode === GenerationMode.LOOP) {
      console.warn(
        "ParticleGenerator : ループ指定中にパーティクル生成間隔を再設定しても反映されません。設定を反映するためにパーティクルを削除して再生成してください。"
      );
      console.trace();
    }
  }
  public speedPerSec: number = 0.07;

  private _ease: (number) => number;
  get ease(): (number) => number {
    return this._ease;
  }

  private _modeManager: GenerationModeManager;
  private _particleContainer: ParticleContainer;

  constructor(
    modeManager: GenerationModeManager,
    particleContainer: ParticleContainer
  ) {
    this._particleContainer = particleContainer;
    this._modeManager = modeManager;
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
   * パーティクルの位置を経過時間分移動する。
   * @param delta 前回アニメーションが実行されてからの経過時間 単位ms
   */
  public move(delta: number): void {
    const movement = (delta / 1000) * this.speedPerSec;
    this._particleContainer.move(movement);
  }

  /**
   * 各パーティクルのEase関数を更新する。
   * @param ease イージング関数。
   * @param override 現存するパーティクルのEase関数を上書きするか否か。規定値はtrue。
   */
  updateEase(ease: (number) => number, override: boolean = true) {
    this._ease = ease;
    if (!override && this._modeManager.mode === GenerationMode.LOOP) {
      console.warn(
        "ParticleGenerator : ループ指定中にEase関数を再設定すると、既存のパーティクルのEase関数は常に上書きされます。"
      );
      console.trace();
    }
    if (override || this._modeManager.mode === GenerationMode.LOOP) {
      this._particleContainer.overrideEase(ease);
    }
  }
}
