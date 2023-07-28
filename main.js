import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import WebGL from 'three/addons/capabilities/WebGL.js';
import ThreeMeshUI from 'three-mesh-ui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import GardenImage from "/image.jpeg";

// FarmBot dimensions
const xAxisLength = 2.8;
const yAxisLength = 1.3;
const bedHeight = 0.3;

// Set up and attach to DOM
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 0, 2.75 );
camera.lookAt( 0, 0, 0 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

// Ground
const groundGeometry = new THREE.PlaneGeometry(10, 10);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xf4f4f4 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.position.set(0, 0, -bedHeight);
ground.receiveShadow = true;
scene.add(ground);

// Raised bed
const bedGeometry = new THREE.BoxGeometry( xAxisLength + 0.1, yAxisLength + 0.1, bedHeight );
const bedMaterial = new THREE.MeshStandardMaterial( { color: 0xc39f7a } );
const bed = new THREE.Mesh( bedGeometry, bedMaterial );
bed.position.set(0, 0, -bedHeight / 2);
bed.castShadow = true;
bed.receiveShadow = true;
scene.add( bed );

// Soil
const soilGeometry = new THREE.BoxGeometry( xAxisLength, yAxisLength, bedHeight + 0.01 );
const soilMaterial = new THREE.MeshStandardMaterial( { color: 0x8e5e31 } );
const soil = new THREE.Mesh( soilGeometry, soilMaterial );
soil.position.set(0, 0, -bedHeight / 2);
soil.receiveShadow = true;
soil.castShadow = true;
scene.add( soil );

// Plants
const plantMaterial = new THREE.MeshStandardMaterial({ color: 0x66aa44, opacity: 0.8, transparent: true });

for (let i = 0; i < 150; i++) {
    // Create plant geometry with random diameter between 0.03 and 0.1
    const plantGeometry = new THREE.SphereGeometry(Math.random() * (0.1 - 0.03) + 0.03);

    // Create plant
    const plant = new THREE.Mesh(plantGeometry, plantMaterial);

    // Set random position in bed
    plant.position.x = Math.random() * xAxisLength - xAxisLength / 2;
    plant.position.y = Math.random() * yAxisLength - yAxisLength / 2;
    plant.position.z = 0;

    // Add plant to scene
    plant.castShadow = true;
    plant.receiveShadow = true;
    scene.add(plant);
}

// Weeds
const weedMaterial = new THREE.MeshStandardMaterial({ color: 0xee6666, opacity: 0.8, transparent: true });

for (let i = 0; i < 150; i++) {
    // Create weed geometry with random diameter between 0.01 and 0.05
    const weedGeometry = new THREE.SphereGeometry(Math.random() * (0.05 - 0.01) + 0.01);

    // Create weed
    const weed = new THREE.Mesh(weedGeometry, weedMaterial);

    // Set random position in bed
    weed.position.x = Math.random() * xAxisLength - xAxisLength / 2;
    weed.position.y = Math.random() * yAxisLength - yAxisLength / 2;
    weed.position.z = 0;

    // Add weed to scene
    weed.castShadow = true;
    weed.receiveShadow = true;
    scene.add(weed);
}

// Grid lines
function createGrid() {
  let material = new THREE.LineBasicMaterial({ color: 0x434343 });
  let grid = new THREE.Group();

  // X-axis lines
  for (let i = -yAxisLength / 2; i <= yAxisLength / 2; i += 0.1) {
      let hPoints = [];
      hPoints.push( new THREE.Vector3(-xAxisLength / 2, i, 0.01), new THREE.Vector3(xAxisLength / 2, i, 0.01));
      let hGeometry = new THREE.BufferGeometry().setFromPoints( hPoints );
      let hLine = new THREE.Line(hGeometry, material);
      grid.add(hLine);

      // Add labels
      const gridLabel = new ThreeMeshUI.Block({
        width: 0.08,
        height: 0.04,
        padding: 0.01,
        borderRadius: 0.01,
        justifyContent: 'center',
        textAlign: 'center',
        fontFamily: '/Roboto-msdf.json',
        fontTexture: '/Roboto-msdf.png',
        fontColor: new THREE.Color(0xf4f4f4),
        backgroundOpacity: 0.5,
       });
      const gridLabelText = new ThreeMeshUI.Text({
        content: (i * 1000).toFixed(0),
        fontSize: 0.02
      });
      gridLabel.add( gridLabelText );
      gridLabel.position.set( -xAxisLength/2 - .05, i, 0.02 );
      scene.add( gridLabel );
  }

  // Y-axis lines
  for (let i = -xAxisLength / 2; i <= xAxisLength / 2; i += 0.1) {
      let vPoints = [];
      vPoints.push( new THREE.Vector3(i, -yAxisLength / 2, 0.01), new THREE.Vector3(i, yAxisLength / 2, 0.01));
      let vGeometry = new THREE.BufferGeometry().setFromPoints( vPoints );
      let vLine = new THREE.Line(vGeometry, material);
      grid.add(vLine);

      // Add labels
      const gridLabel = new ThreeMeshUI.Block({
        width: 0.08,
        height: 0.04,
        padding: 0.01,
        borderRadius: 0.01,
        justifyContent: 'center',
        textAlign: 'center',
        fontFamily: '/Roboto-msdf.json',
        fontTexture: '/Roboto-msdf.png',
        fontColor: new THREE.Color(0xf4f4f4),
        backgroundOpacity: 0.5,
       });
      const gridLabelText = new ThreeMeshUI.Text({
        content: (i * 1000).toFixed(0),
        fontSize: 0.02
      });
      gridLabel.add( gridLabelText );
      gridLabel.position.set( i, -yAxisLength/2 - .05, 0.02 );
      scene.add( gridLabel );
  }

  scene.add(grid);
}

// Add text using https://felixmariotto.github.io/three-mesh-ui/
const textContainer = new ThreeMeshUI.Block({
	width: 1.2,
	height: 0.3,
	padding: 0.08,
  borderRadius: 0.025,
	justifyContent: 'center',
	textAlign: 'center',
  fontFamily: '/Roboto-msdf.json',
  fontTexture: '/Roboto-msdf.png',
  fontColor: new THREE.Color(0xf4f4f4),
  backgroundOpacity: 0.5,
 });

const text = new ThreeMeshUI.Text({
  content: "FarmBot 3D Demo (click to toggle)",
  fontSize: 0.1
});

textContainer.add( text );
textContainer.position.set( 0, -yAxisLength/1.8, 0.2 );
textContainer.rotation.x = Math.PI / 8;

scene.add( textContainer );

// Add photo using https://felixmariotto.github.io/three-mesh-ui/
const photoContainer = new ThreeMeshUI.Block({
  height: 0.8,
  width: 0.6,
});
new THREE.TextureLoader().load(GardenImage, (texture) => {
  photoContainer.set({
    backgroundTexture: texture,
  });
});
photoContainer.position.set( 0, 0, 0.02 );
scene.add( photoContainer );

// FarmBot CAD
let gantryColumnLeft, gantryColumnRight, gantryMainBeam;
let farmBotLayer = new THREE.Group();

const loader = new GLTFLoader();

loader.load( '/gantry-column-left.gltf', function ( gltf ) {
  gltf.scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
    }
  });

  gantryColumnLeft = gltf.scene;
  gantryColumnLeft.rotation.z = Math.PI / 2;
  gantryColumnLeft.position.set( -1.2, -yAxisLength / 2 - 0.05, 0.06 );
  gantryColumnLeft.castShadow = true;
  farmBotLayer.add(gantryColumnLeft);
  scene.add(farmBotLayer);
});

