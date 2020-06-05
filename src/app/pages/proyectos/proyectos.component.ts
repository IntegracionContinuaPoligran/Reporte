import { Component, OnInit, PipeTransform } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProyectoComponent } from '../../formularios/proyecto/proyecto.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { ProyectoModel } from 'src/app/models/proyecto.model';
import { Router } from '@angular/router';
import { UtilesService } from 'src/app/services/utiles.service';
import { registroModel } from 'src/app/models/registro.model';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css'],
})
export class ProyectosComponent implements OnInit {
  page = 1;
  pageSize = 4;
  listProyectos: ProyectoModel[] = [];
  listProyectosFiltro: ProyectoModel[] = [];
  collectionSize = this.listProyectos.length;
  private date: number = Date.now();
  public cargando: boolean;
  public sinData: boolean;
  public tituloModal = 'Confirmacion';
  public mensajeModal = '¿Está seguro de  deshabilitar el registro?';
  public confirmacionRegistroVenta: string;
  public buscador = '';
  public delete = true;
  public msmExitosoPut = 'Se almaceno la información con éxito';
  public msmErrorPut = 'Se presentó un error al guardar la información';
  public msmExitosoDelete = 'Se elimino la información con éxito';
  public msmErrorDelete = 'Se presentó un error al eliminar la información';
  public nombreModal = 'modalConfirmacion';

  ngOnInit(): void {
    this.obtenerListaProyectos();
  }

  get proyectos(): ProyectoModel[] {
    return this.listProyectosFiltro
      .map((country, i) => ({ id: i + 1, ...country }))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  constructor(private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private proyectoService: ProyectoService,
    private utiles: UtilesService) { }


  agregarNuevoProyecto() {
    const modalRef = this.modalService.open(ProyectoComponent, { size: 'lg' });
    modalRef.componentInstance.inputproyectoModel = null;
    modalRef.componentInstance.result.subscribe((resp) => {
      this.despuesDepeticionFormulario(resp);
    }, (error) => {
      this.delete = false;
      this.utiles.notificacionError();
      console.log(error);
    });
  }

  despuesDepeticionFormulario(estado) {
    this.delete = false;
    if (estado) {
      this.obtenerListaProyectos();
      this.utiles.notificacionExito();
    } else {
      this.utiles.notificacionError();
    }
  }

  edicionProyecto(registroVenta: string) {
    const proyecto: ProyectoModel [] = this.listProyectos.filter(pro => pro.registroVenta === registroVenta);

    const modalRef = this.modalService.open(ProyectoComponent, { size: 'lg' });
    modalRef.componentInstance.inputproyectoModel = proyecto.length === 1 ? proyecto[0] : null;
    modalRef.componentInstance.result.subscribe((resp) => {
      this.despuesDepeticionFormulario(resp);
    }, (error) => {
      this.delete = false;
      this.utiles.notificacionError();
      console.log(error);
    });
  }

  confirmarEliminacion(content, registroVenta) {
  this.confirmacionRegistroVenta = registroVenta;
  this.modalService.open(content,  {ariaLabelledBy: 'modal-basic-title'});
  }

  obtenerListaProyectos() {
    this.antesDePeticion();
    this.proyectoService.ObtenerListaProyectos()
      .subscribe(resp => {
        this.listProyectos = typeof(resp.mensaje1) === 'object' ?  resp.mensaje1 : JSON.parse(resp.mensaje1);
        this.despuesDepeticion();
      }, (error) => {
        console.log(error);
        this.router.navigate(['login']);
        });
  }

  antesDePeticion() {
    this.cargando = true;
    this.sinData = false;
  }

  despuesDepeticion() {
    this.collectionSize = this.listProyectos.length;
    this.cargando = false;
    this.sinData = this.listProyectos.length === 0 ? true : false;
    this.filtro();
  }

  filtro() {
    const listArmado: ProyectoModel [] = [];
    if (this.buscador.length ===  0 || this.buscador === undefined || this.buscador === null) {
      this.listProyectosFiltro = this.listProyectos;
      return;
    }

    this.listProyectos.forEach(pro => {
      const horas = pro.registroVenta + ' : ' + pro.proyecto;
    const variable =  `${pro.registroVenta} ${pro.proyecto} ${pro.responsables[0].nombre} ${pro.activo}`;
    variable.toLowerCase().indexOf(this.buscador) > -1 ? listArmado.push(pro) : null;
    });

    this.sinData = listArmado.length > 0 ? false : true;
    this.listProyectosFiltro = listArmado;
    this.collectionSize = this.listProyectosFiltro.length;
    this.pageSize = this.utiles.calcularPaginacion( this.listProyectosFiltro.length);
  }

  desabilitarProyecto() {
    this.delete = true;
    let registro: registroModel = new registroModel();
    registro.parametro1 = this.confirmacionRegistroVenta; 
    this.proyectoService.DesabilitarProyecto(registro)
      .subscribe(resp => {
        if (resp.estado === true) {
          this.listProyectos = this.listProyectos.filter(pro => pro.registroVenta !== this.confirmacionRegistroVenta);
          this.filtro();
          this.utiles.notificacionExito();
          this.modalService.dismissAll(this.nombreModal);

        } else {
          this.utiles.notificacionError();
        }
      }, (error) => {
        this.utiles.notificacionError();
        console.log(error);
        this.router.navigate(['login']);
        })
      ;
  }

}
