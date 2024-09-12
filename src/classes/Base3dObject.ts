import { Group, Scene } from "three";

class Base3dObject {
  static instance: Base3dObject;
  scene!: Scene;
  group = new Group();

  constructor() {
    this.bind();
  }

  static getInstance() {
    if (!Base3dObject.instance) {
      Base3dObject.instance = new Base3dObject();
    }

    return Base3dObject.instance;
  }

  createMeshes() {}

  update() {}

  bind() {}
}

export default Base3dObject;
