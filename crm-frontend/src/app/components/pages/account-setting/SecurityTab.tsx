'use client'

import axiosWithAuth from '@/lib/axiosWithAuth';
import {
  Avatar,
  Box,
  Button,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { IconDeviceLaptop, IconDeviceMobile, IconDotsVertical } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import BlankCard from '../../shared/BlankCard';

interface Device {
  id: string;
  deviceName?: string; // Используем deviceName вместо name
  lastSeen: string;
  location: string;
}

const fetchDevices = async () => {
  console.log('Fetching devices...');
  const response = await axiosWithAuth.get('/users/me/devices');
  console.log('Devices response:', response.data);
  return response.data;
};

const logoutDevice = async (sessionId: string) => {
  console.log('Logging out device with sessionId:', sessionId);
  try {
    const response = await axiosWithAuth.post(`/users/me/devices/${sessionId}/logout`);
    console.log('Logout response:', response.data);
    return response.data;
  } catch (err) {
    console.error('Logout error:', err.response?.data || err);
    throw err;
  }
};

const logoutAllDevices = async () => {
  console.log('Logging out all devices...');
  try {
    const response = await axiosWithAuth.post('/users/me/logout-all');
    console.log('Logout all response:', response.data);
    return response.data;
  } catch (err) {
    console.error('Logout all error:', err.response?.data || err);
    throw err;
  }
};

const SecurityTab = () => {
  const queryClient = useQueryClient();
  const { data: devices, isLoading, error } = useQuery({
    queryKey: ['devices'],
    queryFn: fetchDevices,
  });
  const [formError, setFormError] = useState<string | null>(null);

  const logoutMutation = useMutation({
    mutationFn: logoutDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      setFormError(null);
      console.log('Device logged out successfully');
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.message || 'Неизвестная ошибка';
      setFormError('Не удалось завершить сессию: ' + errorMessage);
      console.error('Error logging out device:', err.response?.data || err);
    },
  });

  const logoutAllMutation = useMutation({
    mutationFn: logoutAllDevices,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      setFormError(null);
      console.log('All devices logged out successfully');
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.message || 'Неизвестная ошибка';
      setFormError('Не удалось выйти со всех устройств: ' + errorMessage);
      console.error('Error logging out all devices:', err.response?.data || err);
    },
  });

  if (isLoading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography>Ошибка загрузки устройств: {error.message}</Typography>;

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid size={{ xs: 12, lg: 8 }}>
        <BlankCard>
          <CardContent>
            <Typography variant="h4" mb={2}>
              Two-factor Authentication
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="subtitle1" color="textSecondary">
                Two-factor authentication is not enabled yet.
              </Typography>
              <Button variant="contained" color="primary" disabled>
                Enable (Coming Soon)
              </Button>
            </Stack>
          </CardContent>
        </BlankCard>
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <BlankCard>
          <CardContent>
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: 'primary.light',
                color: 'primary.main',
                width: 48,
                height: 48,
              }}
            >
              <IconDeviceLaptop size="26" />
            </Avatar>
            <Typography variant="h5" mt={2}>
              Devices
            </Typography>
            <Typography color="textSecondary" mt={1} mb={2}>
              Manage your active devices.
            </Typography>
            {formError && (
              <Typography color="error" mb={2}>
                {formError}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={() => logoutAllMutation.mutate()}
              disabled={logoutAllMutation.isPending}
            >
              Sign out from all other devices
            </Button>
            {devices?.length ? (
              devices.map((device: Device) => (
                <React.Fragment key={device.id}>
                  <Stack direction="row" spacing={2} py={2} mt={3} alignItems="center">
                    {device.deviceName && device.deviceName.includes('Mobile') ? (
                      <IconDeviceMobile size="26" />
                    ) : (
                      <IconDeviceLaptop size="26" />
                    )}
                    <Box>
                      <Typography variant="h6">{device.deviceName || 'Unknown Device'}</Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        {device.location}, {new Date(device.lastSeen).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 'auto !important' }}>
                      <IconButton
                        onClick={() => logoutMutation.mutate(device.id)}
                        disabled={logoutMutation.isPending}
                      >
                        <IconDotsVertical size="22" />
                      </IconButton>
                    </Box>
                  </Stack>
                  <Divider />
                </React.Fragment>
              ))
            ) : (
              <Typography mt={2}>No active devices found.</Typography>
            )}
            <Stack>
              <Button variant="text" color="primary">
                Need Help?
              </Button>
            </Stack>
          </CardContent>
        </BlankCard>
      </Grid>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'end' }} mt={3}>
        <Button size="large" variant="contained" color="primary" disabled>
          Save
        </Button>
        <Button size="large" variant="text" color="error" disabled>
          Cancel
        </Button>
      </Stack>
    </Grid>
  );
};

export default SecurityTab;