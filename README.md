# particle-waypoint

> Path module for calculating waypoints.

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
[![npm version](https://badge.fury.io/js/@masatomakino%2Fparticle-waypoint.svg)](https://badge.fury.io/js/@masatomakino%2Fparticle-waypoint)
[![CI](https://github.com/MasatoMakino/particle-waypoint/actions/workflows/ci_main.yml/badge.svg)](https://github.com/MasatoMakino/particle-waypoint/actions/workflows/ci_main.yml)

## API Documents

[API documents](https://masatomakino.github.io/particle-waypoint/api/)

## Getting Started

### Install

```shell
npm install @masatomakino/particle-waypoint --save-dev
```

### Import

particle-waypoint is composed of ES6 modules and TypeScript d.ts files.

At first, import classes.

```js
import {
  ParticleWay,
  Particle,
  ParticleGenerator,
} from "@masatomakino/particle-waypoint";
```

### Create particle way

```js
const points = [
  [100, 100],
  [100, 200],
  [200, 200],
  [200, 300],
];
const wayPoint = new ParticleWay(points);
```

### Create generator

```js
const generator = new ParticleGenerator(wayPoint, {
  generationMode: "loop",
});
generator.animator.setSpeed(600, 20);
generator.play();
```

Particles animate on `wayPoint`.

## Uninstall

```shell script
npm uninstall @masatomakino/particle-waypoint --save-dev
```

## License

particle-waypoint is [MIT licensed](LICENSE).
