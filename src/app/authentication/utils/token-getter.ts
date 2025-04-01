import { AuthenticationState } from '../store/reducers/authentication.reducers';

export function tokenGetter(): string {
  let authenticationStateStr: string | undefined;
  if (
    typeof window !== 'undefined' &&
    typeof window.localStorage !== 'undefined'
  ) {
    authenticationStateStr = localStorage.getItem('auth');
  }
  const authenticationState: AuthenticationState =
    authenticationStateStr && JSON.parse(authenticationStateStr);
  return authenticationState && authenticationState.token;
}
