import { Component, OnInit, Input, Output, EventEmitter, ɵbypassSanitizationTrustResourceUrl, ɵConsole } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { RergistroHoraModel } from '../../models/registroHora.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistroHorasService } from 'src/app/services/registro-horas.service';
import { ProyectoModel } from '../../models/proyecto.model';
import { FaseModel } from '../../models/fase.model';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TiempoModel } from '../../models/tiempo.model';
import { ReglaModel } from '../../models/regla.model';
import { promise } from 'protractor';
import { ParametroModel } from '../../models/parametro.model';
import { registroModel } from '../../models/registro.model';


@Component({
  selector: 'app-registro-horas',
  templateUrl: './registro-horas.component.html',
  styleUrls: ['./registro-horas.component.css']
})
export class RegistroHorasComponent implements OnInit {
  public titulo: string;
  public formGroup: FormGroup;
  public modelo: RergistroHoraModel = new RergistroHoraModel();
  public alerta = false;
  public mensajeAlerta: string;
  public edicion: boolean;
  public fuentesBuscador: string [] =  [];
  public fases: FaseModel [] = [];
  public reglas:  ParametroModel [] = [];
  public reglasRegistro: ReglaModel;
  public parametro1 = 'fechaDisponibleInicio';
  public parametro2 = 'fechaDisponibleFin';
  public mensaje5 = 'Valide los registros del formulario.';
  public mensaje1 = 'Se presentó un error guardar la informacion';
  public mensaje2 = 'Días disponibles para reportar, entre el ';
  public fechaInicio;
  public fechaFin;

