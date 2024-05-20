// import { OrbitControls } from "@react-three/drei";   //use camera
import { Physics } from '@react-three/rapier';

import Lights from "./Lights.jsx";
import { Player } from './Player.jsx';
import {Level, BlockStart, BlockSpinner, BlockLimbo, BlockAxe, BlockEnd} from './Level.jsx';

import useGame from './stores/useGame.js';

export default function Experience() {

  const blocksCount = useGame((state)=> state.blocksCount);
  const blocksSeed = useGame((state)=> state.blocksSeed);

  
  return (
    <>
      {/* <OrbitControls makeDefault /> */}
      <color args={['#abcdef']} attach="background"/>
      <Physics> 
        <Lights />
        <Level count={blocksCount} bl/>
        <Player/>
      </Physics>
    </>
  );
}
