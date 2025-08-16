import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class CyberpunkScrollAnimation {
    constructor() {
        this.scrollProgress = 0;
        this.textUpper = document.querySelector('.text-upper');
        this.textLower = document.querySelector('.text-lower');
        this.revealedContent = document.querySelector('.revealed-content');
        this.mainTitle = document.querySelector('.main-title');
        this.subTitle = document.querySelector('.sub-title');
        this.shoeModel = document.querySelector('.shoe-model');
        this.shoeCanvas = document.getElementById('shoe-canvas');
        this.remixButton = document.querySelector('.remix-button');
        this.finalSection = document.querySelector('.final-section');
        this.particlesContainer = document.querySelector('.cyber-particles');
        this.navbar = document.querySelector('.navbar');
        
        // Variables Three.js
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.shoe = null;
        this.animationId = null;
        
        this.init();
    }

    init() {
        this.initThreeJS();
        this.createParticles();
        this.bindEvents();
        this.updateAnimation();
    }
    
    initThreeJS() {
        // Créer la scène
        this.scene = new THREE.Scene();
        
        // Créer la caméra
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.camera.position.set(0, 0, 3);
        
        // Créer le renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.shoeCanvas,
            alpha: true,
            antialias: true 
        });
        this.renderer.setSize(120, 120);
        this.renderer.setClearColor(0x000000, 0);
        
        // Ajouter l'éclairage
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(-5, -5, 5);
        this.scene.add(pointLight);
        
        // Charger le modèle 3D
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
                
                // Appliquer un matériau cyberpunk
                this.shoe.traverse((child) => {
                    if (child.isMesh) {
                        // Garder le matériau original mais ajuster les propriétés
                        if (child.material) {
                            child.material.emissive = new THREE.Color(0x000000);
                            child.material.shininess = 100;
                        }
                    }
                });
                
                this.scene.add(this.shoe);
                this.animate3D();
            },
            (progress) => {
                console.log('Chargement du modèle 3D:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('Erreur lors du chargement du modèle 3D:', error);
            }
        );
    }
    
    animate3D() {
        this.animationId = requestAnimationFrame(() => this.animate3D());
        
        if (this.shoe) {
            // Rotation continue de la chaussure
            this.shoe.rotation.y += 0.01;
            this.shoe.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
        }
        
        this.renderer.render(this.scene, this.camera);
    }

    createParticles() {
        for (let i = 0; i < 18; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${20 + i * 8}%`;
            particle.style.top = `${30 + (i % 3) * 20}%`;
            this.particlesContainer.appendChild(particle);
        }
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Effet hover sur le bouton
        this.remixButton.addEventListener('mouseenter', () => {
            if (this.shoe) {
                this.shoe.rotation.z = Math.PI;
            }
        });
        
        this.remixButton.addEventListener('mouseleave', () => {
            if (this.shoe) {
                this.shoe.rotation.z = 0;
            }
        });
        
        // Gestion du clic sur le logo pour retourner en haut
        this.navbar.querySelector('.navbar-logo').addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    handleScroll() {
        const scrollTop = window.pageYOffset;
        const maxScroll = window.innerHeight * 2;
        this.scrollProgress = Math.min(scrollTop / maxScroll, 1);
        
        this.updateAnimation();
    }

    updateAnimation() {
        // Animation de séparation du texte
        const splitOffset = this.scrollProgress * 50;
        this.textUpper.style.transform = `translateY(-${splitOffset}%)`;
        this.textLower.style.transform = `translateY(${splitOffset}%)`;

        // Révélation du contenu
        if (this.scrollProgress > 0.1) {
            this.revealedContent.style.opacity = '1';
            this.revealedContent.style.transform = `scale(${0.8 + this.scrollProgress * 0.2})`;
        }

        // Animation du titre
        if (this.scrollProgress > 0.2) {
        }
        const titleProgress = Math.min(this.scrollProgress / 0.6, 1);
        const translateY = (1 - titleProgress) * window.innerHeight;
        const zoomScale = 0.8 + (titleProgress * 0.2); // Zoom de 0.8 à 1.0
        this.mainTitle.style.transform = `translateY(${translateY}px) scale(${zoomScale})`;
        
        // Animation du sous-titre avec zoom léger
        const subZoomScale = 0.9 + (titleProgress * 0.1); // Zoom de 0.9 à 1.0
        this.subTitle.style.transform = `translateY(${translateY}px) scale(${subZoomScale})`;

        // Animation de l'icône (suit le mouvement du texte)
        const iconTranslateY = (1 - titleProgress) * window.innerHeight;
        const finalScale = 1 + (titleProgress * 2); // Scale de 1 à 3
        this.shoeModel.style.transform = `translateY(${iconTranslateY}px) rotate(${this.scrollProgress * 360}deg) scale(${finalScale})`;
        
        // Ajuster la taille du canvas pour qu'il soit aussi grand que le h2
        const finalSize = 80 + (titleProgress * 120); // De 80px à 200px
        this.shoeModel.style.width = `${finalSize}px`;
        this.shoeModel.style.height = `${finalSize}px`;
        
        // Redimensionner le renderer
        if (this.renderer) {
            this.renderer.setSize(finalSize, finalSize);
        }
        
        // Rotation supplémentaire du modèle 3D basée sur le scroll
        if (this.shoe) {
            this.shoe.rotation.z = this.scrollProgress * Math.PI * 2;
        }

        // Animation du bouton (suit le mouvement du texte)
        const buttonTranslateY = (1 - titleProgress) * window.innerHeight;
        this.remixButton.style.transform = `translateY(${buttonTranslateY}px)`;

        // Animation des particules
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, i) => {
            if (this.scrollProgress > 0.2) {
                particle.style.opacity = '0.8';
                particle.style.transform = `translateY(${this.scrollProgress * (30 + i * 10)}px) rotate(${this.scrollProgress * (45 + i * 15)}deg)`;
            }
        });

        // Section finale
        if (this.scrollProgress >= 1) {
            this.finalSection.style.opacity = '1';
            // Affichage de la navbar à la fin du scroll
            this.navbar.style.opacity = '1';
            this.navbar.style.transform = 'translateY(0)';
        } else {
            // Masquer la navbar si on n'est pas à la fin
            this.navbar.style.opacity = '0';
            this.navbar.style.transform = 'translateY(-100%)';
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

// Initialisation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new CyberpunkScrollAnimation();
});

// Gestion du redimensionnement
window.addEventListener('resize', () => {
    // Recalculer les animations si nécessaire
    const animation = window.cyberpunkAnimation;
    if (animation && animation.renderer) {
        animation.renderer.setSize(120, 120);
    }
});

// Stocker l'instance globalement pour le redimensionnement
window.cyberpunkAnimation = null;
document.addEventListener('DOMContentLoaded', () => {
    window.cyberpunkAnimation = new CyberpunkScrollAnimation();
});