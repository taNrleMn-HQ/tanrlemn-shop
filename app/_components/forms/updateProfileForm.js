'use client';

// supabase
import { createBrowserClient } from '@supabase/ssr';

// recoil
import { useRecoilState } from 'recoil';
import { loadingState } from '@/app/loading';

// hooks
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, useProfile } from '@/app/_lib/hooks/useUser';

// chakra-ui
import {
  Button,
  FormControl,
  Input,
  FormLabel,
  Drawer,
  DrawerFooter,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  DrawerHeader,
  useToast,
} from '@chakra-ui/react';

// local components
import { AccountAvatar } from '@/app/(user)/_components/accountButton';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function UpdateProfileForm({ isOpen, onClose }) {
  const router = useRouter();

  const { session } = useSession();
  const { profile, setProfile } = useProfile();
  const toast = useToast();

  const [loading, setLoading] = useRecoilState(loadingState);

  const [fullname, setFullname] = useState(profile.full_name);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      const res = await fetch('/api/supabase/getProfile');

      const { data, error } = await res.json();

      if (error) {
        console.error(error);
      }

      setProfile(data[0]);
      setUpdated(false);
    };

    updated && getProfile();
  }, [profile, setProfile, updated]);

  async function updateProfile({ fullname, avatarUrl }) {
    try {
      setLoading(true);

      const { error } = await supabase.from('profiles').upsert({
        id: session.user.id,
        full_name: fullname,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;

      toast({
        title: 'Profile updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });

      onClose();

      setUpdated(true);
    } catch (error) {
      toast({
        title: 'An error occurred while updating your profile',
        status: 'error',
        isClosable: true,
        duration: 9000,
        description: error.message,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Drawer
      size={'sm'}
      isOpen={isOpen}
      placement='right'
      onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Update your profile</DrawerHeader>
        <DrawerBody
          w={'100%'}
          mt={'2rem'}>
          <FormControl>
            <FormLabel htmlFor='avatar'>Avatar</FormLabel>
            <AccountAvatar
              uid={session?.user.id}
              url={profile?.avatar_url}
              size={'xl'}
              onUpload={(url) => {
                setAvatarUrl(url);
                updateProfile({ fullname, avatarUrl: url });
              }}
              isUploadWidget
            />
            <FormLabel htmlFor='email'>Email</FormLabel>
            <Input
              mb={'1rem'}
              id='email'
              type='text'
              value={session?.user.email}
              disabled
            />
            <FormLabel htmlFor='fullName'>Full Name</FormLabel>
            <Input
              id='full_name'
              type='text'
              value={fullname || ''}
              onChange={(e) => setFullname(e.target.value)}
            />
          </FormControl>
        </DrawerBody>
        <DrawerFooter>
          <Button
            size={'sm'}
            onClick={() => updateProfile({ fullname, avatarUrl })}
            isLoading={loading}>
            Save Changes
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}