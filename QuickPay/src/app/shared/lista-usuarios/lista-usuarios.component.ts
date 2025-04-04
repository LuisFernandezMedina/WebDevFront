import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.css'
})
export class ListaUsuariosComponent implements OnInit{
  isLoading: boolean = false;
  selectedUser: any = null;
  showBlockModal: boolean = false;
  isAdmin: boolean = true;
  token: string = '';
  showValiModal: boolean = false;
  showDeleteModal: boolean = false;
  countdown: number = 5;
  countdownInterval: any;
  searchBy: string = 'name';
  searchQuery: string = '';
  filterBy: string = 'all';
  myemail: string = '';


  
  loggedUser: any = {
    firstName: 'John',
    lastName: 'Doe',
    profilePicture: '/assets/images/UsuarioSinFoto.png',
    role: 'admin'
  };


  constructor(
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}




  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 1000);
  }



  
  loadAllUsers(): void {
    
  }



  users = [
    {
      name: 'Aaron Smith',
      email: 'aaron.smith@example.com',
      balance: 100.00
    },
    {
      name: 'Maria González Diaz del Campo Blanco de Castilla',
      email: 'maria.gonzalez@example.com',
      balance: 50.50
    },
    {
      name: 'Maria González',
      email: 'maria2.gonzalez@example.com',
      balance: 75.25
    }
  ];

  ngOnInit(): void {
    
    

    
  }
  


}
