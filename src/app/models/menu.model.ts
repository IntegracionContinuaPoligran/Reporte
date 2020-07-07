



  declare interface IPaginas {
    idRol: number;
    rol: string;
    icon: string;
    isCollapsed: boolean;
    paginas: IRouteInfo[];
    activo: boolean;
  }

declare interface IRouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
  }


  export class MenuModel implements IPaginas {
      idRol: number;
      rol: string;
      icon: string;
      isCollapsed: boolean;
      paginas: IRouteInfo[];
      activo: boolean;
  }

