'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  isClerkUser: boolean;
}

export function useAuthUser() {
  const router = useRouter();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();
  const [customUser, setCustomUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch custom auth user from API
  useEffect(() => {
    // Wait for Clerk to load
    if (!clerkLoaded) return;

    // If Clerk user exists, use that
    if (clerkUser) {
      setIsLoading(false);
      return;
    }

    // Try to fetch custom session user
    const fetchCustomUser = async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          setCustomUser({
            id: data.id,
            name: data.name,
            email: data.email,
            image: data.image,
            isClerkUser: false,
          });
        }
      } catch {
        // No custom session
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomUser();
  }, [clerkLoaded, clerkUser]);

  // Combined sign out function
  const signOut = useCallback(async () => {
    if (clerkUser) {
      // Sign out from Clerk
      await clerkSignOut({ redirectUrl: '/' });
    } else {
      // Sign out from custom auth
      await fetch('/api/auth/logout', { method: 'POST' });
      setCustomUser(null);
      router.push('/');
    }
  }, [clerkUser, clerkSignOut, router]);

  // Normalize user data
  const user: AuthUser | null = clerkUser
    ? {
        id: clerkUser.id,
        name: clerkUser.firstName
          ? `${clerkUser.firstName}${clerkUser.lastName ? ' ' + clerkUser.lastName : ''}`
          : null,
        email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
        image: clerkUser.imageUrl || null,
        isClerkUser: true,
      }
    : customUser;

  return {
    user,
    isLoading: isLoading || !clerkLoaded,
    isAuthenticated: !!user,
    signOut,
  };
}
