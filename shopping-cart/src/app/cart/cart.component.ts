import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule , HttpClientModule , FormsModule ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: { name: string , rate : number , qty: number , UserId : string , img : string }[] = [];
  constructor(private http : HttpClient , private authService : AuthService) {};

  ngOnInit(): void {
    const user = this.authService.getUser(); 

    if (!user) {
      console.error('User is not logged in');
      return;
    }
    const UserId = user._id || user.id;
    this.http.get<{ name: string; rate:number ,  qty: number }[]>(`http://localhost:3000/api/items/cart?UserId=${UserId}`).subscribe(
      (response : any) => {
        this.cartItems = response;
      },(error) => {
        console.error(error);
      }
    )
  }
  addToCart(name: string, rate: number, qty: number , img:string ): void {
    const user = this.authService.getUser(); 

    if (!user) {
      console.error('User is not logged in');
      return;
    }
    const UserId = user._id || user.id;
    console.log("UserId:", UserId);
    this.http.post('http://localhost:3000/api/items/add-to-cart', { name, rate, qty , UserId , img}).subscribe(
      (response) => {
        console.log('Item added to cart:', response);
        const existingItem = this.cartItems.find(item => item.name === name );
        if (existingItem) {
          existingItem.qty += qty;
        } else {
          this.cartItems.push({ name, rate, qty , UserId , img }); 
        }
      },
      (error) => {
        console.error('Error adding item to cart:', error);
      }
    );
  }
  
  truncateName(name: string): string {
    return name.length > 30 ? name.substring(0, 50) + '...' : name;
  }
  // subToCart(name: string  , qty: number): void {
  //   const user = this.authService.getUser();

  //   if(!user){
  //     console.error("Pls Login First");
  //     return;
  //   }
  //   const UserId = user._id || user.id;
  //   console.log("UserId:", UserId);

  //   this.http.post('http://localhost:3000/api/items/sub-to-cart', { name,qty , UserId}).subscribe(
  //     (response) => {
  //       const existingItem = this.cartItems.find(item => item.name === name && item.UserId == UserId);
  //       if (existingItem) {
  //         existingItem.qty -= qty;  
  //      if(existingItem.qty <= 0) {
  //         const index = this.cartItems.indexOf(existingItem);
  //         this.cartItems.splice(index, 1);
  //       }
  //     }
  //     },
  //     (error)=>{
  //       console.error('Error substracting item from cart:', error);
  //     }
  //   )
  // }

  subToCart(name: string, qty: number): void {
    const user = this.authService.getUser(); 
  
    if (!user) {
      console.error('User is not logged in');
      return;
    }
    const UserId = user._id || user.id; 
    console.log("UserId:", UserId);
    this.http.post('http://localhost:3000/api/items/sub-to-cart', { name, qty, UserId }).subscribe(
      (response) => {
        const existingItem = this.cartItems.find(item => item.name === name);
        if (existingItem) {
          existingItem.qty -= qty;
  
          if (existingItem.qty <= 0) {
            const index = this.cartItems.indexOf(existingItem);
            this.cartItems.splice(index, 1); 
          }
        }
      },
      (error) => {
        console.error('Error subtracting item from cart:', error);
      }
    );
  }
  
  getTotalAmout(): number{
    return this.cartItems.reduce((total , item) => total+(item.rate * item.qty), 0)
  
  }

    getCartItemsCount(): number {
    return this.cartItems.length;
  }

 
}
