//-- Imports -------------------------------------------------------------------------------------
import * as THREE from '../build/three.module.js';
import { VRButton } from '../build/jsm/webxr/VRButton.js';
import { onWindowResize,
    degreesToRadians,
    createGroundPlane,
    getMaxSize} from "../libs/util/util.js";
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js'

//-- Global variables
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
var mixer = new Array();
var clock = new THREE.Clock();
var camera;

init();
createScene();
animate();

function init()
{
    //-- Setting renderer ---------------------------------------------------------------------------
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.xr.enabled = true;
	renderer.xr.setReferenceSpaceType( 'local' );

    //-- Append renderer and create VR button -------------------------------------------------------
    document.body.appendChild( renderer.domElement );
    document.body.appendChild( VRButton.createButton( renderer ) );
    window.addEventListener( 'resize', onWindowResize );

    //-- Setting scene and camera -------------------------------------------------------------------
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const cameraHolder = new THREE.Object3D();
	cameraHolder.position.set(0.0, 2, 0);
    cameraHolder.rotateY(degreesToRadians(180));
	cameraHolder.add (camera);
scene.add( cameraHolder );
}

function createSky()
{
    //-- Creating equirectangular Panomara ----------------------------------------------------------
    const geometry = new THREE.SphereGeometry( 1000, 60, 60 );
    geometry.scale( - 1, 1, 1 ); // invert the geometry on the x-axis (faces will point inward)
    const texture = new THREE.TextureLoader().load( './assets/sky/2k_stars_milky_way.jpg' );
    const material = new THREE.MeshBasicMaterial( { map: texture } )
    const mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
}

function createExternalObject()
{
    // Load GLTF windmill
    var modelPath = './assets/models/gltfs/x-wing/';
    var modelName = 'scene.gltf';
    var loader = new GLTFLoader( );
    loader.load( modelPath + modelName, function ( gltf ) {
    var obj = gltf.scene;
        obj.traverse( function ( child ) {
            if ( child ) { child.castShadow = true; }
        });
        obj = normalizeAndRescale(obj, 8);
        obj.translateY(1.5);
        // obj.rotateY(degreesToRadians(-90));
        obj.position

    scene.add ( obj );

    // Create animationMixer and push it in the array of mixers
    var mixerLocal = new THREE.AnimationMixer(obj);
    mixerLocal.clipAction( gltf.animations[0] ).play();
    mixer.push(mixerLocal);
    return obj;
    }, null, null);
}


function createSphere()
{
    var textureLoader = new THREE.TextureLoader();
    var deathStar 	= textureLoader.load('./assets/textures/death_star_00.jpg');
    
    // create the sphere
    const sphereGeometry = new THREE.SphereGeometry( 2, 32, 32);
    const sphereMaterial  = new THREE.MeshPhongMaterial({color:"rgb(255,255,255)", shininess:"100"});
    const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
    
    // position the sphere
    sphere.position.set(0.0, 6.0, 16.0);

    // MATERIAL PROPERTIES
    sphereMaterial.side = THREE.DoubleSide;

    // Apply texture
    var wrapModeS  = THREE.RepeatWrapping;
    var wrapModeT  = THREE.RepeatWrapping;
    var minFilter = THREE.LinearFilter;
    var magFilter = THREE.LinearFilter;

    sphere.material.map = deathStar;
    sphere.material.map.repeat.set(8,8);
    sphere.material.map.wrapS = wrapModeS;
    sphere.material.map.wrapT = wrapModeT;
    sphere.material.map.minFilter = minFilter;
    sphere.material.map.magFilter = magFilter;	

    // add the sphere to the scene
    scene.add( sphere );
}

function createGround()
{
    var textureLoader = new THREE.TextureLoader();
    var floor 	= textureLoader.load('../assets/textures/sand.jpg');
    // Create Ground Plane
	var groundPlane = createGroundPlane(60.0, 60.0, 100, 100, "rgb(200,200,150)");
    groundPlane.rotateX(degreesToRadians(-90));
    groundPlane.material.map = floor;		
    groundPlane.material.map.wrapS = THREE.RepeatWrapping;
    groundPlane.material.map.wrapT = THREE.RepeatWrapping;
    groundPlane.material.map.repeat.set(8,8);	

    scene.add(groundPlane);
}

function sceneLight()
{
    const light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );

    // White directional light at half intensity shining from the top.
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    scene.add( directionalLight );
}

// Normalize scale and multiple by the newScale
function normalizeAndRescale(obj, newScale)
{
  var scale = getMaxSize(obj); // Available in 'utils.js'
  obj.scale.set(newScale * (1.0/scale),
                newScale * (1.0/scale),
                newScale * (1.0/scale));
  return obj;
}

function animate() {
	renderer.setAnimationLoop( render );
}

function createScene()
{
    createSky();
    createGround();
    sceneLight();
    createExternalObject();
    createSphere();
}

function render()
{
    var delta = clock.getDelta(); 
    for(var i = 0; i<mixer.length; i++) mixer[i].update( delta );
	renderer.render( scene, camera );
}

