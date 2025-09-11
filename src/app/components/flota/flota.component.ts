import { AfterViewInit, Component, OnDestroy, OnInit, ElementRef } from '@angular/core';

// Declaración global para gtag (opcional - solo si usas Google Analytics)
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

@Component({
  selector: 'app-flota',
  standalone: true,
  imports: [],
  templateUrl: './flota.component.html',
  styleUrl: './flota.component.css'
})
export class FlotaComponent implements OnInit, AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;
  private scrollListener?: () => void;

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.initIntersectionObserver();
  }

  ngAfterViewInit(): void {
    this.initScrollEffects();
  }

  ngOnDestroy(): void {
    // Limpiar observers y listeners
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  /**
   * Función para reservar un vehículo específico
   * @param vehiculo - Nombre del vehículo seleccionado
   */
  reservar(vehiculo: string): void {
    const mensaje = `Hola! Me interesa reservar un ${vehiculo} para un viaje. ¿Podrían darme información sobre tarifas y disponibilidad?`;
    const numeroWhatsApp = '9613037813';
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    
    // Track del evento antes de abrir WhatsApp
    this.trackEvent('reservar_vehiculo', vehiculo);
    
    // Abrir WhatsApp en una nueva ventana
    window.open(url, '_blank');
  }

  /**
   * Función para contactar directamente por WhatsApp
   */
  contactarWhatsApp(): void {
    const mensaje = 'Hola! Me gustaría solicitar información sobre sus servicios de taxi. ¿Podrían ayudarme?';
    const numeroWhatsApp = '9613037813';
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    
    // Track del evento
    this.trackEvent('contactar_whatsapp');
    
    // Abrir WhatsApp en una nueva ventana
    window.open(url, '_blank');
  }

  /**
   * Inicializar el Intersection Observer para las animaciones de entrada
   */
  private initIntersectionObserver(): void {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-in-up');
          
          // Track de visibilidad de tarjetas
          const vehicleName = entry.target.querySelector('h3')?.textContent;
          if (vehicleName) {
            this.trackEvent('ver_vehiculo', vehicleName);
          }
        }
      });
    }, { 
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observar las tarjetas de vehículos después de que se rendericen
    setTimeout(() => {
      const vehicleCards = this.elementRef.nativeElement.querySelectorAll('.vehicle-card');
      vehicleCards.forEach((card: Element) => {
        this.observer?.observe(card);
      });
    }, 100);
  }

  /**
   * Inicializar efectos de scroll para las partículas
   */
  private initScrollEffects(): void {
    this.scrollListener = () => {
      const scrolled = window.pageYOffset;
      const particles = this.elementRef.nativeElement.querySelectorAll('.particle');
      
      particles.forEach((particle: HTMLElement, index: number) => {
        const speed = (index + 1) * 0.5;
        particle.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };

    // Throttle del scroll para mejor performance
    let ticking = false;
    const throttledScrollListener = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.scrollListener?.();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScrollListener, { passive: true });
  }

  /**
   * Función utilitaria para tracking de eventos
   * @param action - Acción realizada
   * @param vehiculo - Vehículo seleccionado (opcional)
   */
  private trackEvent(action: string, vehiculo?: string): void {
    try {
      // Google Analytics 4 (gtag)
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
          event_category: 'Flota',
          event_label: vehiculo || 'General',
          custom_parameter_1: 'Concord_Taxi'
        });
      }

      // Facebook Pixel (si lo tienes configurado)
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          content_name: vehiculo || 'Contacto General',
          content_category: 'Taxi Service'
        });
      }

      // Log para desarrollo
      console.log(`📊 Evento registrado: ${action}`, vehiculo ? `| Vehículo: ${vehiculo}` : '');
      
    } catch (error) {
      console.warn('Error en tracking:', error);
    }
  }

  /**
   * Función para manejar errores de carga de imágenes
   * @param event - Evento de error
   */
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    console.warn('Error cargando imagen:', target.src);
    
    // Imagen de fallback - puedes cambiar esta ruta
    target.src = 'assets/images/default-car.jpg';
    
    // Si tampoco existe la imagen por defecto, usar una imagen de placeholder
    target.onerror = () => {
      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xNzUgMTAwSDIyNVYxNTBIMTc1VjEwMFoiIGZpbGw9IiM2Mzc0OEEiLz4KPHN2ZyBjbGFzcz0idzYgaDYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzlDQTNBRiIgdmlld0JveD0iMCAwIDI0IDI0Ij4KPHA+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3A+Cjwvc3ZnPgo=';
    };
  }

  /**
   * Función para detectar si el dispositivo es móvil
   */
  private isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Función para mejorar la experiencia en dispositivos móviles
   */
  private optimizeForMobile(): void {
    if (this.isMobileDevice()) {
      // Reducir animaciones en móvil para mejor performance
      const particles = this.elementRef.nativeElement.querySelectorAll('.particle');
      particles.forEach((particle: HTMLElement) => {
        particle.style.display = 'none';
      });
    }
  }
}