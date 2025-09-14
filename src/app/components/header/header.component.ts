import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  
  private resizeListener?: () => void;
  private clickListener?: (event: Event) => void;
  
  ngOnInit(): void {
    this.initializeMobileMenu();
    this.initializeSmoothScrolling();
    this.ensureStickyPosition();
  }
  
  ngOnDestroy(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
    if (this.clickListener) {
      document.removeEventListener('click', this.clickListener);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    this.handleStickyBehavior();
  }
  
  private ensureStickyPosition(): void {
    setTimeout(() => {
      const header = document.querySelector('header');
      if (header) {
        header.style.position = 'sticky';
        header.style.top = '0';
        header.style.zIndex = '9999';
        header.style.width = '100%';
      }
    }, 100);
  }
  
  private handleStickyBehavior(): void {
    const headerHost = document.querySelector('app-header');
    if (headerHost) {
      const scrollY = window.scrollY;
      
      if (scrollY > 50) {
        headerHost.classList.add('scrolled');
      } else {
        headerHost.classList.remove('scrolled');
      }
    }
  }
  
  private initializeMobileMenu(): void {
    setTimeout(() => {
      const mobileMenuBtn = document.getElementById('mobile-menu-btn');
      const mobileMenu = document.getElementById('mobile-menu');
      
      if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleMobileMenu(mobileMenu);
        });
        
        this.clickListener = (event: Event) => {
          const target = event.target as Node;
          if (!mobileMenuBtn.contains(target) && 
              !mobileMenu.contains(target)) {
            mobileMenu.classList.remove('active');
            this.resetMobileMenuIcon();
          }
        };
        
        document.addEventListener('click', this.clickListener);
        
        this.resizeListener = () => {
          if (window.innerWidth >= 1024) {
            mobileMenu.classList.remove('active');
            this.resetMobileMenuIcon();
          }
        };
        
        window.addEventListener('resize', this.resizeListener);
      }
    }, 100);
  }
  
  private toggleMobileMenu(menu: HTMLElement): void {
    menu.classList.toggle('active');
    
    const btn = document.getElementById('mobile-menu-btn');
    const icon = btn?.querySelector('svg');
    
    if (menu.classList.contains('active')) {
      if (icon) {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
      }
    } else {
      this.resetMobileMenuIcon();
    }
  }
  
  private resetMobileMenuIcon(): void {
    const btn = document.getElementById('mobile-menu-btn');
    const icon = btn?.querySelector('svg');
    if (icon) {
      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
    }
  }

  private initializeSmoothScrolling(): void {
    setTimeout(() => {
      document.querySelectorAll('a[href^="#"]').forEach((anchor: Element) => {
        anchor.addEventListener('click', (e: Event) => {
          e.preventDefault();
          
          const href = (anchor as HTMLElement).getAttribute('href');
          if (href && href !== '#') {
            const target = document.querySelector(href);
            if (target) {
              const mobileMenu = document.getElementById('mobile-menu');
              if (mobileMenu) {
                mobileMenu.classList.remove('active');
                this.resetMobileMenuIcon();
              }
              
              const headerHeight = document.querySelector('header')?.offsetHeight || 80;
              const targetPosition = (target as HTMLElement).offsetTop - headerHeight;
              
              window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
              });
            }
          }
        });
      });
    }, 200); 
  }
}