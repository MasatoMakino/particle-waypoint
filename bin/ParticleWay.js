/**
 * 中間点の算出が可能な線分を表すクラス
 */
export class ParticleWay {
    constructor(points) {
        this.name = "";
        this.setPoints(points);
    }
    setPoints(points) {
        this._points = points;
        const sumTable = new Array(this._points.length).fill(0);
        this._points.forEach((val, index, array) => {
            if (index === 0)
                return;
            sumTable[index] =
                this.getDistance(array[index - 1], val) + sumTable[index - 1];
        });
        const total = sumTable[sumTable.length - 1];
        this._rateTable = sumTable.map(val => {
            return val / total;
        });
    }
    getDistance(pos1, pos2) {
        const dx = pos2[0] - pos1[0];
        const dy = pos2[1] - pos1[1];
        switch (pos1.length) {
            case 3:
                const dz = pos2[2] - pos1[2];
                return Math.sqrt(dx * dx + dy * dy + dz * dz);
            case 2:
                return Math.sqrt(dx * dx + dy * dy);
        }
    }
    getPoint(t) {
        if (!this._points || this._points.length === 0) {
            return null;
        }
        if (this._points.length === 1) {
            return [...this._points[0]];
        }
        const n = this._points.length;
        t = Math.min(t, 1.0);
        if (t === 1.0)
            return [...this._points[n - 1]];
        t = Math.max(t, 0.0);
        if (t === 0.0)
            return [...this._points[0]];
        let i = 1;
        for (i; i < n; i++) {
            if (this._rateTable[i] >= t)
                break;
        }
        i--;
        const floorPoint = this._points[i];
        const ceilPoint = this._points[i + 1];
        const rateBase = this._rateTable[i];
        return this.getCenterPoint(floorPoint, ceilPoint, (t - rateBase) / (this._rateTable[i + 1] - rateBase));
    }
    getCenterPoint(pos1, pos2, t) {
        const rt = 1.0 - t;
        let pos = [pos1[0] * rt + pos2[0] * t, pos1[1] * rt + pos2[1] * t];
        switch (pos1.length) {
            case 3:
                pos.push(pos1[2] * rt + pos2[2] * t);
                return pos;
            case 2:
                return pos;
        }
    }
}
