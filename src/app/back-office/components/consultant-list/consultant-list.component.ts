import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { environment } from 'src/environments/environment';

const GET_CONSULTANTS = gql`
  query GetConsultants($input: PaginationInput, $filter: ConsultantFilter) {
    getConsultants(input: $input, filter: $filter) {
      rows {
        id
        expertise
        yearsOfExperience
        status
        tjm
        createdAt
        user {
          id
          email
          firstname
          lastname
          isVerified
          validateAt
        }
        category {
          id
          name
        }
        contact {
          phoneNumber
        }
      }
      total
      page
      limit
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      validateAt
      isVerified
    }
  }
`;

@Component({
  selector: 'app-consultant-list',
  templateUrl: './consultant-list.component.html',
  styleUrls: ['./consultant-list.component.scss']
})
export class ConsultantListComponent implements OnInit {
  consultants: any[] = [];
  total: number = 0;
  page: number = 1;
  limit: number = 20;
  loading: boolean = false;
  showPendingOnly: boolean = false;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.loadConsultants();
  }

  loadConsultants() {
    this.loading = true;
    this.apollo.query({
      query: GET_CONSULTANTS,
      variables: {
        input: { 
          page: this.page, 
          limit: this.limit,
          direction: 'DESC',
          orderBy: 'createdAt'
        },
        filter: {
          name: '',
          status: ''
        }
      },
      fetchPolicy: 'network-only',
      context: {
        uri: `${environment.apiBaseUrl}/user`
      }
    }).subscribe({
      next: (result: any) => {
        let consultants = result.data.getConsultants.rows;
        
        // Filtrer si on veut voir uniquement les en attente
        if (this.showPendingOnly) {
          consultants = consultants.filter((c: any) => !c.user.isVerified);
        }
        
        this.consultants = consultants;
        this.total = result.data.getConsultants.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading consultants:', error);
        this.loading = false;
        alert('Erreur lors du chargement des consultants');
      }
    });
  }

  validateConsultant(consultant: any) {
    if (confirm(`Valider le compte de ${consultant.user.firstname} ${consultant.user.lastname} ?`)) {
      this.apollo.mutate({
        mutation: UPDATE_USER,
        variables: {
          input: {
            id: consultant.user.id,
            // Le backend mettra automatiquement validateAt à maintenant
          }
        },
        context: {
          uri: `${environment.apiBaseUrl}/user`
        }
      }).subscribe({
        next: () => {
          alert('Consultant validé avec succès !');
          this.loadConsultants();
        },
        error: (error) => {
          console.error('Error validating consultant:', error);
          alert('Erreur lors de la validation');
        }
      });
    }
  }

  isPending(consultant: any): boolean {
    return !consultant.user.isVerified;
  }

  getPendingCount(): number {
    return this.consultants.filter(c => this.isPending(c)).length;
  }

  toggleFilter() {
    this.showPendingOnly = !this.showPendingOnly;
    this.page = 1;
    this.loadConsultants();
  }

  nextPage() {
    if (this.page * this.limit < this.total) {
      this.page++;
      this.loadConsultants();
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.loadConsultants();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.total / this.limit);
  }
}
