import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-authuser',
  standalone: true,
  imports: [CommonModule , HttpClientModule , FormsModule],
  templateUrl: './authuser.component.html',
  styleUrl: './authuser.component.css'
})
export class AuthuserComponent {
userInfo = {
  email : "",
  password : "",
}
constructor(private http :  HttpClient , private router : Router , private authService : AuthService) { }

LoginClick(){
 const  LoginApi = "http://localhost:3000/auth/login";
  this.http.post(LoginApi , this.userInfo).subscribe(
    (response : any)=>{
      console.log(response);
      this.authService.setUser(response.user);
      this.router.navigate(["/"]);
      localStorage.setItem('token',response.token);
    },
    (error)=>{
      console.log(error);
    }
  )
}
Register(){
  this.router.navigate(["/register"]);
}
}
