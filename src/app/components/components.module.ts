import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//Components
import { CardInformationComponent } from './card-information/card-information.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule
  ],
  declarations: [
    CardInformationComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent
  ],
  exports: [
    CardInformationComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent
  ]
})
export class ComponentsModule { }
 