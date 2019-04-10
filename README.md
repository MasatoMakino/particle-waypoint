# particle-waypoint

> Path module for calculating waypoints.

## API Documents

[API documents](https://masatomakino.github.io/particle-waypoint/api/)

## Getting Started

### Install

```bash
npm install https://github.com/MasatoMakino/particle-waypoint.git --save-dev
```

### Import

particle-waypoint is composed of ES6 modules and TypeScript d.ts files.

At first, import classes.

```.js
import {
  ParticleWay,
  Particle,
  ParticleGenerator
} from "particle-waypoint";
```

### Create particle way

```.js
  const points = [[100, 100], [100, 200], [200, 200], [200, 300]];
  const wayPoint = new ParticleWay(points);
```

### Create generator
```.js
  const generator = new ParticleGenerator( wayPoint, {
    isLoop: true
  });
  generator.setSpeed(600, 20);
  generator.play();
```

Particles animate on ``wayPoint``.

## Uninstall

```bash
npm uninstall https://github.com/MasatoMakino/particle-waypoint.git --save-dev
```

## License

particle-waypoint is [MIT licensed](LICENSE).
