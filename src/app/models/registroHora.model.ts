import { TiempoModel } from "./tiempo.model";

export class RergistroHoraModel {
    idRegistro: number;
    idUsuario: number;
    nombreUsuario: string;
    registroVenta: string;
    proyecto: string;
    actividad: string;
    fase: number;
    horas: TiempoModel;
    fechaReporte: Date;
    solcitud: string;
    estado: number;
    estadoNombre: string;
}