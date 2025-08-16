import { CyberpunkScrollAnimation } from './animation/CyberpunkScrollAnimation.js';

// Initialisation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    window.cyberpunkAnimation = new CyberpunkScrollAnimation();
});

// Gestion du redimensionnement
window.addEventListener('resize', () => {
    // Recalculer les animations si nécessaire
    const animation = window.cyberpunkAnimation;
    if (animation && animation.shoeModel3D) {
        animation.shoeModel3D.resizeRenderer(120);
    }
});