'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Menu,
  Avatar,
  Typography,
  Divider,
  Button,
  IconButton,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axiosWithAuth from '@/lib/axiosWithAuth';
import * as dropdownData from './data';
import { IconMail } from '@tabler/icons-react';
import { Stack } from '@mui/system';
import Image from 'next/image';

// Тип для данных профиля
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: {
    id: string;
    name: string;
  };
}

// Запрос профиля
const fetchProfile = async (): Promise<UserProfile> => {
  const response = await axiosWithAuth.get('/users/me');
  console.log('Fetched profile for Profile.tsx:', response.data);
  return response.data;
};

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);

  // Запрос данных профиля
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  const handleClick2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  // Если данные загружаются, показываем заглушку
  if (isLoading) {
    return (
      <Box>
        <IconButton>
          <Avatar
            src="/images/profile/user-1.jpg"
            alt="ProfileImg"
            sx={{ width: 35, height: 35 }}
          />
        </IconButton>
      </Box>
    );
  }

  // Если ошибка, показываем заглушку и логируем
  if (error) {
    console.error('Error fetching profile:', error);
    return (
      <Box>
        <IconButton>
          <Avatar
            src="/images/profile/user-1.jpg"
            alt="ProfileImg"
            sx={{ width: 35, height: 35 }}
          />
        </IconButton>
      </Box>
    );
  }

  // Если profile не определён, показываем заглушку
  if (!profile) {
    console.error('Profile is undefined');
    return (
      <Box>
        <IconButton>
          <Avatar
            src="/images/profile/user-1.jpg"
            alt="ProfileImg"
            sx={{ width: 35, height: 35 }}
          />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box>
      <IconButton
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={
            profile.avatar
              ? `http://localhost:4200${profile.avatar}?v=${Date.now()}`
              : '/images/profile/user-1.jpg'
          }
          alt={profile.name}
          sx={{
            width: 35,
            height: 35,
          }}
          onError={() => console.error('Failed to load avatar:', profile.avatar)}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '360px',
            p: 4,
          },
        }}
      >
        <Typography variant="h5">User Profile</Typography>
        <Stack direction="row" py={3} spacing={2} alignItems="center">
          <Avatar
            src={
              profile.avatar
                ? `http://localhost:4200${profile.avatar}?v=${Date.now()}`
                : '/images/profile/user-1.jpg'
            }
            alt={profile.name}
            sx={{ width: 95, height: 95 }}
            onError={() => console.error('Failed to load avatar:', profile.avatar)}
          />
          <Box>
            <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
              {profile.name}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {profile.role.name}
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <IconMail width={15} height={15} />
              {profile.email}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        {dropdownData.profile.map((profileItem) => (
          <Box key={profileItem.title}>
            <Box sx={{ py: 2, px: 0 }} className="hover-text-primary">
              <Link href={profileItem.href}>
                <Stack direction="row" spacing={2}>
                  <Box
                    width="45px"
                    height="45px"
                    bgcolor="primary.light"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink="0"
                  >
                    <Avatar
                      src={profileItem.icon}
                      alt={profileItem.icon}
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 0,
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="textPrimary"
                      className="text-hover"
                      noWrap
                      sx={{
                        width: '240px',
                      }}
                    >
                      {profileItem.title}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="subtitle2"
                      sx={{
                        width: '240px',
                      }}
                      noWrap
                    >
                      {profileItem.subtitle}
                    </Typography>
                  </Box>
                </Stack>
              </Link>
            </Box>
          </Box>
        ))}
        <Box mt={2}>
          <Box bgcolor="primary.light" p={3} mb={3} overflow="hidden" position="relative">
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="h5" mb={2}>
                  Unlimited <br />
                  Access
                </Typography>
                <Button variant="contained" color="primary">
                  Upgrade
                </Button>
              </Box>
              <Image
                src="/images/backgrounds/unlimited-bg.png"
                width={150}
                height={183}
                style={{ height: 'auto', width: 'auto' }}
                alt="unlimited"
                className="signup-bg"
              />
            </Box>
          </Box>
          <Button href="/auth/auth1/login" variant="outlined" color="primary" component={Link} fullWidth>
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;