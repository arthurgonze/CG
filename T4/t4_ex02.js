//-- IMPORTS ------------------------------------------------------------------------------------------------
import * as THREE from '../build/three.module.js';
import { VRButton } from '../build/jsm/webxr/VRButton.js';
import { onWindowResize,
    degreesToRadians,
    createGroundPlane,
    getMaxSize} from "../libs/util/util.js";
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js'

//-- GLOBAL VARIABLES ------------------------------------------------------------------------------------------------
// core
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ antialias: true });

// animations
var mixer = new Array();      
var clock = new THREE.Clock();

// text font
const fontLoader = new THREE.FontLoader();
let fontGeometry = null;

// view and interactions
let raycaster = new THREE.Raycaster();	// Raycaster to enable selection and dragging
var camera;
let controller1 = renderer.xr.getController( 0 ); // get the input from controller

// objects
const intersected = [];	// will be used to help controlling the intersected objects
var objectsArray = [];


//-- PROGRAM LOOP ------------------------------------------------------------------------------------------------
init();
createScene();
animate();


function init()
{
    //-- Setting renderer ---------------------------------------------------------------------------
	renderer.setClearColor(new THREE.Color("rgb(70, 150, 240)"));
    renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
    // renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
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
    // cameraHolder.rotateY(degreesToRadians(180));
	cameraHolder.add (camera);
    scene.add( cameraHolder );

    // controllers
    controller1.addEventListener( 'selectstart', onSelectStart );
    controller1.addEventListener( 'selectend', onSelectEnd );
    scene.add( controller1 );

    // VR Camera Rectile 
    var ringGeo = new THREE.RingGeometry( .04, .08, 32 );
    var ringMat = new THREE.MeshBasicMaterial( {
        color:"rgb(255,255,0)", 
        opacity: 0.9, 
        transparent: true } );
    var rectile = new THREE.Mesh( ringGeo, ringMat );
        rectile.position.set(0, 0, -2.5);
        camera.add( rectile );
}

//-- CREATE FUNCTIONS ------------------------------------------------------------------------------------------------
function createScene()
{
    createSceneLight();
    createShop();
    createShelf();
    createShelfItems();
    // createSky();
    // createSphere();
    // createBox();
    // scene.add( group );
}

function importGLTF(modelPath, modelName, initialPosition, initialRotation, initialScale, group, index, info)
{
    var loader = new GLTFLoader( );
    loader.load( modelPath + modelName, function ( gltf ) {
        var obj = gltf.scene;

        obj.traverse( function ( child ) {
            if ( child ) { 
                child.castShadow = true; 
                child.receiveShadow = true;
            }
            if ( child.isMesh ) { 
                child.name = info; 
            }
        });

        obj = normalizeAndRescale(obj, initialScale);
        obj.translateX(initialPosition.x);
        obj.translateY(initialPosition.y);
        obj.translateZ(initialPosition.z);
        obj.rotateX(degreesToRadians(initialRotation.x));
        obj.rotateY(degreesToRadians(initialRotation.y));
        obj.rotateZ(degreesToRadians(initialRotation.z));

        if(group)
        {
            group.name = modelName;
            group.add(obj);
            // console.log(group);
            // console.log(objectsArray[index]);
            objectsArray[index].children[0].add( group );
            scene.add(group);
        }else
        {
            scene.add(obj);
        }
        
        // return obj;
    }, null, null);
}

function createShelf()
{
    // let object0 = new THREE.Group();
    // scene.add(object0);
    // objectsArray.push(object1);

    var path = "./assets/models/gltfs/store_shelf/"
    var name = "scene.gltf"
    var scale = 8;
    var pos = new THREE.Vector3(3,0,-4);
    var rotation = new THREE.Vector3(0,90,0);
    importGLTF(path, name, pos, rotation, scale, null, 0);
}

