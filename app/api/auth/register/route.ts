import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'lawyer-platform-secret-key-change-in-prod';
const TOKEN_EXPIRY = '7d';

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName, userType } = await req.json();

    if (!email || !password || !firstName || !lastName || !userType) {
      return NextResponse.json(
        { error: 'All fields required' },
        { status: 400 }
      );
    }

    // Mock: check if user exists (in production, check real database)
    // For now, always allow registration
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      userType,
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, userType: newUser.userType },
      JWT_SECRET as string,
      { expiresIn: TOKEN_EXPIRY }
    );

    const response = NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          userType: newUser.userType,
        },
      },
      { status: 201 }
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
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
