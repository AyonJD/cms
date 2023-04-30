import { useState } from 'react';
import Head from 'next/head';
import styles from '../../styles/addclient.module.css';

import SidebarLayout from '../../src/layouts/SidebarLayout';

import { Container, Grid, Card, CardHeader, CardContent, TextField, Button, Divider, TextareaAutosize, Tooltip } from '@mui/material';
import { SITETITLE } from '../../utils/constant.js';
import { loadStorage } from '../../utils/utils';
import { createService } from '../../apis/service.api';


function AddService() {
    const [input, setInput] = useState({
        title: '',
        description: '',
        icon: '',
        servicePaymentInfo: 0
    });
    const [token, setToken] = useState(loadStorage('accessToken'));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = async e => {
        e.preventDefault();

        const service = await createService(input, token);

        if (service.status === 200) {
            setInput({
                title: '',
                description: '',
                icon: '',
                servicePaymentInfo: 0
            });

            alert('Service added successfully');
        } else {
            alert('Service adding failed');
        }
    };

    return (
        <>
            <Head>
                <title>{`${SITETITLE} | Add Service`}</title>
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
                        <Card>
                            <CardHeader title="Add Service" />
                            <Divider sx={{ marginBottom: 2 }} />
                            <form onSubmit={handleSubmit}>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="Title"
                                                name="title"
                                                onChange={handleChange}
                                                required
                                                value={input.title}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Tooltip title={<a className='global_anchor' href="https://mui.com/material-ui/material-icons/" target="_blank" rel="noopener noreferrer">Get the icon name from here</a>} arrow>
                                                <TextField
                                                    fullWidth
                                                    label="Icon"
                                                    name="icon"
                                                    onChange={handleChange}
                                                    required
                                                    value={input.icon}
                                                    variant="outlined"
                                                />
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="Service Payment"
                                                name="servicePaymentInfo"
                                                onChange={handleChange}
                                                required
                                                value={input.servicePaymentInfo}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                className={`${styles.margin_bottom_16px} custom_focus`}
                                                minRows={3}
                                                placeholder="Service Description"
                                                name="description"
                                                onChange={handleChange}
                                                required
                                                value={input.description}
                                                style={{ width: '100%', height: 80, borderRadius: 6, border: '1px solid #ced0db', padding: 10 }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ marginBottom: 3, marginTop: 3 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Button size='large' type='submit' sx={{ mr: 2 }} color='primary' variant='contained'>
                                                Submit
                                            </Button>
                                            <Button size='large' color='secondary' variant='outlined'>
                                                Cancel
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </form>
                        </Card>
                    </Grid>
                </Grid>
            </Container >
        </>
    );
}

AddService.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default AddService;
