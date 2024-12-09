import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "../../../../../lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        const connection = await dbConnect();
        console.log("connection: ", connection);
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          console.log("user: ", user);

          if (!user) {
            throw new Error("User not found with this email");
          }

          if (!user.isVerified) {
            throw new Error("Please verify user account first");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          // console.log("isPasswordCorrect: ", isPasswordCorrect);
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    // inserting all information in all like token or session when ever we need data we can fetch the data through the token and session not implementing database query multiple times becouse we dont want to choke the database
    async jwt({ token, user }) {
      // console.log("JWT Callback - Token:", token, "User:", user);
      if (user) {
        token._id = user._id?.toString(); // all this user types defined in the next-auth.d.ts
        token.isVerified = user.isVerified;
        token.isAcceptingMesseges = user.isAcceptingMesseges;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMesseges = token.isAcceptingMesseges;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// jump on nextjs auth docs

// https://next-auth.js.org/providers/credentials
// setup the code according to the docs

//
