import { Component, OnInit } from '@angular/core';
import { RergistroHoraModel } from 'src/app/models/registroHora.model';
import { registroModel } from 'src/app/models/registro.model';
import { RegistroHorasService } from 'src/app/services/registro-horas.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistroHorasComponent } from 'src/app/formularios/registro-horas/registro-horas.component';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { EstadoModel } from 'src/app/models/estado.model';
import { ProyectoModel } from 'src/app/models/proyecto.model';
import { UtilesService } from 'src/app/services/utiles.service';
import { MenuService } from 'src/app/services/menu.service';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { ParametroModel } from 'src/app/models/parametro.model';


interface ReporteRegistroHoras {
  Nombre: string;
  Registro_Venta: string;
  Proyecto: string;  
  Actividad: string;
  Horas:string
  Solicitud: string;
  Fecha_Registro: string;
  Estado: string;
}

@Component({
  selector: 'app-reporte-tiempos',
  templateUrl: './reporte-tiempos.component.html',
  styleUrls: ['./reporte-tiempos.component.scss']
})
export class ReporteTiemposComponent implements OnInit {
  public titulopagina: string = 'Periodo en curso: ';  
  public showCard: boolean;
  public page = 1;
  public pageSize = 4;
  public reglas:  ParametroModel [] = [];
  public listRegistroHoras: RergistroHoraModel [] = [];
  public listRegistroHorasFiltro: RergistroHoraModel [] = [];  
  public collectionSize = this.listRegistroHoras.length;
  public cargando: boolean;
  public sinData: boolean;  
  public usuario: UsuarioModel;
  public confirmacionRegistro: registroModel= new registroModel();
  public cardHorasRegistradas = '00 : 00';
  public cardHorasRechazadas = '00 : 00';
  public cardHorasAprobadas = '00 : 00';
  public cardHoraspendientes = '00 : 00';  
  public mensaje1: string = 'Se guardo el registro con éxito';  
  public mensaje3: string = 'Se presentó un error al guardar la información'; 
  public mensaje5: string = '';
  public tituloModal = 'Confirmacion';;
  public mensajeModal =  '¿Está seguro de eliminar el registro?';
  public copia: boolean = false;
  public cardPorcentajeAprobadas = '00 %';
  public cardPorcentajePendientes = '00 %';
  public cardPorcentajeRechazadas = '00 %';
  public cardPorcentajeRegistradas = '00 %';  
  public buscador = '';
  public nombreModal = 'modalConfirmacion';
  public delete = true;
  public msmExitosoPut = 'Se almaceno la información con éxito';  
  public msmErrorPut = 'Se presentó un error al guardar la información';
  public msmExitosoDelete = 'Se elimino la información con éxito';  
  public msmErrorDelete = 'Se presentó un error al eliminar la información';
  public nombreArchivo = 'RegistroHoras';  
  public generandoArchivo = false;

  constructor(
    private servicio: RegistroHorasService,
    private servicioAux: MenuService,
    private utiles: UtilesService,
    private router: Router,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.showCard = true;
    this.obtenerReglas();
    this.obtenerRegistroHoras();
  }

  obtenerReglas() {
    const registro: registroModel =  new registroModel();
    registro.parametro1 = 'RegistroHoras';
    this.servicio.ObtenerReglas(registro)
    .subscribe(resp => {
      if (resp.estado === true) {
        this.reglas = typeof(resp.mensaje1) === 'object' ?  resp.mensaje1 : JSON.parse(resp.mensaje1);
        this.armarMensajePeriodo();
      } 
    }, (error) => {
      console.error(error);
      this.router.navigate(['login']);    
     });    
  }

  armarMensajePeriodo(){
    let inicio, fin;
    this.reglas.forEach(dato => {
      if (dato.variable == 'periodoActualInicial')
        inicio =dato.valor;
      
        if (dato.variable == 'periodoActualFinal')
        fin = dato.valor;      
    });
    this.titulopagina = this.titulopagina + inicio + ' al ' + fin; 
  }

