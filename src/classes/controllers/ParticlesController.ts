import { BufferGeometry, Float32BufferAttribute, Points, PointsMaterial, Scene } from "three";

class ParticlesController {
  particlesGeometry!: BufferGeometry;
  particlesMaterial!: PointsMaterial;
  particleSystem!: Points;

  particlesCount = 2000;
  boxSize = 30;

  /**
   * Set particles in a BufferGeometry to fly up and go
   * back after some height is reached
   * 
   */

  init(scene: Scene) {
    this.particlesGeometry = new BufferGeometry();
    const particlesPos = [];

    for (let i = 0; i < this.particlesCount; i++) {
      const x = Math.random() * this.boxSize - this.boxSize * .5;
      const y = Math.random() * this.boxSize - this.boxSize * .5;
      const z = Math.random() * this.boxSize - this.boxSize * .5;

      particlesPos.push(x, y, z);
    }

    this.particlesGeometry.setAttribute('position', new Float32BufferAttribute(particlesPos, 3));
    this.particlesMaterial = new PointsMaterial({
      color: 0xffffff,
      size: .015,
    });

    this.particleSystem = new Points(this.particlesGeometry, this.particlesMaterial);
    scene.add(this.particleSystem);

    return this;
  }

  /**
   * Animation loop
   * 
   */

  update() {
    let i = 0;
    const particlesArray = this.particlesGeometry.attributes.position.array;

    while(i < this.particlesCount) {
      particlesArray[i * 3 + 1] += .01;
      if (particlesArray[i * 3 + 1] > this.boxSize * .5) {
        particlesArray[i * 3 + 1] = -this.boxSize * .5;
      }
      i++;
    }
    
    this.particlesGeometry.attributes.position.needsUpdate = true;
  }

  bind() {
    this.init = this.init.bind(this);
    this.update = this.update.bind(this);
  }
}

export default ParticlesController;
