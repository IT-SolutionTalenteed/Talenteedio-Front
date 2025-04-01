import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Article } from 'src/app/shared/models/article.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import { environment } from 'src/environments/environment';
import { ArticleListCriteria } from '../types/article-list-criteria.interface';

@Injectable()
export class BlogService {
  constructor(private apollo: Apollo) {}

  private apiUrl = `${environment.apiBaseUrl}/article`;
  // eslint-disable-next-line max-lines-per-function
  loadArticles(
    articleCriteria: ArticleListCriteria
  ): Observable<Paginated<Article>> {
    const variables = {
      input: {
        limit: articleCriteria.page.pageSize,
        page: articleCriteria.page.page,
      },
      filter: {
        title: articleCriteria?.filter?.search,
        status: 'public',
        category: articleCriteria?.filter?.category,
      },
    };
    return (
      this.apollo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .query<any>({
          query: gql`
            query GetArticles($input: PaginationInput, $filter: ArticleFilter) {
              getArticles(input: $input, filter: $filter) {
                rows {
                  id
                  image {
                    id
                    fileUrl
                  }
                  title
                  content
                  publicContent
                  createdAt
                  slug
                  isPremium
                }
                total
              }
            }
          `,
          variables,
          fetchPolicy: 'network-only', // Force Apollo to make a network request instead of using cache
          context: {
            uri: this.apiUrl, // Use the updated API URL
          },
        })
        .pipe(
          map((response) => ({
            items: response.data.getArticles.rows,
            totalItems: response.data.getArticles.total,
          }))
        )
    );
  }

  // eslint-disable-next-line max-lines-per-function
  loadArticle(id: string): Observable<Article> {
    const variables = {
      input: { slug: id },
    };
    return (
      this.apollo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .query<any>({
          query: gql`
            query GetOneArticle($input: GetOneArticleInput) {
              getOneArticle(input: $input) {
                id
                image {
                  id
                  fileUrl
                }
                title
                content
                createdAt
                publicContent
                isPremium
                admin {
                  user {
                    name
                  }
                }
                company {
                  user {
                    name
                  }
                }
                slug
              }
            }
          `,
          variables,
          fetchPolicy: 'network-only', // Force Apollo to make a network request instead of using cache
          context: {
            uri: this.apiUrl, // Use the updated API URL
          },
        })
        .pipe(map((response) => response.data.getOneArticle as Article))
    );
  }
}
