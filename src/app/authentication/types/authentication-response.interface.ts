import { User } from 'src/app/shared/models/user.interface';

export interface AuthenticationResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}
