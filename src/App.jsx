function App() {

  const sections = [
    {
      heading:"github",
      links:[
        {
          previewurl: "",
          notesurl:`${import.meta.env.VITE_GITHUB_BASE_URL}`,
          label: "github repository",
          target: "_blank"
        }
      ]
    },
    {
      heading:"01 Basics",
      links:[
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/03-basics-first-threejs-project/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/03-basics-first-threejs-project`,
          label: "03-basics-first-threejs-project",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/04-basics-transform-objects/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/04-basics-transform-objects`,
          label: "04-basics-transform-objects",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/05-basics-animations/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/05-basics-animations`, 
          label:"05-basics-animations",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/06-basics-cameras/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/06-basics-cameras`, 
          label: "06-basics-cameras",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/07-basics-fullscreen-and-resizing/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/07-basics-fullscreen-and-resizing`, 
          label: "07-basics-fullscreen-and-resizing",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/08-basics-geometries/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/08-basics-geometries`, 
          label: "08-basics-geometries",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/09-basics-debug-ui/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/09-basics-debug-ui`, 
          label: "09-basics-debug-ui",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/10-basics-textures/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/10-basics-textures`, 
          label: "10-basics-textures",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/11-basics-materials/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/11-basics-materials`, 
          label: "11-basics-materials",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/12-basics-3dtext/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/12-basics-3dtext`, 
          label: "12-basics-3dtext",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/13-basics-go-live/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/13-basics-go-live`, 
          label: "13-basics-go-live",
          target: "_preview"
        },
      ]
    },
    {
      heading:"02 Classic Techniques",
      links:[
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/14-classictechniques-lights/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/14-classictechniques-lights`, 
          label: "14-classictechniques-lights",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/15-classictechniques-shadows/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/15-classictechniques-shadows`, 
          label: "15-classictechniques-shadows",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/16-classictechniques-hauntedhouse/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/16-classictechniques-hauntedhouse`, 
          label: "16-classictechniques-hauntedhouse",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/17-classictechniques-particles/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/17-classictechniques-particles`, 
          label: "17-classictechniques-particles",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/18-classictechniques-galaxygenerator/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/18-classictechniques-galaxygenerator`, 
          label: "18-classictechniques-galaxygenerator",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/19-classictechniques-scrollbasedanimation/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/19-classictechniques-scrollbasedanimation`, 
          label: "19-classictechniques-scrollbasedanimation",
          target: "_preview"
        }
      ]
    },
    {
      heading:'03 Advanced Techniques',
      links:[
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/20-advancedtechniques-physics/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/20-advancedtechniques-physics`, 
          label: "20-advancedtechniques-physics",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/21-advancedtechniques-importedmodels/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/21-advancedtechniques-importedmodels`, 
          label: "21-advancedtechniques-importedmodels",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/22-advancedtechniques-raycaster/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/22-advancedtechniques-raycaster`, 
          label: "22-advancedtechniques-raycaster",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/23-advancedtechniques-custom-model-with-blender/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/23-advancedtechniques-custom-model-with-blender`, 
          label: "23-advancedtechniques-custom-model-with-blender",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/24-advancedtechniques-environment-map/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/24-advancedtechniques-environment-map`, 
          label: "24-advancedtechniques-environment-map",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/25-advancedtechniques-realistic-render/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/25-advancedtechniques-realistic-render`, 
          label: "25-advancedtechniques-realistic-render",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/26-advancedtechniques-code-structuring-for-bigger-projects/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/26-advancedtechniques-code-structuring-for-bigger-projects`, 
          label: "26-advancedtechniques-code-structuring-for-bigger-projects",
          target: "_preview"
        },
      ]
    },
    {
      heading:'04 Shaders',
      links:[
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/27-shaders-shaders/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/27-shaders-shaders`, 
          label: "27-shaders-shaders",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/28-shaders-shaderpatterns/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/28-shaders-shaderpatterns`, 
          label: "28-shaders-shaderpatterns",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/29-shaders-raging-sea/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/29-shaders-raging-sea`, 
          label: "29-shaders-raging-sea",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/30-shaders-animated-galaxy/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/30-shaders-animated-galaxy`, 
          label: "30-shaders-animated-galaxy",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/31-shaders-modified-materials/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/31-shaders-modified-materials`, 
          label: "31-shaders-modified-materials",
          target: "_preview"
        },
        {
          previewurl: "",
          notesurl:"",
          label: "32 Coffee Smoke (new)",
          target: "_preview"
        },
        {
          previewurl: "",
          notesurl:"",
          label: "33 Hologram (new)",
          target: "_preview"
        },
        {
          previewurl: "",
          notesurl:"",
          label: "34 Fireworks (new)",
          target: "_preview"
        },
        {
          previewurl: "",
          notesurl:"",
          label: "35 Lights Shading (new)",
          target: "_preview"
        },
        {
          previewurl: "",
          notesurl:"",
          label: "36 Raging Sea Shading (new)",
          target: "_preview"
        },
        {
          previewurl: "",
          notesurl:"",
          label: "37 Halftone Shading (new)",
          target: "_preview"
        },
        {
          previewurl: "",
          notesurl:"",
          label: "38 Earth (new)",
          target: "_preview"
        },
        {
          previewurl: "",
          notesurl:"",
          label: "39 Particles Cursor Animation (new)",
          target: "_preview"
        },
        {
          previewurl: "",
          notesurl:"",
          label: "40 Particles Morphing (new)",
          target: "_preview"
        },
        {
          previewurl: "",
          notesurl:"",
          label: "41 GPGPU Flow Field Particles (new)",
          target: "_preview"
        },
        {
          previewurl: "",
          notesurl:"",
          label: "42 Wobbly Sphere (new)",
          target: "_preview"
        },
        {
          previewurl: "",
          notesurl:"",
          label: "43 Sliced Model (new)",
          target: "_preview"
        },
        {
          previewurl: "",
          notesurl:"",
          label: "44 Procedural Terrain (new)",
          target: "_preview"
        }
      ]
    },
    {
      heading:'05 Extra',
      links:[
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/45-extra-post-processing/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/45-extra-post-processing`, 
          label: "45-extra-post-processing",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/46-extra-performance-tips/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/46-extra-performance-tips`, 
          label: "46-extra-performance-tips",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/47-extra-intro-and-loading-progress/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/47-extra-intro-and-loading-progress`, 
          label: "47-extra-intro-and-loading-progress",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/48-extra-mixing-html-and-webgl/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/48-extra-mixing-html-and-webgl`, 
          label: "48-extra-mixing-html-and-webgl",
          target: "_preview"
        }
      ]
    },
    {
      heading:'06 Portal Scene',
      links:[
        //DONE IN BLENDER
        {
          previewurl: ``,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/49-portalscene-creating-a-scene-in-blender`, 
          label: "49-portalscene-creating-a-scene-in-blender",
          target: "_preview"
        },
        
        //DONE IN BLENDER
        {
          previewurl: ``,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/50-portalscene-baking-and-exporting-a-scene`, 
          label: "50-portalscene-baking-and-exporting-a-scene",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/51-portalscene-importing-and-optimizing-the-scene/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/51-portalscene-importing-and-optimizing-the-scene`, 
          label: "51-portalscene-importing-and-optimizing-the-scene",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/52-portalscene-adding-details-to-the-scene/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/52-portalscene-adding-details-to-the-scene`, 
          label: "52-portalscene-adding-details-to-the-scene",
          target: "_preview"
        },
      ]
    },
    {
      heading:'07 React Three Fiber',
      links:[
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/54-react-three-fiber-first-react-application-final/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/54-react-three-fiber-first-react-application-final`, 
          label: "54-react-three-fiber-first-react-application-final",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/55-react-three-fiber-first-r3f-application-final/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/55-react-three-fiber-first-r3f-application-final`, 
          label: "55-react-three-fiber-first-r3f-application-final",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/56-react-three-fiber-drei-final/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/56-react-three-fiber-drei-final`, 
          label: "56-react-three-fiber-drei-final",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/57-react-three-fiber-debug/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/57-react-three-fiber-debug`, 
          label: "57-react-three-fiber-debug",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/58-react-three-fiber-environment-and-staging/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/58-react-three-fiber-environment-and-staging`, 
          label: "58-react-three-fiber-environment-and-staging",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/59-react-three-fiber-load-models/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/59-react-three-fiber-load-models`, 
          label: "59-react-three-fiber-load-models",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/60-react-three-fiber-3d-text/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/60-react-three-fiber-3d-text`, 
          label: "60-react-three-fiber-3d-text",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/61-react-three-fiber-portal/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/61-react-three-fiber-portal`, 
          label: "61-react-three-fiber-portal",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/62-react-three-fiber-mouse-events/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/62-react-three-fiber-mouse-events`, 
          label: "62-react-three-fiber-mouse-events",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/63-react-three-fiber-post-processing/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/63-react-three-fiber-post-processing`, 
          label: "63-react-three-fiber-post-processing",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/64-react-three-fiber-fun-simple-portfolio/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/64-react-three-fiber-fun-simple-portfolio`, 
          label: "64-react-three-fiber-fun-simple-portfolio",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/65-react-three-fiber-physics/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/65-react-three-fiber-physics`, 
          label: "65-react-three-fiber-physics",
          target: "_preview"
        },
        {
          previewurl: `${import.meta.env.VITE_BASE_URL}/66-react-three-fiber-create-a-game/index.html`,
          notesurl:`${import.meta.env.VITE_GITHUB_FULL_PATHPREFIX}/66-react-three-fiber-create-a-game`, 
          label: "66-react-three-fiber-create-a-game",
          target: "_preview"
        }
      ]
    }
    
  ];

  return (
    <>
      <div>Threejs journey</div>
      {
        sections.map(({heading, links}, index)=>{
          return (
          <div key={index}>
            <h2>
              {heading}
            </h2>
            <ul>
              {
                links.map( ({previewurl, notesurl, label, target}, index) => (
                    <li key={index}>
                      {label} 
                      {
                        notesurl ? <span> <a href={notesurl} target={target}>(notes)</a></span> : null
                      }
                      {
                        previewurl ? <span> <a href={previewurl} target={target}>(preview)</a></span> : null
                      }
                    </li>
                  )
                )
              }
            </ul>
          </div>
        );
        })
      }
    </>
  )
}

export default App
