import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ProyectoModel } from 'src/app/models/proyecto.model';
import { ResponsableProyectoModel } from 'src/app/models/responsableProyecto.model';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { ParametroModel } from 'src/app/models/parametro.model';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css']
})

export class ProyectoComponent implements OnInit {

  public titulo: string;
  public formGroup: FormGroup;
  public proyectoModel: ProyectoModel = new ProyectoModel();
  public listaParametros: ParametroModel [] = [];
  public responsables:ParametroModel []= [];
  public clasificacion1:ParametroModel []= [];
  public clasificacion2:ParametroModel []= [];
  public clasificacion3:ParametroModel []= [];
  public tipoParametros = ['Responsable','Clasificacion1','Clasificacion2','Clasificacion3'];
  public alerta = false;
  public mensajeAlerta: string;
  public responsablesProyecto: ResponsableProyectoModel[] = [];
  public fechaInicio: Date;
  public fechaFin: Date;
  public edicion: boolean;
  public isCollapsed = true;

  constructor(private activeModal: NgbActiveModal, private fb: FormBuilder, private proyectoService: ProyectoService) { }

  @Input() id: string;
  @Input() inputproyectoModel: ProyectoModel;
  @Output() result: EventEmitter<ProyectoModel> = new EventEmitter<ProyectoModel>();

  ngOnInit(): void {
    this.obtenrParametros();
    this.cargarProyecto();
    this.titulo = this.inputproyectoModel === undefined || this.inputproyectoModel === null ? 'Nuevo Proyecto' : 'Editar Proyecto';
  }

  cargarProyecto() {

    if (this.inputproyectoModel === undefined || this.inputproyectoModel === null) {
      this.nuevoFormulario();
      this.edicion = false;
      return;
    }
    this.edicionFormulario();
    this.edicion = true;
  }

  get labelOpcionAvanzada() {
    return this.isCollapsed === true ? 'Ver opciones avanzadas' : 'Ocultar opciones avanzadas';
  }
  get usuarioNoValido() {
    return this.formGroup.get('registroVenta').invalid && this.formGroup.get('registroVenta').touched;
  }

  guardar() {

    if (this.validarFormulario()) {
      return;
    }

    this.proyectoModel = this.formGroup.value;
    this.proyectoModel.responsables = this.responsablesProyecto;
    this.proyectoModel.fechaInicio = this.fechaInicio;
    this.proyectoModel.fechaFin = this.fechaFin;

    this.edicion == false ? this.nuevoproyecto() : this.editorproyecto()
  }

  nuevoproyecto() {
    this.proyectoModel.activo = true;
    this.proyectoService.nuevoProyecto(this.proyectoModel)
      .subscribe(resp => {

        if (resp.estado == true) {
          this.result.emit(this.proyectoModel);
          this.activeModal.close();
        }
        else {
          this.mensajeAlerta = 'Se presentó un error al guardar la información';
          this.alerta = true;
        }

      }, (error) => {
        this.mensajeAlerta = 'Se presentó un error al guardar la información';
        this.alerta = true;
      });
  }

  editorproyecto() {
    this.proyectoModel.registroVenta = this.inputproyectoModel.registroVenta;
    this.proyectoService.editarProyecto(this.proyectoModel)
      .subscribe(resp => {

        if (resp.estado == true) {
          this.result.emit(this.proyectoModel);
          this.activeModal.close();
        }
        else {
          this.mensajeAlerta = 'Se presentó un error al guardar la información';
          this.alerta = true;
        }

      }, (error) => {
        this.mensajeAlerta = 'Se presentó un error al guardar la información';
        this.alerta = true;
      });
  }

  obtenrParametros() {
    this.proyectoService.ObtenerParametros()
      .subscribe(resp => {
        this.listaParametros = typeof(resp.mensaje1) === 'object' ?  resp.mensaje1 : JSON.parse(resp.mensaje1);
        this.armarListaparametros();
      }, (error) => {
        this.mensajeAlerta = 'Se presentó un error al iniciar el formulario';
        this.alerta = true;
      });
  }

  armarListaparametros() {
    this.listaParametros.forEach(element => {
      if (element.tipo === this.tipoParametros[0]) {
        this.responsables.push(element)
      }

      if (element.tipo === this.tipoParametros[1]) {
        this.clasificacion1.push(element)
      }

      if (element.tipo === this.tipoParametros[2]) {
        this.clasificacion2.push(element)
      }

      if (element.tipo === this.tipoParametros[3]) {
        this.clasificacion3.push(element)
      }
    });
  } 

