import Head from 'next/head';

import SidebarLayout from '../src/layouts/SidebarLayout';

import { Container, Grid } from '@mui/material';
import Footer from '../src/components/Footer';
import { SITETITLE } from '../utils/constant';

import { useEffect } from 'react';
import { verifyExpiredToken } from '../utils/utils';
import { useRouter } from 'next/router';

function Dashboard() {
  const router = useRouter();

  /* This code block is using the `useEffect` hook to check if the user is logged in by retrieving the
  access token from the local storage. If the access token exists, it decodes the token using
  `jwt-decode` library and checks if the token has expired. If the token has expired, it sets the
  `isLoggedIn` state to `false` and removes the access token from the local storage. Otherwise, it
  sets the `isLoggedIn` state to `true`. If the access token does not exist, it sets the
  `isLoggedIn` state to `false`. The empty array `[]` as the second argument to `useEffect` ensures
  that this code block only runs once when the component mounts. */
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const isLoggedIn = verifyExpiredToken(accessToken);

    if (!isLoggedIn) {
      localStorage.removeItem('accessToken');
      router.push('/cms/auth/login');
    }
  }, []);

  return (
    <>
      <Head>
        <title>{`${SITETITLE}`}</title>
      </Head>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={4}
          sx={{ marginTop: 1 }}
        >
          <Grid item xs={12}>
            Dashboard
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

Dashboard.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Dashboard;
