import * as THREE from "three";
import { extend } from "react-three-fiber";

export default class Image extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        texture: { type: "t", value: undefined } as any,
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D texture;
        void main() {
          vec2 uv = vUv;
          vec4 texture = texture2D(texture, uv);
          gl_FragColor = texture;
        }`,
    });
  }

  get texture() {
    return this.uniforms.texture.value;
  }
  set texture(v) {
    this.uniforms.texture.value = v;
  }
}

// register element in r3f (<image />)
extend({ Image });
