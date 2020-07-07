import { Component, OnInit } from '@angular/core';
import { MenuModel } from 'src/app/models/menu.model';
import { RolService } from 'src/app/services/rol.service';
import { UtilesService } from 'src/app/services/utiles.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RolComponent } from 'src/app/formularios/rol/rol.component';
import { registroModel } from 'src/app/models/registro.model';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  public titulopagina: string = 'Administracion Roles';
  public page = 1;
  public pageSize = 4;
  public listMenu: MenuModel [] = [];
  public listMenuFiltro: MenuModel [] = [];  
  public collectionSize = this.listMenuFiltro.length;
  public cargando: boolean;
  public sinData: boolean;
  public idRol = 0;
  public nombreModal = 'modalConfirmacion';
  public delete = true;
  public buscador = '';
  public tituloModal = 'Confirmacion';
  public mensajeModal =  '¿Está seguro de eliminar el registro?';
  public msmExitosoPut = 'Se almaceno la información con éxito';  
  public msmErrorPut = 'Se presentó un error al guardar la información';
  public msmExitosoDelete = 'Se elimino la información con éxito';  
  public msmErrorDelete = 'Se presentó un error al eliminar la información';
  public nombreArchivo = 'Roles';
  public confirmacionRegistro: registroModel= new registroModel();


  constructor(
    private servicio: RolService,
    private utiles: UtilesService,
    private router: Router,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.obtenerRoles();
  }

  obtenerRoles() {
    this.antesPeticionRH();
    this.servicio.obtenerRoles()
    .subscribe(resp => {
      resp.estado === true ? this.listMenu = typeof(resp.mensaje1) == 'object' ?  resp.mensaje1 : JSON.parse(resp.mensaje1) : [];
      this.despuesPeticionRH();
    }, (error) => {
      console.error(error);
      this.router.navigate(['login']);        
      })
  }

  antesPeticionRH() {
    this.cargando = true; 
    this.sinData = false;
  }

  despuesPeticionRH() {
    this.cargando = false;
    this.sinData = this.listMenu.length == 0 ? true : false;
    this.collectionSize = this.listMenu.length;
    this.pageSize = this.utiles.calcularPaginacion (this.listMenu.length)   
    this.filtro();    
  }

  get listDataTable(): MenuModel[] {    
    return this.listMenuFiltro
      .map((data, i) => ({ id: i + 1, ...data }))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  filtro() {
    let listArmado: MenuModel [] = [];
    if (this.buscador.length ===  0 || this.buscador === undefined || this.buscador === null)
    {
      this.listMenuFiltro = this.listMenu;
      this.pageSize = this.utiles.calcularPaginacion (this.listMenuFiltro.length)       
      return;
    }

    this.listMenu.forEach(pro =>{      
    const variable =  `${pro.rol} ${pro.icon}`
    variable.toLowerCase().indexOf(this.buscador) > -1 ? listArmado.push(pro): null;  
    });

    this.sinData = listArmado.length > 0 ? false : true;
    this.listMenuFiltro = listArmado;
    this.collectionSize= this.listMenuFiltro.length; 
    this.pageSize = this.utiles.calcularPaginacion (this.listMenuFiltro.length)   
  }

  nuevoRegistro() {    
    this.abrirFormulario(null);
  }

  edicionRegistro(id) {
    const registro : MenuModel [] = this.listMenu.filter(pro => pro.idRol == id);
     this.abrirFormulario(registro);
  }

  abrirFormulario(inputRegistro) {    
    const modalRef = this.modalService.open(RolComponent, { size: 'lg' });
    modalRef.componentInstance.inputModelo= inputRegistro === null ? null :  inputRegistro[0]; 
    modalRef.componentInstance.result.subscribe((resp) => {         
    this.despuesdePeticionFormulario(resp);
    }, (error) => {
      console.error(error);
      this.delete = false;
      this.utiles.notificacionError();
    });
  }

  despuesdePeticionFormulario(resp) {
    this.delete = false;
    if (resp.estado === true) {
      this.utiles.notificacionExito();
      this.obtenerRoles();
    } else {
      this.utiles.notificacionError();
    }   
   
  }

  confirmarEliminacion(modal, id: number) {    
    this.confirmacionRegistro.idregistro = id;   
    this.modalService.open(modal,  {ariaLabelledBy: 'modal-basic-title'});
  }

  eliminarRegistro() {
    this.servicio.desabilitarRol(this.confirmacionRegistro)
      .subscribe(resp => {       
        this.despuesEliminar(resp.estado);      
      }, (error) => {        
        this.utiles.notificacionError(); 
        this.delete= true;
        })
      ;
  }

  despuesEliminar(est) {
    this.delete= true;
    this.modalService.dismissAll(this.nombreModal);
    if (est ===true) {
      this.utiles.notificacionExito();    
      this.listMenu = this.listMenu.filter(pro => pro.idRol !== this.confirmacionRegistro.idregistro);
      this. filtro();
      //this.listMenuFiltro = this.listMenuFiltro.filter(pro => pro.idRol !== this.confirmacionRegistro.idregistro);
   
    } else {
      this.utiles.notificacionError();
    }
    
  }

}
