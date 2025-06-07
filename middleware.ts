import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(req) {
        console.log("User accessing : " , req.nextUrl.pathname);
    },
    {
        callbacks: {
            authorized: ( {token}) => !!token
        },
    }
);

export const config = {
    matcher : [
        "/api/tickets/:path*",
        "/api/users/:path*",
        "dashboard/:path*",
    ]
}