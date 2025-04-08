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
  searchQuery: string = '';
  filterBy: string = 'all';
  myemail: string = '';
  searchBy: 'name' | 'email' = 'name';
  selectedTab: 'find' | 'friends' | 'transactions' = 'find';
  userId: number = 0;



  
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
  loadTransactions(): void {
    if (!this.token || !this.userId) return;
  
    this.userService.getTransactions(this.userId, this.token).subscribe({
      next: (data) => {
        const sent = data.sent.map((t: any) => ({
          sender: 'You',
          receiver: t.to,
          amount: t.amount,
          date: new Date(t.date)
        }));
  
        const received = data.received.map((t: any) => ({
          sender: t.from,
          receiver: 'You',
          amount: t.amount,
          date: new Date(t.date)
        }));
  
        this.transactions = [...sent, ...received].sort((a, b) => b.date.getTime() - a.date.getTime());
      },
      error: (err) => {
        console.error('Error al obtener transacciones:', err);
      }
    });
  }
  


  transactions = [
    { sender: 'Alice Johnson', receiver: 'Bob Smith', amount: 75.00, date: new Date('2024-04-01') },
    { sender: 'Carlos Diaz', receiver: 'Eva Adams', amount: 120.50, date: new Date('2024-04-02') },
    { sender: 'Bob Smith', receiver: 'Alice Johnson', amount: 45.25, date: new Date('2024-04-03') },
    { sender: 'Eva Adams', receiver: 'Carlos Diaz', amount: 60.00, date: new Date('2024-04-04') }
  ];
  
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
    const token = sessionStorage.getItem('authToken');
    const userIdStr = sessionStorage.getItem('userid'); 
    if (token && userIdStr) {
      this.token = token;
      this.userId = parseInt(userIdStr, 10);
  
      this.userService.getAllUsers(token).subscribe({
        next: (data) => {
          this.users = data;
        },
        error: (err) => {
          console.error('Error al obtener usuarios:', err);
        }
      });
  
      this.loadTransactions();
    } else {
      console.error('No token found in sessionStorage');
    }
    
  }
  get filteredUsers() {
    return this.users.filter(user =>
      String(user[this.searchBy as keyof typeof user])
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase())
    );
  }

  selectTab(tab: 'find' | 'friends' | 'transactions') {
    this.selectedTab = tab;
  }
  
  irABizum(tipo: 'send' | 'request', usuario: any) {
    this.router.navigate(['/bizum', tipo], { state: { usuario } });
  }
  
  


}
