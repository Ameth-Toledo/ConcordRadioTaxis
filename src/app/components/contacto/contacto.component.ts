import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ContactForm {
  nombre: string;
  telefono: string;
  origen: string;
  destino: string;
  fecha: string;
  hora: string;
  pasajeros: number;
  mensaje: string;
}

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent implements OnInit, AfterViewInit, OnDestroy {
  
  private observer?: IntersectionObserver;
  private scrollListener?: () => void;
  
  // Formulario de contacto
  contactForm: ContactForm = {
    nombre: '',
    telefono: '',
    origen: '',
    destino: '',
    fecha: '',
    hora: '',
    pasajeros: 1,
    mensaje: ''
  };

  // Estado del formulario
  isSubmitting = false;
  showSuccess = false;
  showError = false;

  // Información de contacto
  contactInfo = {
    whatsapp: '9613037813',
    telefono: '961-303-7813',
    email: 'contacto@concord-taxi.com',
    direccion: 'Tuxtla Gutiérrez, Chiapas, México',
    horarios: '24 horas, 7 días a la semana'
  };

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.initIntersectionObserver();
    this.setMinDateTime();
  }

  ngAfterViewInit(): void {
    this.initScrollEffects();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  /**
   * Obtener fecha de hoy en formato YYYY-MM-DD
   */
  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Enviar formulario por WhatsApp
   */
  onSubmit(): void {
    if (this.isSubmitting) return;

    if (!this.validateForm()) {
      this.showError = true;
      setTimeout(() => this.showError = false, 5000);
      return;
    }

    this.isSubmitting = true;
    
    // Simular delay de envío
    setTimeout(() => {
      this.sendWhatsAppMessage();
      this.isSubmitting = false;
      this.showSuccess = true;
      this.resetForm();
      
      setTimeout(() => this.showSuccess = false, 5000);
    }, 1000);
  }

  /**
   * Validar formulario
   */
  private validateForm(): boolean {
    const { nombre, telefono, origen, destino, fecha, hora } = this.contactForm;
    return !!(nombre.trim() && telefono.trim() && origen.trim() && destino.trim() && fecha && hora);
  }

  /**
   * Enviar mensaje por WhatsApp
   */
  private sendWhatsAppMessage(): void {
    const { nombre, telefono, origen, destino, fecha, hora, pasajeros, mensaje } = this.contactForm;
    
    let whatsappMessage = `🚖 *SOLICITUD DE TAXI - CONCORD*\n\n`;
    whatsappMessage += `👤 *Cliente:* ${nombre}\n`;
    whatsappMessage += `📱 *Teléfono:* ${telefono}\n`;
    whatsappMessage += `📍 *Origen:* ${origen}\n`;
    whatsappMessage += `🎯 *Destino:* ${destino}\n`;
    whatsappMessage += `📅 *Fecha:* ${this.formatDate(fecha)}\n`;
    whatsappMessage += `🕐 *Hora:* ${hora}\n`;
    whatsappMessage += `👥 *Pasajeros:* ${pasajeros}\n`;
    
    if (mensaje.trim()) {
      whatsappMessage += `💬 *Mensaje:* ${mensaje}\n`;
    }
    
    whatsappMessage += `\n✨ ¡Gracias por elegir Concord Taxi!`;

    const url = `https://wa.me/${this.contactInfo.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
    
    this.trackEvent('enviar_formulario_contacto', `${origen} → ${destino}`);
  }

  /**
   * Contacto directo por WhatsApp
   */
  contactarWhatsApp(tipo: 'general' | 'emergencia' = 'general'): void {
    let mensaje = '';
    
    if (tipo === 'emergencia') {
      mensaje = '🚨 EMERGENCIA - Necesito un taxi URGENTE. Por favor contactarme inmediatamente.';
    } else {
      mensaje = 'Hola! Me gustaría solicitar información sobre sus servicios de taxi. ¿Podrían ayudarme?';
    }

    const url = `https://wa.me/${this.contactInfo.whatsapp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    
    this.trackEvent('contacto_directo', tipo);
  }

  /**
   * Llamar por teléfono
   */
  llamarTelefono(): void {
    window.location.href = `tel:${this.contactInfo.whatsapp}`;
    this.trackEvent('llamar_telefono');
  }

  /**
   * Resetear formulario
   */
  private resetForm(): void {
    this.contactForm = {
      nombre: '',
      telefono: '',
      origen: '',
      destino: '',
      fecha: '',
      hora: '',
      pasajeros: 1,
      mensaje: ''
    };
    // Resetear también la fecha mínima
    this.setMinDateTime();
  }

  /**
   * Establecer fecha y hora mínima
   */
  private setMinDateTime(): void {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    this.contactForm.fecha = `${year}-${month}-${day}`;
  }

  /**
   * Formatear fecha para WhatsApp
   */
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    };
    return date.toLocaleDateString('es-MX', options);
  }

  /**
   * Inicializar Intersection Observer
   */
  private initIntersectionObserver(): void {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-in-up');
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    setTimeout(() => {
      const elements = this.elementRef.nativeElement.querySelectorAll('.animate-on-scroll');
      elements.forEach((element: Element) => {
        this.observer?.observe(element);
      });
    }, 100);
  }

  /**
   * Efectos de scroll
   */
  private initScrollEffects(): void {
    this.scrollListener = () => {
      const scrolled = window.pageYOffset;
      const particles = this.elementRef.nativeElement.querySelectorAll('.particle');
      
      particles.forEach((particle: HTMLElement, index: number) => {
        const speed = (index + 1) * 0.3;
        particle.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };

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
   * Tracking de eventos
   */
  private trackEvent(action: string, label?: string): void {
    try {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', action, {
          event_category: 'Contacto',
          event_label: label || 'General',
          custom_parameter_1: 'Concord_Taxi'
        });
      }
      
      console.log(`📊 Evento: ${action}`, label ? `| ${label}` : '');
    } catch (error) {
      console.warn('Error en tracking:', error);
    }
  }

  /**
   * Obtener horarios sugeridos
   */
  getTimeSlots(): string[] {
    const slots = [];
    for (let hour = 6; hour <= 23; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  }
}