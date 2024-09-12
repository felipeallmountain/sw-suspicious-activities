import { DoubleSide, Mesh, MeshBasicMaterial, RingGeometry } from "three";
import Base3dObject from "../Base3dObject";

class RingsFactory extends Base3dObject {
  static instance: RingsFactory;

  RING_OFFSET = .05;
  SEGMENTS = 90;

  static getInstance() {
    if (!RingsFactory.instance) {
      RingsFactory.instance = new RingsFactory();
    }

    return RingsFactory.instance;
  }

  /**
   * Create rings to place on top of the dish
   * 
   */

  createRings(radius: number, numRings: number) {
    const ringFrag = radius / numRings;
    for (let i = 1; i <= numRings; i++) {
      const ringRadius = i * ringFrag;

      const geometry = new RingGeometry(
        ringRadius, ringRadius + this.RING_OFFSET, this.SEGMENTS
      );

      const material = new MeshBasicMaterial({ color: 0x00f1ff, side: DoubleSide });
      const mesh = new Mesh(geometry, material);
      this.group.add(mesh);
      
    }

    return this.group;
  }
}

export default RingsFactory;