import { Component, OnInit } from '@angular/core';
import { ReportesService } from 'src/app/services/reportes.service';
import { Router } from '@angular/router';
import { registroModel } from 'src/app/models/registro.model';
import { ReporteDedicacionProyectoModel } from 'src/app/models/reporteDedicacionProyecto.model';
import { UtilesService } from 'src/app/services/utiles.service';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  public titulopagina = 'Reportes Financieros';
  public fehcaInicio ;
  public fehcaFin ;
  public mensajeAlerta = '';
  public alerta = false; 
  public modeloDedicacion: ReporteDedicacionProyectoModel [] = [];
  public collectionSize = this.modeloDedicacion.length;
  public page = 1;
  public pageSize = 4;
  public cargando: boolean;
  public sinData: boolean;
  public generandoArchivo = false;
  public nombreArchivo = 'DedicacionUsuario'
  public mensaje1 = 'Ingrese una fecha valida.'
  public mensaje2 = 'La fecha de inicio tiene que ser menor  que la fecha fin.'
  public mensaje3 = 'Ocurrió un error al cargar los datos.';
  public mensaje4 = 'No se logro generar el archivo';


  constructor(
    private servicio: ReportesService,
    private router: Router,
    private utiles: UtilesService) {
    }

  ngOnInit(): void {   
  }  

  GenerarReporteDedicacionPorProyecto(){
    if(!this.validarFecha()) {
      return;
    }    
    this.antesDepeticion();
    let registro: registroModel = this.armarParametro();
    this.servicio.ObtenerReporteDedicacionPorProyecto(registro)
    .subscribe(resp => {
      if(resp.estado === true) {
        this.modeloDedicacion = typeof(resp.mensaje1) == 'object' ?  resp.mensaje1 : JSON.parse(resp.mensaje1);
        this.despuesDePEticion();      
      }
    }, (error) => {
       this.errorPeticion(error);
    });  
  }

  antesDepeticion() {
    this.modeloDedicacion = [];
    this.alerta= false;
    this.cargando = true;
    this.sinData = false;
  }

  despuesDePEticion() {
    this.collectionSize = this.modeloDedicacion.length;
    this.pageSize = this.utiles.calcularPaginacion(this.modeloDedicacion.length);        
    this.cargando = false;       
    this.sinData = this.modeloDedicacion.length === 0 ? true : false; 
  }

  errorPeticion(error) {
    this.cargando = false;
    this.mensajeAlerta = this.mensaje3;
    this.alerta= true;
    console.log(error);
  }

  get listDataTable(): ReporteDedicacionProyectoModel[] {    
    return this.modeloDedicacion
      .map((data, i) => ({ id: i + 1, ...data }))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

 armarParametro() {
  let registro: registroModel = new registroModel();
    registro.parametro1 = this.armarFecha(this.fehcaInicio). toString();
    registro.parametro2 = this.armarFecha(this.fehcaFin). toString();
    return registro;
 }

  public validarFecha() {    
     
    if (typeof(this.fehcaInicio) !== 'object' || typeof(this.fehcaInicio) !== 'object') {
      this.mensajeAlerta = this.mensaje1;
      this.alerta = true;
      return false;
     }
   
    const fechaInicio = this.armarFecha(this.fehcaInicio); 
    const fechaFin= this.armarFecha(this.fehcaFin); 
     if (fechaInicio > fechaFin) {
        this.mensajeAlerta = this.mensaje2;
        this.alerta = true;
        return false;
     }
     
    return true;
  }

  armarFecha(fecha) {   
    const fechaReporte = new Date (fecha.year + '-' + fecha.month + '-' + fecha.day );
    return fechaReporte
  }

  generarExcel() {
    this.utiles.exportAsExcelFile(this.modeloDedicacion,this.nombreArchivo)
    .then(resp => {
      if(resp === true){
        this.generandoArchivo = false;
      } else {
      this.generandoArchivo = false;
      this.mensajeAlerta = this.mensaje4;
      this.alerta = true;
      console.log(resp);
      }
    })
    .catch(error => {
      this.generandoArchivo = false;
      this.mensajeAlerta = this.mensaje4;
      this.alerta = true;
      console.log(error);
    });
  }
}
