import { ShoeModel3D } from '../3d-model/ShoeModel3D.js';

export class CyberpunkScrollAnimation {
    constructor() {
        this.scrollProgress = 0;
        this.customizationProgress = 0;
        this.textUpper = document.querySelector('.text-upper');
        this.textLower = document.querySelector('.text-lower');
        this.revealedContent = document.querySelector('.revealed-content');
        this.mainTitle = document.querySelector('.main-title');
        this.subTitle = document.querySelector('.sub-title');
        this.shoeModel = document.querySelector('.shoe-model');
        this.remixButton = document.querySelector('.remix-button');
        this.particlesContainer = document.querySelector('.cyber-particles');
        this.navbar = document.querySelector('.navbar');
        this.customizationSection = document.querySelector('.customization-section');
        this.stepCards = document.querySelectorAll('.step-card-stack');
        
        // Instance du modèle 3D
        this.shoeModel3D = null;
        
        this.init();
    }

    init() {
        this.initShoeModel();
        this.createParticles();
        this.bindEvents();
        this.updateAnimation();
    }
    
    initShoeModel() {
        this.shoeModel3D = new ShoeModel3D('shoe-canvas');
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
            if (this.shoeModel3D) {
                this.shoeModel3D.setHoverEffect(true);
            }
        });
        
        this.remixButton.addEventListener('mouseleave', () => {
            if (this.shoeModel3D) {
                this.shoeModel3D.setHoverEffect(false);
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
        const customizationStart = window.innerHeight * 2;
        const customizationMaxScroll = window.innerHeight * 3;
        
        this.scrollProgress = Math.min(scrollTop / maxScroll, 1);
        this.customizationProgress = Math.max(0, Math.min((scrollTop - customizationStart) / (customizationMaxScroll - customizationStart), 1));
        
        this.updateAnimation();
        this.updateCustomizationAnimation();
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
        
        // Redimensionner le renderer et appliquer la rotation du scroll
        if (this.shoeModel3D) {
            this.shoeModel3D.resizeRenderer(finalSize);
            this.shoeModel3D.setScrollRotation(this.scrollProgress);
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
        if (this.scrollProgress >= 0.9) {
            // Affichage de la navbar vers la fin du scroll
            this.navbar.style.opacity = '1';
            this.navbar.style.transform = 'translateY(0)';
        } else {
            // Masquer la navbar si on n'est pas à la fin
            this.navbar.style.opacity = '0';
            this.navbar.style.transform = 'translateY(-100%)';
        }
        
        // Masquer l'animation principale quand on arrive à la customisation
        if (this.scrollProgress >= 1) {
            document.querySelector('.animation-viewport').style.opacity = '0';
        } else {
            document.querySelector('.animation-viewport').style.opacity = '1';
        }
    }
    
    updateCustomizationAnimation() {
        // Afficher/masquer la section de customisation
        if (this.customizationProgress > 0) {
            this.customizationSection.classList.add('visible');
        } else {
            this.customizationSection.classList.remove('visible');
        }
        
        // Animation d'empilement des cartes
        this.stepCards.forEach((card, index) => {
            const cardDelay = index * 0.25; // Délai entre chaque carte
            const cardProgress = Math.max(0, Math.min(1, (this.customizationProgress - cardDelay) / 0.25));
            
            if (cardProgress > 0) {
                card.classList.add('stacked');
            } else {
                card.classList.remove('stacked');
            }
        });
    }
    
    destroy() {
        if (this.shoeModel3D) {
            this.shoeModel3D.destroy();
        }
    }
}