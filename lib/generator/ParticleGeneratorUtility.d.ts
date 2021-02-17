/**
 * ParticleGeneratorで利用する各種の値を算出するヘルパークラス
 */
export declare class ParticleGeneratorUtility {
    /**
     * パーティクルの生成インターバルと経路上の数から、移動速度を算出する
     * @param interval
     * @param particleNum
     */
    static getSpeed(interval: number, particleNum: number): number;
    /**
     * パーティクルの移動速度と経路上の数から、生成インターバルを算出する
     * @param speed
     * @param particleNum
     */
    static getInterval(speed: number, particleNum: number): number;
}
//# sourceMappingURL=ParticleGeneratorUtility.d.ts.map