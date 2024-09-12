import { Color, DoubleSide, Mesh, MeshBasicMaterial, Shape, ShapeGeometry, Group } from "three";
import Base3dObject from "../Base3dObject";

class SliceFactory extends Base3dObject {
  static instance: SliceFactory;

  data!: TSwTypeSection;
  _sliceAngle = 0;
  geometry!: ShapeGeometry;
  material!: MeshBasicMaterial;
  RADIUS = 0;

  static getInstance() {
    if (!SliceFactory.instance) {
      SliceFactory.instance = new SliceFactory();
    }

    return SliceFactory.instance;
  }

  set sliceAngle(itemNumber: number) {
    this._sliceAngle = Math.PI * 2 / itemNumber;
  }

  get sliceAngle() {
    return this._sliceAngle;
  }

  createMeshes() {
    const shape = new Shape();
    shape.moveTo(0, 0);
    shape.arc(0, 0, this.RADIUS, 0, this.sliceAngle, false);
    shape.lineTo(0, 0);

    this.geometry = new ShapeGeometry(shape);
    this.material = new MeshBasicMaterial({ color: 0xffffff, side: DoubleSide, wireframe: false });

  }

  getSlice(slicePosition: number, color: Color) {
    const clonedGeometry = this.geometry.clone();
    const clonedMaterial = this.material.clone();
    clonedMaterial.color.set(color);

    const sliceMesh = new Mesh(clonedGeometry, clonedMaterial);
    sliceMesh.rotateZ(this.sliceAngle * slicePosition);

    const newGroup = new Group();
    
    newGroup.add(sliceMesh);

    return newGroup;
  }
}

export default SliceFactory;
