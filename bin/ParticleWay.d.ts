/**
 * 中間点の算出が可能な線分を表すクラス
 */
export declare class ParticleWay {
    name: string;
    protected _points: number[][];
    protected _total: number;
    constructor(points: number[][]);
    setPoints(points: number[][]): void;
    private getDistance;
    getPoint(t: number): number[] | null;
    private getCenterPoint;
}
//# sourceMappingURL=ParticleWay.d.ts.map