import{Box3 as e,BufferGeometry as t,CanvasTexture as n,Color as r,ColorManagement as i,DataTexture as a,DepthStencilFormat as o,DepthTexture as s,DirectionalLight as c,Float32BufferAttribute as l,Group as u,HalfFloatType as d,MathUtils as f,Matrix4 as p,Mesh as m,MeshBasicMaterial as h,MeshNormalMaterial as g,NearestFilter as _,OrthographicCamera as v,PMREMGenerator as y,PerspectiveCamera as b,PlaneGeometry as x,PointLight as S,RGBAFormat as C,RawShaderMaterial as w,RepeatWrapping as T,SRGBColorSpace as E,Scene as D,ShaderMaterial as O,ShadowMaterial as k,Sphere as A,SphereGeometry as ee,Timer as te,UniformsUtils as j,UnsignedByteType as M,UnsignedInt248Type as N,Vector2 as P,Vector3 as F,WebGLRenderTarget as I,WebGLRenderer as ne}from"./three.module-DoJEsZyp.js";import{n as L}from"./app-DySsOzkN.js";import{A as R,d as z,o as B,w as V}from"./kit-PkuaroJP.js";var re={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},H=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},ie=new v(-1,1,1,-1,0,1),ae=new class extends t{constructor(){super(),this.setAttribute(`position`,new l([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new l([0,2,0,0,2,0],2))}},oe=class{constructor(e){this._mesh=new m(ae,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,ie)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},se=class extends H{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof O?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=j.clone(e.uniforms),this.material=new O({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new oe(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},ce=class extends H{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},le=class extends H{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},ue=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new P);this._width=n.width,this._height=n.height,t=new I(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:d}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new se(re),this.copyPass.material.blending=0,this.timer=new te}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}ce!==void 0&&(r instanceof ce?n=!0:r instanceof le&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new P);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},de=class extends H{constructor(e,t,n=null,i=null,a=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=a,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new r}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},U={name:`GTAOShader`,defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:`x`,SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new P},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new p},cameraProjectionMatrixInverse:{value:new p},cameraWorldMatrix:{value:new p},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new F(-1,-1,-1)},sceneBoxMax:{value:new F(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif

		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}

		void main() {
			float depth = getDepth(vUv.xy);

			#ifdef USE_REVERSED_DEPTH_BUFFER
				if (depth <= 0.0) {
					discard;
					return;
				}
			#else
				if (depth >= 1.0) {
					discard;
					return;
				}
			#endif
			
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {

				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w);
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				vec3 viewDir = normalize(-viewPos.xyz);
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));

				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));

				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},W={name:`GTAODepthShader`,defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},G={name:`GTAOBlendShader`,uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function fe(e=5){let t=Math.floor(e)%2==0?Math.floor(e)+1:Math.floor(e),n=pe(t),r=n.length,i=new Uint8Array(r*4);for(let e=0;e<r;++e){let t=n[e],a=2*Math.PI*t/r,o=new F(Math.cos(a),Math.sin(a),0).normalize();i[e*4]=(o.x*.5+.5)*255,i[e*4+1]=(o.y*.5+.5)*255,i[e*4+2]=127,i[e*4+3]=255}let o=new a(i,t,t);return o.wrapS=T,o.wrapT=T,o.needsUpdate=!0,o}function pe(e){let t=Math.floor(e)%2==0?Math.floor(e)+1:Math.floor(e),n=t*t,r=Array(n).fill(0),i=Math.floor(t/2),a=t-1;for(let e=1;e<=n;)i===-1&&a===t?(a=t-2,i=0):(a===t&&(a=0),i<0&&(i=t-1)),r[i*t+a]===0?(r[i*t+a]=e++,a++,i--):(a-=2,i++);return r}var K={name:`PoissonDenoiseShader`,defines:{SAMPLES:16,SAMPLE_VECTORS:me(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new P},cameraProjectionMatrixInverse:{value:new p},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;

		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
		#if DEPTH_VALUE_SOURCE == 1
			return textureLod(tDepth, uv.xy, 0.0).a;
		#else
			return textureLod(tDepth, uv.xy, 0.0).r;
		#endif
		}

		float fetchDepth(const ivec2 uv) {
			#if DEPTH_VALUE_SOURCE == 1
				return texelFetch(tDepth, uv.xy, 0).a;
			#else
				return texelFetch(tDepth, uv.xy, 0).r;
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);

			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;

			denoised += w * neighborColor;
			totalWeight += w;
		}

		void main() {
			float depth = getDepth(vUv.xy);
			vec3 viewNormal = getViewNormal(vUv);
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);

			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}

			if (totalWeight > 0.) {
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function me(e,t,n){let r=he(e,t,n),i=`vec3[SAMPLES](`;for(let t=0;t<e;t++){let n=r[t];i+=`vec3(${n.x}, ${n.y}, ${n.z})${t<e-1?`,`:`)`}`}return i}function he(e,t,n){let r=[];for(let i=0;i<e;i++){let a=2*Math.PI*t*i/e,o=(i/(e-1))**n;r.push(new F(Math.cos(a),Math.sin(a),o))}return r}var ge=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,t){let n,r,i,a=.5*(Math.sqrt(3)-1),o=(e+t)*a,s=Math.floor(e+o),c=Math.floor(t+o),l=(3-Math.sqrt(3))/6,u=(s+c)*l,d=s-u,f=c-u,p=e-d,m=t-f,h,g;p>m?(h=1,g=0):(h=0,g=1);let _=p-h+l,v=m-g+l,y=p-1+2*l,b=m-1+2*l,x=s&255,S=c&255,C=this.perm[x+this.perm[S]]%12,w=this.perm[x+h+this.perm[S+g]]%12,T=this.perm[x+1+this.perm[S+1]]%12,E=.5-p*p-m*m;E<0?n=0:(E*=E,n=E*E*this._dot(this.grad3[C],p,m));let D=.5-_*_-v*v;D<0?r=0:(D*=D,r=D*D*this._dot(this.grad3[w],_,v));let O=.5-y*y-b*b;return O<0?i=0:(O*=O,i=O*O*this._dot(this.grad3[T],y,b)),70*(n+r+i)}noise3d(e,t,n){let r,i,a,o,s=(e+t+n)*(1/3),c=Math.floor(e+s),l=Math.floor(t+s),u=Math.floor(n+s),d=1/6,f=(c+l+u)*d,p=c-f,m=l-f,h=u-f,g=e-p,_=t-m,v=n-h,y,b,x,S,C,w;g>=_?_>=v?(y=1,b=0,x=0,S=1,C=1,w=0):g>=v?(y=1,b=0,x=0,S=1,C=0,w=1):(y=0,b=0,x=1,S=1,C=0,w=1):_<v?(y=0,b=0,x=1,S=0,C=1,w=1):g<v?(y=0,b=1,x=0,S=0,C=1,w=1):(y=0,b=1,x=0,S=1,C=1,w=0);let T=g-y+d,E=_-b+d,D=v-x+d,O=g-S+2*d,k=_-C+2*d,A=v-w+2*d,ee=g-1+3*d,te=_-1+3*d,j=v-1+3*d,M=c&255,N=l&255,P=u&255,F=this.perm[M+this.perm[N+this.perm[P]]]%12,I=this.perm[M+y+this.perm[N+b+this.perm[P+x]]]%12,ne=this.perm[M+S+this.perm[N+C+this.perm[P+w]]]%12,L=this.perm[M+1+this.perm[N+1+this.perm[P+1]]]%12,R=.6-g*g-_*_-v*v;R<0?r=0:(R*=R,r=R*R*this._dot3(this.grad3[F],g,_,v));let z=.6-T*T-E*E-D*D;z<0?i=0:(z*=z,i=z*z*this._dot3(this.grad3[I],T,E,D));let B=.6-O*O-k*k-A*A;B<0?a=0:(B*=B,a=B*B*this._dot3(this.grad3[ne],O,k,A));let V=.6-ee*ee-te*te-j*j;return V<0?o=0:(V*=V,o=V*V*this._dot3(this.grad3[L],ee,te,j)),32*(r+i+a+o)}noise4d(e,t,n,r){let i=this.grad4,a=this.simplex,o=this.perm,s=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,l,u,d,f,p,m=(e+t+n+r)*s,h=Math.floor(e+m),g=Math.floor(t+m),_=Math.floor(n+m),v=Math.floor(r+m),y=(h+g+_+v)*c,b=h-y,x=g-y,S=_-y,C=v-y,w=e-b,T=t-x,E=n-S,D=r-C,O=w>T?32:0,k=w>E?16:0,A=T>E?8:0,ee=w>D?4:0,te=T>D?2:0,j=+(E>D),M=O+k+A+ee+te+j,N=+(a[M][0]>=3),P=+(a[M][1]>=3),F=+(a[M][2]>=3),I=+(a[M][3]>=3),ne=+(a[M][0]>=2),L=+(a[M][1]>=2),R=+(a[M][2]>=2),z=+(a[M][3]>=2),B=+(a[M][0]>=1),V=+(a[M][1]>=1),re=+(a[M][2]>=1),H=+(a[M][3]>=1),ie=w-N+c,ae=T-P+c,oe=E-F+c,se=D-I+c,ce=w-ne+2*c,le=T-L+2*c,ue=E-R+2*c,de=D-z+2*c,U=w-B+3*c,W=T-V+3*c,G=E-re+3*c,fe=D-H+3*c,pe=w-1+4*c,K=T-1+4*c,me=E-1+4*c,he=D-1+4*c,ge=h&255,q=g&255,J=_&255,_e=v&255,ve=o[ge+o[q+o[J+o[_e]]]]%32,ye=o[ge+N+o[q+P+o[J+F+o[_e+I]]]]%32,be=o[ge+ne+o[q+L+o[J+R+o[_e+z]]]]%32,xe=o[ge+B+o[q+V+o[J+re+o[_e+H]]]]%32,Se=o[ge+1+o[q+1+o[J+1+o[_e+1]]]]%32,Y=.6-w*w-T*T-E*E-D*D;Y<0?l=0:(Y*=Y,l=Y*Y*this._dot4(i[ve],w,T,E,D));let X=.6-ie*ie-ae*ae-oe*oe-se*se;X<0?u=0:(X*=X,u=X*X*this._dot4(i[ye],ie,ae,oe,se));let Z=.6-ce*ce-le*le-ue*ue-de*de;Z<0?d=0:(Z*=Z,d=Z*Z*this._dot4(i[be],ce,le,ue,de));let Q=.6-U*U-W*W-G*G-fe*fe;Q<0?f=0:(Q*=Q,f=Q*Q*this._dot4(i[xe],U,W,G,fe));let $=.6-pe*pe-K*K-me*me-he*he;return $<0?p=0:($*=$,p=$*$*this._dot4(i[Se],pe,K,me,he)),27*(l+u+d+f+p)}_dot(e,t,n){return e[0]*t+e[1]*n}_dot3(e,t,n,r){return e[0]*t+e[1]*n+e[2]*r}_dot4(e,t,n,r,i){return e[0]*t+e[1]*n+e[2]*r+e[3]*i}},q=class e extends H{constructor(e,t,n=512,i=512,a,o,s){super(),this.width=n,this.height=i,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=fe(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new I(this.width,this.height,{type:d,depthBuffer:!1}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new O({defines:Object.assign({},U.defines),uniforms:j.clone(U.uniforms),vertexShader:U.vertexShader,fragmentShader:U.fragmentShader,blending:0,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=+!!this.camera.isPerspectiveCamera,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new g,this.normalMaterial.blending=0,this.pdMaterial=new O({defines:Object.assign({},K.defines),uniforms:j.clone(K.uniforms),vertexShader:K.vertexShader,fragmentShader:K.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new O({defines:Object.assign({},W.defines),uniforms:j.clone(W.uniforms),vertexShader:W.vertexShader,fragmentShader:W.fragmentShader,blending:0}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new O({uniforms:j.clone(re.uniforms),vertexShader:re.vertexShader,fragmentShader:re.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:208,blendDst:200,blendEquation:100,blendSrcAlpha:206,blendDstAlpha:200,blendEquationAlpha:100}),this.blendMaterial=new O({uniforms:j.clone(G.uniforms),vertexShader:G.vertexShader,fragmentShader:G.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:5,blendSrc:208,blendDst:200,blendEquation:100,blendSrcAlpha:206,blendDstAlpha:200,blendEquationAlpha:100}),this._fsQuad=new oe(null),this._originalClearColor=new r,this.setGBuffer(a?a.depthTexture:void 0,a?a.normalTexture:void 0),o!==void 0&&this.updateGtaoMaterial(o),s!==void 0&&this.updatePdMaterial(s)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,t){e===void 0?(this.depthTexture=new s,this.depthTexture.format=o,this.depthTexture.type=N,this.normalRenderTarget=new I(this.width,this.height,{minFilter:_,magFilter:_,type:d,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0):(this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1);let n=+!!this.normalTexture,r=this.depthTexture===this.normalTexture?`w`:`x`;this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=n,this.gtaoMaterial.defines.DEPTH_SWIZZLING=r,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=n,this.pdMaterial.defines.DEPTH_SWIZZLING=r,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&+!!e.screenSpaceRadius!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=+!!e.screenSpaceRadius,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=me(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(t,n,r){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(t,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(t,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case e.OUTPUT.Off:break;case e.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=r.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=r.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(t,this.blendMaterial,this.renderToScreen?null:n);break;default:console.warn(`THREE.GTAOPass: Unknown output type.`)}}_renderPass(e,t,n,r,i){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,r!=null&&(e.setClearColor(r),e.setClearAlpha(i||0),e.clear()),this._fsQuad.material=t,this._fsQuad.render(e),e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_renderOverride(e,t,n,r,i){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,r=t.clearColor||r,i=t.clearAlpha||i,r!=null&&(e.setClearColor(r),e.setClearAlpha(i||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(e){(e.isPoints||e.isLine||e.isLine2)&&e.visible&&(e.visible=!1,t.push(e))})}_restoreVisibility(){let e=this._visibilityCache;for(let t=0;t<e.length;t++)e[t].visible=!0;e.length=0}_generateNoise(e=64){let t=new ge,n=e*e*4,r=new Uint8Array(n);for(let n=0;n<e;n++)for(let i=0;i<e;i++){let a=n,o=i;r[(n*e+i)*4]=(t.noise(a,o)*.5+.5)*255,r[(n*e+i)*4+1]=(t.noise(a+e,o)*.5+.5)*255,r[(n*e+i)*4+2]=(t.noise(a,o+e)*.5+.5)*255,r[(n*e+i)*4+3]=(t.noise(a+e,o+e)*.5+.5)*255}let i=new a(r,e,e,C,M);return i.wrapS=T,i.wrapT=T,i.needsUpdate=!0,i}};q.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var J={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},_e=class extends H{constructor(){super(),this.isOutputPass=!0,this.uniforms=j.clone(J.uniforms),this.material=new w({name:J.name,uniforms:this.uniforms,vertexShader:J.vertexShader,fragmentShader:J.fragmentShader}),this._fsQuad=new oe(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},i.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},ve=`
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,ye=`
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  uniform vec3 uGround;
  varying vec3 vDir;
  void main() {
    float y = vDir.y;
    vec3 c = y > 0.0 ? mix(uHorizon, uTop, pow(y, 0.7)) : mix(uHorizon, uGround, pow(-y, 0.45));
    gl_FragColor = vec4(c, 1.0);
  }
`,be=new WeakMap;function xe(e,{warmth:t=.5,strength:n=1,dark:i=!1}={}){let a=`${t}|${n}|${i}`,o=be.get(e);if(o||be.set(e,o=new Map),o.has(a))return o.get(a);let s=new r().setRGB(1,.96-.04*t,.9-.1*t),c=new r().setRGB(.92,.95,1),l=new D,u=new m(new ee(30,64,32),new O({side:1,depthWrite:!1,uniforms:{uTop:{value:(i?new r(.22,.21,.2):new r(.85,.83,.8)).multiplyScalar(n)},uHorizon:{value:(i?new r(.1,.095,.09):new r(.52,.49,.46)).multiplyScalar(n)},uGround:{value:(i?new r(.02,.02,.02):new r(.16,.14,.12)).multiplyScalar(n)}},vertexShader:ve,fragmentShader:ye}));l.add(u);let d=(e,t,r,i,a)=>{let o=new m(new x(e,t),new h({color:i.clone().multiplyScalar(a*n),side:2}));o.position.set(r[0],r[1],r[2]),o.lookAt(0,0,0),l.add(o)};d(9,7,[-8,9,8],s,i?5:4.2),d(2.4,12,[11,2,3],c,i?2.2:2.6),d(14,2.2,[0,7,-11],s,i?4:3.2),d(16,16,[0,16,0],s,i?.9:1.6),d(14,14,[0,-14,2],s,i?.12:.35);let f=new y(e),p=f.fromScene(l,.035,.1,100).texture;return f.dispose(),l.traverse(e=>{e.geometry?.dispose(),e.material?.dispose()}),o.set(a,p),p}function Se(){try{let e=document.createElement(`canvas`);return!!(window.WebGLRenderingContext&&(e.getContext(`webgl2`)||e.getContext(`webgl`)))}catch{return!1}}function Y({alpha:e=!0,preserve:t=!1,tone:n=`neutral`,exposure:r=1}={}){let i=new ne({antialias:!0,alpha:e,powerPreference:`high-performance`,preserveDrawingBuffer:t});return i.setClearColor(0,0),i.outputColorSpace=E,i.toneMapping=n===`agx`?6:7,i.toneMappingExposure=r,i.domElement.addEventListener(`webglcontextlost`,e=>e.preventDefault()),i}function X(e,t,n=1,r={}){t.environment=xe(e,r),t.environmentIntensity=n}function Z(e,{key:t=`#fff1dc`,keyI:n=2.1,rim:r=`#ffffff`,rimI:i=1.1,fill:a=null,fillI:o=0}={}){let s=new c(t,n);s.position.set(3,5,4);let l=new c(r,i);l.position.set(-4,2,-3),e.add(s,l,s.target);let u=null;return a&&(u=new S(a,o,12,1.4),u.position.set(0,-2.4,2),e.add(u)),{key:s,rim:l,fill:u}}function Q(e,t,n=2048){e.shadowMap.enabled=!0,e.shadowMap.type=1,t.castShadow=!0,t.shadow.mapSize.set(n,n),t.shadow.bias=-4e-4,t.shadow.normalBias=.02,t.shadow.radius=5}function $(e,t){let r=document.createElement(`canvas`);r.width=r.height=512;let i=r.getContext(`2d`),a=i.createRadialGradient(256,210,20,256,256,380);a.addColorStop(0,e),a.addColorStop(1,t),i.fillStyle=a,i.fillRect(0,0,512,512);let o=new n(r);return o.colorSpace=E,o}function Ce(e){e.traverse(e=>{e.isMesh&&!e.userData.isShadow&&!(e.material&&e.material.transparent&&e.material.opacity<.5)&&(e.castShadow=!0,e.receiveShadow=!0)})}function we(e,{materials:t=!0}={}){e.traverse(e=>{e.geometry&&e.geometry.dispose(),t&&e.material&&(Array.isArray(e.material)?e.material:[e.material]).forEach(e=>e.dispose())})}var Te=class{constructor(e,t={}){this.container=e,this.opts=t,this.isMobile=window.innerWidth<768,this.renderer=Y({tone:t.tone,exposure:t.exposure}),e.appendChild(this.renderer.domElement),this.scene=new D,X(this.renderer,this.scene,t.envIntensity??.9,t.env),t.background&&(this.scene.background=new r(t.background),this.renderer.setClearColor(t.background,1)),V(!!t.background),this.lights=Z(this.scene,t.lights),t.shadows&&Q(this.renderer,this.lights.key,this.isMobile?1024:2048),this.camera=new b(t.fov??30,1,.1,100),this.camera.position.set(0,0,12),this.root=new u,this.scene.add(this.root),this.pointer={x:0,y:0,sx:0,sy:0},this.active=!0,this.hidden=!1,this.updaters=new Set,this.resizers=new Set,this.elapsed=0,this._last=performance.now(),this.maxPR=Math.min(window.devicePixelRatio||1,this.isMobile?1.35:1.5),this.pr=this.maxPR,this._slow=0,this._frames=0,this._onPointer=e=>{this.pointer.x=e.clientX/window.innerWidth*2-1,this.pointer.y=-(e.clientY/window.innerHeight*2-1)},window.addEventListener(`pointermove`,this._onPointer,{passive:!0}),this._lastW=0,this._lastH=0,this.resize=this.resize.bind(this),window.addEventListener(`resize`,this.resize),this.resize(!0),this._onVis=()=>this.hidden=document.hidden,document.addEventListener(`visibilitychange`,this._onVis),this.tick=this.tick.bind(this),L.ticker.add(this.tick)}get view(){let e=2*Math.tan(f.degToRad(this.camera.fov/2))*this.camera.position.z;return{width:e*this.camera.aspect,height:e,aspect:this.camera.aspect}}resize(e){let t=this.container.clientWidth||window.innerWidth,n=this.container.clientHeight||window.innerHeight;e!==!0&&t===this._lastW&&Math.abs(n-this._lastH)<140||(this._lastW=t,this._lastH=n,this.isMobile=t<768,this.renderer.setPixelRatio(this.pr),this.renderer.setSize(t,n,!1),this.camera.aspect=t/n,this.camera.updateProjectionMatrix(),this.resizers.forEach(e=>e(this.view,this.isMobile)))}onUpdate(e){return this.updaters.add(e),()=>this.updaters.delete(e)}onResize(e){return this.resizers.add(e),e(this.view,this.isMobile),()=>this.resizers.delete(e)}setActive(e){this.active!==e&&(this.active=e,this.container.style.visibility=e?`visible`:`hidden`,this._last=performance.now())}adapt(e){this._frames+=1,e>1/45&&(this._slow+=1),this._frames>=60&&(this._slow>30&&this.pr>1&&(this.pr=Math.max(1,+(this.pr-.2).toFixed(2)),this.resize(!0)),this._frames=0,this._slow=0)}tick(){let e=performance.now(),t=(e-this._last)/1e3,n=Math.min(.05,t);if(this._last=e,!this.active||this.hidden)return;t<.25&&this.adapt(t),this.elapsed+=n;let r=this.pointer;r.sx+=(r.x-r.sx)*Math.min(1,n*3.5),r.sy+=(r.y-r.sy)*Math.min(1,n*3.5),this.updaters.forEach(e=>e(this.elapsed,n)),R(this.root,this.elapsed),this.renderer.render(this.scene,this.camera)}warmup(){this.renderer.compile(this.scene,this.camera),this.renderer.render(this.scene,this.camera)}},Ee=class{constructor(e=512,t=e,n={}){if(this.w=e,this.h=t,this.studio=n.studio||null,this.renderer=Y({preserve:!0,alpha:!this.studio,tone:n.tone,exposure:n.exposure}),this.renderer.setPixelRatio(1),this.renderer.setSize(e,t,!1),this.scene=new D,X(this.renderer,this.scene,n.envIntensity??.95,n.env),this.lights=Z(this.scene,n.lights),this.camera=new b(n.fov??26,e/t,.1,100),this.shadowOpacity=n.shadowOpacity??.34,this.format=n.format||(this.studio?`image/jpeg`:`image/webp`),this.quality=n.quality??.9,this.studio){this.scene.background=$(this.studio.inner,this.studio.outer),Q(this.renderer,this.lights.key,2048),this.floor=new m(new x(60,60),new k({opacity:this.studio.shadow??.32,color:this.studio.shadowColor||`#000000`})),this.floor.rotation.x=-Math.PI/2,this.floor.receiveShadow=!0,this.scene.add(this.floor);let n=new I(e,t,{type:d,samples:4});this.composer=new ue(this.renderer,n),this.composer.setPixelRatio(1),this.composer.setSize(e,t),this.composer.addPass(new de(this.scene,this.camera));let r=new q(this.scene,this.camera,e,t);r.output=q.OUTPUT.Default,r.blendIntensity=this.studio.ao??.85,r.updateGtaoMaterial({radius:.22,distanceExponent:1.4,thickness:1,scale:1,samples:16,distanceFallOff:1}),r.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:5,rings:2,samples:16}),this.composer.addPass(r),this.composer.addPass(new _e)}}async render(e,t={}){let n=await this.renderBlob(e,t);return n?URL.createObjectURL(n):null}async renderBlob(t,n={}){V(!!this.studio);let r=t(),i=z(r,2);n.rot&&i.rotation.set(n.rot[0]||0,n.rot[1]||0,n.rot[2]||0),this.scene.add(i),i.updateMatrixWorld(!0),this.studio&&Ce(i);let a=new e().setFromObject(i),o=a.getCenter(new F),s=a.getBoundingSphere(new A),c=null;if(n.shadow!==!1){let e=Math.max(a.max.x-a.min.x,a.max.z-a.min.z)*(n.shadowScale??1.25);c=B(e,n.shadowOpacity??(this.studio?this.shadowOpacity*.6:this.shadowOpacity)),c.position.set(o.x,a.min.y+.002,o.z),this.scene.add(c)}if(this.studio){this.floor.position.y=a.min.y;let e=this.lights.key;e.position.copy(o).add(new F(2.2,4.5,3.2)),e.target.position.copy(o);let t=e.shadow.camera,n=s.radius*1.6;t.left=-n,t.right=n,t.top=n,t.bottom=-n,t.near=.1,t.far=20,t.updateProjectionMatrix()}let l=n.el??.42,u=n.az??.5,d=f.degToRad(this.camera.fov/2),p=Math.atan(Math.tan(d)*this.camera.aspect),m=(n.zoom??1)*(this.studio?this.studio.zoom??.82:1),h=s.radius/Math.sin(Math.min(d,p))*(.98/m),g=new F(Math.sin(u)*Math.cos(l),Math.sin(l),Math.cos(u)*Math.cos(l));this.camera.position.copy(o).addScaledVector(g,h),this.camera.lookAt(o.x,o.y-(n.lookDown??0),o.z),R(i,1.2),this.composer?this.composer.render():this.renderer.render(this.scene,this.camera);let _=await new Promise(e=>this.renderer.domElement.toBlob(e,this.format,this.quality));return this.scene.remove(i),we(i,{materials:!1}),c&&(this.scene.remove(c),we(c,{materials:!1})),_}dispose(){this.renderer.dispose(),this.renderer.forceContextLoss?.()}},De=class{constructor(e={}){this.studio=e.studio||null,this.renderer=Y({alpha:!this.studio,tone:e.tone,exposure:e.exposure}),this.renderer.domElement.setAttribute(`aria-hidden`,`true`),this.scene=new D,X(this.renderer,this.scene,e.envIntensity??.95,e.env),this.lights=Z(this.scene,e.lights),this.studio&&(this.scene.background=$(this.studio.inner,this.studio.outer),Q(this.renderer,this.lights.key,1024),this.floor=new m(new x(60,60),new k({opacity:this.studio.shadow??.3,color:this.studio.shadowColor||`#000000`})),this.floor.rotation.x=-Math.PI/2,this.floor.receiveShadow=!0,this.scene.add(this.floor)),this.camera=new b(26,1,.1,100),this.pivot=new u,this.scene.add(this.pivot),this.rotY=0,this.velY=0,this.tilt=0,this.dragging=!1,this.running=!1,this.elapsed=0,this.view={},this.shadowOpacity=e.shadowOpacity??.3,this.loop=this.loop.bind(this),this.resize=this.resize.bind(this),this._ro=new ResizeObserver(this.resize)}attach(e){this._abort?.abort(),this._ro.disconnect(),this.container=e,e.prepend(this.renderer.domElement),this._ro.observe(e);let t=new AbortController;this._abort=t;let n={signal:t.signal},r=0,i=0;e.addEventListener(`pointerdown`,t=>{this.dragging=!0,r=t.clientX,i=t.clientY,e.setPointerCapture?.(t.pointerId)},n),e.addEventListener(`pointermove`,e=>{if(!this.dragging)return;let t=e.clientX-r,n=e.clientY-i;r=e.clientX,i=e.clientY,this.velY=t*.012,this.rotY+=this.velY,this.tilt=Math.max(-.35,Math.min(.35,this.tilt+n*.004))},n);let a=()=>this.dragging=!1;e.addEventListener(`pointerup`,a,n),e.addEventListener(`pointercancel`,a,n),e.addEventListener(`lostpointercapture`,a,n)}resize(){if(!this.container)return;let e=this.container.clientWidth,t=this.container.clientHeight;e&&t&&(this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.frame())}frame(){if(!this.sphere)return;let e=f.degToRad(this.camera.fov/2),t=Math.atan(Math.tan(e)*this.camera.aspect),n=this.sphere.radius/Math.sin(Math.min(e,t))*(this.studio?1.12:1.02),r=this.view.el??.38;this.camera.position.set(0,Math.sin(r)*n+this.sphere.center.y,Math.cos(r)*n),this.camera.lookAt(0,this.sphere.center.y,0)}show(t,n={}){this.clear(),this.view=n,V(!!this.studio);let r=z(t(),2);n.rot&&r.rotation.set(n.rot[0]||0,n.rot[1]||0,n.rot[2]||0),r.updateMatrixWorld(!0),this.studio&&Ce(r);let i=new e().setFromObject(r),a=i.getCenter(new F);r.position.x-=a.x,r.position.z-=a.z,this.pivot.add(r);let o=Math.max(i.max.x-i.min.x,i.max.z-i.min.z)*1.25,s=B(o,this.studio?this.shadowOpacity*.6:this.shadowOpacity);if(s.position.y=i.min.y+.002,this.pivot.add(s),this.holder=r,this.shadow=s,this.pivot.rotation.set(0,0,0),this.pivot.updateMatrixWorld(!0),i.setFromObject(this.pivot),this.sphere=i.getBoundingSphere(new A),this.studio){this.floor.position.y=i.min.y;let e=this.lights.key;e.position.set(2.2,4.5+this.sphere.center.y,3.2),e.target.position.copy(this.sphere.center);let t=e.shadow.camera,n=this.sphere.radius*1.8;t.left=-n,t.right=n,t.top=n,t.bottom=-n,t.far=20,t.updateProjectionMatrix()}this.rotY=n.az??.5,this.velY=.004,this.tilt=0,this.resize(),this.running||(this.running=!0,this._last=performance.now(),L.ticker.add(this.loop))}loop(){let e=performance.now(),t=Math.min(.05,(e-this._last)/1e3);this._last=e,this.elapsed+=t,this.dragging||(this.velY+=(.0035-this.velY)*Math.min(1,t*1.5),this.rotY+=this.velY,this.tilt+=(0-this.tilt)*Math.min(1,t*2)),this.pivot.rotation.y=this.rotY,this.pivot.rotation.x=this.tilt,R(this.pivot,this.elapsed),this.renderer.render(this.scene,this.camera)}clear(){this.holder&&(this.pivot.remove(this.holder),we(this.holder,{materials:!1}),this.holder=null),this.shadow&&(this.pivot.remove(this.shadow),we(this.shadow,{materials:!1}),this.shadow=null)}stop(){this.running&&(L.ticker.remove(this.loop),this.running=!1),this.clear()}};export{Te as Stage,Ee as ThumbRenderer,De as Viewer,we as disposeObject,Se as supportsWebGL};