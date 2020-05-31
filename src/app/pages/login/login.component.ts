import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginModel } from '../../models/login.model';
import { LoginService } from '../../services/login.service';
import { SweetService } from '../../services/sweet.service';

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
    private router: Router,
    private alerta: SweetService) { }

  ngOnInit() {
    this.cargarFormulario();
  }

  //#region  Validación de controles
  get userNameNoValido() {
    return this.formGroup.get('userName').invalid && this.formGroup.get('userName').touched
  }

  get passwordNoValido() {
    return this.formGroup.get('password').invalid && this.formGroup.get('password').touched
  }
  //#endregion


  cargarFormulario() {
    this.formGroup = this.fb.group({
      userName: ['', [
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

    this.alerta.mostrarAlerta('info', 'Estamos validando su información', true);

    this.loginModel = this.formGroup.value;
    
    this.loginService.login(this.loginModel)
      .subscribe(resp => {
        this.alerta.cerrarAlerta();
        this.router.navigateByUrl(resp);
      }, (error) => {
        if (error?.status === 401) {
          this.router.navigateByUrl('/login');
          this.alerta.cerrarAlerta();
        } else {
          console.log(error);
          this.alerta.mostrarAlerta('error', 'Los datos ingresados no son correctos. Por favor verifíquelos e intente nuevamente.', false);
        }
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


}
