import { useEffect, useRef, useState } from "react";
import MainThreeScene from '@/classes/MainThreeScene';
import { getEntitiesData } from "@/api/api";
import { useLoadFont } from "@/utils/useLoadFont";
import { Font } from 'three/addons/loaders/FontLoader.js';
import NodeDescription from "./NodeDescription";

const ThreeDataVis = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedNodeEntity, setSelectedNodeEntity] = useState<TSwEntity>();
  const [hoverNodeEntity, setHoverNodeEntity] = useState<TSwEntity>();

  const font = useLoadFont('./Kanit Medium Regular.json');
  let mainThreeScene!: MainThreeScene;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchData = async(loadedFont: Font) => {
    const entitiesData = await getEntitiesData();
    mainThreeScene = new MainThreeScene(containerRef.current as HTMLDivElement, loadedFont);
    mainThreeScene.setData(entitiesData);
  }

  const selectNodeData = (e: Event) => {
    const selectedEntity = (e as CustomEvent).detail as TSwEntity;
    setSelectedNodeEntity(selectedEntity);
  }

  const clearNodeData = () => {
    console.log('clearr')
    setSelectedNodeEntity(undefined);
  }

  const hoverNodeData = (e: Event) => {
    const selectedEntity = (e as CustomEvent).detail as TSwEntity;
    setHoverNodeEntity(selectedEntity);
  }

  const outNodeData = () => {
    setHoverNodeEntity(undefined);
  }

  const checkSelectedEntity = () => {
    return hoverNodeEntity || selectedNodeEntity;
  }
  
  useEffect(() => {
    if (typeof window !== 'undefined' && containerRef && font) {
      fetchData(font);
      window.addEventListener('nodeSelected', selectNodeData);
      window.addEventListener('nodeUnselected', clearNodeData);
      window.addEventListener('nodeHover', hoverNodeData);
      window.addEventListener('nodeOut', outNodeData);

      return () => {
        mainThreeScene.removeEventListeners();
        window.removeEventListener('nodeSelected', selectNodeData);
        window.removeEventListener('nodeUnselected', clearNodeData);
        window.removeEventListener('nodeHover', hoverNodeData);
        window.removeEventListener('nodeOut', outNodeData);
      }
    }
  }, [font]);

  return (
    <main className={`ssa-data-vis h-screen w-screen block relative`}>
      <div ref={containerRef} className={`ssa-canvas-container h-full w-full block absolute`}></div>
      <div className={`ssa-title absolute w-full h-full pointer-events-none`}>
        {checkSelectedEntity()
          ? <NodeDescription {...checkSelectedEntity() as TSwEntity} />
          : ''          
        }              
        
      </div>
    </main>
  )
}

export default ThreeDataVis;
