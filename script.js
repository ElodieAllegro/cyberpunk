class CyberpunkScrollAnimation {
    constructor() {
        this.scrollProgress = 0;
        this.textUpper = document.querySelector('.text-upper');
        this.textLower = document.querySelector('.text-lower');
        this.revealedContent = document.querySelector('.revealed-content');
        this.mainTitle = document.querySelector('.main-title');
        this.subTitle = document.querySelector('.sub-title');
        this.cyberIcon = document.querySelector('.cyber-icon');
        this.remixButton = document.querySelector('.remix-button');
        this.finalSection = document.querySelector('.final-section');
        this.particlesContainer = document.querySelector('.cyber-particles');
        this.navbar = document.querySelector('.navbar');
        
        this.init();
    }

    init() {
        this.createParticles();
        this.bindEvents();
        this.updateAnimation();
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
            this.cyberIcon.style.transform = 'translateY(0) rotate(180deg) scale(1.1)';
        });
        
        this.remixButton.addEventListener('mouseleave', () => {
            this.cyberIcon.style.transform = `translateY(0) rotate(${this.scrollProgress * 360}deg) scale(1)`;
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
        this.cyberIcon.style.transform = `translateY(${iconTranslateY}px) rotate(${this.scrollProgress * 360}deg) scale(1)`;

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
}

// Initialisation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new CyberpunkScrollAnimation();
});

// Gestion du redimensionnement
window.addEventListener('resize', () => {
    // Recalculer les animations si nécessaire
});