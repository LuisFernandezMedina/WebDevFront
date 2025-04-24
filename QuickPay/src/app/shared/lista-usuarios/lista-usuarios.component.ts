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
  
        const contactos: any[] = [];
        const vistos = new Set();
  
        for (const tx of this.transactions) {
          const contacto = tx.sender === 'You' ? tx.receiver : tx.sender;
          console.log('🔎 Buscando contacto:', contacto);
  
          if (!vistos.has(contacto)) {
            console.log('📋 Lista completa de usuarios disponibles:');
this.users.forEach((user: any) => {
  console.log(`🧑‍💼 Nombre: ${user.name}, Email: ${user.email}`);
});

            const match = this.users.find(u => u.name === contacto || u.email === contacto);
            if (match) {
              console.log('✅ Match encontrado:', match);
              contactos.push(match);
              vistos.add(contacto);
            } else {
              console.warn('❌ No se encontró usuario con ese nombre o email:', contacto);
            }
          }
  
          if (contactos.length >= 10) break;
        }
  
        this.frequentContacts = contactos;
        console.log('📋 Contactos frecuentes resultantes:', this.frequentContacts);
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
    }
  ];

  ngOnInit(): void {
    const token = sessionStorage.getItem('authToken');
    const userIdStr = sessionStorage.getItem('userid'); 
    if (token && userIdStr) {
      this.token = token;
      this.userId = parseInt(userIdStr, 10);
      this.loadRequests();

      
      
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

  selectTab(tab: 'find' | 'friends' | 'transactions' | 'requests'| 'frequent') {
    this.selectedTab = tab;
    if (tab === 'requests') {
      this.loadRequests();
    }
  }
  
  irABizum(tipo: 'send' | 'request', usuario: any) {
    this.router.navigate(['/bizum', tipo], { state: { usuario } });
  }
  
  requests: any[] = [];

  
  acceptRequest(req: any) {
    this.userService.acceptRequest(req.id, this.token).subscribe({
      next: () => {
        this.showModal('✅ Payment sent successfully');
        this.requests = this.requests.filter(r => r.id !== req.id);
      },
      error: (err) => {
        this.showModal('❌ Error: ' + (err.error?.error || 'Could not accept the request'));
      }
    });
  }
  
  rejectRequest(req: any) {
    this.userService.deleteRequest(req.id, this.token).subscribe({
      next: () => {
        this.showModal('🔕 Request rejected');
        this.requests = this.requests.filter(r => r.id !== req.id);
      },
      error: (err) => {
        this.showModal('❌ Error: ' + (err.error?.error || 'Could not reject the request'));
      }
    });
  }
  

  loadRequests() {
    if (!this.token || !this.userId) return;
  
    this.userService.getAllUsers(this.token).subscribe({
      next: (users) => {
        const userMap = new Map(users.map((u: any) => [u.id, u.name])); // id → name
  
        this.userService.myRequests(this.userId, this.token).subscribe({
          next: (res) => {
            this.requests = [...res.sent_requests, ...res.received_requests].map((r: any) => ({
              ...r,
              requesterName: userMap.get(r.requester_id) || `User ${r.requester_id}`
            }));
          },
          error: () => {
            this.requests = [];
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
      }
    });
  }
  
  
  
  


}

