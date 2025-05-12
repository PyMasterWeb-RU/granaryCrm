'use client'

import { fetchCurrentUser } from '@/store/apps/auth/AuthSlice'
import { useDispatch } from '@/store/hooks'
import { ReactNode, useEffect } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { styled, useTheme } from '@mui/material/styles'

import Customizer from './layout/shared/customizer/Customizer'
import Header from './layout/vertical/header/Header'
import Sidebar from './layout/vertical/sidebar/Sidebar'

// Создаём стили
const MainWrapper = styled('div')(() => ({
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
}))

const PageWrapper = styled('div')(() => ({
  display: 'flex',
  flexGrow: 1,
  paddingBottom: '60px',
  flexDirection: 'column',
  zIndex: 1,
  width: '100%',
  backgroundColor: 'transparent',
}))

export default function RootLayout({ children }: { children: ReactNode }) {
  const dispatch = useDispatch()
  const theme = useTheme()

  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [dispatch])

  return (
    <MainWrapper>
      <Sidebar />
      <PageWrapper
        className="page-wrapper"
        sx={{
          [theme.breakpoints.up('lg')]: {
            ml: '80px',
          },
        }}
      >
        <Header />
        <Container
          sx={{
            pt: '30px',
            maxWidth: '100%!important',
          }}
        >
          <Box sx={{ minHeight: 'calc(100vh - 170px)' }}>{children}</Box>
        </Container>
        <Customizer />
      </PageWrapper>
    </MainWrapper>
  )
}