import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  scrollToContacto() {
    const elemento = document.getElementById('contacto');
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth' }); 
    }
  }

  scrollToFlota() {
    const elemento = document.getElementById('flota');
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth'});
    }
  }
}
