import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

constructor(private http : HttpClient , private router : Router , private authservice : AuthService){};

onHome(){
  this.router.navigate(["/"]);
}
onCart(){
  this.router.navigate(["/cart"]);
}
onAdd(){
  this.router.navigate(["/add-cart"])
}

onLogout(){
    this.authservice.logout();

    this.http.post("http://localhost:3000/auth/logout", {}).subscribe(
      (response) => {
        console.log(response)
      },
      (error) => {
        console.log(error);
      }
    )

}


}
