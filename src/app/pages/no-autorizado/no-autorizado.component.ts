import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-autorizado',
  templateUrl: './no-autorizado.component.html',
  styleUrls: ['./no-autorizado.component.css']
})
export class NoAutorizadoComponent implements OnInit {
public titulopagina = 'Acceso no Autorizado';
  constructor() { }

  ngOnInit(): void {
  }

}
