import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../core';
import { AuthService } from '../../../../../modules/auth/_services/auth.service';

@Component({
  selector: 'app-dashboard-wrapper',
  templateUrl: './dashboard-wrapper.component.html',
})
export class DashboardWrapperComponent implements OnInit {
  demo: string;
  user: string;
  constructor(private layout: LayoutService, private authService: AuthService,) {}

  ngOnInit(): void {

  	this.authService.getUserByToken().subscribe(user => {
       console.log("UserDetails",user.roles[0]);
       if(user){
       		switch(user.roles[0]){
       			case 1: 
       				this.demo = 'demo1';
       				break;
       			case 2:
       				this.demo = 'demo2';
       				break;
       			case 3:
       				this.demo = 'demo3';
       				break;
       			default:
       				this.demo = 'demo1';
       		}
       }else{
       	this.demo = this.layout.getProp('demo');
       }
    });

  	console.log(this.demo);

    /*this.demo = this.layout.getProp('demo');*/
  }
}
