import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const ktx2Loader = new KTX2Loader();
ktx2Loader.setTranscoderPath('https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/libs/basis/');

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
dracoLoader.preload();
const originalLoad = GLTFLoader.prototype.load;
GLTFLoader.prototype.load = function(url, onLoad, onProgress, onError) {
  
  if (!this.ktx2Loader) {
    this.setKTX2Loader(ktx2Loader);
  }
  if (!this.dracoLoader) {
    this.setDRACOLoader(dracoLoader);
  }
  if (!this.meshoptDecoder) {
    this.setMeshoptDecoder(MeshoptDecoder);
  }
  return originalLoad.call(this, url, onLoad, onProgress, onError);
};
const originalParse = GLTFLoader.prototype.parse;
if (originalParse) {
  GLTFLoader.prototype.parse = function(data, path, onLoad, onError) {

    if (!this.ktx2Loader) {
      this.setKTX2Loader(ktx2Loader);
    }
    if (!this.dracoLoader) {
      this.setDRACOLoader(dracoLoader);
    }
    if (!this.meshoptDecoder) {
      this.setMeshoptDecoder(MeshoptDecoder);
    }
    return originalParse.call(this, data, path, onLoad, onError);
  };
}


const originalLoadAsync = GLTFLoader.prototype.loadAsync;
if (originalLoadAsync) {
  GLTFLoader.prototype.loadAsync = function(url, onProgress) {
    
    if (!this.ktx2Loader) {
      this.setKTX2Loader(ktx2Loader);
    }
    if (!this.dracoLoader) {
      this.setDRACOLoader(dracoLoader);
    }
    if (!this.meshoptDecoder) {
      this.setMeshoptDecoder(MeshoptDecoder);
    }
    return originalLoadAsync.call(this, url, onProgress);
  };
}
export { ktx2Loader, dracoLoader };

