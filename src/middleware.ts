import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // Bu fonksiyon Next.js 16+ uyumluluğu için açıkça tanımlanmıştır
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
  ],
};
