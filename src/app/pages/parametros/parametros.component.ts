import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParametrosService } from 'src/app/services/parametros.service';
import { Router } from '@angular/router';
import { ParametroModel } from 'src/app/models/parametro.model';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UtilesService } from 'src/app/services/utiles.service';
import { registroModel } from 'src/app/models/registro.model';
import { error } from 'protractor';

declare interface ParametrosRegistroHoras {
  horasDiarias: string;
  fechaDisponibleInicio: string;
  fechaDisponibleFin: string;
  diaInicioCorte: string;
  diaFinCorte: string;
  frecuenciaCorte: string;
}

declare interface ParametrosCorreo {
  Servidor: string;
  correo: string;
  puerto: string;
  usuario: string;
  clave: string;
}

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css']
})
export class ParametrosComponent implements OnInit {

  public listParametros: ParametroModel[] = [];
  public formGroup: FormGroup;
  public formGroupCorreo: FormGroup;
  public ModeloRH: ParametrosRegistroHoras;
  public ModeloCorreo: ParametrosCorreo;
  public horasAutomaticas;
  public horasRegistrar;
  public horasCalificar;
  public pendienteAutomaticos = 'Horas pendientes automáticas';
  public pendienteRegistrar = 'Horas pendientes por registrar';
  public pendienteCalificar = 'Horas pendientes por calificar';
  public tituloModal = 'Confirmacion';
  public mensajeModal = '¿Está seguro de generar las horas?';
  public tipoError = true;
  public ErrorRH = false;
  public msmErrorRH;
  public msmExitoso = 'Se almaceno la información con éxito';
  public msmErrorPUT = 'Se presentó un error al guardar la información';
  public msmErrorGET = 'Se presentó un error al cargar la información';
  public nombreModal = 'modalConfirmacion';
  public accionGeneracionHoras;

  constructor(
    private servicio: ParametrosService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private utiles: UtilesService) {
  }

  ngOnInit(): void {
    this.formularioRegistroHoras();
    this.formularioCorreo();
    this.obtenerParametros();
    this.obtenerHorasPendientes();
  }

  obtenerHorasPendientes() {
    this.servicio.obtenerHoraspendientes()
      .subscribe(resp => {
        if (resp.estado === true) {
          const registros: ParametroModel[] = typeof (resp.mensaje1) === 'object' ? resp : JSON.parse(resp.mensaje1);
          this.asignarHoraspendientes(registros);

        } else {
          console.error(resp.mensaje1);
          this.tipoError = true;
          this.utiles.notificacionError();
        }

      }, (error) => {
        console.error(error);
        this.tipoError = true;
        this.utiles.notificacionError();
        this.router.navigate(['login']);
      });
  }
  asignarHoraspendientes(registros: ParametroModel[]) {
    const variables = ['horaspendientesRegistrar', 'horasPendientesGenerarAutomaticos', 'horasPendientesPorCalificar']
    registros.forEach(pro => {
      if (variables[0] === pro.variable) {
        this.horasRegistrar = pro.valor
      }

      if (variables[1] === pro.variable) {
        this.horasAutomaticas = pro.valor
      }

      if (variables[2] === pro.variable) {
        this.horasCalificar = pro.valor
      }
    })
  }

  obtenerParametros() {
    this.servicio.obtenerTodosParametros()
      .subscribe(resp => {
        if (resp.estado === true) {
          this.listParametros = typeof (resp.mensaje1) === 'object' ? resp : JSON.parse(resp.mensaje1);
          this.armarEntidades();
          this.AsignaValoresFormularioRH();
        } else {
          console.error(resp.mensaje1);
          this.tipoError = true;
          this.utiles.notificacionError();
        }

      }, (error) => {
        console.error(error);
        this.tipoError = true;
        this.utiles.notificacionError();
        this.router.navigate(['login']);
      });
  }

  armarEntidades() {
    this.asignarValorRH();
    this.asignarValorCorreo();
    this.AsignaValoresFormularioCorreo();
  }