function createShelfItems()
{
    let object1 = new THREE.Group();
    scene.add(object1);
    objectsArray.push(object1);
    let gltfGroup1 = new THREE.Group();
	object1.add(gltfGroup1);
    var path = "./assets/models/gltfs/"
    var name = "feed_me_vegan_curry/scene.gltf"
    var scale = 0.6;
    var pos = new THREE.Vector3(-3, 1.75, -3.5);
    var rotation = new THREE.Vector3(0,0,0);
    var info1 = "Curry Vegano, Preco: 10,99R$, Validade: 29/07/21";
    importGLTF(path, name, pos, rotation, scale, object1, 0, info1);

    let object2 = new THREE.Group();
    scene.add(object2);
    objectsArray.push(object2);
    let gltfGroup2 = new THREE.Group();
	object1.add(gltfGroup2);
    var path = "./assets/models/gltfs/"
    var name = "juice/scene.gltf"
    var scale = 0.4;
    var pos = new THREE.Vector3(-1, 1.45, -3.5);
    var rotation = new THREE.Vector3(0,0,0);
    var info2 = "Suco de Laranja Tropicana, Preco: 4,99R$, Validade: 28/07/21";
    importGLTF(path, name, pos, rotation, scale, object2, 1, info2);

    let object3 = new THREE.Group();
    scene.add(object3);
    objectsArray.push(object3);
    let gltfGroup3 = new THREE.Group();
	object1.add(gltfGroup3);
    var path = "./assets/models/gltfs/"
    var name = "kelloggs_cereal/scene.gltf"
    var scale = 0.5;
    var pos = new THREE.Vector3(1, 1.75, -3.5);
    var rotation = new THREE.Vector3(0,0,0);
    var info3 = "Sucrilhos Kellogs, Preco: 12,99R$, Validade: 27/07/21";
    importGLTF(path, name, pos, rotation, scale, object3, 2, info3);

    let object4 = new THREE.Group();
    scene.add(object4);
    objectsArray.push(object4);
    let gltfGroup4 = new THREE.Group();
	object1.add(gltfGroup4);
    var path = "./assets/models/gltfs/"
    var name = "kirbys_star_clusters_cereal_box/scene.gltf"
    var scale = 0.5;
    var pos = new THREE.Vector3(3, 1.2, -3.5);
    var rotation = new THREE.Vector3(0,0,0);
    var info4 = "Cereal Kirbys, Preco: 15,99R$, Validade: 26/07/21";
    importGLTF(path, name, pos, rotation, scale, object4, 3, info4);

    let object5 = new THREE.Group();
    scene.add(object5);
    objectsArray.push(object5);
    let gltfGroup5 = new THREE.Group();
	object1.add(gltfGroup5);
    var path = "./assets/models/gltfs/"
    var name = "lays_chips/scene.gltf"
    var scale = 0.5;
    var pos = new THREE.Vector3(-3, 0.8, -3.75);
    var rotation = new THREE.Vector3(60,0,0);
    var info5 = "";
    importGLTF(path, name, pos, rotation, scale, object5, 4, info5);

    let object6 = new THREE.Group();
    scene.add(object6);
    objectsArray.push(object6);
    let gltfGroup6 = new THREE.Group();
	object1.add(gltfGroup6);
    var path = "./assets/models/gltfs/"
    var name = "orange_juice_bottle/scene.gltf"
    var scale = 0.5;
    var pos = new THREE.Vector3(1, 0.9, -3.5);
    var rotation = new THREE.Vector3(0,0,0);
    var info6 = "Suco de Laranja Arno, Preco: 7,99R$, Validade: 30/07/21";
    importGLTF(path, name, pos, rotation, scale, object6, 5, info6);

    let object7 = new THREE.Group();
    scene.add(object7);
    objectsArray.push(object7);
    let gltfGroup7 = new THREE.Group();
	object1.add(gltfGroup7);
    var path = "./assets/models/gltfs/"
    var name = "rice_a_roni_long_grain_rice_box/scene.gltf"
    var scale = 0.4;
    var pos = new THREE.Vector3(-1, 0.1, -3.5);
    var rotation = new THREE.Vector3(0,0,0);
    var info7 = "Arroz Roni, Preco: 9,99R$, Validade: 31/07/21";
    importGLTF(path, name, pos, rotation, scale, object7, 6, info7);

    // console.log("Objects Array: ");
    // console.log(objectsArray);
}


function createShop()
{
    var textureLoader = new THREE.TextureLoader();
    var floor 	= textureLoader.load('./assets/textures/floor-wood.jpg');
    var wall 	= textureLoader.load('./assets/textures/stone.jpg');
    var roof 	= textureLoader.load('./assets/textures/granite.png');
    // Create Ground Plane
	var groundPlane = createGroundPlane(60.0, 60.0, 100, 100, "rgb(255,255,255)");
    groundPlane.rotateX(degreesToRadians(-90));
    groundPlane.material.map = floor;		
    groundPlane.material.map.wrapS = THREE.RepeatWrapping;
    groundPlane.material.map.wrapT = THREE.RepeatWrapping;
    groundPlane.material.map.repeat.set(8,8);	
    scene.add(groundPlane);

    // Create Roof Plane
    var roofPlane = createGroundPlane(60.0, 60.0, 100, 100, "rgb(255,255,255)");
    roofPlane.translateY(8)
    roofPlane.rotateX(degreesToRadians(90));
    roofPlane.material.map = roof;		
    roofPlane.material.map.wrapS = THREE.RepeatWrapping;
    roofPlane.material.map.wrapT = THREE.RepeatWrapping;
    roofPlane.material.map.repeat.set(8,8);	
    scene.add(roofPlane);

    // Create Walls
    // left
    var leftWallPlane = createGroundPlane(60.0, 60.0, 100, 100, "rgb(255,255,255)");
    leftWallPlane.translateY(4)
    leftWallPlane.translateX(-8)
    leftWallPlane.rotateY(degreesToRadians(90));
    leftWallPlane.material.map = wall;		
    leftWallPlane.material.map.wrapS = THREE.RepeatWrapping;
    leftWallPlane.material.map.wrapT = THREE.RepeatWrapping;
    leftWallPlane.material.map.repeat.set(16,16);	
    scene.add(leftWallPlane);
    // back
    var backWallPlane = createGroundPlane(60.0, 60.0, 100, 100, "rgb(255,255,255)");
    backWallPlane.translateY(4)
    backWallPlane.translateZ(-16)
    backWallPlane.material.map = wall;		
    backWallPlane.material.map.wrapS = THREE.RepeatWrapping;
    backWallPlane.material.map.wrapT = THREE.RepeatWrapping;
    backWallPlane.material.map.repeat.set(16,16);	
    scene.add(backWallPlane);
    // right
    var leftWallPlane = createGroundPlane(60.0, 60.0, 100, 100, "rgb(255,255,255)");
    leftWallPlane.translateY(4)
    leftWallPlane.translateX(8)
    leftWallPlane.rotateY(degreesToRadians(90));
    leftWallPlane.material.map = wall;		
    leftWallPlane.material.map.wrapS = THREE.RepeatWrapping;
    leftWallPlane.material.map.wrapT = THREE.RepeatWrapping;
    leftWallPlane.material.map.repeat.set(16,16);	
    scene.add(leftWallPlane);
    // front
    var frontWallPlane = createGroundPlane(60.0, 60.0, 100, 100, "rgb(255,255,255)");
    frontWallPlane.translateY(4)
    frontWallPlane.translateZ(16)
    frontWallPlane.material.map = wall;		
    frontWallPlane.material.map.wrapS = THREE.RepeatWrapping;
    frontWallPlane.material.map.wrapT = THREE.RepeatWrapping;
    frontWallPlane.material.map.repeat.set(16,16);	
    scene.add(frontWallPlane);
}

