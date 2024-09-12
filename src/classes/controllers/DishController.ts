import { Color, Group, PerspectiveCamera, Raycaster, Scene, Vector2 } from "three";
import SliceFactory from "../factories/SliceFactory";
import RingsFactory from "../factories/RingsFactory";
import NodeFactory from "../factories/NodeFactory";
import { getRadians } from '@/utils/utils';
import NodeController from './NodeController';
import SliceController from './SliceController';
import LabelFactory from "../factories/LabelFactory";

export default class DishController {
  scene: Scene;
  camera: PerspectiveCamera;
  group: Group;
  raycaster: Raycaster;

  slicesGroup: SliceController[] = [];
  nodesGroup: NodeController[] = [];

  RADIUS = 8;
  RINGOFFSET = -.01;
  NUM_RINGS = 4;

  SLICE_COLORS = [0x002a4d, 0x1a1a1a, 0x999999];

  constructor(scene: Scene, camera: PerspectiveCamera) {
    this.scene = scene;
    this.camera = camera;
    this.group = new Group();
    this.raycaster = new Raycaster();
  }

  /**
   * Create the circle with each type section
   * by getting instances of SliceFactory
   * 
   */
  createDishGroup(typeSections: TSwTypeSection[]) {
    typeSections.forEach((value, index) => {
      const sliceModel =  SliceFactory.getInstance().getSlice(
        index, new Color(this.SLICE_COLORS[index])
      );
      
      const slice = new SliceController(value);
      slice.setModel(sliceModel);

      this.group.add(slice);
      this.slicesGroup.push(slice);
    });

    this.group.rotateX(Math.PI * .5);
    this.scene.add(this.group);
  }

  /**
   * Add rings from RingsFactory
   * on top of the slices
   * 
   */

  createRings() {
    const rings = RingsFactory.getInstance().createRings(this.RADIUS, this.NUM_RINGS);
    rings.translateZ(this.RINGOFFSET);
    
    this.group.add(rings);    
  }

  /**
   * Get nodes from NodeFactory according to the node type
   * 
   * 
   */

  addNodes() {
    this.slicesGroup.forEach((slice) => {
      const { typeGroup } = slice;
      const { entities, type } = typeGroup

      entities.forEach((entity) => {
        const nodeModel = NodeFactory.getInstance().getNodeModel(type);
        const labelModel = LabelFactory.getInstance().getLabel(`${entity.type} - ${entity.id}`);
        
        // NodeController controls actions on the created Node
        const node = new NodeController(entity, this.camera);
        node.setModel(nodeModel);
        node.setLabel(labelModel);

        node.rotateX(Math.PI * .5);

        const radAngle = getRadians(node.nodeEntity.position.angle)
        const distanceDiff = this.RADIUS / this.NUM_RINGS;
        const radiusDiff = this.RADIUS - distanceDiff;
        const radDistance = (node.nodeEntity.position.distance * radiusDiff) + distanceDiff;

        node.translateX(Math.cos(radAngle) * radDistance);
        node.translateZ(Math.sin(radAngle) * radDistance);
        node.translateY(-.5);

        slice.add(node);
        // Box to check the hit area of the meshes
        // this.scene.add(node.boundingBoxHelper)

        this.nodesGroup.push(node);
      });
    });
  }

  onMouseDown(mouse: Vector2, camera: PerspectiveCamera) {
    this.raycaster.setFromCamera(mouse, camera);
    this.checkClickPosition();
  }
  
  onMouseMove(mouse: Vector2, camera: PerspectiveCamera) {
    this.raycaster.setFromCamera(mouse, camera);
  }

  /**
   * Select the nodes that are connected to the clicked node
   * 
   */
  selectConnections(node: NodeController) {
    node.nodeEntity.connections.forEach(connection => {
      const connectionNode = this.nodesGroup.find(node => node.nodeEntity.id === connection.id);
      if (connectionNode) {
        connectionNode.isConnected = true;
        connectionNode.connect(connection);
      }      
    });
  }

  /**
   * Remove state from nodes that are marked as connections
   * 
   */
  resetConnections() {
    this.nodesGroup.forEach(node => {
      node.isConnected = false;
      node.onMouseOut();
    });
  }

  /**
   * Evaluate Raycaster to check if the mouse is hovering meshes
   * and act according to the state
   * 
   */
  checkHoverPosition() {
    const intersectsGroup = this.raycaster.intersectObjects(this.nodesGroup);
    
    this.nodesGroup.forEach(node => {
      const intersectBox = this.raycaster.ray.intersectsBox(node.boundingBox);
      if (intersectBox) {
        this.resetHover();
        node.onMouseOver();
        node.dispatchSelect('nodeHover');
      } else {
        if (!node.isSelected && !node.isConnected) node.onMouseOut();

        if (!intersectsGroup.length) {
          node.dispatchUnselect('nodeOut');
        }

        if (node.isConnected) node.connect()
      }
    });
  }

  /**
   * Evaluate Raycaster to check if the mouse is on top of clicked meshes
   * and act according to the state
   * 
   */

  checkClickPosition() {
    this.nodesGroup.forEach(node => {
      const intersectBox = this.raycaster.ray.intersectsBox(node.boundingBox);
      if (intersectBox) {
        if (!node.isSelected) this.resetEntities();
        node.isSelected = !node.isSelected;
        if (!node.isSelected) {
          this.resetConnections();
          node.onClick();
          node.onMouseOut();
        }

        if (node.isSelected) {
          this.resetConnections();
          node.onClick();
          this.selectConnections(node);
        }
      }
    });
  }

  /**
   * Remove state from nodes that are marked as hover
   * 
   */

  resetHover() {
    this.nodesGroup.forEach(node => {
      node.dispatchUnselect('nodeOut');
    });
  }

   /**
   * Remove state from nodes that are marked as selected
   * 
   */

  resetEntities() {
    this.nodesGroup.forEach(node => {
      node.isSelected = false;
      node.onMouseOut();
    });
  }

   /**
   * Render loop
   * 
   */

  update() {
    this.nodesGroup.forEach(node => node.update());
    this.checkHoverPosition();
  }
}
