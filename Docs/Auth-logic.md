# Authentication Module (localStorage-based)

This module implements a simple client-side authentication system using `localStorage`. It supports user registration, login, logout, session persistence, and UI updates based on authentication state. It is intended for demo or learning purposes only.

## Storage Keys

Two keys are used in `localStorage`:

* `amazon-auth`: Stores the currently logged-in user (session data).
* `amazon-users`: Stores the list of all registered users.

## Core Concepts

* Users are stored permanently in `localStorage`.
* Authentication state is maintained by saving the logged-in user separately.
* Passwords are stored in plain text (not secure, demo only).
* Sessions persist across page reloads.

## API Reference

### getCurrentUser()

Returns the currently logged-in user from `localStorage`.

* Returns: `user object | null`
* Safely handles corrupted JSON.

### isLoggedIn()

Checks whether a user is currently authenticated.

* Returns: `true` if logged in, otherwise `false`

### signup(name, email, password)

Registers a new user and automatically logs them in.

Validation rules:

* Name must be at least 2 characters.
* Email must contain `@`.
* Password must be at least 6 characters.
* Email must be unique (case-insensitive).

On success:

* Stores the new user in `amazon-users`
* Creates a session in `amazon-auth`

Returns:

```js
{
  success: boolean,
  message: string,
  user?: { id, name, email }
}
```

### login(email, password)

Authenticates an existing user.

* Matches email (case-insensitive) and password
* Creates a session without storing the password

Returns:

```js
{
  success: boolean,
  message: string,
  user?: { id, name, email }
}
```

### logout()

Logs out the current user by clearing session data.

* Removes `amazon-auth` from `localStorage`

### updateAuthHeader()

Updates the header UI based on authentication status.

If user is logged in:

* Displays greeting with user’s name
* Shows “Sign Out” button
* Attaches logout handler

If user is logged out:

* Displays “Hello, Sign in”
* Shows link to login page

Requires the following DOM element:

```html
<div class="js-auth-link"></div>
```

## Security Notes

* Passwords are stored in plain text.
* Authentication is fully client-side.
* No encryption, hashing, or server validation.

This approach is **not suitable for production** and should only be used for demos, prototypes, or learning projects.


