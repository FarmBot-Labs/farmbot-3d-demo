import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import ThreeMeshUI from 'three-mesh-ui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Set up and attach to DOM
const controlsPopup = document.getElementById( 'controls-popup' );
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf4f4f4);

const camera = new THREE.PerspectiveCamera( 40, controlsPopup.clientWidth / controlsPopup.clientHeight, 0.1, 1000 );
camera.position.set( 0, -100, 170 );
camera.lookAt( 0, 0, 0 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( controlsPopup.clientWidth, controlsPopup.clientHeight )
renderer.setPixelRatio(window.devicePixelRatio);
controlsPopup.appendChild( renderer.domElement );

// Electronics box
const loader = new GLTFLoader();

loader.load( '/electronics-box.gltf', function ( gltf ) {
  const electronicsBox = gltf.scene;
  electronicsBox.scale.set( 1000, 1000, 1000 );
  electronicsBox.rotation.z = Math.PI / 2;
  electronicsBox.position.set( 0, 50, -130 );
  scene.add(electronicsBox);
  }
);

// Button bases (should be integrated into electronics box model for better performance)
loader.load( '/push-button.gltf', function ( gltf ) {
  const buttonBase = gltf.scene;
  buttonBase.scale.set( 1000, 1000, 1000 );
  buttonBase.rotation.z = Math.PI / 2;

  // E-Stop
  buttonBase.position.set( 60, 20, 0 );
  scene.add(buttonBase);

  // Unlock
  const button2 = buttonBase.clone();
  button2.position.set(30, 20, 0);
  scene.add(button2);

  // Button 3
  const button3 = buttonBase.clone();
  button3.position.set(0, 20, 0);
  scene.add(button3);

  // Button 4
  const button4 = buttonBase.clone();
  button4.position.set(-30, 20, 0);
  scene.add(button4);

  // Button 5
  const button5 = buttonBase.clone();
  button5.position.set(-60, 20, 0);
  scene.add(button5);
});

// Button buttons
const buttonButton1Geometry = new THREE.CylinderGeometry( 6.75, 6.75, 3 );
const buttonButton1Material = new THREE.MeshStandardMaterial( { color: 0xd4d4d4 } );
const buttonButton1 = new THREE.Mesh( buttonButton1Geometry, buttonButton1Material );
buttonButton1.position.set(60, 20, 1.1);
buttonButton1.rotateX( Math.PI / 2 );

const buttonButton2 = buttonButton1.clone();
buttonButton2.position.set(30, 20, 1.1);
scene.add(buttonButton2);

// E-stop Button color
const buttonColor1Geometry = new THREE.CylinderGeometry( 9, 9, 3 );
const buttonColor1Material = new THREE.MeshStandardMaterial( { color: 0xef6666 } );
const buttonColor1 = new THREE.Mesh( buttonColor1Geometry, buttonColor1Material );
buttonColor1.position.set(60, 20, 1);
buttonColor1.rotateX( Math.PI / 2 );

// Unlock Button color
let offColor = new THREE.Color(0xffdd66);
let onColor = new THREE.Color(0xffff00);
const buttonColor2Geometry = new THREE.CylinderGeometry( 9, 9, 3 );
const buttonColor2Material = new THREE.MeshStandardMaterial( { color: offColor } );
const buttonColor2 = new THREE.Mesh( buttonColor2Geometry, buttonColor2Material );
buttonColor2.position.set(30, 20, 1);
buttonColor2.rotateX( Math.PI / 2 );

let isOffColor = true;
setInterval(function() {
    if (isOffColor) {
      buttonColor2.material.color.set(onColor);
    } else {
      buttonColor2.material.color.set(offColor);
    }
    isOffColor = !isOffColor;
}, 1000); // change colors every 1 second

// Button labels
const buttonLabel1 = new ThreeMeshUI.Block({
  width: 20,
  height: 8,
  padding: 1,
  borderRadius: 2,
  justifyContent: 'center',
  textAlign: 'center',
  fontFamily: '/Roboto-msdf.json',
  fontTexture: '/Roboto-msdf.png',
  fontColor: new THREE.Color(0xf4f4f4),
  backgroundOpacity: 0.75,
 });
const buttonLabel1Text = new ThreeMeshUI.Text({
  content: 'E-Stop',
  fontSize: 4
});
buttonLabel1.add( buttonLabel1Text );
buttonLabel1.position.set( 60, 35, 10 );
buttonLabel1.rotateX( Math.PI / 6 );

const buttonLabel2 = new ThreeMeshUI.Block({
  width: 20,
  height: 8,
  padding: 1,
  borderRadius: 2,
  justifyContent: 'center',
  textAlign: 'center',
  fontFamily: '/Roboto-msdf.json',
  fontTexture: '/Roboto-msdf.png',
  fontColor: new THREE.Color(0xf4f4f4),
  backgroundOpacity: 0.75,
 });
const buttonLabel2Text = new ThreeMeshUI.Text({
  content: 'Unlock',
  fontSize: 4
});
buttonLabel2.add( buttonLabel2Text );
buttonLabel2.position.set( 30, 35, 10 );
buttonLabel2.rotateX( Math.PI / 6 );

// Button group
var buttonGroup = new THREE.Group();
buttonGroup.add(buttonButton1);
buttonGroup.add(buttonButton2);
buttonGroup.add(buttonColor1);
buttonGroup.add(buttonColor2);
buttonGroup.add(buttonLabel1);
buttonGroup.add(buttonLabel2);
scene.add(buttonGroup);

// Lighting (to illuminate the CAD model)
var pointLight = new THREE.PointLight(0xFFFFFF, 1);
pointLight.position.set(0, 0, 200);
scene.add(pointLight);

var ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// Fog to limit the view distance
scene.fog = new THREE.Fog(0xf4f4f4, 225, 400);


// Render loop
function animate() {
	requestAnimationFrame( animate );
  ThreeMeshUI.update();
	renderer.render( scene, camera );
}

// Compatibility check
if ( WebGL.isWebGLAvailable() ) {
	animate();
} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );
}
