import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

interface Usuario {
  id: number;
  name: string;
  email: string;
  balance?: number;
}

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
  selectedTab: 'find' | 'friends' | 'transactions' | 'requests' | 'frequent'| 'grouprequest'= 'find';
  userId: number = 0;
  modalVisible: boolean = false;
  modalMessage: string = '';
  frequentContacts: any[] = [];
  user: Usuario[] = [];
  friends: Usuario[] = [];
  

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
      id: 1,
      name: 'Aaron Smith',
      email: 'aaron.smith@example.com',
      balance: 100.
    }
  ];

  ngOnInit(): void {
    const token = sessionStorage.getItem('authToken');
    const userIdStr = sessionStorage.getItem('userid');
  
    if (token && userIdStr) {
      this.token = token;
      this.userId = parseInt(userIdStr, 10);
  
      this.loadRequests();
  
      // Primero obtenemos todos los usuarios
      this.userService.getAllUsers(token).subscribe({
        next: (users) => {
          this.users = users
          .filter((u: Usuario) => u.id !== this.userId);

  
          // Luego usamos esos usuarios para mapear los IDs de amigos a objetos completos
          this.userService.getFriends(this.userId, token).subscribe({
            next: (friendList) => {
              console.log('📩 Amigos recibidos (objetos):', friendList);
              this.friends = friendList;
              this.friends = friendList.filter(u => u.role !== 'admin' && u.id !== this.userId);

            },
            error: (err) => console.error('Error al obtener amigos:', err)
          });
          
  
          this.loadTransactions(); // ya con users disponibles
        },
        error: (err) => console.error('Error al obtener usuarios:', err)
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

  selectTab(tab: 'find' | 'friends' | 'transactions' | 'requests'| 'frequent' | 'grouprequest') {
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
    if (req.type === 'group') {
      this.userService.acceptGroupRequest(req.id, this.token).subscribe({
        next: () => {
          this.showModal('✅ Group request accepted');
          this.requests = this.requests.filter(r => r.id !== req.id || r.type !== 'group');
        },
        error: (err) => {
          this.showModal('❌ Error: ' + (err.error?.error || 'Could not accept the group request'));
        }
      });
    } else {
      this.userService.acceptRequest(req.id, this.token).subscribe({
        next: () => {
          this.showModal('✅ Request accepted');
          this.requests = this.requests.filter(r => r.id !== req.id || r.type !== 'single');
        },
        error: (err) => {
          this.showModal('❌ Error: ' + (err.error?.error || 'Could not accept the request'));
        }
      });
    }
  }
  
  rejectRequest(req: any) {
    if (req.type === 'group') {
      this.userService.rejectGroupRequest(req.id, this.token).subscribe({
        next: () => {
          this.showModal('🔕 Group request rejected');
          this.requests = this.requests.filter(r => r.id !== req.id || r.type !== 'group');
        },
        error: (err) => {
          this.showModal('❌ Error: ' + (err.error?.error || 'Could not reject the group request'));
        }
      });
    } else {
      this.userService.deleteRequest(req.id, this.token).subscribe({
        next: () => {
          this.showModal('🔕 Request rejected');
          this.requests = this.requests.filter(r => r.id !== req.id || r.type !== 'single');
        },
        error: (err) => {
          this.showModal('❌ Error: ' + (err.error?.error || 'Could not reject the request'));
        }
      });
    }
  }
  
  loadRequests() {
    if (!this.token || !this.userId) return;
  
    // 1. Obtener todos los usuarios para mapear IDs a nombres
    this.userService.getAllUsers(this.token).subscribe({
      next: (users) => {
        const userMap = new Map(users.map((u: any) => [u.id, u.name]));
  
        // 2. Cargar solicitudes normales
        this.userService.myRequests(this.userId, this.token).subscribe({
          next: (res) => {
            const normalRequests = [...res.sent_requests, ...res.received_requests].map((r: any) => ({
              ...r,
              requesterName: userMap.get(r.requester_id) || `User ${r.requester_id}`,
              type: 'normal'
            }));
  
            // 3. Cargar solicitudes grupales
            this.userService.getGroupRequests(this.token).subscribe({
              next: (groupRes) => {
                const groupRequests = [];
  
                for (const g of groupRes) {
                  const me = g.participants.find((p: any) => p.id === this.userId && !p.paid);
                  if (me) {
                    groupRequests.push({
                      id: g.id,
                      amount: me.amount,
                      requesterName: g.creator_name || 'Group Request',
                      type: 'group'
                    });
                  }
                }
  
                // 4. Combinar ambos
                this.requests = [...normalRequests, ...groupRequests];
              },
              error: (err) => {
                console.error('Error loading group requests:', err);
                this.requests = normalRequests; // fallback
              }
            });
          },
          error: () => {
            this.requests = [];
          }
        });
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }
  

  get filteredFriends(): Usuario[] {
    return this.friends.filter(friend =>
      String(friend[this.searchBy])
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase())
    );
  }     

  isFriend(userId: number): boolean {
    return this.friends.some(friend => friend.id === userId);
  }

  follow(user: Usuario): void {
    this.userService.followUser(this.userId, user.id, this.token).subscribe({
      next: () => {
        this.friends.push(user); // 👈 Añade el objeto, no solo el id
        this.showModal(`✅ Siguiendo a ${user.name}`);
      },
      error: (err) => {
        this.showModal(`❌ Error: ${err.error?.error || 'No se pudo seguir'}`);
      }
    });
  }
  
  unfollow(user: Usuario): void {
    this.userService.unfollowUser(this.userId, user.id, this.token).subscribe({
      next: () => {
        this.friends = this.friends.filter(f => f.id !== user.id); // 👈 Filtra por id
        this.showModal(`👋 Dejaste de seguir a ${user.name}`);
      },
      error: (err) => {
        this.showModal(`❌ Error: ${err.error?.error || 'No se pudo dejar de seguir'}`);
      }
    });
  }  
  userSource: 'all' | 'friends' = 'all';
searchParticipant: string = '';
newAmount: number = 0;
manualTotal: number | null = null;
groupDescription: string = '';
groupParticipants: any[] = [];
filteredParticipantOptions: any[] = [];

resetParticipantSearch() {
  this.searchParticipant = '';
  this.filteredParticipantOptions = this.getUserSource();
}

getUserSource() {
  return this.userSource === 'friends' ? this.friends : this.users;
}

filterParticipants() {
  const query = this.searchParticipant.toLowerCase();
  this.filteredParticipantOptions = this.getUserSource().filter(u =>
    u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
  );
}

addParticipant() {
  const user = this.selectedParticipant;
  if (!user) return;

  if (this.groupParticipants.some(p => p.id === user.id)) return;

  this.groupParticipants.push({
    id: user.id,
    name: user.name,
    email: user.email,
    amount: this.newAmount || 0
  });

  // Reset
  this.selectedParticipant = null;
  this.searchParticipant = '';
  this.newAmount = 0;
}


distributeEqually() {
  if (!this.manualTotal || this.groupParticipants.length === 0) return;

  const equalAmount = +(this.manualTotal / this.groupParticipants.length).toFixed(2);
  this.groupParticipants = this.groupParticipants.map(p => ({ ...p, amount: equalAmount }));
}

totalAmount(): number {
  return this.groupParticipants.reduce((sum, p) => sum + (p.amount || 0), 0);
}

createGroupRequest() {
  const token = this.token; // Asegúrate de tenerlo
  const payload = {
    total_amount: this.totalAmount(),
    description: this.groupDescription || 'Sin descripción',
    participants: this.groupParticipants.map(p => ({
      id: p.id,
      amount: p.amount
    }))
  };

  this.userService.createGroupRequest(payload, token).subscribe({
    next: res => {
      this.groupParticipants = [];
      this.manualTotal = null;
      this.groupDescription = '';
      alert('Solicitud creada con éxito');
    },
    error: err => alert('Error: ' + err.error?.error || 'No se pudo crear la solicitud')
  });
}
selectParticipant(user: any) {
  if (this.groupParticipants.some(p => p.id === user.id)) return;

  this.groupParticipants.push({
    id: user.id,
    name: user.name,
    email: user.email,
    amount: this.newAmount || 0
  });

  this.searchParticipant = '';
  this.newAmount = 0;
  this.filteredParticipantOptions = [];
}

selectedParticipant: any = null;
selectUser(user: any) {
  this.selectedParticipant = user;
  this.searchParticipant = `${user.name} (${user.email})`;
  this.filteredParticipantOptions = [];
}



}