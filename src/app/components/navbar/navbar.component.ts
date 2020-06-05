import { Component, OnInit, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

//Servicios
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { MenuService } from 'src/app/services/menu.service';

//Modelos
import { MenuModel } from '../../models/menu.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public focus;
  public listTitles: any[] = [];
  public location: Location;
  private menu: MenuModel [] = [];
  public nombreUsuario = '';


  constructor(location: Location, private element: ElementRef, private router: Router,
     private token: TokenStorageService, private servicio: MenuService) {
      this.location = location;
  }

  ngOnInit() {
    this.obtenerMenu();
    this.obtenerNombreUsuario();
  }

  obtenerMenu() {
    this.menu = this.token.obtenerMenu();
    this.listTitles = this.menu.filter(listTitle => listTitle);
  }

  obtenerNombreUsuario() {
    this.servicio.obtenerNombreUsuario()
    .subscribe(resp => {
      resp.estado === true ? this.nombreUsuario = resp.mensaje1 : this.nombreUsuario = 'Usuario No Registrado';
    }, (error) => {
      this.nombreUsuario = 'Usuario No Registrado';
      console.log(error);
    });
  }

  getTitle() {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }

    for (let item = 0; item < this.listTitles.length; item++) {
      for (let pagina = 0; pagina < this.listTitles[item].paginas.length; pagina++) {
        if (this.listTitles[item].paginas[pagina].path === titlee) {
          const tituloPagina = this.listTitles[item].paginas[pagina].title;
          const rol = this.listTitles[item].rol;
          return `${ rol } / ${ tituloPagina }`;
        }
      }
    }
    return 'Dashboard';
  }

  salir() {
    this.router.navigateByUrl('/login');
  }
  
}
