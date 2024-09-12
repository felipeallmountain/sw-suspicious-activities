/* eslint-disable @typescript-eslint/ban-ts-comment */
import { 
  BoxGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  SphereGeometry,
  Vector3 } from "three";
import Base3dObject from "../Base3dObject";

// @ts-expect-error
import vertexShader from "@/shaders/nodeVertex.glsl";
// @ts-expect-error
import fragmentShader from "@/shaders/nodeFragment.glsl";
// @ts-expect-error
import shadowVertex from "@/shaders/shadowVertex.glsl";
// @ts-expect-error
import shadowFragment from "@/shaders/shadowFragment.glsl";

class NodeFactory extends Base3dObject {
  static instance: NodeFactory;

  characterGroup = new Group();
  objectGroup = new Group();
  locationGroup = new Group();
  shadowGroup = new Group();
  ovalGroup = new Group();

  lightPosition = new Vector3(10, 5, 0);
  GEOMRAD = .5;


  static getInstance() {
    if (!NodeFactory.instance) {
      NodeFactory.instance = new NodeFactory();
    }

    return NodeFactory.instance;
  }

  createMeshes() {
    this.characterGroup.name = 'nodeModel';
    this.objectGroup.name = 'nodeModel';
    this.locationGroup.name = 'nodeModel';
    this.shadowGroup.name = 'shadow';
    this.createCharacterMesh();
    this.createObjectMesh();
    this.createLocationMesh();
    this.createShadowMesh();
  }

  /**
   * Gets the mesh according to the type
   * 
   */

  getNodeModel(model: 'Character' | 'Location' | 'Object') {
    switch(model) {
      case 'Character':
        return this.assembleModel(this.characterGroup.clone());

      case 'Location':
        return this.assembleModel(this.locationGroup.clone());

      case 'Object':
        return this.assembleModel(this.objectGroup.clone());
    }
  }

   /**
   * Shader material for the node model
   * 
   */

  createShaderMaterial(color: number) {
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uColor: { value: new Color(color) },
        lightPosition: { value: this.lightPosition },
        opacity: { value: 1.0 },
      },
    });
  }

   /**
   * Assemble the node with the Mesh and the shadow
   * 
   */


  assembleModel(nodeGroup: Group) {
    this.group.position.z = 0;
    this.group.position.y = 0;
    this.group.clear();
    
    const shadowClone = this.shadowGroup.clone();
    shadowClone.translateY(.47);
    this.group.add(nodeGroup);
    this.group.add(shadowClone);
    this.group.translateZ(-.48);
    
    return this.group.clone();
  }

  /**
   * Mesh for the 'Character' type
   * 
   */

  createCharacterMesh() {
    const shaderMaterial = this.createShaderMaterial(0xff0000);

    const headGeometry = new SphereGeometry(this.GEOMRAD * .7, 32, 32);
    const headMesh = new Mesh(headGeometry, shaderMaterial);
    headMesh.translateY(-.9);

    const bodyGeometry = new CylinderGeometry(this.GEOMRAD * .5, this.GEOMRAD * .5, 1, 32, 32);
    const bodyMesh = new Mesh(bodyGeometry, shaderMaterial);
    bodyMesh.translateY(-.2);

    this.characterGroup.add(headMesh);
    this.characterGroup.add(bodyMesh);
  }

  /**
   * Mesh for the 'Object' type
   * 
   */

  createObjectMesh() {
    const rad = this.GEOMRAD * 1.4;
    const cubeGeometry = new BoxGeometry(rad, rad, rad);
    const shaderMaterial = this.createShaderMaterial(0x0066ff);
    const cubeMesh = new Mesh(cubeGeometry, shaderMaterial);
    this.objectGroup.add(cubeMesh);
  }

  /**
   * Mesh for the 'Location' type
   * 
   */

  createLocationMesh() {
    const sphereGeometry = new SphereGeometry(this.GEOMRAD * .65, 32, 32);
    const shaderMaterial = this.createShaderMaterial(0xffffff);
    const sphereMesh = new Mesh(sphereGeometry, shaderMaterial);
    sphereMesh.translateY(-.45)
    
    const coneGeometry = new ConeGeometry(this.GEOMRAD * .7, this.GEOMRAD * 1.7, 32);
    const coneMesh = new Mesh(coneGeometry, shaderMaterial);

    this.locationGroup.add(sphereMesh);
    this.locationGroup.add(coneMesh);
  }

  /**
   * Mesh for the shadow
   * 
   */

  createShadowMesh() {
    const shadowMaterial = new ShaderMaterial({
      vertexShader: shadowVertex,
      fragmentShader: shadowFragment,
      uniforms: {
        shadowRadius: { value: .5 },
        shadowOpacity: { value: .7 },
        shadowColor: { value: new Color(0x000000)},
      },
      transparent: true,
    });
    const shadowGeometry = new PlaneGeometry(this.GEOMRAD * 3, this.GEOMRAD * 3);
    const shadowMesh = new Mesh(shadowGeometry, shadowMaterial);
    shadowMesh.rotateX(Math.PI * .5);
    this.shadowGroup.add(shadowMesh);
  }
}

export default NodeFactory;
