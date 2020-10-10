export var WaySelectType;
(function (WaySelectType) {
    WaySelectType[WaySelectType["Random"] = 0] = "Random";
    WaySelectType[WaySelectType["Sequential"] = 1] = "Sequential";
})(WaySelectType || (WaySelectType = {}));
/**
 * このクラスは、ParticleGeneratorに設定された複数の経路を管理するためのものです。
 */
export class MultipleParticleWays {
    constructor(option) {
        this.waySelectionCount = 0;
        MultipleParticleWaysOption.initOption(option);
        this.ways = option.ways;
        this.waySelectType = option.type;
    }
    countUp() {
        this.waySelectionCount = (this.waySelectionCount + 1) % this.ways.length;
    }
    getParticleWay() {
        let index;
        switch (this.waySelectType) {
            case WaySelectType.Sequential:
                index = this.waySelectionCount;
                break;
            case WaySelectType.Random:
                index = Math.floor(Math.random() * this.ways.length);
                break;
        }
        return this.ways[index];
    }
}
export class MultipleParticleWaysOption {
    static initOption(option) {
        var _a, _b;
        option !== null && option !== void 0 ? option : (option = {});
        (_a = option.ways) !== null && _a !== void 0 ? _a : (option.ways = []);
        if (!Array.isArray(option.ways)) {
            option.ways = [option.ways];
        }
        (_b = option.type) !== null && _b !== void 0 ? _b : (option.type = WaySelectType.Sequential);
        return option;
    }
}
