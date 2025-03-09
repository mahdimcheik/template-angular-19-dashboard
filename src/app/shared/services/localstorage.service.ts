import { Injectable } from '@angular/core';
import { Theme } from './theme.service';
import { UserResponseDTO } from '../models/user';
import { layoutConfig } from '../../layout/service/layout.service';

@Injectable({
    providedIn: 'root'
})
export class LocalstorageService {
    getTheme(): Theme {
        const theme = JSON.parse(localStorage.getItem('theme') || '{}');
        return theme;
    }
    setTheme(theme: Theme) {
        localStorage.setItem('theme', JSON.stringify(theme));
    }
    setUser(user: UserResponseDTO) {
        localStorage.setItem('user', JSON.stringify(user));
    }
    getUser(): UserResponseDTO {
        return JSON.parse(localStorage.getItem('user') || '{}') as UserResponseDTO;
    }
    setToken(token: string) {
        localStorage.setItem('token', token);
    }
    getToken(): string {
        return localStorage.getItem('token') || '';
    }
    getRefreshToken(): string {
        return localStorage.getItem('refreshToken') || '';
    }
    setRefreshToken(token: string) {
        localStorage.setItem('refreshToken', token);
    }
    getLayoutConfig(): layoutConfig {
        return JSON.parse(localStorage.getItem('layoutConfig') || '{}');
    }
    setLayoutConfig(config: layoutConfig) {
        localStorage.setItem('layoutConfig', JSON.stringify(config));
    }
    reset() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    }
    constructor() {}
}
