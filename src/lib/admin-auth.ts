import { getAuthUser } from './clerk-auth';

export async function getAdminUser() {
  const user = await getAuthUser();

  if (!user) return null;
  if (!user.isAdmin) return null;

  return user;
}

export async function requireAdminUser() {
  const user = await getAdminUser();
  if (!user) {
    throw new Error('Unauthorized - Admin access required');
  }
  return user;
}
