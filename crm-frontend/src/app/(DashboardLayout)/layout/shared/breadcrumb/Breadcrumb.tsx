'use client'
import React from "react";
import { Grid, Typography, Box, Breadcrumbs, Theme } from "@mui/material";
import Link from "next/link";
import { IconCircle } from "@tabler/icons-react";
import Image from "next/image";

interface BreadCrumbType {
  subtitle?: string;
  items?: { title: string; to?: string }[];
  title: string;
  children?: JSX.Element;
}

const Breadcrumb = ({ subtitle, items, title, children }: BreadCrumbType) => (
  <Grid
    container
    sx={{
      backgroundColor: "primary.light",
      borderRadius: (theme: Theme) => theme.shape.borderRadius / 4,
      p: "30px 25px 20px",
      mb: "30px",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Левая часть */}
    <Grid
      size={{ xs: 12, sm: 6, lg: 8 }}
      sx={{ mb: 1 }}
    >
      <Typography variant="h4">{title}</Typography>
      <Typography
        color="textSecondary"
        variant="h6"
        fontWeight={400}
        mt={0.8}
        mb={0}
      >
        {subtitle}
      </Typography>

      <Breadcrumbs
        separator={
          <IconCircle
            size={5}
            fill="textSecondary"
            fillOpacity={0.6}
            style={{ margin: "0 5px" }}
          />
        }
        sx={{ alignItems: "center", mt: items ? 1 : undefined }}
        aria-label="breadcrumb"
      >
        {items?.map((item) => (
          <div key={item.title}>
            {item.to ? (
              <Link href={item.to} passHref>
                <Typography color="textSecondary">{item.title}</Typography>
              </Link>
            ) : (
              <Typography color="textPrimary">{item.title}</Typography>
            )}
          </div>
        ))}
      </Breadcrumbs>
    </Grid>

    {/* Правая часть */}
    <Grid
      size={{ xs: 12, sm: 6, lg: 4 }}
      display="flex"
      alignItems="flex-end"
    >
      <Box
        sx={{
          display: { xs: "none", md: "block", lg: "flex" },
          alignItems: "center",
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
        <Box sx={{ position: "absolute", top: 0 }}>
          {children ?? (
            <Image
              src="/images/breadcrumb/ChatBc.png"
              alt="breadcrumbImg"
              width={165}
              height={165}
              priority
              style={{ width: 165, height: 165 }}
            />
          )}
        </Box>
      </Box>
    </Grid>
  </Grid>
);

export default Breadcrumb;
