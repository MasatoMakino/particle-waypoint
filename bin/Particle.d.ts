import { ParticleWay } from "./ParticleWay";
export declare class Particle {
    private _pathPosition;
    protected path: ParticleWay;
    private _visible;
    constructor(path: ParticleWay);
    update(t: number): void;
    add(t: number): void;
    readonly pathPosition: number;
    visible: boolean;
    dispose(): void;
}
//# sourceMappingURL=Particle.d.ts.map