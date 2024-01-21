import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'wp-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent {
  
  constructor(private router: Router) {}
  
  navigateToGame(){
    this.router.navigateByUrl('/popularitygame');
  }
}
