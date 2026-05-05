import { defineMiddleware } from "astro:middleware";

// Routes that require authentication
const protectedRoutes = ["/chat", "/documents", "/profile"];

// Routes that should NOT be accessible if already logged in
const authRoutes = ["/login", "/register"];

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;
  const path = url.pathname;
  const token = cookies.get("auth_token")?.value;

//   console.log(`[Middleware] Path: ${path}, Token: ${token ? 'Present' : 'Missing'}`);

  // 1. If user is NOT logged in and tries to access a protected route
  if (!token && protectedRoutes.some((route) => path.startsWith(route))) {
    return redirect("/login");
  }

  // 2. If user IS logged in and tries to access login/register
  if (token && authRoutes.some((route) => path.startsWith(route))) {
    return redirect("/chat");
  }

  // 3. Special case for home page (optional: redirect to chat if logged in)
  if (path === "/" && token) {
    return redirect("/chat");
  }

  return next();
});
