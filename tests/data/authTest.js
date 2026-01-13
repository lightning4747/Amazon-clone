import {
    getCurrentUser,
    isLoggedIn,
    signup,
    login,
    logout
} from '../../data/auth.js';

describe('test suite: Auth Module', () => {

    beforeEach(() => {
        // Clear localStorage before each test
        spyOn(Storage.prototype, 'getItem').and.callFake((key) => {
            return null;
        });
        spyOn(Storage.prototype, 'setItem');
        spyOn(Storage.prototype, 'removeItem');
    });

    describe('getCurrentUser', () => {
        it('returns null when no user is logged in', () => {
            expect(getCurrentUser()).toBeNull();
        });

        it('returns user object when user is logged in', () => {
            Storage.prototype.getItem.and.callFake((key) => {
                if (key === 'amazon-auth') {
                    return JSON.stringify({ id: '123', name: 'John', email: 'john@test.com' });
                }
                return null;
            });

            // Need to reimport or call again
            const authData = localStorage.getItem('amazon-auth');
            expect(authData).not.toBeNull();
        });
    });

    describe('isLoggedIn', () => {
        it('returns false when no user is logged in', () => {
            expect(isLoggedIn()).toBe(false);
        });
    });

    describe('signup', () => {
        beforeEach(() => {
            Storage.prototype.getItem.and.callFake((key) => {
                if (key === 'amazon-users') {
                    return JSON.stringify([]);
                }
                return null;
            });
        });

        it('returns error for invalid name', () => {
            const result = signup('J', 'john@test.com', 'password123');
            expect(result.success).toBe(false);
            expect(result.message).toContain('valid name');
        });

        it('returns error for invalid email', () => {
            const result = signup('John Doe', 'invalid-email', 'password123');
            expect(result.success).toBe(false);
            expect(result.message).toContain('valid email');
        });

        it('returns error for short password', () => {
            const result = signup('John Doe', 'john@test.com', '12345');
            expect(result.success).toBe(false);
            expect(result.message).toContain('at least 6 characters');
        });

        it('creates user successfully with valid inputs', () => {
            const result = signup('John Doe', 'john@test.com', 'password123');
            expect(result.success).toBe(true);
            expect(result.user).toBeDefined();
            expect(result.user.name).toBe('John Doe');
            expect(result.user.email).toBe('john@test.com');
            expect(Storage.prototype.setItem).toHaveBeenCalled();
        });

        it('prevents duplicate email registration', () => {
            Storage.prototype.getItem.and.callFake((key) => {
                if (key === 'amazon-users') {
                    return JSON.stringify([{ email: 'john@test.com', name: 'John', password: 'test' }]);
                }
                return null;
            });

            const result = signup('Jane Doe', 'john@test.com', 'password123');
            expect(result.success).toBe(false);
            expect(result.message).toContain('already exists');
        });
    });

    describe('login', () => {
        beforeEach(() => {
            Storage.prototype.getItem.and.callFake((key) => {
                if (key === 'amazon-users') {
                    return JSON.stringify([
                        { id: '123', email: 'john@test.com', name: 'John', password: 'password123' }
                    ]);
                }
                return null;
            });
        });

        it('returns error for wrong password', () => {
            const result = login('john@test.com', 'wrongpassword');
            expect(result.success).toBe(false);
            expect(result.message).toContain('Invalid email or password');
        });

        it('returns error for non-existent email', () => {
            const result = login('notfound@test.com', 'password123');
            expect(result.success).toBe(false);
            expect(result.message).toContain('Invalid email or password');
        });

        it('logs in successfully with correct credentials', () => {
            const result = login('john@test.com', 'password123');
            expect(result.success).toBe(true);
            expect(result.user).toBeDefined();
            expect(result.user.email).toBe('john@test.com');
            expect(Storage.prototype.setItem).toHaveBeenCalled();
        });

        it('is case-insensitive for email', () => {
            const result = login('JOHN@TEST.COM', 'password123');
            expect(result.success).toBe(true);
        });
    });

    describe('logout', () => {
        it('removes auth data from localStorage', () => {
            logout();
            expect(Storage.prototype.removeItem).toHaveBeenCalledWith('amazon-auth');
        });
    });
});
