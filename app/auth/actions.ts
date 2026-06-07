"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "warkop-pos-super-secret-key"
);

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username dan password wajib diisi" };
  }

  try {
    // 1. Logika Pembuatan User Default (Jika Belum Ada)
    if (username === "admin") {
      const existingAdmins: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM User WHERE username = 'admin' LIMIT 1`);
      if (existingAdmins.length === 0) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        await prisma.$executeRawUnsafe(`INSERT INTO User (username, password, role) VALUES ('admin', '${hashedPassword}', 'ADMIN')`);
      }
    } else if (username === "kasir") {
      const existingKasirs: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM User WHERE username = 'kasir' LIMIT 1`);
      if (existingKasirs.length === 0) {
        const hashedPassword = await bcrypt.hash("kasir123", 10);
        await prisma.$executeRawUnsafe(`INSERT INTO User (username, password, role) VALUES ('kasir', '${hashedPassword}', 'CASHIER')`);
      }
    }

    // 2. Proses Login Normal menggunakan Raw Query untuk menghindari masalah Stale Prisma Client
    const users: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM User WHERE username = ? LIMIT 1`, username);
    const user = users[0];

    if (!user) {
      return { error: `User '${username}' tidak ditemukan.` };
    }

    // 3. Cek password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { error: "Password yang Anda masukkan salah." };
    }

    // 3. Buat JWT Token
    const token = await new SignJWT({ 
      id: user.id, 
      username: user.username, 
      role: user.role 
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    // 4. Simpan ke Cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
    });

    // 5. Redirect berdasarkan role
    if (user.role === "ADMIN") {
      redirect("/admin");
    } else {
      redirect("/dashboard/kasir");
    }
  } catch (error: any) {
    if (error.digest?.includes("NEXT_REDIRECT")) throw error;
    console.error("Login Error Details:", error);
    
    // Fallback if table name is lowercase
    if (error.message?.includes("User' doesn't exist")) {
      try {
        const users: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM user WHERE username = ? LIMIT 1`, username);
        const user = users[0];
        if (user) {
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (isPasswordValid) {
            // ... copy logic from above or just return error to retry
            return { error: "Silakan coba login sekali lagi (sinkronisasi tabel)." };
          }
        }
      } catch (e2) {}
    }

    return { error: `Kesalahan: ${error.message || "Unknown error"}` };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  redirect("/login");
}
