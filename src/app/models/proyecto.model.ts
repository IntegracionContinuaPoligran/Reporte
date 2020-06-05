import { ResponsableProyectoModel } from "./responsableProyecto.model";

export class ProyectoModel {
    registroVenta: string;
    cliente: string;
    proyecto: string;
    descripcion: string;
    fechaInicio: Date;
    fechaFin: Date;
    responsables: ResponsableProyectoModel [];
    clasificacion1: number;
    clasificacion2: number;
    clasificacion3: number;
    ingreso: boolean;
    costo: boolean;
    gasto: boolean;
    activo: boolean;

}
