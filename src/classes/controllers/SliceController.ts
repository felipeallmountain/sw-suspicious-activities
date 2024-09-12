import { Group } from "three";

export default class SliceController extends Group{
 typeGroup: TSwTypeSection;

  constructor(sliceGroup: TSwTypeSection) {
    super();
    this.typeGroup = {...sliceGroup};
  }

  setModel(groupModel: Group) {
    this.add(groupModel);
  }
}
