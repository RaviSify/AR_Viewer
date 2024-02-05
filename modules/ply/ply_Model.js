import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';

// PLY Model
export default function GetPLYModelAsync(url) 
{
    return new Promise((resolve, reject) => 
    {
        const loader = new PLYLoader();
        loader.load(url, function (geometry) 
        {
            geometry.computeVertexNormals();

            const material = new THREE.MeshStandardMaterial({ color: 0x009cff, flatShading: true });
            const mesh = new THREE.Mesh(geometry, material);


            //mesh.castShadow = true;
            //mesh.receiveShadow = true;

            const group = new THREE.Group();
            group.add(mesh);

            // You can also add other elements to the group if needed

            // Resolve the promise with the group containing the mesh
            resolve(group);
        });
    });
}




// PLY Model
// const loader = new PLYLoader();
// loader.load( './models/ply/box.ply', function ( geometry ) 
// {
// 	geometry.computeVertexNormals();

// 	const material = new THREE.MeshStandardMaterial( { color: 0x009cff, flatShading: true } );
// 	const mesh = new THREE.Mesh( geometry, material );

// 	mesh.position.y = - 0.2;
// 	mesh.position.z = 0.3;
// 	mesh.rotation.x = - Math.PI / 2;
// 	//mesh.scale.multiplyScalar( 0.001 );
// 	mesh.scale.multiplyScalar( 0.5 );

// 	mesh.castShadow = true;
// 	mesh.receiveShadow = true;

// 	scene.add( mesh );

// } );