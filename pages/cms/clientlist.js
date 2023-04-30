import Head from 'next/head';

import SidebarLayout from '../../src/layouts/SidebarLayout';

import { Container, Grid } from '@mui/material';
import { SITETITLE } from '../../utils/constant.js'
import ClientListTable from '../../src/content/Tables/Client/ClientListTable';
import { getAllClient } from '../../apis/client.api.js';
import { loadStorage } from '../../utils/utils.js';
import { useEffect, useState } from 'react';

function ClientList() {
    const [token, setToken] = useState(loadStorage('accessToken'));
    const [clients, setClients] = useState([]);

    useEffect(() => {
        setToken(loadStorage('accessToken'));
        if (token) {
            const _retrieveClients = async () => {
                const clients = await getAllClient(token);
                setClients(clients);
            }
            _retrieveClients();
        }
    }, []);

    return (
        <>
            <Head>
                <title>{`${SITETITLE} | Client List`}</title>
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
                        <ClientListTable clients={clients.result} />
                    </Grid>
                </Grid>
            </Container >
        </>
    );
}

ClientList.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ClientList;
