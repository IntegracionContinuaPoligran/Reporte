import { AutomaticoModel } from "./automatico.model";

export class AutomaticoPorUsuarioModel {
    idUsuario: number;
    nombre: string;
    fechaInicio: Date;
    fechaFin: Date;
    listaAutomaticos: AutomaticoModel[];
    totalPorcentaje: number;
}