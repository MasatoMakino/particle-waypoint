const onDomContentsLoaded = () => {};

// export class DomParticle extends Particle {
//   init(parent) {
//     this.parent = parent;
//     // const element = parent.createElement;
//   }
//
//   update(t) {
//     super.update(t);
//     // const pos = this.path.getPoint(t);
//     // this.bitmap.x = pos[0];
//     // this.bitmap.y = pos[1];
//   }
//
//   dispose() {
//     super.dispose();
//     this.parent = null;
//   }
// }

/**
 * DOMContentLoaded以降に初期化処理を実行する
 */
if (document.readyState !== "loading") {
  onDomContentsLoaded();
} else {
  document.addEventListener("DOMContentLoaded", onDomContentsLoaded);
}
