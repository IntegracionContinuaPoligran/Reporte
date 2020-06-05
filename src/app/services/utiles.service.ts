import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { RergistroHoraModel } from '../models/registroHora.model';
import { TiempoModel } from '../models/tiempo.model';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class UtilesService {

  constructor() { }
  public exportAsExcelFile(json: any[], excelFileName: string) {

    return new Promise((resolve, reject) => {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, excelFileName)
        .then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });

    });
  }
  
  private saveAsExcelFile(buffer: any, fileName: string) {
    return new Promise((resolve, reject) => {
      const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      resolve(true);
    });
  }

  public notificacionError() {
    const toast = document.getElementById('notifiError');
    toast.className = 'mostrar';
    setTimeout(function () { toast.className = toast.className.replace('mostrar', ''); }, 5000);
  }

  public notificacionExito() {
    const toast = document.getElementById('notifiCorrecta');
    toast.className = 'mostrar';
    setTimeout(function () { toast.className = toast.className.replace('mostrar', ''); }, 5000);
  }

  calcularPaginacion(count: number) {
    let valor = 2;
    if (count < 10) {
      valor = 4;
    } else if (count < 100) {
      valor = 10;
    } else if (count < 500) {
      valor = 50;
    } else if (count > 500) {
      valor = 100;
    }
    return valor;
  }

  formatearFecha(fecha) {
    const date = new Date(fecha);
    const nuevaFecha = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    return nuevaFecha;
  }

  sumarHoras(registroHoras: RergistroHoraModel[]) {
    let horas = 0;
    let minutos = 0;
    let valorFinal;
    registroHoras.forEach(element => {
      horas = horas + element.horas.hora;
      minutos = minutos + element.horas.minuto;
    });

    horas = Math.trunc(minutos / 60) + horas;
    minutos = minutos % 60;

    let retunrHora, retunrMinuto;
    retunrHora = horas < 10 ? `0${horas}` : horas;
    retunrMinuto = minutos < 10 ? `0${minutos}` : minutos;

    return `${retunrHora} : ${retunrMinuto}`;

  }

  sumarHorasModeloTiempo(registroHoras: TiempoModel[]) {
    let horas = 0;
    let minutos = 0;
    registroHoras.forEach(element => {
      horas = horas + element.hora;
      minutos = minutos + element.minuto;
    });

    horas = Math.trunc(minutos / 60) + horas;
    minutos = minutos % 60;

    let retunrHora, retunrMinuto;
    retunrHora = horas < 10 ? `0${horas}` : horas;
    retunrMinuto = minutos < 10 ? `0${minutos}` : minutos;

    return `${retunrHora} : ${retunrMinuto}`;
  }

  calcularPorcenta(totalHoras, horas) {
    totalHoras = totalHoras.split(':');
    horas = horas.split(':');
    const horasTotal = parseFloat(totalHoras[0]) + parseFloat(totalHoras[1]) / 60;
    const horasAlcance = parseFloat(horas[0]) + parseFloat(horas[1]) / 60;
    return ((horasAlcance * 100) / horasTotal).toFixed(2) + ' %';
  }

}
