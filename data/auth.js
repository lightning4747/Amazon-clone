// Authentication module using localStorage
const AUTH_KEY = 'amazon-auth';
const USERS_KEY = 'amazon-users';

// Get current user
export function getCurrentUser() {
    const authData = localStorage.getItem(AUTH_KEY);
    if (authData) {
        try {
            return JSON.parse(authData);
        } catch (e) {
            return null;
        }
    }
    return null;
}

// Check if user is logged in
export function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Get all registered users
function getUsers() {
    const usersData = localStorage.getItem(USERS_KEY);
    if (usersData) {
        try {
            return JSON.parse(usersData);
        } catch (e) {
            return [];
        }
    }
    return [];
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Register a new user
export function signup(name, email, password) {
    const users = getUsers();

    // Check if email already exists
    const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        return { success: false, message: 'An account with this email already exists.' };
    }

    // Validate inputs
    if (!name || name.trim().length < 2) {
        return { success: false, message: 'Please enter a valid name (at least 2 characters).' };
    }

    if (!email || !email.includes('@')) {
        return { success: false, message: 'Please enter a valid email address.' };
    }

    if (!password || password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters.' };
    }

    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password, // In real app, this should be hashed!
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    // Auto login after signup
    const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem(AUTH_KEY, JSON.stringify(sessionUser));

    return { success: true, message: 'Account created successfully!', user: sessionUser };
}

// Login user
export function login(email, password) {
    const users = getUsers();

    const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );

    if (!user) {
        return { success: false, message: 'Invalid email or password.' };
    }

    // Create session (don't include password)
    const sessionUser = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem(AUTH_KEY, JSON.stringify(sessionUser));

    return { success: true, message: 'Login successful!', user: sessionUser };
}

// Logout user
export function logout() {
    localStorage.removeItem(AUTH_KEY);
}

// Update header based on auth status
export function updateAuthHeader() {
    const authLinkContainer = document.querySelector('.js-auth-link');
    if (!authLinkContainer) return;

    const user = getCurrentUser();

    if (user) {
        authLinkContainer.innerHTML = `
      <span class="greeting-text">Hello, ${user.name}</span>
      <span class="account-text js-logout-btn" style="cursor: pointer;">Sign Out</span>
    `;

        // Add logout event listener
        const logoutBtn = document.querySelector('.js-logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                logout();
                window.location.reload();
            });
        }
    } else {
        authLinkContainer.innerHTML = `
      <span class="greeting-text">Hello, Sign in</span>
      <a href="login.html" class="account-text" style="text-decoration: none; color: inherit;">Account</a>
    `;
    }
}
