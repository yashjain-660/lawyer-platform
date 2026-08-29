import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'lawyer-platform-secret-key-change-in-prod';
const TOKEN_EXPIRY = '7d';

// Mock user database (replace with real DB later)
const mockUsers: Record<string, { id: string; email: string; password: string; firstName: string; lastName: string; userType: string }> = {
  'user@example.com': {
    id: '1',
    email: 'user@example.com',
    password: '$2a$10$SlFQSZ6.M0l9H9SG.6i1VuZMvGJGLZ3Ld3Z1qZ1qZ1qZ1qZ1qZ1qZ', // hashed "password"
    firstName: 'John',
    lastName: 'Doe',
    userType: 'client',
  },
};

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Mock user lookup
    const user = mockUsers[email];
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    // For now, accept any password (mock login)
    // In production, use: const passwordValid = await bcrypt.compare(password, user.password);
    const passwordValid = password === 'password'; // Mock validation

    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, userType: user.userType },
      JWT_SECRET as string,
      { expiresIn: TOKEN_EXPIRY }
    );

    const response = NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
        },
      },
      { status: 200 }
    );

    // Set httpOnly cookie
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
