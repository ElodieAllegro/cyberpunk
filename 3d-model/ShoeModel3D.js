import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class ShoeModel3D {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.shoe = null;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.initThreeJS();
        this.loadModel();
    }
    
    initThreeJS() {
        // Créer la scène
        this.scene = new THREE.Scene();
        
        // Créer la caméra
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.camera.position.set(0, 0, 3);
        
        // Créer le renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(120, 120);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        // Éclairage propre et équilibré
        // Lumière ambiante douce
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        
        // Lumière principale (key light)
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
        keyLight.position.set(2, 2, 2);
        keyLight.castShadow = false;
        this.scene.add(keyLight);
        
        // Lumière de remplissage (fill light)
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-1, 0, 1);
        this.scene.add(fillLight);
        
        // Lumière arrière (rim light)
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
        rimLight.position.set(0, 1, -2);
        this.scene.add(rimLight);
    }
    
    loadModel() {
        const loader = new GLTFLoader();
        loader.load(
            './models/AF1.glb',
            (gltf) => {
                this.shoe = gltf.scene;
                
                // Ajuster la taille et position du modèle
                const box = new THREE.Box3().setFromObject(this.shoe);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                // Centrer le modèle
                this.shoe.position.sub(center);
                
                // Redimensionner pour qu'il rentre dans le canvas
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 2 / maxDim;
                this.shoe.scale.setScalar(scale);
                
                // Appliquer un matériau naturel
                this.shoe.traverse((child) => {
                    if (child.isMesh) {
                        if (child.material) {
                            // Préserver les couleurs originales du modèle
                            child.material.needsUpdate = true;
                            
                            // Ajuster les propriétés pour un rendu plus réaliste
                            if (child.material.isMeshStandardMaterial) {
                                child.material.roughness = 0.3;
                                child.material.metalness = 0.1;
                            }
                        }
                    }
                });
                
                this.scene.add(this.shoe);
                this.startAnimation();
            },
            (progress) => {
                console.log('Chargement du modèle 3D:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('Erreur lors du chargement du modèle 3D:', error);
            }
        );
    }
    
    startAnimation() {
        this.animationId = requestAnimationFrame(() => this.startAnimation());
        
        if (this.shoe) {
            // Rotation continue de la chaussure
            this.shoe.rotation.y += 0.01;
            this.shoe.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    // Méthodes pour contrôler les animations depuis l'extérieur
    setScrollRotation(progress) {
        if (this.shoe) {
            this.shoe.rotation.z = progress * Math.PI * 2;
        }
    }
    
    setHoverEffect(isHovering) {
        if (this.shoe) {
            this.shoe.rotation.z = isHovering ? Math.PI : 0;
        }
    }
    
    resizeRenderer(size) {
        if (this.renderer) {
            this.renderer.setSize(size, size);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}