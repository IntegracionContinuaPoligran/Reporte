import { Component, OnInit } from '@angular/core';
import { AutomaticoPorUsuarioModel } from 'src/app/models/automaticoPorUsuario.model';
import { AutomaticoService } from 'src/app/services/automatico.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { registroModel } from 'src/app/models/registro.model';
import { AutomaticoComponent } from 'src/app/formularios/automatico/automatico.component';
import { UtilesService } from 'src/app/services/utiles.service';

@Component({
  selector: 'app-horas-automaticas',
  templateUrl: './horas-automaticas.component.html',
  styleUrls: ['./horas-automaticas.component.css']
})
export class HorasAutomaticasComponent implements OnInit {
  public titulopagina: string = 'Administración de horas automaticas';
  public page = 1;
  public pageSize = 4; 
  public listAutomaticoPorUsuario: AutomaticoPorUsuarioModel [] = [];
  public listAutomaticoPorUsuarioFiltro: AutomaticoPorUsuarioModel [] = []
  public collectionSize = this.listAutomaticoPorUsuario.length;
  public cargando: boolean;
  public sinData: boolean;  
  public confirmacionRegistro: registroModel= new registroModel(); 
  public modal;
  public nombreModal = 'modalConfirmacion';
  public buscador='';
  public msmExitosoPut = 'Se almaceno la información con éxito';  
  public msmErrorPut = 'Se presentó un error al guardar la información';
  public msmExitosoDelete = 'Se elimino la información con éxito';  
  public msmErrorDelete = 'Se presentó un error al eliminar la información';
  public tituloModal = 'Confirmacion'
  public mensajeModal = '¿Está seguro de eliminar el registro?'
  public delete = true;
  
  constructor(
    private servicio: AutomaticoService,
    private utiles: UtilesService,
    private router: Router,
    private modalService: NgbModal) { }

  ngOnInit(): void {    
    this.obtenerListaAutomaticosPorUsuario();
  }

  obtenerListaAutomaticosPorUsuario() {
    this.antesDepeticion();
    this.servicio.ObtenerAutomaticosPorUsuario()
      .subscribe(resp => {        
        this.listAutomaticoPorUsuario = typeof(resp.mensaje1) == 'object' ?  resp.mensaje1 : JSON.parse(resp.mensaje1);
        this.despuesDePEticion();
      }, (error) => {
        this.router.navigate(['login']);
        console.log(error);
        })
      ;
  }

  antesDepeticion() {
    this.cargando = true; 
    this.sinData = false;
  }

  despuesDePEticion() {    
    this.pageSize = this.utiles.calcularPaginacion(this.listAutomaticoPorUsuario.length);
    this.filtro();
    this.collectionSize = this.listAutomaticoPorUsuario.length;
    this.cargando = false;
    this.sinData = this.listAutomaticoPorUsuario.length == 0 ? true : false; 
  }

  filtro() {
    let listArmado: AutomaticoPorUsuarioModel [] = [];
    if (this.buscador.length ===  0 || this.buscador === undefined || this.buscador === null)
    {
      this.listAutomaticoPorUsuarioFiltro = this.listAutomaticoPorUsuario;
      return;
    }

    this.listAutomaticoPorUsuario.forEach(pro =>{
      const variable =  `${pro.nombre} ${pro.totalPorcentaje} ${pro.listaAutomaticos.length} `
      variable.toLowerCase().indexOf(this.buscador) > -1 ? listArmado.push(pro): null;      
    });

    this.sinData = listArmado.length > 0 ? false : true;
    this.listAutomaticoPorUsuarioFiltro = listArmado;
    this.collectionSize = this.listAutomaticoPorUsuarioFiltro.length;    
  }
  
  get listDataTable(): AutomaticoPorUsuarioModel[] {
    return this.listAutomaticoPorUsuarioFiltro
      .map((data, i) => ({ id: i + 1, ...data }))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  nuevoRegistro() {    
    this.abrirFormulario(null);
  }

  edicionRegistro( id) {
    const registro : AutomaticoPorUsuarioModel [] = this.listAutomaticoPorUsuario.filter(pro => pro.idUsuario == id);
     this.abrirFormulario(registro);
  }

  abrirFormulario(inputRegistro) {    
    const modalRef = this.modalService.open(AutomaticoComponent, { size: 'lg' });
    modalRef.componentInstance.inputModelo= inputRegistro === null ? null :  inputRegistro[0];
    modalRef.componentInstance.result.subscribe((receivedProyecto: AutomaticoComponent) => {      
      this.obtenerListaAutomaticosPorUsuario();
      this.delete = false;
      this.utiles.notificacionExito();
    }, (error) => {     
      this.delete = false;
      this.utiles.notificacionError();
      console.log(error);
    });
  }

  confirmarEliminacion(modal, id: number) {
    this.confirmacionRegistro.idregistro = id; 
    this.modalService.open(modal,  {ariaLabelledBy: 'modal-basic-title'});
  }

  eliminarRegistro() {
    this.servicio.EliminarAutomaticosPorUsuario(this.confirmacionRegistro)
      .subscribe(resp => {
        this.despuesEliminar(resp.estado);
        
      }, (error) => {
        this.utiles.notificacionError(); 
        this.delete= true;
        this.router.navigate(['login']);        
        })
      ;
  }

  despuesEliminar(est) {
    this.delete= true;
    this.modalService.dismissAll(this.nombreModal);
    if (est === true) {
      this.utiles.notificacionExito();   
      this.listAutomaticoPorUsuario = this.listAutomaticoPorUsuario.filter(pro => pro.idUsuario != this.confirmacionRegistro.idregistro);
      this.listAutomaticoPorUsuarioFiltro = this.listAutomaticoPorUsuarioFiltro.filter(pro => pro.idUsuario != this.confirmacionRegistro.idregistro);
    }
    else {
      this.utiles.notificacionError();
    }
   
  }

}