  asignarValorRH() {

    let horasDiarias = '', fechaDisponibleInicio = '', fechaDisponibleFin = '', diaInicioCorte = '', diaFinCorte = '', frecuenciaCorte = '';

    this.listParametros.forEach(parametro => {

      switch (parametro.variable) {
        case 'horasDiarias':
          horasDiarias = parametro.valor;
          break;
        case 'fechaDisponibleInicio':
          fechaDisponibleInicio = parametro.valor;
          break;
        case 'fechaDisponibleFin':
          fechaDisponibleFin = parametro.valor;
          break;
        case 'diaInicioCorte':
          diaInicioCorte = parametro.valor;
          break;
        case 'diaFinCorte':
          diaFinCorte = parametro.valor;
          break;
        case 'frecuenciaCorte':
          frecuenciaCorte = parametro.valor;
          break;
        default:
          break;
      }
    });

    this.ModeloRH = {
      horasDiarias: horasDiarias,
      fechaDisponibleInicio: fechaDisponibleInicio,
      fechaDisponibleFin: fechaDisponibleFin,
      diaInicioCorte: diaInicioCorte,
      diaFinCorte: diaFinCorte,
      frecuenciaCorte: frecuenciaCorte
    };
  }

  asignarValorCorreo() {

    let Servidor = '', puerto = '', correo = '', usuario = '', clave = '';

    this.listParametros.forEach(parametro => {

      switch (parametro.variable) {
        case 'Servidor':
          Servidor = parametro.valor;
          break;
        case 'puerto':
          puerto = parametro.valor;
          break;
        case 'correo':
          correo = parametro.valor;
          break;
        case 'usuario':
          usuario = parametro.valor;
          break;
        case 'clave':
          clave = parametro.valor;
          break;
        default:
          break;
      }
    });

    this.ModeloCorreo = {
      Servidor: Servidor,
      puerto: puerto,
      correo: correo,
      usuario: usuario,
      clave: clave
    };

  }

  formularioRegistroHoras() {
    this.formGroup = this.fb.group({
      horasDiarias: ['0', [Validators.required, Validators.maxLength(5), this.validarValorMinimo]],
      fechaDisponibleInicio: ['', [Validators.maxLength(100)]],
      fechaDisponibleFin: ['', [Validators.maxLength(100)]],
      diaInicioCorte: ['1', [Validators.required, Validators.maxLength(2), this.validarValorMinimo]],
      diaFinCorte: ['30', [Validators.required, Validators.maxLength(2), this.validarValorMinimo]],
      frecuenciaCorte: ['1', [Validators.required, Validators.maxLength(2)]]
    });
  }

