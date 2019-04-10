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
        this.particleInterval = 300;
        this.speedPerSec = 0.07;
        this._isLoop = false;
        this.lastParticleTime = 0;
        this.lastAnimateTime = 0;
        this.isDisposed = false;
        /**
         * パーティクルをアニメーションさせる。
         * @param timestamp requestAnimationFrameのタイムスタンプ。単位ミリ秒。
         */
        this.animate = (timestamp) => {
            if (this.isDisposed)
                return;
            this.move(timestamp);
            this.removeCompletedParticles();
            //generate particle
            while (timestamp > this.lastParticleTime + this.particleInterval) {
                const current = this.lastParticleTime;
                this.lastParticleTime += this.particleInterval;
                //すでに寿命切れのパーティクルは生成をスキップ。
                if (timestamp > current + (1.0 / this.speedPerSec) * 1000) {
                    continue;
                }
                const particle = this.generate();
                const move = ((timestamp - this.lastParticleTime) * this.speedPerSec) / 1000;
                particle.add(move);
            }
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
            this.move(timestamp);
            this.rollupParticles();
            this.renderID = requestAnimationFrame(this.loop);
        };
        this.path = path;
        if (option == null)
            return;
        if (option.isLoop)
            this._isLoop = option.isLoop;
        if (option.ease)
            this.ease = option.ease;
    }
    /**
     * パーティクルの生成を開始する。
     */
    play() {
        if (this.renderID != null)
            return;
        this.lastParticleTime = this.lastAnimateTime = performance.now();
        if (this._isLoop) {
            this.renderID = requestAnimationFrame(this.loop);
        }
        else {
            this.renderID = requestAnimationFrame(this.animate);
        }
    }
    /**
     * パーティクルの生成を停止する。
     */
    stop() {
        if (this.renderID == null)
            return;
        cancelAnimationFrame(this.renderID);
        this.renderID = null;
    }
    /**
     * パーティクルの位置を経過時間分移動する。
     * @param timestamp requestAnimationFrameのタイムスタンプ。単位ミリ秒。
     */
    move(timestamp) {
        const movement = ((timestamp - this.lastAnimateTime) / 1000) * this.speedPerSec;
        this.particles.forEach(p => {
            p.add(movement);
        });
        this.lastAnimateTime = timestamp;
    }
    /**
     * パーティクルを1つ追加する。
     */
    generate() {
        const particle = this.generateParticle(this.path);
        this.particles.push(particle);
        particle.visible = this._visible;
        if (this.ease != null) {
            particle.ease = this.ease;
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
        const move = (this.speedPerSec * this.particleInterval) / 1000;
        let pos = 0.0;
        while (pos < 1.0) {
            const particle = this.generate();
            particle.update(pos);
            pos += move;
        }
        this.removeCompletedParticles();
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
        this.particleInterval = interval;
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
        this.particleInterval = ParticleGeneratorUtility.getInterval(speed, particleNum);
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
    get visible() {
        return this._visible;
    }
    set visible(value) {
        this._visible = value;
        for (let i in this.particles) {
            this.particles[i].visible = this._visible;
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
