import { Particle } from "./Particle";
/**
 * 一定間隔でパーティクルを生成し、アニメーションさせるクラス。
 * パーティクルインスタンスの生成と管理を行う。
 */
export class ParticleGenerator {
    /**
     * @param path
     * @param option
     */
    constructor(path, option) {
        this._visible = true;
        this.particles = [];
        this.renderID = null;
        this.particleInterval = 300;
        this.lastParticleTime = 0;
        this.lastAnimateTime = 0;
        this._isLoop = false;
        this.isDisposed = false;
        this.speedPerSec = 0.07;
        /**
         * パーティクルをアニメーションさせる。
         * @param timestamp
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
         * @param timestamp
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
    stop() {
        if (this.renderID == null)
            return;
        cancelAnimationFrame(this.renderID);
        this.renderID = null;
    }
    /**
     * パーティクルの位置を経過時間分移動する。
     * @param timestamp
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
