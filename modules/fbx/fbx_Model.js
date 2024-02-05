import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'


//FBX Model
export default function GetFBXModelAsync(url) 
{
	return new Promise((resolve, reject) => 
	{
		console.log(url);
		const loader = new FBXLoader();
		loader.load( url, function ( object )
		{
			resolve(object);
		} );
	});
}

// export function GetFBXModelAsync() 
// {
// 	return new Promise((resolve, reject) => 
// 	{
// 		console.log(url);
// 		const loader = new FBXLoader();
// 		loader.load( url, function ( object )
// 		{
// 			resolve(object);
// 		} );
// 	});
// }


//FBX Model At main.js
// const loader = new FBXLoader();
////loader.load( 'https://threejs.org/examples/models/fbx/Samba%20Dancing.fbx', function ( object ) 
// loader.load( 'models/fbx/eve_j_gonzales.fbx', function ( object ) 
// {
// 	mixer = new THREE.AnimationMixer( object );
// 	const action = mixer.clipAction( object.animations[ 0 ] );
// 	action.play();
// 	object.traverse( function ( child ) 
// 	{
// 		if ( child.isMesh ) 
// 		{
// 			child.castShadow = true;
// 			child.receiveShadow = true;
// 		}
// 	} );
// 	scene.add( object );
// } );