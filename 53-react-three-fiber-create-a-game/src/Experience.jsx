// import { OrbitControls } from "@react-three/drei";   //use camera
import { Physics } from '@react-three/rapier';

import Lights from "./Lights.jsx";
import { Player } from './Player.jsx';
import {Level, BlockStart, BlockSpinner, BlockLimbo, BlockAxe, BlockEnd} from './Level.jsx';

import useGame from './stores/useGame.js';

export default function Experience() {

  const blocksCount = useGame((state)=> state.blocksCount);

  return (
    <>
      {/* <OrbitControls makeDefault /> */}
      <Physics debug> 
        <Lights />
        <Level count={blocksCount}/>
        <Player/>
      </Physics>
    </>
  );
}
