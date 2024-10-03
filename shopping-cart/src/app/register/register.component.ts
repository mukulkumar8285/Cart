import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule , HttpClientModule , FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  userInfo = {
    username: '',
    email: '',
    password : ''
  }
constructor(private http: HttpClient , private router : Router) {}


register(){
  this.http.post("https://cart-angular.vercel.app/auth/register" , this.userInfo).subscribe(
    (res) => {
      console.log(res);
      this.router.navigate(["login"]);
    },
    (err) => {
      console.log(err);
    }
  )
}


}
