export class Particle {
    constructor(path) {
        this.path = path;
        this._pathPosition = 0.0;
    }
    update(t) {
        this._pathPosition = t;
    }
    add(t) {
        this._pathPosition += t;
        this.update(this._pathPosition);
    }
    get pathPosition() {
        return this._pathPosition;
    }
    set visible(value) {
        this._visible = value;
    }
    dispose() { }
}
