import { Component, OnInit } from '@angular/core';
import { RergistroHoraModel } from 'src/app/models/registroHora.model';
import { SeguimientoEquipoService } from 'src/app/services/seguimiento-equipo.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { EstadoModel } from 'src/app/models/estado.model';
import { UtilesService } from 'src/app/services/utiles.service';

@Component({
  selector: 'app-seguimiento-equipos',
  templateUrl: './seguimiento-equipos.component.html',
  styleUrls: ['./seguimiento-equipos.component.css']
})
export class SeguimientoEquiposComponent implements OnInit {
  public titulopagina = 'Seguimiento al equipo de trabajo';
  public showCard: boolean;
  public page = 1;
  public pageSize = 4;
  public pageSize1 = 4;
  public listRegistroHoraEquipo: RergistroHoraModel [] = [];
  public listRegistroHorasUsuario: RergistroHoraModel [] = [];
  public listRegistroHorasUsuarioFiltro: RergistroHoraModel [] = [];
  public listModeloPorUsuario = [];
  public collectionSize = this.listRegistroHoraEquipo.length;
  public collectionSizeUsuario = this.listRegistroHorasUsuario.length;
  public cargando: boolean;
  public sinData: boolean;
  public tituloModal: string;
  public mensajeModal: string;
  public filtroEstado = '0';
  public filtroProyecto = '';
  public detalle = false;
  public fuentesBuscador: []=  [];
  public listEstado: EstadoModel [] = [];
  public mensajeAlerta = '';
  public mensajeErrorData = 'Ocurrió un error al cargar los datos.';
  public alerta= true;
  public buscador = '';
  
  constructor(
    private servicio: SeguimientoEquipoService,
    private utiles: UtilesService,
    private router: Router,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.cargando = true;
    this.sinData = false;
    this.obtenerRegistroHorasEquipo();
  }


obtenerRegistroHorasEquipo() {
    this.servicio.ObtenerRegistroHorasPorEquipo()
    .subscribe(resp => {
      if (resp.estado === true) {
        this.listRegistroHoraEquipo = typeof(resp.mensaje1) == 'object' ?  resp.mensaje1 : JSON.parse(resp.mensaje1);       
        this.despuesDePEticion();
      } else {
        this.errorPeticion();
      }
            

    }, (error) => {
      console.error(error);
      this.router.navigate(['login']);
      });
  }

despuesDePEticion() {
    this.cargando = false;
    this.sinData = this.listRegistroHoraEquipo.length === 0 ? true : false;
    this.collectionSize = this.listRegistroHoraEquipo.length;
    this.armarRegistroPorUsuario();    
  }

errorPeticion() {
    this.cargando = false;
    this.mensajeAlerta = this.mensajeErrorData;
    this.alerta= true;   
  }

armarRegistroPorUsuario() {
    const usuarios = [];
    this.listRegistroHoraEquipo.forEach( prom => {
    if (! usuarios.includes( prom.idUsuario) ) {
      usuarios.push( prom.idUsuario);
    }
  });

  usuarios.forEach( idUsuario => {
    this.listModeloPorUsuario.push(this.armaModeloUsuario(idUsuario));
  });
  this.collectionSize = this.listModeloPorUsuario.length;
  }

armaModeloUsuario(IdUsuario) {
    const registroHoras: RergistroHoraModel [] = [];
    this.listRegistroHoraEquipo.forEach( prom => {
      if ( prom.idUsuario === IdUsuario) {
        registroHoras.push(prom);
      }
    });

    const pendientes: RergistroHoraModel [] = registroHoras.filter(pro => pro.estado === 1);
    const aprobadas: RergistroHoraModel [] = registroHoras.filter(pro => pro.estado === 2);
    const rechazadas: RergistroHoraModel [] = registroHoras.filter(pro => pro.estado === 3);
    const horasPendientes = this.sumarHorasUsuario(pendientes);
    const horasRechazadas = this.sumarHorasUsuario(rechazadas);
    const horasAprobadas = this.sumarHorasUsuario(aprobadas);
    const horastotal = this.sumarHorasUsuario(registroHoras);

    const modeloUsuario = {
      idUsuario: registroHoras.length > 0 ? registroHoras[0].idUsuario : '',
      nombreUsuario: registroHoras.length > 0 ? registroHoras[0].nombreUsuario : '',
      cantidadRegistrados: horasPendientes,
      cantidadAprobados: horasAprobadas,
      cantidadRechazados: horasRechazadas,
      cantidadTotal: horastotal
      };

      return modeloUsuario;
}

sumarHorasUsuario (registroHoras: RergistroHoraModel []) {
  let horas = 0;
  let minutos = 0;

  registroHoras.forEach(element => {
    horas = horas +  element.horas.hora;
    minutos = minutos + element.horas.minuto;
  });

  horas = Math.trunc(minutos / 60) + horas;
  minutos = minutos % 60;

  let retunrHora, retunrMinuto;
  retunrHora = horas < 10 ? `0${horas}` : horas;
  retunrMinuto = minutos < 10 ? `0${minutos}` : minutos;

  return `${retunrHora} : ${retunrMinuto}`;
}

detalleRegistroHoras(idUsuario: number, nombreUsuario) {
  this.obtenerEstados();
  this.listRegistroHorasUsuario = [];
  this.listRegistroHorasUsuario = this.listRegistroHoraEquipo.filter(pro => pro.idUsuario === idUsuario);  
  this.pageSize1 = this.utiles.calcularPaginacion(this.listRegistroHorasUsuario .length)
  this.collectionSizeUsuario = this.listRegistroHorasUsuario.length;
  this.filtro();
  this.detalle= true;
}

 obtenerEstados() {
  this.servicio.ObtenerEstados()
  .subscribe(resp => {
    if (resp.estado == true)
    {
      this.listEstado = JSON.parse(resp.mensaje1) ;        
    }      

  }, (error) => {
    console.error(error);            
    })
}

formatearFecha(fecha: Date){    
  var date = new Date(fecha);
   var nuevaFoto = date.getDate() + "/" + (date.getMonth() +1) + "/" + date.getFullYear();
  return nuevaFoto;
}

filtro() {
  let listArmado: RergistroHoraModel [] = [];
  if (this.buscador.length ===  0 || this.buscador === undefined || this.buscador === null)
  {
    this.listRegistroHorasUsuarioFiltro = this.listRegistroHorasUsuario;
    return;
  }

  this.listRegistroHorasUsuario.forEach(pro =>{
    const horas = pro.horas.hora + ' : ' + pro.horas.minuto;
    const variable =  `${pro.registroVenta} ${pro.proyecto} ${pro.actividad} ${pro.estadoNombre}  ${this.formatearFecha(pro.fechaReporte)} ${horas} `
    variable.toLowerCase().indexOf(this.buscador) > -1 ? listArmado.push(pro): null;      
  });

  this.sinData = listArmado.length > 0 ? false : true; 
  this.listRegistroHorasUsuarioFiltro = listArmado;
  this.collectionSizeUsuario = this.listRegistroHorasUsuarioFiltro.length;    
}

  get listDataTable(): RergistroHoraModel[] {    
    return this.listRegistroHorasUsuarioFiltro
      .map((data, i) => ({ id: i + 1, ...data }))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
}