  formularioCorreo() {
    this.formGroupCorreo = this.fb.group({
      Servidor: ['', [Validators.required, Validators.maxLength(300)]],
      puerto: ['', [Validators.required, Validators.maxLength(6), this.validarValorMinimo]],
      correo: ['', [Validators.required, Validators.maxLength(50), this.validarCorreo]],
      usuario: ['', [Validators.required, Validators.maxLength(50)]],
      clave: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  AsignaValoresFormularioRH() {
    let fechaInicio = null, fechaFin =null;
    if(this.ModeloRH.fechaDisponibleInicio != null)
      fechaInicio = this.armarObjetoFecha(this.ModeloRH.fechaDisponibleInicio);
     
    if(this.ModeloRH.fechaDisponibleFin != null)
      fechaFin = this.armarObjetoFecha(this.ModeloRH.fechaDisponibleFin);

    this.formGroup.reset({
      horasDiarias: this.ModeloRH.horasDiarias,
      fechaDisponibleInicio: fechaInicio,
      fechaDisponibleFin: fechaFin,
      diaInicioCorte: this.ModeloRH.diaInicioCorte,
      diaFinCorte: this.ModeloRH.diaFinCorte,
      frecuenciaCorte: this.ModeloRH.frecuenciaCorte
    });
  }

  AsignaValoresFormularioCorreo() {
    this.formGroupCorreo.reset({
      Servidor: this.ModeloCorreo.Servidor,
      puerto: this.ModeloCorreo.puerto,
      correo: this.ModeloCorreo.correo,
      usuario: this.ModeloCorreo.usuario,
      clave: this.ModeloCorreo.clave
    });
  }

  armarObjetoFecha(fecha) {
    const ObjetoFecha = {
      year: new Date(fecha).getFullYear(),
      month: new Date(fecha).getMonth() + 1,
      day: new Date(fecha).getDate()
    };
    return ObjetoFecha;
  }

  validarValorMinimo(control: AbstractControl) {
    let result = null;
    let valor: number = parseInt(control.value);
    if (!Number.isInteger(valor) || valor === 0) {
      result = { seleccioncombo: 'Debe ingresar un valor numerico mayor a cero (0) ' };
    }
    return result;
  }

  validarCorreo(control: AbstractControl) {
    let result = null;
    const rexg = /^[_a-zA-Z0-9-]+(.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*(.[a-zA-Z]{2,4})$/i;
    const texto = control.value;
    if (texto.match(rexg) === null) {
      result = { email: 'Debe ingresar un correo electrónico valido' };
    }
    return result
  }

  getErrorRH(controlName: string): string {
    let error = '';
    const control = this.formGroup.get(controlName);
    if (control.touched && control.errors != null) {
      error = JSON.stringify(control.errors);
    }
    error = this.formatearError(error);
    return error;
  }

  getErrorCorreo(controlName: string): string {
    let error = '';
    const control = this.formGroupCorreo.get(controlName);
    if (control.touched && control.errors != null) {
      error = JSON.stringify(control.errors);
    }
    error = this.formatearError(error);
    return error;
  }

  formatearError(objeto: string): string {
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
    } else if (obj.caractespeciales) {
      mensaje = obj.caractespeciales;
    } else if (obj.seleccioncombo) {
      mensaje = obj.seleccioncombo;
    } else if (obj.textoProyecto) {
      mensaje = obj.textoProyecto;
    } else if (obj.validarHoras) {
      mensaje = obj.validarHoras;
    } else if (obj.rangoFechas) {
      mensaje = obj.rangoFechas;
    } else if (obj.email) {
      mensaje = obj.email
    }
    return mensaje;
  }

  actualizarparametrosRH() {
    this.ErrorRH=false;
    this.armarListaparametrosRH();
    this.servicio.actualizarParametros(this.listParametros)
      .subscribe(resp => {
        if (resp.estado == true) {
          this.utiles.notificacionExito();
        }
        else {
          console.log(resp.mensaje1);
          this.tipoError = false;
          this.utiles.notificacionError();
          this.ErrorRH= true;
          this.msmErrorRH = resp.mensaje1
        }

      }, (error) => {
        console.error(error);
        this.tipoError = false;
        this.utiles.notificacionError();
      });
  }

  armarListaparametrosRH() {
    const listVariablesRH = ['horasDiarias', 'fechaDisponibleInicio', 'fechaDisponibleFin', 'diaInicioCorte', 'diaFinCorte', 'frecuenciaCorte'];
    this.listParametros = [];
    listVariablesRH.forEach(variable => {
      const control = this.formGroup.get(variable);
      let valor;
      let parametro: ParametroModel = new ParametroModel();
      valor = variable === 'fechaDisponibleInicio' || variable === 'fechaDisponibleFin' ? this.armarFecha(control.value) : control.value;
      parametro.tipo = 'RegistroHoras';
      parametro.variable = variable;
      parametro.valor = valor;
      this.listParametros.push(parametro);
    });
  }

  public armarFecha(fecha) {
    if(fecha != null)
      return new Date(fecha.year + '-' + fecha.month + '-' + fecha.day)

    return fecha
  }

  public actualizarparametrosCorreo() {
    this.armarListaparametrosCorreo();
    this.servicio.actualizarParametros(this.listParametros)
      .subscribe(resp => {
        if (resp.estado == true) {
          this.utiles.notificacionExito();
        }
        else {
          console.log(resp.mensaje1);
          this.tipoError = false;
          this.utiles.notificacionError();
        }

      }, (error) => {
        console.error(error);
        this.tipoError = false;
        this.utiles.notificacionError();
      });
  }

  public armarListaparametrosCorreo() {
    const listVariablesRH = ['Servidor', 'puerto', 'correo', 'usuario', 'clave'];
    this.listParametros = [];
    listVariablesRH.forEach(variable => {
      const control = this.formGroupCorreo.get(variable);
      let parametro: ParametroModel = new ParametroModel();
      parametro.tipo = 'Correo';
      parametro.variable = variable;
      parametro.valor = control.value;
      this.listParametros.push(parametro);
    });
  }

  generarHoras(modal, accion) {
    this.accionGeneracionHoras = accion;
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' });
  }

  confirmacionGenerarHoras() {
    let registro: registroModel = new registroModel();
    registro.idregistro = this.accionGeneracionHoras;
    this.servicio.aprobacionHorasPendientes(registro)
      .subscribe(resp => {
        if (resp.estado === true) {
          this.obtenerHorasPendientes();
          this.utiles.notificacionExito();
          this.modalService.dismissAll(this.nombreModal);
        }
      }, (error) => {
        console.log(error);
        this.utiles.notificacionError();
      })
  }

}
