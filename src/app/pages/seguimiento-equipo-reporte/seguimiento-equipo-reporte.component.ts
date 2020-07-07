import { Component, OnInit } from '@angular/core';
import { RergistroHoraModel } from 'src/app/models/registroHora.model';
import { SeguimientoEquipoService } from 'src/app/services/seguimiento-equipo.service';
import { Router } from '@angular/router';
import { UtilesService } from 'src/app/services/utiles.service';
import { registroModel } from 'src/app/models/registro.model';

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
  selector: 'app-seguimiento-equipo-reporte',
  templateUrl: './seguimiento-equipo-reporte.component.html',
  styleUrls: ['./seguimiento-equipo-reporte.component.css']
})
export class SeguimientoEquipoReporteComponent implements OnInit {

  public titulopagina = 'Reportes Seguimiento Equipo';
  public fehcaInicio ;
  public fehcaFin ;
  public mensajeAlerta = '';
  public alerta = false; 
  public ListModelo: RergistroHoraModel [] = [];
  public collectionSize = this.ListModelo.length;
  public page = 1;
  public pageSize = 4;
  public cargando: boolean;
  public sinData: boolean;
  public nombreArchivo = 'ReporteTiemposEquipo'
  public mensaje1 = 'Ingrese una fecha valida.'
  public mensaje2 = 'La fecha de inicio tiene que ser menor  que la fecha fin.'
  public mensaje3 = 'Ocurrió un error al cargar los datos.';
  public mensaje4 = 'No se logro generar el archivo';
  public generandoArchivo = false;

  constructor(
    private servicio: SeguimientoEquipoService,
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
    this.servicio.ReporteHistoricoEquipo(registro)
    .subscribe(resp => {
      if(resp.estado === true) {
        this.ListModelo = typeof(resp.mensaje1) == 'object' ?  resp.mensaje1 : JSON.parse(resp.mensaje1);
        this.despuesDePEticion();      
      }
    }, (error) => {
       this.errorPeticion(error);
       this.router.navigate(['login']); 
    });  
  }

  antesDepeticion() {
    this.ListModelo = [];
    this.alerta= false;
    this.cargando = true;
    this.sinData = false;
  }

  despuesDePEticion() {
    this.collectionSize = this.ListModelo.length;
    this.pageSize = this.utiles.calcularPaginacion(this.ListModelo.length);        
    this.cargando = false;       
    this.sinData = this.ListModelo.length === 0 ? true : false; 
  }

  errorPeticion(error) {
    this.cargando = false;
    this.mensajeAlerta = this.mensaje3;
    this.alerta= true;
    console.log(error);
  }

  get listDataTable(): RergistroHoraModel[] {    
    return this.ListModelo
      .map((data, i) => ({ id: i + 1, ...data }))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

 armarParametro() {
  let registro: registroModel = new registroModel();
    registro.parametro1 = this.armarFecha(this.fehcaInicio). toString();
    registro.parametro2 = this.armarFecha(this.fehcaFin). toString();
    return registro;
 }

 validarFecha() {    
     
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
    this.generandoArchivo = true;
    let listReporte: ReporteRegistroHoras [] = this.generarModeloReporte();  
    
    this.utiles.exportAsExcelFile(listReporte,this.nombreArchivo)
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

  generarModeloReporte(){    
    let listReporte: ReporteRegistroHoras [] = [];
    this.ListModelo.forEach(pro =>{
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

  formatearFecha(fecha) {
  return this.utiles.formatearFecha(fecha);
  }

}
