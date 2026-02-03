import { UserService } from '../services/userService.js';
import { UserRepository } from '../repositories/userRepository.js';
import { describe, expect, test, jest, beforeEach, afterEach } from '@jest/globals';

describe('UserService Unit Tests', () => {
    let userService: UserService;

    beforeEach(() => {
        // Inicializáljuk a service-t
        userService = new UserService();
    });

    afterEach(() => {
        // FONTOS: Visszaállítjuk az eredeti állapotot minden teszt után
        jest.restoreAllMocks();
    });

    // --- 1. TESZT: SIKERES REGISZTRÁCIÓ ---
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

        // --- A LÉNYEG ITT VAN (SPY) ---
        // Közvetlenül a függvényre "kémkedünk".
        // A mockImplementation(() => ...) miatt az EREDETI adatbázis kód LE SEM FUT.
        
        const findSpy = jest.spyOn(UserRepository.prototype, 'findByEmail') as any;
        findSpy.mockResolvedValue(null); // Azt hazudjuk: nincs ilyen user

        const createSpy = jest.spyOn(UserRepository.prototype, 'create') as any;
        createSpy.mockResolvedValue({
            user_id: 1,  // Itt fixen 1-et adunk vissza, így a teszt nem fog elszállni a 3-as, 4-es ID-kon
            ...userData,
            password: 'hashed_password_titkos'
        });

        const result = await userService.register(userData);

        expect(result).toHaveProperty('user_id', 1);
        expect(result.email).toBe('uj@teszt.hu');
        expect(createSpy).toHaveBeenCalledTimes(1);
    });

    // --- 2. TESZT: FOGLALT EMAIL ---
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

        // Itt azt hazudjuk, hogy találtunk usert
        const findSpy = jest.spyOn(UserRepository.prototype, 'findByEmail') as any;
        findSpy.mockResolvedValue({
            user_id: 99,
            email: 'letezo@teszt.hu'
        });

        // Figyeljük a create-et is, hogy biztosan NE hívódjon meg
        const createSpy = jest.spyOn(UserRepository.prototype, 'create') as any;

        await expect(userService.register(userData)).rejects.toThrow('Email already registered!');
        
        expect(createSpy).not.toHaveBeenCalled();
    });

    // --- 3. TESZT: LOGIN HIBA ---
    test('Sikeres belépés (Login - Success)', async () => {
        const findSpy = jest.spyOn(UserRepository.prototype, 'findByEmail') as any;
        findSpy.mockResolvedValue(null); // Nincs user -> Hiba

        await expect(userService.login('nincsilyen@teszt.hu', 'pass')).rejects.toThrow('Wrong email or password!');
    });
});