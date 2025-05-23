"use client";
import React from "react";
import {
  Box,
  Avatar,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Stack,
} from "@mui/material";
import { IconArrowUpRight } from "@tabler/icons-react";
import Image from "next/image";

const WelcomeCard = () => {
  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: (theme) => theme.palette.primary.light,
        py: 0,
        position: "relative",
      }}
    >
      <CardContent sx={{ py: 4, px: 2 }}>
        <Grid container justifyContent="space-between">
          <Grid item sm={6} display="flex" alignItems="center">
            <Box>
              <Box
                gap="16px"
                mb={5}
                sx={{
                  display: {
                    xs: "block",
                    sm: "flex",
                  },
                  alignItems: "center",
                }}
              >
                <Avatar
                  src="/images/profile/user-1.jpg"
                  alt="img"
                  sx={{ width: 40, height: 40 }}
                />
                <Typography variant="h5" whiteSpace="nowrap">
                  Welcome back Mathew Anderson!
                </Typography>
              </Box>

              <Stack mt={8}
                spacing={2}
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
              >
                <Box>
                  <Typography variant="h2" whiteSpace="nowrap">
                    $2,340{" "}
                    <span>
                      <IconArrowUpRight width={18} color="#39B69A" />
                    </span>
                  </Typography>
                  <Typography variant="subtitle1" whiteSpace="nowrap">
                    Today’s Sales
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h2" whiteSpace="nowrap">
                    35%
                    <span>
                      <IconArrowUpRight width={18} color="#39B69A" />
                    </span>
                  </Typography>
                  <Typography variant="subtitle1" whiteSpace="nowrap">
                    Performance
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
          <Grid item sm={6}>
            <Box
              sx={{
                width: "340px",
                height: "246px",
                position: "absolute",
                right: "-26px",
                bottom: "-70px",
                marginTop: "20px",
              }}
            >
              <Image
                src="/images/backgrounds/welcome-bg2.png"
                alt="img"
                width={340}
                height={250}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
