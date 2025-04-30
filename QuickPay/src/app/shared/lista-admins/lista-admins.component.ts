import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-lista-admins',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-admins.component.html',
  styleUrl: './lista-admins.component.css'
})
export class ListaAdminsComponent {
   
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
  selectedTab: 'find' | 'friends' | 'transactions' | 'requests' | 'frequent' = 'find';
  userId: number = 0;
  modalVisible: boolean = false;
  modalMessage: string = '';
  frequentContacts: any[] = [];
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

  
  showModal(message: string) {
    this.modalMessage = message;
    this.modalVisible = true;
    setTimeout(() => {
      this.modalVisible = false;
    }, 2500);
  }
  
  loadTransactions(): void {

  }
  users = [
    {
      id: 1,
      name: 'Aaron Smith',
      email: 'aaron.smith@example.com',
      balance: 100.00
    }
  ];
  
  
  selectTab(tab: 'find' | 'friends' | 'transactions' | 'requests'| 'frequent') {
    this.selectedTab = tab;

  }
 
  
  ngOnInit(): void {
    const token = sessionStorage.getItem('authToken');
    const userIdStr = sessionStorage.getItem('userid'); 
    if (token && userIdStr) {
      this.token = token;
      this.userId = parseInt(userIdStr, 10);
      this.userService.getAllUsers(token).subscribe({
        next: (data) => {
          this.users = data;
          this.loadTransactions(); // 👈 Llama aquí una vez tengas users reales

        },
        error: (err) => {
          console.error('Error al obtener usuarios:', err);
        }
      });
  
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

  deleteUser(user : any) {
    this.selectedUser = user;
    this.modalMessage = "Are you sure you want to delete this user? This action cannot be undone.";
    this.showDeleteModal = true;
  }

  
  confirmDelete(): void {
    if (this.selectedUser) {
      this.userService.deleteUserAsAdmin(this.selectedUser.id, this.token).subscribe({
        next: () => {
          this.showDeleteModal = false;
          this.selectedUser = null;
          this.loadUsers(); // 🔄 Recarga la lista tras borrar
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          this.showDeleteModal = false;
        }
      });
    }
  }
  loadUsers(): void {
    this.userService.getAllUsers(this.token).subscribe((users) => {
      this.users = users;
      this.loadTransactions()
    });
  }
  editUser(userId: number): void {
    this.router.navigate(['/perfil-usuario', userId]);
  }
  


}
