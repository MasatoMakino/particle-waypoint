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
