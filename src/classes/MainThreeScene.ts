import { PerspectiveCamera, Scene, Vector2, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Font } from 'three/addons/loaders/FontLoader.js';
import Stats from 'stats.js';

import ParticlesController from '@/classes/controllers/ParticlesController';
import SliceFactory from '@/classes/factories/SliceFactory';
import NodeFactory from '@/classes/factories/NodeFactory';

import { getGroupedEntities } from '@/utils/utils';
import DishController from './controllers/DishController';
import LabelFactory from './factories/LabelFactory';

class MainThreeScene {

  stats = new Stats();

  renderer!: WebGLRenderer;
  scene!: Scene;
  camera!: PerspectiveCamera;
  controls!: OrbitControls;
  entitiesData!: TSwEntity[];
  typeSectionsData!: TSwTypeSection[];

  font!: Font;

  particlesController!: ParticlesController;
  dishController!: DishController;

  /**
   * Define main three.js elements:
   * scene, camera, renderer and controls
   * 
   */

  constructor(container: HTMLDivElement, font: Font) {
    const { innerWidth, innerHeight } = window;
    this.scene = new Scene();
    this.font = font;

    this.renderer = this.addRenderer(innerWidth, innerHeight);
    this.camera = this.addCamera(innerWidth, innerHeight)    
    this.controls = this.addControls();

    container.appendChild(this.renderer.domElement);

    this.bind();
  }

  /**
   * Init app when data is injected
   * 
   */

  setData(entitiesData: TSwEntity[]) {
    this.addStats();

    this.entitiesData = [...entitiesData];
    this.typeSectionsData = getGroupedEntities(entitiesData);

    this.initFactories();
    this.initControllers();
    this.drawObjects();

    this.addEventListeners();

    this.resize();
    this.update();
  }

  /**
   * Stats.js panel
   * 
   */

  addStats() {
    this.stats.showPanel(0);
    this.stats.dom.style.position = 'fixed';
    this.stats.dom.style.top = 'initial';
    this.stats.dom.style.bottom = '0';
    document.body.appendChild(this.stats.dom);
  }

  addRenderer(innerWidth = 0, innerHeight = 0) {
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(innerWidth, innerHeight);

    return renderer; 
  }

  addCamera(innerWidth = 0, innerHeight = 0) {
    const camera = new PerspectiveCamera(75, innerWidth / innerHeight, 1, 200);
    camera.position.set(0, 6, 12);

    return camera;
  }

  addControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.maxDistance = 1500;
    controls.minDistance = 0;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI * .4;

    return controls;
  }

  /**
   * Factories are singletones that create 
   * instances of 3d Meshes to be cloned inside the app
   * in order to increase performance by having less elements
   * on Screen
   * 
   */

  initFactories() {
    SliceFactory.getInstance().RADIUS = 8;
    SliceFactory.getInstance().sliceAngle = this.typeSectionsData.length;
    SliceFactory.getInstance().createMeshes();
    NodeFactory.getInstance().createMeshes();
    LabelFactory.getInstance().font = this.font;
  }

  /**
   * Controllers manage actions of the Meshes by assembling them
   * into the main scene and wiring up interactions
   * 
   */

  initControllers() {
    // particles to decorate the scene with an starfield
    this.particlesController = new ParticlesController();
    this.particlesController.init(this.scene);

    this.dishController = new DishController(this.scene, this.camera);
  }
  
  /**
   * DishController assembles all pieces of interaction
   * and wire them together
   * 
   */
  drawObjects() {
    this.dishController.createDishGroup(this.typeSectionsData);
    this.dishController.createRings();
    this.dishController.addNodes();
  }

  /**
   * Render loop for three.js
   * 
   */

  update() {
    this.stats.update();
    this.particlesController.update();
    this.dishController.update();
    this.renderer.render(this.scene as Scene, this.camera as PerspectiveCamera);
    
    requestAnimationFrame(this.update);
  }

  /**
   * Fit elements if window is resized
   * 
   */

  resize() {
    const { innerWidth, innerHeight } = window;
    this.renderer.setSize(innerWidth, innerHeight);
    const aspectRatio = innerWidth / innerHeight;
    this.camera.fov = aspectRatio > 1 ? 75 : 120;
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
  }

  /**
   * Get pointer to be used with three.js Raycaster
   * 
   */

  getMousePoint(event: MouseEvent) {
    const mouse = new Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    return mouse;
  }

  onMouseDown(event: MouseEvent) {
    const mouse = this.getMousePoint(event);
    this.dishController.onMouseDown(mouse, this.camera);
  }

  onMouseMove(event: MouseEvent) {
    const mouse = this.getMousePoint(event);
    this.dishController.onMouseMove(mouse, this.camera)

  }

  addEventListeners() {
    this.renderer.domElement.addEventListener('mousedown', this.onMouseDown);
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('resize', this.resize);

  }

  removeEventListeners() {
    this.renderer.domElement.removeEventListener('mousedown', this.onMouseDown);
    this.renderer.domElement.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.resize);
  }

  bind() {
    this.update = this.update.bind(this);
    this.resize = this.resize.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.removeEventListeners = this.removeEventListeners.bind(this);
  }
}

export default MainThreeScene;