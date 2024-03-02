import { OrbitControls } from "@react-three/drei";
import { Physics } from '@react-three/rapier';

import Lights from "./Lights.jsx";
import { Player } from './Player.jsx';
import {Level, BlockStart, BlockSpinner, BlockLimbo, BlockAxe, BlockEnd} from './Level.jsx';

export default function Experience() {
  return (
    <>
      <OrbitControls makeDefault />
      <Physics debug>
        <Lights />
        <Level/>
        <Player/>
      </Physics>
    </>
  );
}
