import { Component, OnInit, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/services/menu.service';
import { MenuModel } from 'src/app/models/menu.model';
import { error } from 'protractor';
import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UsuarioModel } from 'src/app/models/usuario.model';

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
  public usuario: UsuarioModel;

  constructor(
    location: Location,
     private element: ElementRef,
     private router: Router,
     private token: TokenStorageService,
     private servicio: MenuService) {
    this.location = location;
  }

  ngOnInit() {
    this.obtenerMenu();
    this.obtenerNombreUsuario();
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

  obtenerMenu() {
    this.menu = this.token.obtenerMenu();
    this.listTitles = this.menu.filter(listTitle => listTitle);
  }

  obtenerNombreUsuario() {
    this.servicio.obtenerNombreUsuario()
    .subscribe(resp => {
      resp.estado === true ? this.usuario = typeof(resp.mensaje1) == 'object' ?  resp.mensaje1 : JSON.parse(resp.mensaje1) : [];
      this.nombreUsuario = this.usuario.nombre;
      //resp.estado === true ? this.nombreUsuario = resp.mensaje1 : this.nombreUsuario = 'Usuario No Registrado';
    }, (error) => {
      this.nombreUsuario = 'Usuario No Registrado';
      console.log(error);
    });
  }

  salir() {
    this.router.navigateByUrl('/proyectos');
  }

}