loader.load( '/gantry-column-right.gltf', function ( gltf ) {
  gltf.scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
    }
  });

  gantryColumnRight = gltf.scene;
  gantryColumnRight.rotation.z = Math.PI / 2;
  gantryColumnRight.position.set( -1.2, yAxisLength / 2 + 0.05, 0.06 );
  gantryColumnRight.castShadow = true;
  farmBotLayer.add(gantryColumnRight);
  scene.add(farmBotLayer);
});

loader.load( '/gantry-main-beam.gltf', function ( gltf ) {
  gltf.scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
    }
  });

  gantryMainBeam = gltf.scene;
  gantryMainBeam.rotation.z = Math.PI / 2;
  gantryMainBeam.position.set( -1.1775, -0.75, 0.62 );
  gantryMainBeam.castShadow = true;
  farmBotLayer.add(gantryMainBeam);
  scene.add(farmBotLayer);
});

function toggleFarmBotLayer() {
  console.log("toggleFarmBotLayer");
  if (farmBotLayer.visible) {
    farmBotLayer.visible = false;
  } else {
    farmBotLayer.visible = true;
  }
}



// Lighting (to illuminate the CAD model)
var pointLight = new THREE.PointLight(0xFFFFFF, 1.25);
pointLight.position.set(-4, 3, 4);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1500;
pointLight.shadow.mapSize.height = 1500;
pointLight.shadow.camera.near = 0.5;
pointLight.shadow.camera.far = 10;
scene.add(pointLight);

var ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

// LED strip using spotlights
// function createLEDStrip(start, end, numPoints, color, intensity) {
//   var points = [];
//
//   // Create points along the line
//   for (var i = 0; i < numPoints; i++) {
//       var x = start.x + (end.x - start.x) * (i / (numPoints - 1));
//       var y = start.y + (end.y - start.y) * (i / (numPoints - 1));
//       var z = start.z + (end.z - start.z) * (i / (numPoints - 1));
//
//       // Create a spotlight at each point
//       var spotLight = new THREE.SpotLight(color, intensity);
//       spotLight.position.set(x, y, z);
//
//       // Point the light downwards
//       spotLight.target.position.set(x, y, z - 1);
//       scene.add(spotLight.target);
//
//       // Add the light to the scene
//       scene.add(spotLight);
//   };
// }
//
// var start = new THREE.Vector3(-1.1775, -0.7, 0.62);
// var end = new THREE.Vector3(-1.1775, 0.7, 0.62);
// createLEDStrip(start, end, 5, 0xffffee, 0.25);

// LED strip using rect area light
const rectLight = new THREE.RectAreaLight( 0xffffee, 100, .02, 1.5 );
rectLight.position.set( -1.1775, 0, 0.56 );
rectLight.lookAt( -1.1775, 0, 0 );
scene.add( rectLight )

// Mouse raycasting
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let rect;
function updateRect() {
    rect = renderer.domElement.getBoundingClientRect();
}
window.addEventListener('resize', updateRect);
updateRect();

// Button hover effects
window.addEventListener( 'mousemove', onMouseMove, false );

function onMouseMove( event ) {

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera( mouse, camera );

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects( [textContainer] );

  if ( intersects.length > 0 ) {
    // Change the cursor to a pointer
    renderer.domElement.style.cursor = 'pointer';
    // change the background color of the text container
    textContainer.set({ backgroundOpacity: 0.8 });
  } else {
    // restore background opacity
    textContainer.set({ backgroundOpacity: 0.5 });
    // Change the cursor back to default
    renderer.domElement.style.cursor = 'default';
  }
}

// Button click action
window.addEventListener( 'click', onClick, false );

function onClick( event ) {

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera( mouse, camera );

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects( [textContainer] );

  if ( intersects.length > 0 ) {
    toggleFarmBotLayer()
  }
}

// Render loop
function animate() {
	requestAnimationFrame( animate );
  ThreeMeshUI.update();

  // Pan camera back
  // camera.position.y -= 0.005;

  // Move "sun"
  pointLight.position.x += 0.05;

  controls.update();

  // update ThreeMeshUI components
  textContainer.updateMatrixWorld();
  text.updateMatrixWorld();

	renderer.render( scene, camera );
}

// Compatibility check
if ( WebGL.isWebGLAvailable() ) {
  createGrid();
	animate();
} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );
}
