import { UserService } from '../services/userService.js';
import { UserRepository } from '../repositories/userRepository.js';
import { describe, expect, test, jest, beforeEach, afterEach } from '@jest/globals';

describe('UserService Unit Tests', () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('Sikeres regisztráció (Register - Success)', async () => {
        const userData = {
            email: 'uj@teszt.hu',
            password: 'jelszo123',
            first_name: 'Teszt',
            last_name: 'Elek',
            role: 'RENTER',
            username: 'tesztelek',
            phone_number: '123456789'
        };

        const findSpy = jest.spyOn(UserRepository.prototype, 'findByEmail') as any;
        findSpy.mockResolvedValue(null);

        const createSpy = jest.spyOn(UserRepository.prototype, 'create') as any;
        createSpy.mockResolvedValue({
            user_id: 1,
            ...userData,
            password: 'hashed_password_titkos'
        });

        const result = await userService.register(userData);

        expect(result).toHaveProperty('user_id', 1);
        expect(result.email).toBe('uj@teszt.hu');
        expect(createSpy).toHaveBeenCalledTimes(1);
    });

    test('Regisztráció hiba: Foglalt email cím', async () => {
        const userData = {
            email: 'letezo@teszt.hu',
            password: 'jelszo123',
            first_name: 'Teszt',
            last_name: 'Elek',
            role: 'RENTER',
            username: 'teszt',
            phone_number: '123'
        };

        const findSpy = jest.spyOn(UserRepository.prototype, 'findByEmail') as any;
        findSpy.mockResolvedValue({
            user_id: 99,
            email: 'letezo@teszt.hu'
        });

        const createSpy = jest.spyOn(UserRepository.prototype, 'create') as any;

        await expect(userService.register(userData)).rejects.toThrow('Email already registered!');

        expect(createSpy).not.toHaveBeenCalled();
    });


    test('Sikeres belépés (Login - Success)', async () => {
        const findSpy = jest.spyOn(UserRepository.prototype, 'findByEmail') as any;
        findSpy.mockResolvedValue(null);

        await expect(userService.login('nincsilyen@teszt.hu', 'pass')).rejects.toThrow('Wrong email or password!');
    });
});