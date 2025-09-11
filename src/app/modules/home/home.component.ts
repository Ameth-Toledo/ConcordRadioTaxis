import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { HeroComponent } from "../../components/hero/hero.component";
import { ServicesComponent } from "../../components/services/services.component";
import { FlotaComponent } from "../../components/flota/flota.component";
import { ContactoComponent } from "../../components/contacto/contacto.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, HeroComponent, ServicesComponent, FlotaComponent, ContactoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
