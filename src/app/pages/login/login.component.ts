import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

//Modelos
import { LoginModel } from '../../models/login.model';

//Servicios
import { LoginService } from '../../services/login.service';
import { SweetService } from '../../services/sweet.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private formGroup: FormGroup;
  loginModel: LoginModel = new LoginModel();

  constructor(private fb: FormBuilder,
    private loginService: LoginService,
    private menuService: MenuService,
    private router: Router,
    private alerta: SweetService) { }

  ngOnInit() {
    sessionStorage.clear();
    this.cargarFormulario();
  }

  get userNameNoValido() {
    return this.formGroup.get('usuario').invalid && this.formGroup.get('usuario').touched
  }

  get passwordNoValido() {
    return this.formGroup.get('password').invalid && this.formGroup.get('password').touched
  }

  cargarFormulario() {
    this.formGroup = this.fb.group({
      usuario: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(12)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(12)
      ]]
    });
  }


  login() {

    if (!this.validarFormulario()) return;
    this.alerta.mostrarAlerta('info', 'Iniciando sesión', true);
    this.loginModel = this.formGroup.value;

    this.loginService.login(this.loginModel)
      .subscribe(resp => this.obtenerMenu(resp),
        (error) => {
          this.alerta.mostrarAlerta('error', 'La credenciales son incorrectas.', false);
        });
  }

  validarFormulario(): boolean {
    if (this.formGroup.invalid) {
      Object.values(this.formGroup.controls).forEach(control => {
        control.markAsTouched();
      });
      return false;
    }
    return true;
  }

  obtenerMenu(resp) {
    if (resp.estado) {
      if (this.menuUsuario()) {
        this.router.navigateByUrl('/proyectos');
      } else {
        this.router.navigateByUrl('/login');
      }

      this.alerta.cerrarAlerta();
    }
  }

  async menuUsuario() {
    await this.menuService.menuUsuario()
      .subscribe(resp => {
        return true;
      }, (error) => {
        return false;
      });

  }



}
