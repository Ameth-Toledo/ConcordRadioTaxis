import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  
  ngOnInit(): void {
    this.initializeMobileMenu();
  }
  
  private initializeMobileMenu(): void {
    // Esperar a que el DOM esté cargado
    setTimeout(() => {
      const mobileMenuBtn = document.getElementById('mobile-menu-btn');
      const mobileMenu = document.getElementById('mobile-menu');
      
      if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
          this.toggleMobileMenu(mobileMenu);
        });
        
        // Cerrar menú al hacer click fuera
        document.addEventListener('click', (event: Event) => {
          const target = event.target as Node;
          if (!mobileMenuBtn.contains(target) && 
              !mobileMenu.contains(target)) {
            mobileMenu.classList.remove('active');
          }
        });
        
        // Cerrar menú al redimensionar ventana
        window.addEventListener('resize', () => {
          if (window.innerWidth >= 1024) {
            mobileMenu.classList.remove('active');
          }
        });
      }
    }, 100);
  }
  
  private toggleMobileMenu(menu: HTMLElement): void {
    menu.classList.toggle('active');
    
    // Cambiar icono del botón
    const btn = document.getElementById('mobile-menu-btn');
    const icon = btn?.querySelector('svg');
    
    if (menu.classList.contains('active')) {
      // Cambiar a icono de X
      if (icon) {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
      }
    } else {
      // Cambiar a icono de hamburguesa
      if (icon) {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
      }
    }
  }
}

// Opcional: Funcionalidad adicional para efectos smooth scroll
export function initSmoothScrolling(): void {
  document.querySelectorAll('a[href^="#"]').forEach((anchor: Element) => {
    anchor.addEventListener('click', function (this: HTMLElement, e: Event) {
      e.preventDefault();
      const href = this.getAttribute('href');
      const target = document.querySelector(href || '');
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}