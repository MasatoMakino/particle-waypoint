import { ParticleWay } from "../ParticleWay";
export declare enum WaySelectType {
    Random = 0,
    Sequential = 1
}
/**
 * このクラスは、ParticleGeneratorに設定された複数の経路を管理するためのものです。
 */
export declare class MultipleParticleWays {
    ways: ParticleWay[];
    waySelectType: WaySelectType;
    private waySelectionCount;
    constructor(option?: MultipleParticleWaysOption);
    countUp(): void;
    getParticleWay(): ParticleWay;
}
export declare class MultipleParticleWaysOption {
    ways?: ParticleWay | ParticleWay[];
    type?: WaySelectType;
    static initOption(option?: MultipleParticleWaysOption): MultipleParticleWaysOption;
}
//# sourceMappingURL=MultipleParticleWays.d.ts.map