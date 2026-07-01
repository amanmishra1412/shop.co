// Dummy users stored in memory (replace with real API later)
const USERS_KEY = "shopco_users";
const TOKEN_KEY = "shopco_token";

// Seed a default user if none exist
const seedUsers = () => {
  if (typeof window === "undefined") return;
  const existing = localStorage.getItem(USERS_KEY);
  if (!existing) {
    localStorage.setItem(
      USERS_KEY,
      JSON.stringify([
        {
          id: 1,
          name: "Demo User",
          email: "demo@shopco.com",
          password: "password123",
        },
      ])
    );
  }
};

// Create a dummy base64 JWT-style token
export const createToken = (user) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    })
  );
  const signature = btoa(`${header}.${payload}.secret`);
  return `${header}.${payload}.${signature}`;
};

// Decode our dummy token
export const decodeToken = (token) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp < Date.now()) return null; // expired
    return payload;
  } catch {
    return null;
  }
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getCurrentUser = () => {
  const token = getToken();
  if (!token) return null;
  return decodeToken(token);
};

// Auth operations
export const loginUser = (email, password) => {
  seedUsers();
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid email or password");
  const token = createToken(user);
  setToken(token);
  return { user, token };
};

export const registerUser = (name, email, password) => {
  seedUsers();
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  if (users.find((u) => u.email === email)) {
    throw new Error("Email already registered");
  }
  const newUser = { id: Date.now(), name, email, password };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  const token = createToken(newUser);
  setToken(token);
  return { user: newUser, token };
};

export const logoutUser = () => {
  removeToken();
};

export const resetPassword = (email, newPassword) => {
  seedUsers();
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  const idx = users.findIndex((u) => u.email === email);
  if (idx === -1) throw new Error("Email not found");
  users[idx].password = newPassword;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return true;
};
