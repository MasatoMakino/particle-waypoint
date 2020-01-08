"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Particle_1 = require("./Particle");
var raf_ticker_1 = require("raf-ticker");
var ParticleGeneratorUtility_1 = require("./ParticleGeneratorUtility");
/**
 * 一定間隔でパーティクルを生成し、アニメーションさせるクラス。
 * パーティクルインスタンスの生成と管理を行う。
 */
var ParticleGenerator = /** @class */ (function () {
    /**
     * コンストラクタ
     * @param path
     * @param option
     */
    function ParticleGenerator(path, option) {
        var _this = this;
        this.path = [];
        this.pathSelectType = PathSelectType.Sequential;
        this.pathSelectionCount = 0;
        this._visible = true;
        this._particles = [];
        this.isPlaying = false;
        //animation setting
        this._particleInterval = 300;
        this.speedPerSec = 0.07;
        this._isLoop = false;
        this._probability = 1.0;
        this._isOpenValve = true;
        this.elapsedFromGenerate = 0; //前回パーティクル生成時からの経過時間　単位ms
        this.isDisposed = false;
        /**
         * パーティクルをアニメーションさせる。
         * @param e
         */
        this.animate = function (e) {
            if (_this.isDisposed)
                return;
            _this.move(e.delta);
            _this.removeCompletedParticles();
            _this.addParticle(e.delta);
        };
        /**
         * パーティクルをループアニメーションさせる。
         * @param e
         */
        this.loop = function (e) {
            if (_this.isDisposed)
                return;
            if (_this._particles.length === 0) {
                _this.generateAll();
            }
            _this.move(e.delta);
            _this.rollupParticles();
        };
        if (Array.isArray(path)) {
            this.path = path;
        }
        else {
            this.path = [path];
        }
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
    ParticleGenerator.prototype.play = function () {
        if (this.isPlaying)
            return;
        this.isPlaying = true;
        if (this._isLoop) {
            raf_ticker_1.RAFTicker.addEventListener(raf_ticker_1.RAFTickerEventType.tick, this.loop);
        }
        else {
            raf_ticker_1.RAFTicker.addEventListener(raf_ticker_1.RAFTickerEventType.tick, this.animate);
        }
    };
    /**
     * パーティクルアニメーションを停止する。
     */
    ParticleGenerator.prototype.stop = function () {
        if (!this.isPlaying)
            return;
        this.isPlaying = false;
        raf_ticker_1.RAFTicker.removeEventListener(raf_ticker_1.RAFTickerEventType.tick, this.loop);
        raf_ticker_1.RAFTicker.removeEventListener(raf_ticker_1.RAFTickerEventType.tick, this.animate);
    };
    /**
     * パーティクル生成を開始する。
     */
    ParticleGenerator.prototype.openValve = function () {
        if (this._isOpenValve)
            return;
        this._isOpenValve = true;
        this.warnValve();
    };
    /**
     * パーティクル生成を停止する。
     * アニメーションは続行される。
     */
    ParticleGenerator.prototype.closeValve = function () {
        if (!this._isOpenValve)
            return;
        this._isOpenValve = false;
        this.warnValve();
    };
    ParticleGenerator.prototype.warnValve = function () {
        if (!this._isLoop)
            return;
        console.warn("ParticleGenerator : ループ指定中にバルブ開閉操作を行いました。この操作はループ指定中には反映されません。");
        console.trace();
    };
    /**
     * アニメーションに伴い、新規パーティクルを追加する。
     * @param delta
     */
    ParticleGenerator.prototype.addParticle = function (delta) {
        if (!this._isOpenValve)
            return;
        this.elapsedFromGenerate += delta;
        while (this.elapsedFromGenerate > this._particleInterval) {
            this.elapsedFromGenerate -= this._particleInterval;
            //すでに寿命切れのパーティクルは生成をスキップ。
            if (this.elapsedFromGenerate > (1.0 / this.speedPerSec) * 1000) {
                continue;
            }
            var particle = this.generate();
            var move = (this.elapsedFromGenerate * this.speedPerSec) / 1000;
            if (particle)
                particle.add(move);
        }
    };
    /**
     * パーティクルの位置を経過時間分移動する。
     * @param delta 前回アニメーションが実行されてからの経過時間
     */
    ParticleGenerator.prototype.move = function (delta) {
        var movement = (delta / 1000) * this.speedPerSec;
        this._particles.forEach(function (p) {
            p.add(movement);
        });
    };
    /**
     * パーティクルを1つ追加する。
     */
    ParticleGenerator.prototype.generate = function () {
        this.pathSelectionCount = (this.pathSelectionCount + 1) % this.path.length;
        //発生確率に応じて生成の可否を判定する。
        if (this._probability !== 1.0) {
            if (Math.random() > this._probability)
                return null;
        }
        var path = this.getPath(this.pathSelectionCount);
        var particle = this.generateParticle(path);
        this._particles.push(particle);
        particle.visible = this._visible;
        if (this._ease != null) {
            particle.ease = this._ease;
        }
        return particle;
    };
    ParticleGenerator.prototype.getPath = function (count) {
        var index;
        switch (this.pathSelectType) {
            case PathSelectType.Sequential:
                index = count;
                break;
            case PathSelectType.Random:
                index = Math.floor(Math.random() * this.path.length);
                break;
        }
        return this.path[index];
    };
    /**
     * パーティクルを生成する。
     * generate関数の内部処理。
     * @param path
     */
    ParticleGenerator.prototype.generateParticle = function (path) {
        var particle = new Particle_1.Particle(path);
        //TODO ここでコンテナに挿入。
        return particle;
    };
    /**
     * 経路上にパーティクルを敷き詰める。
     */
    ParticleGenerator.prototype.generateAll = function () {
        //パーティクルの最大生存期間 単位ミリ秒
        var lifeTime = 1000.0 / this.speedPerSec;
        while (lifeTime > 0.0) {
            var particle = this.generate();
            if (particle)
                particle.update((lifeTime / 1000) * this.speedPerSec);
            lifeTime -= this._particleInterval;
        }
        this.elapsedFromGenerate = 0;
    };
    /**
     * 寿命切れのパーティクルを一括で削除する。
     */
    ParticleGenerator.prototype.removeCompletedParticles = function () {
        var removed = this._particles
            .filter(function (p) {
            return p.ratio >= 1.0;
        })
            .forEach(function (p) {
            p.dispose();
        });
        this._particles = this._particles.filter(function (p) {
            return p.ratio < 1.0;
        });
    };
    /**
     * 終端にたどり着いたパーティクルを始点に巻き戻す。
     */
    ParticleGenerator.prototype.rollupParticles = function () {
        this._particles.forEach(function (p) {
            p.update(p.ratio % 1);
        });
    };
    /**
     * 指定されたパーティクルを削除する。
     * @param particle
     */
    ParticleGenerator.prototype.removeParticle = function (particle) {
        var i = this._particles.indexOf(particle);
        var popped = this._particles.splice(i, 1);
        popped.forEach(function (val) {
            val.dispose();
        });
    };
    /**
     * 全てのパーティクルを削除する。
     */
    ParticleGenerator.prototype.removeAllParticles = function () {
        this._particles.forEach(function (p) {
            p.dispose();
        });
        this._particles = [];
    };
    /**
     * 生成インターバルと経路上のパーティクル数から移動スピードを算出し設定する。
     * loop時に破綻しない値が得られる。
     * @param interval
     * @param particleNum
     */
    ParticleGenerator.prototype.setSpeed = function (interval, particleNum) {
        this._particleInterval = interval;
        this.speedPerSec = ParticleGeneratorUtility_1.ParticleGeneratorUtility.getSpeed(interval, particleNum);
    };
    /**
     * 移動スピードと経路上のパーティクル数から生成インターバルを算出し設定する。
     * loop時に破綻しない値が得られる。
     * @param speed
     * @param particleNum
     */
    ParticleGenerator.prototype.setInterval = function (speed, particleNum) {
        this.speedPerSec = speed;
        this._particleInterval = ParticleGeneratorUtility_1.ParticleGeneratorUtility.getInterval(speed, particleNum);
    };
    /**
     * パーティクル生成の停止とパーティクルの破棄を行う。
     */
    ParticleGenerator.prototype.dispose = function () {
        this.stop();
        this.isDisposed = true;
        this.removeAllParticles();
        this._particles = null;
        this.path = null;
    };
    Object.defineProperty(ParticleGenerator.prototype, "particleInterval", {
        get: function () {
            return this._particleInterval;
        },
        set: function (value) {
            if (this._particleInterval === value)
                return;
            this._particleInterval = value;
            if (this._isLoop) {
                console.warn("ParticleGenerator : ループ指定中にパーティクル生成間隔を再設定しても反映されません。設定を反映するためにパーティクルを削除して再生成してください。");
                console.trace();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleGenerator.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        set: function (value) {
            this._visible = value;
            for (var i in this._particles) {
                this._particles[i].visible = this._visible;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleGenerator.prototype, "isLoop", {
        get: function () {
            return this._isLoop;
        },
        set: function (value) {
            if (value === this._isLoop)
                return;
            this._isLoop = value;
            if (this._isLoop) {
                this.removeAllParticles();
            }
            //再生中なら一旦停止して再度再生
            if (this.isPlaying) {
                this.stop();
                this.play();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleGenerator.prototype, "ease", {
        get: function () {
            return this._ease;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleGenerator.prototype, "probability", {
        get: function () {
            return this._probability;
        },
        set: function (value) {
            this._probability = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 各パーティクルのEase関数を更新する。
     * @param ease イージング関数。
     * @param override 現存するパーティクルのEase関数を上書きするか否か。規定値はtrue。
     */
    ParticleGenerator.prototype.updateEase = function (ease, override) {
        if (override === void 0) { override = true; }
        this._ease = ease;
        if (!override && this._isLoop) {
            console.warn("ParticleGenerator : ループ指定中にEase関数を再設定すると、既存のパーティクルのEase関数は常に上書きされます。");
            console.trace();
        }
        if (override || this._isLoop) {
            this._particles.forEach(function (p) {
                p.ease = ease;
            });
        }
    };
    return ParticleGenerator;
}());
exports.ParticleGenerator = ParticleGenerator;
var PathSelectType;
(function (PathSelectType) {
    PathSelectType[PathSelectType["Random"] = 0] = "Random";
    PathSelectType[PathSelectType["Sequential"] = 1] = "Sequential";
})(PathSelectType = exports.PathSelectType || (exports.PathSelectType = {}));
