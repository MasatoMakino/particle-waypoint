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
        this._visible = true;
        this.path = path;
        this._pathPosition = 0.0;
    }
    /**
     * パーティクルの位置を更新する。
     * @param t パーティクルのパス上の位置。入力に制限はないが、ParticleWay側で0.0~1.0の間に丸め込まれる。
     * @return n ease関数で補正済みのt。
     */
    update(t) {
        this._pathPosition = t;
        let n = this._pathPosition;
        if (this.ease != null) {
            n = this.ease(n);
        }
        return n;
    }
    /**
     * パーティクル位置を指定された量移動する。
     * @param t 移動量
     */
    add(t) {
        this.update(this._pathPosition + t);
    }
    /**
     * 現在位置を取得する
     * @return number
     */
    get pathPosition() {
        return this._pathPosition;
    }
    set visible(value) {
        this._visible = value;
    }
    dispose() { }
}