  nuevoFormulario() {
    const mes = new Date().getMonth() + 1;
    var fecha = {
      year: new Date().getFullYear(),
      month: mes,
      day: new Date().getDate()
    }

    this.formGroup = this.fb.group({
      registroVenta: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(6), this.validarRegistroVenta]],
      proyecto: ['', [Validators.required, Validators.maxLength(150), Validators.minLength(5), this.validarTexto]],
      responsable1: ['0', [Validators.required, Validators.maxLength(5), this.validarCombo]],
      responsable2: ['0', [Validators.required, Validators.maxLength(5), this.validarCombo]],
      cliente: ['', [Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(100)]],
      fechaInicio: [fecha, []],
      fechaFin: [fecha, []],
      clasificacion1: ['0', []],
      clasificacion2: ['0', []],
      clasificacion3: ['0', []],
      ingreso: [false, []],
      costo: [false, []],
      gasto: [false, []],
      activo: [true, []]
    });
    // this.formGroup = this.fb.group({ falto colocar el requerido
    //   registroVenta: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(6), this.validarRegistroVenta]],
    //   proyecto: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(5), this.validarTexto]],      
    //   responsable1: ['0', [Validators.required, Validators.maxLength(5), this.validarCombo]],
    //   responsable2: ['0', [Validators.maxLength(5)]],
    //   cliente: ['', [Validators.maxLength(50), Validators.minLength(5), this.validarTexto]],
    //   descripcion: ['', [Validators.maxLength(100), Validators.minLength(5), this.validarTexto]],
    //   fechaInicio: ['', [Validators.maxLength(10)]],
    //   fechaFin: ['', [Validators.maxLength(10)]],
    //   clasificacion1: ['0', [Validators.maxLength(5), this.validarCombo]],
    //   clasificacion2: ['0', [Validators.maxLength(5), this.validarCombo]],
    //   clasificacion3: ['0', [Validators.maxLength(5), this.validarCombo]],
    //   ingreso: [false, []],
    //   costo: [false, []],
    //   gasto: [false, []],
    //   activo: [true, []]
    // });
  }

  edicionFormulario() {

    var responsablePrincipal = this.inputproyectoModel.responsables[0].id;
    var responsableSecundario = this.inputproyectoModel.responsables.length > 1 ? this.inputproyectoModel.responsables[1].id : 0;
    var fechaInicio = {
      year: new Date(this.inputproyectoModel.fechaInicio).getFullYear(),
      month: new Date(this.inputproyectoModel.fechaInicio).getMonth(),
      day: new Date(this.inputproyectoModel.fechaInicio).getDate()
    }
    var fechaFin = {
      year: new Date(this.inputproyectoModel.fechaFin).getFullYear(),
      month: new Date(this.inputproyectoModel.fechaFin).getMonth(),
      day: new Date(this.inputproyectoModel.fechaFin).getDate()
    }
    this.inputproyectoModel.fechaFin

    this.formGroup = this.fb.group({
      registroVenta: [this.inputproyectoModel.registroVenta, [Validators.required, Validators.maxLength(10), Validators.minLength(6), this.validarRegistroVenta]],
      responsable1: [responsablePrincipal, [Validators.required, Validators.maxLength(5), this.validarCombo]],
      responsable2: [responsableSecundario, [Validators.required, Validators.maxLength(5)]],
      proyecto: [this.inputproyectoModel.proyecto, [Validators.required, Validators.maxLength(150), Validators.minLength(5), this.validarTexto]],
      cliente: [this.inputproyectoModel.cliente, [Validators.maxLength(100), this.validarTexto]],
      descripcion: [this.inputproyectoModel.descripcion, [Validators.maxLength(100), this.validarTexto]],
      fechaInicio: [fechaInicio, []],
      fechaFin: [fechaFin, []],
      clasificacion1: [this.inputproyectoModel.clasificacion1, [Validators.maxLength(5)]],
      clasificacion2: [this.inputproyectoModel.clasificacion2, [Validators.maxLength(5)]],
      clasificacion3: [this.inputproyectoModel.clasificacion3, [Validators.maxLength(5)]],
      ingreso: [this.inputproyectoModel.ingreso, []],
      costo: [this.inputproyectoModel.costo, []],
      gasto: [this.inputproyectoModel.gasto, []],
      activo: [this.inputproyectoModel.activo, []]
    });

    this.formGroup.controls.registroVenta.disable();

    // this.formGroup = this.fb.group({
    //   registroVenta: [this.inputproyectoModel.registroVenta, [Validators.required, Validators.maxLength(10), Validators.minLength(6), this.validarRegistroVenta]],
    //   responsable1: [responsablePrincipal, [Validators.required, Validators.maxLength(5), this.validarCombo]],
    //   responsable2: [responsableSecundario, [Validators.maxLength(5)]],
    //   proyecto: [this.inputproyectoModel.proyecto, [Validators.required, Validators.maxLength(50), Validators.minLength(5), this.validarTexto]],
    //   cliente: [this.inputproyectoModel.cliente, [Validators.maxLength(50), Validators.minLength(5), this.validarTexto]],
    //   descripcion: [this.inputproyectoModel.descripcion, [Validators.maxLength(100), Validators.minLength(5), this.validarTexto]],
    //   fechaInicio: [fechaInicio, [Validators.maxLength(10)]],
    //   fechaFin: [fechaFin, [Validators.maxLength(10)]],
    //   clasificacion1: [this.inputproyectoModel.clasificacion1, [Validators.maxLength(5), this.validarCombo]],
    //   clasificacion2: [this.inputproyectoModel.clasificacion2, [Validators.maxLength(5), this.validarCombo]],
    //   clasificacion3: [this.inputproyectoModel.clasificacion3, [Validators.maxLength(5), this.validarCombo]],
    //   ingreso: [this.inputproyectoModel.ingreso, []],
    //   costo: [this.inputproyectoModel.costo, []],
    //   gasto: [this.inputproyectoModel.gasto, []],
    //   activo: [this.inputproyectoModel.activo, []]
    // });

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

  public validarTexto(control: AbstractControl) {
    let result = null;
    const rexg = /^[A-Za-z0-9\s\.,ñáóéíú?-]+$/i;
    const texto = control.value;
    if (texto === '') return result;

    if (texto.match(rexg) === null) {
      result = { caractespeciales: 'El campo contiene caracteres especiales' };
    }
    return result;
  }

  public validarRegistroVenta(control: AbstractControl) {
    let result = null;
    const rexg = /^[A-Za-z0-9\.,ñáóéíú?-]+$/i;
    const texto = control.value;

    if (texto.match(rexg) === null) {
      result = { caractespeciales: 'El campo contiene caracteres especiales' };
    }
    return result
  }

  public validarCombo(control: AbstractControl) {
    let result = null;
    const valor = parseInt(control.value);
    if (!Number.isInteger(valor) || valor === 0) {
      result = { seleccioncombo: 'Debe seleccionar un valor de la lista' };
    }
    return result;
  }

  public validarFormulario(): boolean {

    if (this.formGroup.invalid) {
      this.mensajeAlerta = 'Valide los registros del formulario.';
      this.alerta = true;
      return true;
    } else if (this.validarfechas()) {
      this.mensajeAlerta = 'La fecha de inicio no puede ser superior a la fecha fin o el formato  de alguna fecha no corresponde.'
      this.alerta = true;
      return true;
    }

    this.armarResponsables();
    return false;
  }

  public validarfechas(): boolean {
    if (typeof (this.formGroup.value.fechaInicio) !== 'object' && typeof (this.formGroup.value.fechaFin) !== 'object') {
      return false;
    }
    this.fechaInicio = this.armarFecha(this.formGroup.value.fechaInicio);
    this.fechaFin = this.armarFecha(this.formGroup.value.fechaFin);
    return this.fechaFin > this.fechaInicio || this.fechaInicio.toDateString() === this.fechaFin.toDateString() ? false : true;

  }

  public armarFecha(fecha) {
    return new Date(fecha.year + '-' + fecha.month + '-' + fecha.day);
  }

  public armarResponsables() {

    const responsableProyecto: ResponsableProyectoModel = new ResponsableProyectoModel();
    responsableProyecto.id = this.formGroup.value.responsable1;
    responsableProyecto.nombre = '';
    this.responsablesProyecto.push(responsableProyecto);

    if (this.formGroup.value.responsable2 !== '0') {
      const responsableProyecto2: ResponsableProyectoModel = new ResponsableProyectoModel();
      responsableProyecto2.id = this.formGroup.value.responsable2;
      responsableProyecto2.nombre = '';
      this.responsablesProyecto.push(responsableProyecto2);
    }

  }
}
