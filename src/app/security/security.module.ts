import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';

import { SecurityComponent } from './security.component';
import { SecurityService } from './security.service';
import { SocketFactoryModule } from '../socketFactory/socketFactory.module'


@NgModule({
  imports: [ 
    BrowserModule,
    FormsModule,
    SocketFactoryModule
  ],
  providers: [ SecurityService ],
  declarations: [ SecurityComponent, LoginComponent, RegisterComponent ],
  exports: [ SecurityComponent, LoginComponent, RegisterComponent ]
})
export class SecurityModule {}