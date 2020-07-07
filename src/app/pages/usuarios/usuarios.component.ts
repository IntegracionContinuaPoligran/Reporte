import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProyectoModel } from 'src/app/models/proyecto.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { ProyectoBaseModel } from 'src/app/models/proyectoBase.model';
import { registroModel } from 'src/app/models/registro.model';
import { UtilesService } from 'src/app/services/utiles.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  public titulopagina = 'Administración de usuarios';
  public page = 1;
  public pageSize = 4;
  listProyectos: ProyectoModel[] = [];
  public listUsuarios: UsuarioModel[] = [];
  public listUsuariosFiltro: UsuarioModel[] = [];
  public collectionSize = this.listUsuarios.length;
  public Modelo: ProyectoBaseModel = new ProyectoBaseModel();
  public cargando: boolean;
  public sinData: boolean;
  public tituloModal: string;
  public mensajeModal = '';
  public confirmacionRegistro: registroModel = new registroModel();
  public modalError = false;
  public filtroUsuario = '';
  public modalUsuario = '';
  public modalProyecto = '0';
  public idUsuario = 0;
  public buscador = '';
  public mensaje1 = ' Seleccione un proyecto de la lista';
  public mensaje2 = ' Ocurrió un error  al guardar la información';
  public mensaje3 = 'Asignación proyecto base';

  constructor(
    private servicio: UsuarioService,
    private utiles: UtilesService,
    private router: Router,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.cargando = true;
    this.sinData = false;
    this.obtenerListaProyectos();
    this.obtenerListaUsuarios();
  }

  get listDataTable(): UsuarioModel[] {
    return this.listUsuariosFiltro
      .map((country, i) => ({ id: i + 1, ...country }))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  obtenerListaProyectos() {
    this.servicio.ObtenerProyectos()
      .subscribe(resp => {
        this.listProyectos =  typeof(resp.mensaje1) === 'object' ?  resp : JSON.parse(resp.mensaje1);
      }, (error) => {
        this.router.navigate(['login']);
        console.error(error);
        });
  }

  obtenerListaUsuarios() {
    this.servicio.ObtenerUsuarios()
      .subscribe(resp => {
        this.listUsuarios =  typeof(resp.mensaje1) === 'object' ?  resp : JSON.parse(resp.mensaje1);
        this.collectionSize = this.listUsuarios.length;
        this.pageSize = this.utiles.calcularPaginacion( this.collectionSize)
        this.cargando = false;
        this.sinData = this.listUsuarios.length === 0 ? true : false;
        this.filtro();
      }, (error) => {
        this.router.navigate(['login']);
        this.cargando = false;
        this.sinData = this.listUsuarios.length === 0 ? true : false;
        });
  }

  filtro() {
    const listArmado: UsuarioModel [] = [];
    if (this.buscador.length ===  0 || this.buscador === undefined || this.buscador === null) {
      this.listUsuariosFiltro = this.listUsuarios;;
      return;
    }

    this.listUsuarios.forEach(pro => {      
    const variable =  `${pro.nombre} ${pro.email} ${pro.cargo} ${pro.jefeInmediato} ${pro.proyectoBase}`;
    variable.toLowerCase().indexOf(this.buscador) > -1 ? listArmado.push(pro) : null;
    });

    this.sinData = listArmado.length > 0 ? false : true;
    this.listUsuariosFiltro = listArmado;
    this.collectionSize = this.listUsuariosFiltro.length;
    this.calcularpginacion();
    //this.pageSize =50; // this.utiles.calcularPaginacion( this.listUsuariosFiltro.length);
  }

  public filtrarRegistros() {
    let filtro1: UsuarioModel [] = [] ;
    const filtro2: UsuarioModel [] = [] ;

    filtro1 = this.listUsuarios;

    if (this.filtroUsuario.length > 0 && this.filtroUsuario != null) {
      filtro1.forEach(prom => {
        if (prom.nombre.indexOf(this.filtroUsuario) > -1) {
            filtro2.push(prom);
        }
      });
    }

     this.listUsuariosFiltro = filtro2.length === 0 ? filtro1 : filtro2;
     this.collectionSize = this.listUsuariosFiltro.length;
     this.calcularpginacion();
  }

  public calcularpginacion() {
       const tamanio = this.collectionSize;
       if (tamanio < 50) {
        this.pageSize = 10;
       } else if (tamanio < 200) {
        this.pageSize = 50;
       } else {
        this.pageSize = 100;
       }

  }

  public EditarUsuario(modal, idUsuario, nombre) {
    this.modalError = false;
    this.tituloModal =  this.mensaje3;
    this.buscarUsuario(idUsuario);
    this.modalService.open(modal,  {ariaLabelledBy: 'modal-basic-title'});
  }

  public buscarUsuario(idUsuario) {
    this.listUsuarios.forEach(pro => {
      if (pro.idUsuario === idUsuario) {
        this.Modelo.idUsuario = pro.idUsuario;
        this.Modelo.registroVenta = pro.proyectoBase;
        this.modalUsuario = pro.nombre;
      }
    });
  }

  public buscarProyecto() {
    let estado = false;
    this.listProyectos.forEach(pro => {
      if (pro.registroVenta === this.Modelo.registroVenta) {
        estado = true;
            }
    });
    return estado;
  }

  public guardarRegistro(modal) {

    if (this.Modelo.registroVenta === '0' || this.Modelo.registroVenta === '' || !this.buscarProyecto() ) {
      this.modalError = true;
      this.mensajeModal = this.mensaje1;
      return;
    }

    this.servicio.ActualizarProyectoBase(this.Modelo)
    .subscribe(resp => {
      if (resp.estado === true) {
        this.obtenerListaUsuarios();
        this.modalService.dismissAll(modal);
      } else {
        this.modalError = true;
        this.mensajeModal = this.mensaje2;
      }
    }, (error) => {
      console.error(error);
      this.modalError = true;
      this.mensajeModal = this.mensaje2;
     });
  }
}
