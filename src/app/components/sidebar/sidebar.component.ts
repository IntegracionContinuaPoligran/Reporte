import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { MenuModel } from 'src/app/models/menu.model';
import { MenuService } from 'src/app/services/menu.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  private menu: MenuModel [] = [] ;
  public menuItems: any[];
  public isCollapsed = true;
  public PROP: any[];  

  constructor(
    private router: Router,
    private servicio: MenuService,
    private token: TokenStorageService) { }

  ngOnInit() {
    this.obtenerMenu(); 
  }

  sideBarCollapse(id: string) {
    this.menuItems.forEach((menu) => {
      if (menu.rol === id) {
        menu.isCollapsed = !menu.isCollapsed;
      } else {
        menu.isCollapsed = true;
      }
    });

  }

  obtenerMenu() {
    this.menu= this.token.obtenerMenu();    
    this.menuItems = this.menu.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
    }); 
  }
}
