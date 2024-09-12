import gsap from "gsap";
import {
  Box3,
  Box3Helper,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  ShaderMaterial
} from "three";

export default class NodeController extends Group {
  nodeEntity: TSwEntity;
  camera: PerspectiveCamera;
  name: string = 'node';

  isSelected = false;
  isConnected = false;

  nodeModelGroup!: Group;
  shadowGroup!: Group;
  shadowMaterial!: ShaderMaterial;
  labelGroup!: Group;
  labelFrameMaterial!: MeshBasicMaterial;

  boundingBox!: Box3;
  boundingBoxHelper!: Box3Helper;

  connectColor = 0x00f1ff;
  outColor = 0xffffff;
  selectedColor = 0xff9100;
  originalColor = 0x000000;

  shaderList: ShaderMaterial[] = [];

  constructor(entity: TSwEntity, camera: PerspectiveCamera) {
    super();
    this.nodeEntity = entity;
    this.camera = camera;
  }

  setModel(groupModel: Group) {
    this.add(groupModel);
    groupModel.traverse(child => {
      if (child.name === 'nodeModel') {
        this.nodeModelGroup = child as Group;

        this.nodeModelGroup.traverse(nodeChild => {
          if (nodeChild.type === 'Mesh') {
            const nodeParent = nodeChild as Mesh;
            const nodeMat = (nodeParent.material as ShaderMaterial).clone();
            this.originalColor = nodeMat.uniforms.uColor.value.clone();
            nodeParent.material = nodeMat;
            this.shaderList.push(nodeMat);          
          }
        });        
        
        this.boundingBox = new Box3();
        this.nodeModelGroup.updateMatrixWorld(true);
        this.boundingBox.expandByObject(this.nodeModelGroup, true);
        this.boundingBoxHelper = new Box3Helper(this.boundingBox, 0xffff00);
      }

      if (child.name === 'shadow') {
        this.shadowGroup = child as Group;
        const shadowMesh = this.shadowGroup.children[0] as Mesh;
        this.shadowMaterial = (shadowMesh.material as ShaderMaterial).clone();
        shadowMesh.material = this.shadowMaterial;
      }
    });
  }

  setLabel(groupLabel: Group) {
    this.labelGroup = groupLabel;
    this.labelGroup.translateZ(-.5);
    this.labelGroup.translateY(-1.4);
    this.labelGroup.rotateX(Math.PI);
    this.add(this.labelGroup);

    const textFrame = this.labelGroup.children.find(child => child.name === 'frame') as Mesh;
    this.labelFrameMaterial = textFrame.material as MeshBasicMaterial;
  }

  connect(connection?: TSwConnection) {
    this.labelFrameMaterial.color = new Color(this.connectColor);
    this.shadowMaterial.uniforms.shadowColor.value.set(this.connectColor);

    if (connection) {
      gsap.to(this.nodeModelGroup.position, { y: -2.5, duration: .3, delay: .3 });
      gsap.to(this.labelGroup.position, { y: -3.9, duration: .3, delay: .3 });

      this.setShaderColor(this.connectColor, connection.strength);
    }
  }

  setShaderColor(color: number, opacity: number = 1) {
    this.shaderList.forEach(shader => {
      shader.uniforms.uColor.value.set(color);
      shader.uniforms.opacity.value = opacity;
    });
  }

  onMouseOut() {
    gsap.to(this.nodeModelGroup.position, { y: 0, duration: .3 });
    gsap.to(this.labelGroup.position, { y: -1.4, duration: .3 });
    this.shadowMaterial.uniforms.shadowColor.value.set(this.outColor);
    this.labelFrameMaterial.color = new Color(this.outColor);
    
    this.setShaderColor(this.originalColor);
  }

  onMouseOver() {
    this.shadowMaterial.uniforms.shadowColor.value.set(this.selectedColor);
  }
  
  onClick() {
    gsap.to(this.nodeModelGroup.position, { y: -2.5, duration: .3 });
    gsap.to(this.labelGroup.position, { y: -3.9, duration: .3 });
    this.labelFrameMaterial.color = new Color(this.selectedColor);
    this.setShaderColor(this.selectedColor);

    this.isSelected
      ? this.dispatchSelect('nodeSelected')
      : this.dispatchUnselect('nodeUnselected');
  }

  dispatchSelect(eventName: 'nodeSelected' | 'nodeHover') {
    const customEvent = new CustomEvent(eventName, {
      detail: {
        ...this.nodeEntity
      }
    });
    window.dispatchEvent(customEvent);
  }

  dispatchUnselect(eventName: 'nodeUnselected' | 'nodeOut') {
    const customEvent = new CustomEvent(eventName);
    window.dispatchEvent(customEvent);
  }

  update() {
    this.labelGroup.lookAt(this.camera.position);
    this.boundingBox.setFromObject(this);
    this.boundingBoxHelper.updateMatrix();
  }
}
