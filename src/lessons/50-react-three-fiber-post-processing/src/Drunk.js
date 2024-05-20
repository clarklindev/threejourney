import DrunkEffect from "./DrunkEffect.jS";
import { forwardRef } from "react";

// export default function Drunk() {
//   const effect = new DrunkEffect();

//   return (
//     // <mesh><boxGeometry/></mesh>
//     <primitive object={effect} />
//   );
// }

export default forwardRef(function Drunk(props, ref)
{
    const effect = new DrunkEffect(props);

    return <primitive ref={ ref } object={ effect } />
})
