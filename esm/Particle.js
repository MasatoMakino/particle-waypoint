/**
 * パーティクルを表すクラス。
 * このクラス自体には描画のための機能はない。
 * 各種の描画ライブラリと組み合わせて利用する。
 */
export class Particle {
    /**
     * 指定されたパスに沿って移動するパーティクルを生成する。
     * @param path
     */
    constructor(path) {
        this._ratio = 0.0;
        this._visible = true;
        this.path = path;
    }
    /**
     * パーティクルの位置を更新する。
     * @param t パーティクルのパス上の位置。入力に制限はないが、ParticleWay側で0.0~1.0の間に丸め込まれる。
     * @return n ease関数で補正済みのt。
     */
    update(t) {
        this._ratio = t;
        if (this.ease == null) {
            return this._ratio;
        }
        return this.ease(this._ratio);
    }
    /**
     * パーティクル位置を指定された量移動する。
     * @param t 移動量 0.0 ~ 1.0
     */
    add(t) {
        return this.update(this._ratio + t);
    }
    /**
     * 現在位置を取得する
     * @return number
     */
    get ratio() {
        return this._ratio;
    }
    get visible() {
        return this._visible;
    }
    set visible(value) {
        this._visible = value;
    }
    dispose() { }
}
Particle.MAX_RATIO = 1.0;
Particle.MIN_RATIO = 0.0;