  obtenerRegistroHoras() {
    this.antesPeticionRH();
    this.servicio.ObtenerRegistroHorasPorUsuario()
    .subscribe(resp => {
      resp.estado === true ? this.listRegistroHoras = typeof(resp.mensaje1) == 'object' ?  resp.mensaje1 : JSON.parse(resp.mensaje1) : [];
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
    this.sinData = this.listRegistroHoras.length == 0 ? true : false;
    this.collectionSize = this.listRegistroHoras.length;
    this.pageSize = this.utiles.calcularPaginacion (this.listRegistroHoras.length)
    this.obtenerIdUsuario();
    this.filtro();
    this.informacionTarjetas();   
  }
    
  obtenerIdUsuario(){
    this.servicioAux.obtenerNombreUsuario()
    .subscribe(resp => {
      resp.estado === true ? this.usuario = typeof(resp.mensaje1) == 'object' ?  resp.mensaje1 : JSON.parse(resp.mensaje1) : [];
        
    }, (error) => {      
      console.log(error);
    });
  }
  get listDataTable(): RergistroHoraModel[] {    
    return this.listRegistroHorasFiltro
      .map((data, i) => ({ id: i + 1, ...data }))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  filtro() {
    let listArmado: RergistroHoraModel [] = [];
    if (this.buscador.length ===  0 || this.buscador === undefined || this.buscador === null)
    {
      this.listRegistroHorasFiltro = this.listRegistroHoras;      
      return;
    }

    this.listRegistroHoras.forEach(pro =>{
      const horas = pro.horas.hora + ' : ' + pro.horas.minuto;
    const variable =  `${pro.registroVenta} ${pro.proyecto} ${pro.actividad} ${pro.estadoNombre}  ${this.formatearFecha(pro.fechaReporte)} ${horas} `
    variable.toLowerCase().indexOf(this.buscador) > -1 ? listArmado.push(pro): null;  
    });

    this.sinData = listArmado.length > 0 ? false : true;
    this.listRegistroHorasFiltro = listArmado;
    this.collectionSize= this.listRegistroHorasFiltro.length;   
  }


  informacionTarjetas() {
    var pendientes: RergistroHoraModel [] = this.listRegistroHoras.filter(pro => pro.estado === 1);
    var aprobadas: RergistroHoraModel [] = this.listRegistroHoras.filter(pro => pro.estado === 2);
    var rechazadas: RergistroHoraModel [] = this.listRegistroHoras.filter(pro => pro.estado === 3);

    this.cardHorasRegistradas = this.utiles.sumarHoras(this.listRegistroHoras);
    this.cardHoraspendientes = this.utiles.sumarHoras(pendientes);
    this.cardHorasRechazadas = this.utiles.sumarHoras(rechazadas);
    this.cardHorasAprobadas = this.utiles.sumarHoras(aprobadas);
    this.cardPorcentajePendientes = this.utiles.calcularPorcenta(this.cardHorasRegistradas, this.cardHoraspendientes );
    this.cardPorcentajeAprobadas = this.utiles.calcularPorcenta(this.cardHorasRegistradas, this.cardHorasAprobadas );
    this.cardPorcentajeRechazadas = this.utiles.calcularPorcenta(this.cardHorasRegistradas, this.cardHorasRechazadas );

  }

   formatearFecha(fecha) { 
     return this.utiles.formatearFecha(fecha);
  }

   nuevoRegistro() {    
    this.abrirFormulario(null);
  }

   edicionRegistro(id){
    const registro : RergistroHoraModel [] = this.listRegistroHoras.filter(pro => pro.idRegistro == id);
     this.abrirFormulario(registro);
  }

   copiarRegistro( id){
    const registro : RergistroHoraModel [] = this.listRegistroHoras.filter(pro => pro.idRegistro == id);
    this.copia = true;
    this.abrirFormulario(registro);
    this.copia = false;
  }

   abrirFormulario(inputRegistro) {    
    const modalRef = this.modalService.open(RegistroHorasComponent, { size: 'lg' });
    modalRef.componentInstance.inputModelo= inputRegistro === null ? null :  inputRegistro[0];
    modalRef.componentInstance.inputCopia=  this.copia;
    modalRef.componentInstance.inputIdUsuario = this.usuario.idUsuario;
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
      this.obtenerRegistroHoras();
    } else {
      this.utiles.notificacionError();
    }   
   
  }

  confirmarEliminacion(modal, id: number) {    
    this.confirmacionRegistro.idregistro = id;   
    this.modalService.open(modal,  {ariaLabelledBy: 'modal-basic-title'});
  }

  eliminarRegistro() {
    this.servicio.EliminarRegistroHoras(this.confirmacionRegistro)
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
      this.listRegistroHoras = this.listRegistroHoras.filter(pro => pro.idRegistro !== this.confirmacionRegistro.idregistro);
      this.listRegistroHorasFiltro = this.listRegistroHorasFiltro.filter(pro => pro.idRegistro !== this.confirmacionRegistro.idregistro);
      this.informacionTarjetas();
    } else {
      this.utiles.notificacionError();
    }
    
  }

  generarExcel() {    
    let listReporte: ReporteRegistroHoras [] = this.generarModeloReporte();  
    this.generandoArchivo = true;
    this.utiles.exportAsExcelFile(listReporte,this.nombreArchivo)
    .then(resp => {
      if(resp === true){
        this.generandoArchivo = false;
      } else {
      this.generandoArchivo = false;     
      console.log(resp);
      }
    })
    .catch(error => {
      this.generandoArchivo = false;    
      console.log(error);
    });    
  }

  generarModeloReporte(){    
    let listReporte: ReporteRegistroHoras [] = [];
    this.listRegistroHoras .forEach(pro =>{
      let modelo = {
      Nombre : pro.nombreUsuario,
      Registro_Venta : pro.registroVenta,
      Proyecto : pro.proyecto,
      Horas : pro.horas.hora + ' : ' + pro.horas.minuto,
      Actividad : pro.actividad,
      Solicitud: pro.solcitud,
      Fecha_Registro : this.formatearFecha(pro.fechaReporte),
      Estado : pro.estadoNombre
      };
      listReporte.push(modelo);
    }); 

    return listReporte;
  }

}
