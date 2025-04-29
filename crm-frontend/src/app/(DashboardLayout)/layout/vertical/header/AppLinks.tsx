import React from 'react';
import { Avatar, Box, Typography, Grid, Stack } from '@mui/material';
import Link from 'next/link';
import * as dropdownData from './data';

const AppLinks = () => {
  return (
    <Grid 
      container 
      spacing={3} 
      sx={{ mb: 4 /* перенесли mb в sx */ }}
    >
      {dropdownData.appsLink.map((links, index) => (
        <Grid 
          key={index} 
          /* Убрали item, заменили lg={6} на size */
          size={{ xs: 12, lg: 6 }}
        >
          <Link href={links.href} className="hover-text-primary">
            <Stack direction="row" spacing={2}>
              <Box
                minWidth={45}
                height={45}
                bgcolor="grey.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Avatar
                  src={links.avatar}
                  alt={links.title}
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
                  noWrap
                  className="text-hover"
                  sx={{ width: 240 }}
                >
                  {links.title}
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                  fontSize={12}
                  sx={{ width: 240 }}
                  noWrap
                >
                  {links.subtext}
                </Typography>
              </Box>
            </Stack>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default AppLinks;
