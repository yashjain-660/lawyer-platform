import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const specialization = searchParams.get('specialization') || undefined;
    const page = Number(searchParams.get('page') || '1');
    const limit = Number(searchParams.get('limit') || '10');

    // Stub data - replace with actual DB query later
    const stubLawyers = [
      {
        id: '1',
        userId: 'user-1',
        specializations: ['Corporate Law', 'Contract Law'],
        experience: 10,
        bio: 'Experienced corporate lawyer',
        hourlyRate: 250,
        isVerified: true,
        user: {
          id: 'user-1',
          email: 'lawyer1@example.com',
          name: 'John Doe',
        },
      },
      {
        id: '2',
        userId: 'user-2',
        specializations: ['Family Law', 'Divorce'],
        experience: 8,
        bio: 'Family law specialist',
        hourlyRate: 200,
        isVerified: true,
        user: {
          id: 'user-2',
          email: 'lawyer2@example.com',
          name: 'Jane Smith',
        },
      },
    ];

    // Filter by specialization if provided
    const filtered = specialization
      ? stubLawyers.filter((lawyer) =>
          lawyer.specializations.some(
            (spec) =>
              spec.toLowerCase().includes(specialization.toLowerCase())
          )
        )
      : stubLawyers;

    // Apply pagination
    const start = (page - 1) * limit;
    const paginatedLawyers = filtered.slice(start, start + limit);

    return NextResponse.json({
      data: paginatedLawyers,
      total: filtered.length,
      page,
      limit,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
