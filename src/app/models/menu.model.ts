
  declare interface IPaginas {
    rol: string;
    icon: string;
    isCollapsed: boolean;
    paginas: IRouteInfo[];
  }

declare interface IRouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
  }


  export class MenuModel implements IPaginas {

      rol: string;
      icon: string;
      isCollapsed: boolean;
      paginas: IRouteInfo[];

  }

