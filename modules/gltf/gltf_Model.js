import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

// GLTF Model
export default function GetGLTFModelAsync(url) 
{
    return new Promise((resolve, reject) => 
    {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
        const gLTFloader = new GLTFLoader();

        gLTFloader.load(url, function (gltf) 
        {
            console.log('GLTF loaded successfully:', gltf);
            resolve(gltf.scene);
        },
        function (xhr) 
        {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) 
        {
            console.error('An error happened', error);
            reject(error);
        });
    });
}


//GLTF Model and GLB Model
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
// const gLTFloader = new GLTFLoader();
// gLTFloader.setDRACOLoader( dracoLoader );
// gLTFloader.load('models/gltf/DamagedHelmet.glb',function ( gltf ) 
// {
// 		scene.add( gltf.scene );
// 		// gltf.animations;
// 		// gltf.scene;
// 		// gltf.scenes;
// 		// gltf.cameras;
// 		// gltf.asset;
// },
// function ( xhr ) 
// {
// 	console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
// },
// function ( error ) 
// {
// 	console.log( 'An error happened' );
// });
