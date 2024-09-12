import { Mesh, MeshBasicMaterial, MeshPhongMaterial, PlaneGeometry } from "three";
import Base3dObject from "../Base3dObject";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader, Font } from 'three/addons/loaders/FontLoader.js';

export default class LabelFactory extends Base3dObject {
  static instance: LabelFactory;
  fontLoader: FontLoader;
  font!: Font;

  constructor() {
    super();

    this.fontLoader = new FontLoader();
  }
  

  static getInstance() {
    if (!LabelFactory.instance) {
      LabelFactory.instance = new LabelFactory();
    }

    return LabelFactory.instance;
  }

  getLabel(text = '') {
    this.group.clear();
    const textGeometry = new TextGeometry(text, {
      font: this.font,
      size: .15,
      height: 0.2,
      curveSegments: 12,
      depth: .01,
    });

    const textMaterial = new MeshPhongMaterial({ color: 0xff0000 });
    const textMesh = new Mesh(textGeometry, textMaterial);
    textMesh.name = 'text';

    textGeometry.computeBoundingBox();
    const textOffset = textGeometry.boundingBox?.max.clone().sub(
      textGeometry.boundingBox.min
    ).multiplyScalar(.5);

    if (textOffset) {
      textMesh.position.x = -textOffset.x;
      textMesh.position.y = -textOffset.y;
      textMesh.position.z = -textOffset.z;
      const frameGeometry = new PlaneGeometry(textOffset.x * 2.5, textOffset.y * 2.5);
      const frameMaterial = new MeshBasicMaterial({ color: 0xff9100 });
      const frameMesh = new Mesh(frameGeometry, frameMaterial);
      frameMesh.name = 'frame';
      frameMesh.position.z = -.01;

      this.group.add(textMesh);
      this.group.add(frameMesh);
    } 


    return this.group.clone();
  }
}