function createSceneLight()
{
    const light = new THREE.AmbientLight( 0x404040, 1); // soft white light
    scene.add( light );

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.25 );
    directionalLight.translateZ(8);
    // directionalLight.target = ;
    scene.add( directionalLight );
}

//-- UTILS ------------------------------------------------------------------------------------------------
// Normalize scale and multiple by the newScale
function normalizeAndRescale(obj, newScale)
{
  var scale = getMaxSize(obj); // Available in 'utils.js'
  obj.scale.set(newScale * (1.0/scale),
                newScale * (1.0/scale),
                newScale * (1.0/scale));
  return obj;
}

// Create and render the text in the VR environment
function changeFont(message)
{
	if(fontGeometry) scene.remove( fontGeometry );
	fontLoader.load( '../assets/fonts/helvetiker_regular.typeface.json', function ( font ) 
	{
		const matLite = new THREE.MeshBasicMaterial( { color: "rgb(0, 0, 255)" } );
		const shapes = font.generateShapes( message, 0.1 );

		const geometry = new THREE.ShapeGeometry( shapes );
		// Compute bounding box to help centralize the text
		geometry.computeBoundingBox();
		const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
		geometry.translate( xMid, 1, 0 );

		fontGeometry = new THREE.Mesh( geometry, matLite );
		fontGeometry.position.set(0, 0, - 2);
		scene.add( fontGeometry );
	} );	
}

//-- MAIN LOOP ------------------------------------------------------------------------------------------------
function animate() {
	renderer.setAnimationLoop( render );
}

function render()
{
    var delta = clock.getDelta(); 
    for(var i = 0; i<mixer.length; i++) mixer[i].update( delta );
    cleanIntersected();
	intersectObjects( controller1 );
	renderer.render( scene, camera );
}

//-- INTERSECTIONS ------------------------------------------------------------------------------------------------
function onSelectStart( event ) {
    console.log("SelectStart");
	const controller = event.target;
	const intersections = getIntersections( camera );

	if ( intersections.length > 0 ) {
		const intersection = intersections[ 0 ];
        console.log("Intersection: ");
        console.log(intersection);
		const object = intersection.object;
        console.log("Object: ");
        console.log(object);
		// object.material.emissive.b = 1;
		changeFont(object.name); // This function add text on a specific position in the VR environment
        controller.userData.selected = object;
		// camera.attach( object );
	}
}

function onSelectEnd( event ) {
	const controller = event.target;
	if ( controller.userData.selected !== undefined ) {
		const object = controller.userData.selected;
		// object.material.emissive.b = 0;
		// group.attach( object );
		controller.userData.selected = undefined;
		if(fontGeometry) 
		{
			// Deleting fontGeometry and removing from the scene
			fontGeometry.geometry.dispose();
			fontGeometry.material.dispose();
			scene.remove(fontGeometry);
		}
	}
}

function getIntersections( controller ) {
	const tempMatrix = new THREE.Matrix4();	
	tempMatrix.identity().extractRotation( controller.matrixWorld );
	raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
	raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( tempMatrix );
    var intersections = raycaster.intersectObjects( objectsArray, true);
    // console.log("Intersections: ");
    // console.log(intersections);
	return intersections;
}

function intersectObjects( controller ) {
	if ( controller.userData.selected !== undefined ) return;

	const intersections = getIntersections(camera);

	if ( intersections.length > 0 ) {
		const intersection = intersections[ 0 ];
		const object = intersection.object;
		// object.material.emissive.r = 1;
		intersected.push( object );
	} 
}

function cleanIntersected() {
	while ( intersected.length ) {
		const object = intersected.pop();
		// object.material.emissive.r = 0;
	}
}