  @Input() inputModelo: RergistroHoraModel;
  @Input() inputCopia: boolean;
  @Input() inputIdUsuario: number;
  @Output() result: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private activeModal: NgbActiveModal,
     private fb: FormBuilder,
     private servicio: RegistroHorasService) { }

  ngOnInit(): void {
    // Promise.all([this.obtenerProyectos(), this.obtenerFases(), this.obtenerReglas()])
    // .then(values => {
    //   this.CrearFormulario();
    // })
    // .catch(error => {
    //   console.log(error);
    // });

    this.obtenerProyectos();
    this.obtenerFases();
    this.obtenerReglas();
    this.CrearFormulario();
  }

  guardar() {

    if (this.validarFormulario()) {
      this. armarEntidad();

      this.servicio.ActualizarRegistroHoras(this.modelo)
      .subscribe(resp => {
        if (resp.estado === true) {
          this.result.emit(resp);
          this.activeModal.close();
        } else {
        this.mensajeAlerta = this.mensaje1;
        this.alerta = true;
      }
      }, (error) => {
        this.mensajeAlerta = this.mensaje1;
        this.alerta = true;
        console.log(error);
      });

    }

  }

  validarFormulario (): boolean {

    if (this.formGroup.invalid) {
      this. mensajeAlerta = this.mensaje5;
      this.alerta = true;
      return false;
    }

    if (this.validarRangoFecha()) {
      this. mensajeAlerta = this.mensaje2;
      this.alerta = true;
      return false;
    }
    return true;
  }

  validarRangoFecha() {
    const fechaIngresada  = this.armarFecha();
    return fechaIngresada < this.fechaFin &&  fechaIngresada > this.fechaInicio ? false : true;
  }

  armarFechaFormateada(fecha) {
    fecha = new Date(fecha);
    const mes =    fecha.getMonth() + 1;
    return fecha.getDate() + '/' + mes + '/' + fecha.getFullYear();
  }

  armarEntidad() {

    const array = this.obtenerProyecto();

    this.modelo.idRegistro = this.inputModelo != null && this.inputCopia === false ? this.inputModelo.idRegistro  : 0;
    this.modelo.estado = 1;
    this.modelo.estadoNombre = this.inputModelo != null && this.inputCopia === false ? this.inputModelo.estadoNombre : '';
    this.modelo.idUsuario = this.inputIdUsuario;
    this.modelo.nombreUsuario =  this.inputModelo != null && this.inputCopia === false ? this.inputModelo.nombreUsuario : '';
    this.modelo.registroVenta = array[0];
    this.modelo.proyecto = array[1];
    this.modelo.actividad = this.formGroup.value.actividad;
    this.modelo.fase = this.formGroup.value.fase;
    this.modelo.horas = this.armarHoras();
    this.modelo.fechaReporte = this. armarFecha();
    this.modelo.solcitud = this.formGroup.value.solicitud !== undefined ? this.formGroup.value.solicitud : '' ;
  }

  armarFecha() {
    const fecha = this.formGroup.value.fechaReporte;
    const fechaReporte = new Date (fecha.year + '-' + fecha.month + '-' + fecha.day );
    return fechaReporte;
  }

  armarHoras() {
    const tiempo: TiempoModel = new TiempoModel();
    tiempo.hora =  this.formGroup.value.horas.hour;
    tiempo.minuto =  this.formGroup.value.horas.minute;
    tiempo.segundo = 0;
    return tiempo;
  }

  search = (text$: Observable <string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 2 ? []
      : this.fuentesBuscador.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  )

  obtenerProyectos() {
    return new Promise((resolve, reject) => {

    this.servicio.ObtenerProyectos()
    .subscribe(resp => {
      if (resp.estado === true) {
        const proyectos: ProyectoModel [] = typeof(resp.mensaje1) === 'object' ?  resp.mensaje1 : JSON.parse(resp.mensaje1);
        proyectos.forEach(prom => {
         this.fuentesBuscador.push( `${prom.registroVenta}; ${prom.proyecto}`);
        });
        resolve(true);
      } else {
        reject(false);
      }
    }, (error) => {
      console.error(error);
      reject(false);
    });
  });

  }

  obtenerFases() {

    return new Promise((resolve, reject) => {
    this.servicio.ObtenerFases()
    .subscribe(resp => {
      this.fases = typeof(resp.mensaje1) === 'object' ?  resp.mensaje1 : JSON.parse(resp.mensaje1);
      resp.estado === true ? resolve(true) : reject(false);
    }, (error) => {
      console.error(error);
      reject(false);
      });
    });
  }

  obtenerReglas() {
    return new Promise((resolve, reject) => {
    const registro: registroModel =  new registroModel();
    registro.parametro1 = 'RegistroHoras';
    this.servicio.ObtenerReglas(registro)
    .subscribe(resp => {
      if (resp.estado === true) {
        this.reglas = typeof(resp.mensaje1) === 'object' ?  resp.mensaje1 : JSON.parse(resp.mensaje1);
        this.armarMensajeRangoFechas();
        resolve(true);
      } else {
        reject(false);
      }
    }, (error) => {
      console.error(error);
      reject(false);
     });
    });
  }

 armarMensajeRangoFechas() {
    let fi, ff;
    this.reglas.forEach(pro => {
       if (pro.variable === this.parametro1) {
        fi = this.armarFechaFormateada(pro.valor);
        this.fechaInicio  = new Date(pro.valor);
       } else if (pro.variable === this.parametro2 ) {
         ff =  this.armarFechaFormateada(pro.valor);
         this.fechaFin = new Date(pro.valor);
      }
     });
    this.mensaje2 = this.mensaje2 + fi + '  al ' + ff ;
 }

  CrearFormulario() {
    if (this.inputModelo === undefined || this.inputModelo === null) {
      this.nuevoFormulario();
      this.edicion = false;
      this.titulo = 'Nuevo Registro';
    }  else if (! this.inputCopia) {
      this.edicionFormulario();
      this.titulo = 'Edición registro';
     } else if (this.inputCopia) {
      this.edicionFormulario();
      this.titulo = 'Copia registro';
     }
  }

 nuevoFormulario() {
  const time = {hour: 0, minute: 0};
  this.formGroup = this.fb.group({
    idRegistro: ['', []],
    idUsuario: ['', [Validators.maxLength(50)]],
    registroVenta: ['', [Validators.maxLength(15)]],
    proyecto: ['', [Validators.required, Validators.maxLength(150), this.validarProyecto]],
    actividad: ['', [Validators.required, Validators.maxLength(500)]],
    fase: ['0', [Validators.required, Validators.maxLength(5), this.validarCombo]],
    horas: [time, [Validators.required, this.validarHoras]],
    fechaReporte: ['', [Validators.required, Validators.maxLength(5)]],
    solcitud : ['', [Validators.maxLength(10)]],
    estado: ['1', [Validators.maxLength(5)]]
  });

}

 edicionFormulario() {
  const fechaRegistro = this.armarObjetoFecha(this.inputModelo.fechaReporte);
  const hora = {hour: this.inputModelo.horas.hora, minute: this.inputModelo.horas.minuto};
  const proyecto = this.inputModelo.registroVenta + '; ' + this.inputModelo.proyecto;

  this.formGroup = this.fb.group({
    idRegistro: [this.inputModelo.idRegistro, []],
    idUsuario: [this.inputModelo.idUsuario, [Validators.maxLength(50)]],
    registroVenta: [this.inputModelo.registroVenta, [Validators.maxLength(15)]],
    proyecto: [proyecto, [Validators.required, Validators.maxLength(150), this.validarProyecto]],
    actividad: [this.inputModelo.actividad, [Validators.required, Validators.maxLength(500)]],
    fase: [this.inputModelo.fase, [Validators.required, Validators.maxLength(5), this.validarCombo]],
    horas: [hora, [Validators.required, this.validarHoras]],
    fechaReporte: [fechaRegistro, [Validators.required, Validators.maxLength(5)]],
    solcitud : [this.inputModelo.solcitud, [Validators.maxLength(10)]],
    estado: ['1', [Validators.maxLength(5)]]
  });

}

 armarObjetoFecha(fecha: Date) {
  const ObjetoFecha = {
    year: new Date(fecha).getFullYear(),
    month: new Date(fecha).getMonth() + 1,
    day: new Date(fecha).getDate()
  };
  return ObjetoFecha;
}

