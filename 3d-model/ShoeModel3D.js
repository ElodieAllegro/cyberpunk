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
            antialias: true 
        });
        this.renderer.setSize(120, 120);
        this.renderer.setClearColor(0x000000, 0);
        
        // Ajouter l'éclairage blanc
        this.scene.add(new THREE.AmbientLight(0xffffff, 1.5));
        const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.8);
        hemi.position.set(0, 2, 0);
        this.scene.add(hemi);
        const dir = new THREE.DirectionalLight(0xffffff, 1.5);
        dir.position.set(3, 3, 3);
        this.scene.add(dir);
        const frontLight = new THREE.DirectionalLight(0xffffff, 1);
        frontLight.position.copy(this.camera.position);
        this.scene.add(frontLight);
        const fillLight = new THREE.PointLight(0xffffff, 1);
        fillLight.position.set(-2, 1, 2);
        this.scene.add(fillLight);
        const backFill = new THREE.DirectionalLight(0xffffff, 3);
        backFill.position.set(-this.camera.position.x, -this.camera.position.y, -this.camera.position.z);
        this.scene.add(backFill);
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
                            child.material.emissive = new THREE.Color(0x000000);
                            child.material.shininess = 100;
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