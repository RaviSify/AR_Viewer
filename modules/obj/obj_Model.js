import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

// OBJ Model
export default function GetOBJModelAsync(url, mapTexture, normalMapTexture)
 {
  return new Promise((resolve, reject) => 
  {
    const loader = new OBJLoader();
    loader.load(url, (object) => 
    {
      if (object instanceof THREE.Group) 
      {
        object.traverse((child) => 
        {
          if (child instanceof THREE.Mesh) 
          {
            child.material.map = mapTexture;
            if (child.material instanceof THREE.MeshStandardMaterial) 
            {
              child.material.normalMap = normalMapTexture;
              child.material.normalScale.set(1, 1);
            }
          }
        });
        resolve(object);
      } 
      else 
      {
        reject(new Error('Loaded object is not an instance of THREE.Group.'));
      }
    }, undefined, (error) => 
    {
      reject(error);
    });
  });
}