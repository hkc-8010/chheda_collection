import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export async function requireAuth() {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }
  
  return session;
}

export async function requireAdmin() {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }
  
  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }
  
  return session;
}

export async function getOptionalAuth() {
  const session = await auth();
  return session;
}
