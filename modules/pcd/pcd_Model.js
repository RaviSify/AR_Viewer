import * as THREE from 'three';
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader';

// PCD Model
export default function GetPCDModelAsync(url) 
{
  return new Promise((resolve, reject) => 
  {
    console.log(url);
    const loader = new PCDLoader();
    loader.load(url, function (object) 
    {
      resolve(object);
    });
  });
}
