import { NextResponse, type NextRequest } from 'next/server';

interface ConsultationRequest {
  lawyerId: string;
  title: string;
  description: string;
  scheduledDate: string;
  duration: number;
  mode: string;
  services?: string[];
}

interface Consultation {
  id: string;
  clientId: string;
  lawyerId: string;
  title: string;
  description: string;
  scheduledDate: string;
  duration: number;
  mode: string;
  amount: number;
  services: Array<{ id: string; serviceId: string }>;
}

// Stub data storage (in-memory for now, replace with DB later)
const consultations: Consultation[] = [
  {
    id: 'cons-1',
    clientId: 'user-client-1',
    lawyerId: '1',
    title: 'Contract Review',
    description: 'Review of employment contract',
    scheduledDate: '2024-09-15T10:00:00Z',
    duration: 60,
    mode: 'ONLINE',
    amount: 0,
    services: [],
  },
];

export async function POST(request: NextRequest) {
  try {
    const body: ConsultationRequest = await request.json();
    const { lawyerId, title, description, scheduledDate, duration, mode, services } = body;

    // Validation
    if (!lawyerId || !title || !description || !scheduledDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Stub consultation creation - replace with actual DB insert later
    const newConsultation: Consultation = {
      id: `cons-${Date.now()}`,
      clientId: 'user-client-1', // TODO: Get from auth context
      lawyerId,
      title,
      description,
      scheduledDate,
      duration,
      mode,
      amount: 0,
      services: services?.map((serviceId) => ({ id: `svc-${Date.now()}`, serviceId })) || [],
    };

    consultations.push(newConsultation);

    return NextResponse.json(newConsultation, { status: 201 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // TODO: Get clientId from auth context
    const clientId = 'user-client-1';

    // Filter consultations for the current user
    const userConsultations = consultations.filter(
      (consultation) => consultation.clientId === clientId
    );

    return NextResponse.json(userConsultations);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
