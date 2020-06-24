import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutomaticoService } from '../../services/automatico.service';

import { AutomaticoPorUsuarioModel } from '../../models/automaticoPorUsuario.model';
import { AutomaticoModel } from '../../models/automatico.model';
import { ProyectoModel } from '../../models/proyecto.model';
import { UsuarioModel } from '../../models/usuario.model';
import { element } from 'protractor';

@Component({
  selector: 'app-automatico',
  templateUrl: './automatico.component.html',
  styleUrls: ['./automatico.component.css']
})
export class AutomaticoComponent implements OnInit {

  public titulo: string;
  public formGroup: FormGroup;
  public modelo: AutomaticoPorUsuarioModel = new AutomaticoPorUsuarioModel();
  public alerta: boolean = false;
  public mensajeAlerta: string;
  public mensajeAlerta1: string;
  public mensajeAlerta2: string;
  public fechaInicio: Date;
  public fechaFin: Date;
  public edicion: boolean;
  public listParametros1: ProyectoModel[];
  public listParametros2: UsuarioModel[];
  public porcentajeConfigurado;
  public porcentajesUsuario: AutomaticoModel[] = [];
  public alertaPorcentaje: boolean = false;
  public mensaje1 = 'Algún valor porcentaje no cumple con el formato requerido (numero entro o decimal). Ejemplos: 1, 10,   50.33';
  public mensaje2 = 'No se admite valores en 0 en el campo porcentaje';
  public mensaje3 = 'El valor total del porcentaje no puede superar el 100%';
  public mensaje4 = ' Debe seleccionar  un proyecto para cada porcentaje configurado';
  public mensaje5 = 'Valide los registros del formulario.';
  public mensaje6 = 'La fecha de inicio no puede ser superior a la fecha fin o el formato  de alguna fecha no corresponde.';
  public mensaje7 = 'Debe agregar al menos un  porcentaje';

