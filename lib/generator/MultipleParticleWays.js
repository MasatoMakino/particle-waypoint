"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleParticleWaysOption = exports.MultipleParticleWays = exports.WaySelectType = void 0;
var WaySelectType;
(function (WaySelectType) {
    WaySelectType[WaySelectType["Random"] = 0] = "Random";
    WaySelectType[WaySelectType["Sequential"] = 1] = "Sequential";
})(WaySelectType = exports.WaySelectType || (exports.WaySelectType = {}));
/**
 * このクラスは、ParticleGeneratorに設定された複数の経路を管理するためのものです。
 */
var MultipleParticleWays = /** @class */ (function () {
    function MultipleParticleWays(option) {
        this.waySelectionCount = 0;
        MultipleParticleWaysOption.initOption(option);
        this.ways = option.ways;
        this.waySelectType = option.type;
    }
    MultipleParticleWays.prototype.countUp = function () {
        this.waySelectionCount = (this.waySelectionCount + 1) % this.ways.length;
    };
    MultipleParticleWays.prototype.getParticleWay = function () {
        var index;
        switch (this.waySelectType) {
            case WaySelectType.Sequential:
                index = this.waySelectionCount;
                break;
            case WaySelectType.Random:
                index = Math.floor(Math.random() * this.ways.length);
                break;
        }
        return this.ways[index];
    };
    return MultipleParticleWays;
}());
exports.MultipleParticleWays = MultipleParticleWays;
var MultipleParticleWaysOption = /** @class */ (function () {
    function MultipleParticleWaysOption() {
    }
    MultipleParticleWaysOption.initOption = function (option) {
        var _a, _b;
        option !== null && option !== void 0 ? option : (option = {});
        (_a = option.ways) !== null && _a !== void 0 ? _a : (option.ways = []);
        if (!Array.isArray(option.ways)) {
            option.ways = [option.ways];
        }
        (_b = option.type) !== null && _b !== void 0 ? _b : (option.type = WaySelectType.Sequential);
        return option;
    };
    return MultipleParticleWaysOption;
}());
exports.MultipleParticleWaysOption = MultipleParticleWaysOption;
