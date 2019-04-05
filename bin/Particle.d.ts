import { ParticleWay } from "./ParticleWay";
/**
 * パーティクルを表すクラス。
 * このクラス自体には描画のための機能はない。
 * 各種の描画ライブラリと組み合わせて利用する。
 */
export declare class Particle {
    private _ratio;
    protected path: ParticleWay;
    private _visible;
    ease: (number: any) => number;
    /**
     * 指定されたパスに沿って移動するパーティクルを生成する。
     * @param path
     */
    constructor(path: ParticleWay);
    /**
     * パーティクルの位置を更新する。
     * @param t パーティクルのパス上の位置。入力に制限はないが、ParticleWay側で0.0~1.0の間に丸め込まれる。
     * @return n ease関数で補正済みのt。
     */
    update(t: number): number;
    /**
     * パーティクル位置を指定された量移動する。
     * @param t 移動量
     */
    add(t: number): number;
    /**
     * 現在位置を取得する
     * @return number
     */
    readonly ratio: number;
    visible: boolean;
    dispose(): void;
}
//# sourceMappingURL=Particle.d.ts.map