  @Input() inputModelo: AutomaticoPorUsuarioModel;
  @Output() result: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private Service: AutomaticoService) { }

  ngOnInit(): void {
    //this.obtenrUsuarios();
    this.obtenrParametros();
    this.CrearFormulario();
    this.titulo = this.inputModelo === undefined || this.inputModelo === null ? 'Programación de Registros Automáticos -  Nuevo' : 'Programación de Registros Automáticos -  Edición ';
  }

  public obtenrParametros() {
    new Promise((resolve, reject) => {
      this.obtenrProyectos();
      this.obtenrUsuarios();
      resolve(true)
    })
      .then(resp => {
        this.CrearFormulario();
      })
      .catch(error => {
        console.error('Falla en promesa')
      })

  }

  public obtenrProyectos() {
    this.Service.ObtenerProyectos()
      .subscribe(resp => {
        this.listParametros1 = JSON.parse(resp.mensaje1);
      }, (error) => {
        this.mensajeAlerta = 'Se presentó un error al iniciar el formulario';
        this.alerta = true;
      });
  }

  public obtenrUsuarios() {
    this.Service.ObtenerUsuarios()
      .subscribe(resp => {
        this.listParametros2 = JSON.parse(resp.mensaje1);
      }, (error) => {
        this.mensajeAlerta = 'Se presentó un error al iniciar el formulario';
        this.alerta = true;
      });
  }

  public CrearFormulario() {
    if (this.inputModelo === undefined || this.inputModelo === null) {
      this.nuevoFormulario();
      this.edicion = false;
      return
    }
    this.edicionFormulario();
    this.edicion = true;

  }

  public guardar() {

    if (this.validarFormulario()) {
      this.armarEntidad();

      this.Service.ActualizarAutomaticosPorUsuario(this.modelo)
        .subscribe(resp => {
          if (resp.estado == true) {
            this.result.emit(resp);
            this.activeModal.close();
          }
          this.mensajeAlerta = 'Se presentó un error guardar la informacion';
          this.alerta = true;

        }, (error) => {
          this.mensajeAlerta = 'Se presentó un error al iniciar el formulario';
          this.alerta = true;
          console.log(error);
        });

    }

  }

  public validarFormulario(): boolean {

    if (this.formGroup.invalid) {
      this.mensajeAlerta = this.mensaje5;
      this.alerta = true;
      return false;
    }

    if (this.validarfechas()) {
      this.mensajeAlerta = this.mensaje6;
      this.alerta = true;
      return false;
    }

    if (this.formGroup.value.porcentajes.length == 0) {
      this.mensajeAlerta = this.mensaje7;
      this.alerta = true;
      return false;

    }

    return true;
  }

  public armarEntidad() {

    var auto: AutomaticoModel = new AutomaticoModel();

    this.formGroup.value.porcentajes.forEach(element => {
      auto.porcentaje = element.valor;
      auto.registroVenta = element.proyecto;
      auto.idUsuario = this.formGroup.value.idUsuario;
      auto.activo = true;
      this.porcentajesUsuario.push(auto);
    });

    this.modelo.fechaInicio = this.fechaInicio;
    this.modelo.fechaFin = this.fechaFin;
    this.modelo.idUsuario = this.formGroup.value.idUsuario;
    this.modelo.listaAutomaticos = this.porcentajesUsuario;
  }

  public validarfechas(): boolean {
    this.fechaInicio = this.armarFecha(this.formGroup.value.fechaInicio);
    this.fechaFin = this.armarFecha(this.formGroup.value.fechaFin);

    return this.fechaFin > this.fechaInicio ? false : true;
  }

  public armarFecha(fecha) {
    return new Date(fecha.year + '-' + fecha.month + '-' + fecha.day)
  }

  get porcentajes() {
    this.validarArrayControls();
    return this.formGroup.get('porcentajes') as FormArray;
  }

  public agregarPorcentaje() {
    this.porcentajes.push(this.fb.group({
      proyecto: ['0', [Validators.required, this.validarCombo]],
      valor: ['', [Validators.required, this.validarPorcentaje]]
    }))

  }

  public borrarPorcentaje(i: number) {
    this.porcentajes.removeAt(i)
  }

  public validarArrayControls() {

    this.mensajeAlerta1 = '';
    this.mensajeAlerta2 = '';
    this.validarPorcentajes();
    this.validarproyectos();

    this.alertaPorcentaje = this.mensajeAlerta1 != '' || this.mensajeAlerta2 != '' ? true : false

  }

  public validarPorcentajes() {
    const rexg = /^([0-9\.])*$/i;
    var suma = 0;
    this.formGroup.value.porcentajes.forEach(element => {

      if (element.valor.toString().match(rexg) === null) {
        this.mensajeAlerta1 = this.mensaje1;
        return;
      }
      else if (element.valor == '0') {
        this.mensajeAlerta1 = this.mensaje2
        return;
      }
      else {
        var valor = parseFloat(element.valor);
        if (!isNaN(valor)) {
          suma = suma + valor;
        }
      }

    });

    if (suma > 100) {
      this.mensajeAlerta1 = this.mensaje3
    }
    this.porcentajeConfigurado = suma;
  }

  public validarproyectos() {

    this.formGroup.value.porcentajes.forEach(element => {

      if (element.proyecto == '0') {
        this.mensajeAlerta2 = this.mensaje4;
        return;
      }

    });
  }

  public nuevoFormulario() {

    this.formGroup = this.fb.group({
      idUsuario: ['0', [Validators.required, this.validarCombo]],
      fechaInicio: ['', [Validators.required, Validators.maxLength(10)]],
      fechaFin: ['', [Validators.required, Validators.maxLength(10)]],
      porcentajes: this.fb.array([])

    });

  }

  public edicionFormulario() {
    var fechaInicio = this.armarObjetoFecha(this.inputModelo.fechaInicio);
    var fechaFin = this.armarObjetoFecha(this.inputModelo.fechaFin);

    this.formGroup = this.fb.group({
      idUsuario: [this.inputModelo.idUsuario, [Validators.required, this.validarCombo]],
      fechaInicio: [fechaInicio, [Validators.required, Validators.maxLength(10)]],
      fechaFin: [fechaFin, [Validators.required, Validators.maxLength(10)]],
      porcentajes: this.fb.array([])
    });

    this.cargarPorcentajesEdicion();
  }

  public armarObjetoFecha(fecha: Date) {
    var ObjetoFecha = {
      year: new Date(fecha).getFullYear(),
      month: new Date(fecha).getMonth(),
      day: new Date(fecha).getDate()
    }
    return ObjetoFecha
  }
  public cargarPorcentajesEdicion() {
    const porc = this.formGroup.controls.porcentajes as FormArray;
    this.inputModelo.listaAutomaticos.forEach(element => {
      porc.push(this.fb.group({
        proyecto: element.registroVenta,
        valor: element.porcentaje
      }))

    });
  }

  public getError(controlName: string): string {
    let error = '';
    const control = this.formGroup.get(controlName);
    if (control.touched && control.errors != null) {
      error = JSON.stringify(control.errors);
    }
    error = this.formatearError(error);
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
    } else if (obj.caractespeciales) {
      mensaje = obj.caractespeciales;
    } else if (obj.seleccioncombo) {
      mensaje = obj.seleccioncombo
    }
    return mensaje;
  }

  public validarCombo(control: AbstractControl) {
    const valor = parseInt(control.value);
    return !Number.isInteger(valor) || valor === 0 ? { seleccioncombo: 'Debe seleccionar un valor de la lista' } : null
  }

  public validarPorcentaje(control: AbstractControl) {
    const rexg = /^([0-9\.])*$/i;
    const valor = control.value;
    return valor.match(rexg) === null ? { caractespeciales: 'El campo solo admite números. Separación de decimales: signo punto (.)' } : null

  }

}
