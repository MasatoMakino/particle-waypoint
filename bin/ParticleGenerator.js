import { Particle } from "./Particle";
/**
 * 一定間隔でパーティクルを生成し、アニメーションさせるクラス。
 * パーティクルインスタンスの生成と管理を行う。
 */
export class ParticleGenerator {
    /**
     * コンストラクタ
     * @param path
     * @param option
     */
    constructor(path, option) {
        this._visible = true;
        this.particles = [];
        this.renderID = null;
        //animation setting
        this._particleInterval = 300;
        this.speedPerSec = 0.07;
        this._isLoop = false;
        this._probability = 1.0;
        this._isOpenValve = true;
        this.elapsedFromGenerate = 0; //前回パーティクル生成時からの経過時間　単位ms
        this.lastAnimateTime = 0; //アニメーションを最後に実行した時点のタイムスタンプ　単位ms
        this.isDisposed = false;
        /**
         * パーティクルをアニメーションさせる。
         * @param timestamp requestAnimationFrameのタイムスタンプ。単位ミリ秒。
         */
        this.animate = (timestamp) => {
            if (this.isDisposed)
                return;
            const delta = this.getDelta(timestamp);
            this.move(delta);
            this.removeCompletedParticles();
            this.addParticle(delta);
            this.renderID = requestAnimationFrame(this.animate);
        };
        /**
         * パーティクルをループアニメーションさせる。
         * @param timestamp requestAnimationFrameのタイムスタンプ。単位ミリ秒。
         */
        this.loop = (timestamp) => {
            if (this.isDisposed)
                return;
            if (this.particles.length === 0) {
                this.generateAll();
            }
            const delta = this.getDelta(timestamp);
            this.move(delta);
            this.rollupParticles();
            this.renderID = requestAnimationFrame(this.loop);
        };
        this.path = path;
        if (option == null)
            return;
        if (option.isLoop)
            this._isLoop = option.isLoop;
        if (option.ease)
            this._ease = option.ease;
        if (option.probability)
            this._probability = option.probability;
    }
    /**
     * パーティクルアニメーションを開始する。
     */
    play() {
        if (this.renderID != null)
            return;
        this.lastAnimateTime = performance.now();
        if (this._isLoop) {
            this.renderID = requestAnimationFrame(this.loop);
        }
        else {
            this.renderID = requestAnimationFrame(this.animate);
        }
    }
    /**
     * パーティクルアニメーションを停止する。
     */
    stop() {
        if (this.renderID == null)
            return;
        cancelAnimationFrame(this.renderID);
        this.renderID = null;
    }
    /**
     * パーティクル生成を開始する。
     */
    openValve() {
        if (this._isOpenValve)
            return;
        this._isOpenValve = true;
        this.warnValve();
    }
    /**
     * パーティクル生成を停止する。
     * アニメーションは続行される。
     */
    closeValve() {
        if (!this._isOpenValve)
            return;
        this._isOpenValve = false;
        this.warnValve();
    }
    warnValve() {
        if (!this._isLoop)
            return;
        console.warn("ParticleGenerator : ループ指定中にバルブ開閉操作を行いました。この操作はループ指定中には反映されません。");
        console.trace();
    }
    /**
     * アニメーションに伴い、新規パーティクルを追加する。
     * @param delta
     */
    addParticle(delta) {
        if (!this._isOpenValve)
            return;
        this.elapsedFromGenerate += delta;
        while (this.elapsedFromGenerate > this._particleInterval) {
            this.elapsedFromGenerate -= this._particleInterval;
            //すでに寿命切れのパーティクルは生成をスキップ。
            if (this.elapsedFromGenerate > (1.0 / this.speedPerSec) * 1000) {
                continue;
            }
            const particle = this.generate();
            const move = (this.elapsedFromGenerate * this.speedPerSec) / 1000;
            if (particle)
                particle.add(move);
        }
    }
    /**
     * 前回アニメーション実行時からの経過時間を取得する。
     * @param timestamp
     */
    getDelta(timestamp) {
        const delta = timestamp - this.lastAnimateTime;
        this.lastAnimateTime = timestamp;
        return delta;
    }
    /**
     * パーティクルの位置を経過時間分移動する。
     * @param delta 前回アニメーションが実行されてからの経過時間
     */
    move(delta) {
        const movement = (delta / 1000) * this.speedPerSec;
        this.particles.forEach(p => {
            p.add(movement);
        });
    }
    /**
     * パーティクルを1つ追加する。
     */
    generate() {
        //発生確率に応じて生成の可否を判定する。
        if (this._probability !== 1.0) {
            if (Math.random() > this._probability)
                return null;
        }
        const particle = this.generateParticle(this.path);
        this.particles.push(particle);
        particle.visible = this._visible;
        if (this._ease != null) {
            particle.ease = this._ease;
        }
        return particle;
    }
    /**
     * パーティクルを生成する。
     * generate関数の内部処理。
     * @param path
     */
    generateParticle(path) {
        const particle = new Particle(path);
        //TODO ここでコンテナに挿入。
        return particle;
    }
    /**
     * 経路上にパーティクルを敷き詰める。
     */
    generateAll() {
        //パーティクルの最大生存期間 単位ミリ秒
        let lifeTime = 1000.0 / this.speedPerSec;
        while (lifeTime > 0.0) {
            const particle = this.generate();
            if (particle)
                particle.update((lifeTime / 1000) * this.speedPerSec);
            lifeTime -= this._particleInterval;
        }
        this.elapsedFromGenerate = 0;
    }
    /**
     * 寿命切れのパーティクルを一括で削除する。
     */
    removeCompletedParticles() {
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
     * 終端にたどり着いたパーティクルを視点に巻き戻す。
     */
    rollupParticles() {
        this.particles.forEach(p => {
            p.update(p.ratio % 1);
        });
    }
    /**
     * 指定されたパーティクルを削除する。
     * @param particle
     */
    removeParticle(particle) {
        const i = this.particles.indexOf(particle);
        const popped = this.particles.splice(i, 1);
        popped.forEach(val => {
            val.dispose();
        });
    }
    /**
     * 全てのパーティクルを削除する。
     */
    removeAllParticles() {
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
    setSpeed(interval, particleNum) {
        this._particleInterval = interval;
        this.speedPerSec = ParticleGeneratorUtility.getSpeed(interval, particleNum);
    }
    /**
     * 移動スピードと経路上のパーティクル数から生成インターバルを算出し設定する。
     * loop時に破綻しない値が得られる。
     * @param speed
     * @param particleNum
     */
    setInterval(speed, particleNum) {
        this.speedPerSec = speed;
        this._particleInterval = ParticleGeneratorUtility.getInterval(speed, particleNum);
    }
    /**
     * パーティクル生成の停止とパーティクルの破棄を行う。
     */
    dispose() {
        this.stop();
        this.isDisposed = true;
        this.removeAllParticles();
        this.particles = null;
        this.path = null;
    }
    get particleInterval() {
        return this._particleInterval;
    }
    set particleInterval(value) {
        if (this._particleInterval === value)
            return;
        this._particleInterval = value;
        if (this._isLoop) {
            console.warn("ParticleGenerator : ループ指定中にパーティクル生成間隔を再設定しても反映されません。設定を反映するためにパーティクルを削除して再生成してください。");
            console.trace();
        }
    }
    get visible() {
        return this._visible;
    }
    set visible(value) {
        this._visible = value;
        for (let i in this.particles) {
            this.particles[i].visible = this._visible;
        }
    }
    get isLoop() {
        return this._isLoop;
    }
    set isLoop(value) {
        if (value === this._isLoop)
            return;
        this._isLoop = value;
        if (this._isLoop) {
            this.removeAllParticles();
        }
        //再生中なら一旦停止して再度再生
        if (this.renderID != null) {
            this.stop();
            this.play();
        }
    }
    get ease() {
        return this._ease;
    }
    /**
     * 各パーティクルのEase関数を更新する。
     * @param ease イージング関数。
     * @param override 現存するパーティクルのEase関数を上書きするか否か。規定値はtrue。
     */
    updateEase(ease, override = true) {
        this._ease = ease;
        if (!override && this._isLoop) {
            console.warn("ParticleGenerator : ループ指定中にEase関数を再設定すると、既存のパーティクルのEase関数は常に上書きされます。");
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
 * ParticleGeneratorで利用する各種の値を算出するヘルパークラス
 */
export class ParticleGeneratorUtility {
    /**
     * パーティクルの生成インターバルと経路上の数から、移動速度を算出する
     * @param interval
     * @param particleNum
     */
    static getSpeed(interval, particleNum) {
        return (1.0 / (interval * particleNum)) * 1000;
    }
    /**
     * パーティクルの移動速度と経路上の数から、生成インターバルを算出する
     * @param speed
     * @param particleNum
     */
    static getInterval(speed, particleNum) {
        return (1.0 / speed / particleNum) * 1000;
    }
}