public getError(controlName: string): string {
  let error = '';
  const control = this.formGroup.get(controlName);
  if (control.touched && control.errors != null) {
    error = JSON.stringify(control.errors);
  }
  error = this.formatearError (error);
  return error;
}

public formatearError(objeto: string): string {
  if (objeto === '') {
    return objeto;
  }
  const obj = JSON.parse(objeto);
  let mensaje = '';

  if (obj.minlength) {
    mensaje = 'La longitud mínima de caracteres es de : ' + obj.minlength.requiredLength;
  } else if (obj.maxlength) {
    mensaje = 'Supero el límite de caracteres permitidos de: ' + obj.maxlength.requiredLength;
  } else if (obj.required) {
    mensaje = 'El campo es requerido';
  } else  if (obj.caractespeciales) {
    mensaje = obj.caractespeciales;
  } else if (obj.seleccioncombo) {
    mensaje = obj.seleccioncombo;
  } else if (obj.textoProyecto) {
    mensaje = obj.textoProyecto;
  } else if (obj.validarHoras) {
    mensaje = obj.validarHoras;
  } else if (obj.rangoFechas) {
    mensaje = obj.rangoFechas;
  }
  return mensaje;
}


public validarHoras(control: AbstractControl) {
  let result = null;
  result = control.value.hour === 0 && control.value.minute === 0 ? {cantidadHoras: 'Debe estableces algún tiempo' } : null;
  return result;
}

public validarProyecto(control: AbstractControl) {
  let result = null;
  let baseProyecto = control.value;
  baseProyecto = baseProyecto.split(';');
  result = baseProyecto.length !== 2 ? {textoProyecto: 'Debe seleccionar un registro de la lista' } : null;

  return result;
}

public validarCombo( control: AbstractControl) {
  let result = null;
  const valor = parseInt(control.value) ;
  return result = !Number.isInteger(valor) || valor === 0 ? result = {seleccioncombo: 'Debe seleccionar un valor de la lista'} : null  
}

public obtenerProyecto() {
  let baseProyecto = this.formGroup.value.proyecto;
  baseProyecto = baseProyecto.split(';');
    return baseProyecto;
}

}
