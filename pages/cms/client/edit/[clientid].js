import Head from 'next/head';

import SidebarLayout from '../../../../src/layouts/SidebarLayout';
import { SITETITLE } from '../../../../utils/constant';
import { Button, Card, CardContent, CardHeader, Container, Divider, Grid, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getClientById } from '../../../../apis/client.api';
import { loadStorage } from '../../../../utils/utils';
import { getAllService } from '../../../../apis/service.api';
import styles from '../../../../styles/addclient.module.css';
import { handleTotalDue, handleTotalPaid, handleTotalPayment } from '../../../../utils/functions/paymentHandler.function';
import { handleChange } from '../../../../utils/functions/addclient.function';

function EditClient() {
    const [token, setToken] = useState(loadStorage('accessToken'));
    const router = useRouter();
    const { clientid } = router.query;
    const [client, setClient] = useState({});

    const [input, setInput] = useState({
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        clientAddress: '',
        clientServices: [],
        status: 'Inactive',

        // Payment data-------------->
        totalPayment: 0,
        totalPaid: 0,
        currentlyDue: 0,

        // Service data-------------->
        serviceStates: {},

        // Tracking paid amount for each service by the paid date
        paymentTracker: [],
    });
    const [services, setServices] = useState({});
    const [allServices, setAllServices] = useState([]);

    useEffect(async () => {
        if (clientid) {
            // 
            const _retrieveServices = async () => {
                try {
                    const res = await getAllService(token);
                    setAllServices(res.result);

                    const updatedServices = {};
                    res.result.forEach(service => {
                        updatedServices[service.title] = false;
                    });

                    setServices(updatedServices);
                } catch (error) {
                    console.log(error);
                }
            };
            await _retrieveServices();

            const setServiceOfClient = async (clientData) => {
                const updatedServices = {};
                clientData.result.clientServices.forEach(service => {
                    updatedServices[service] = true;
                });
                console.log(updatedServices, 'updatedServices')
                setServices(prev => ({ ...prev, ...updatedServices }))
                // setInput(prev => ({ ...prev, clientServices: updatedServices }));
            };

            const _retrieveClient = async () => {
                const client = await getClientById(clientid, token);
                setClient(client);

                // Update the input fields
                setInput(prev => ({
                    ...prev,
                    clientName: client.result.clientName,
                    clientPhone: client.result.clientPhone,
                    clientEmail: client.result.clientEmail,
                    clientAddress: client.result.clientAddress,
                    clientServices: client.result.clientServices,
                    status: client.result.status,
                    serviceStates: client.result.serviceStates,
                    totalPayment: client.result.totalPayment,
                    totalPaid: client.result.totalPaid,
                    currentlyDue: client.result.currentlyDue,
                }));

                setServiceOfClient(client);
            };
            _retrieveClient();
        }
    }, [clientid, token]);

    useEffect(() => {
        if (allServices.length === 0) return;

        /*
            Keep track of the payment amount of each service selected by the client
        */

        const updateServiceStates = async () => {
            const selectedServices = Object.keys(services).filter((key) => services[key]);
            const serviceStates = {};

            selectedServices.forEach(service => {
                const serviceData = allServices.find(s => s.title === service);
                serviceStates[`${service}PaymentAmount`] = serviceData.servicePaymentInfo;
                serviceStates[`${service}PaidAmount`] = 0;
                serviceStates[`${service}DueAmount`] = serviceData.servicePaymentInfo;
            });

            setInput(prev => ({ ...prev, serviceStates }));
        }

        updateServiceStates();
    }, [services, allServices])

    useEffect(() => {
        // Update the input fields whenever the services state changes
        handleTotalPayment(input, setInput, services);
        handleTotalPaid(input, setInput, services);
        handleTotalDue(input, setInput, services);
    }, [input.serviceStates, services]);

    // ------------> Toggle functions for services <----------------
    const togglService = (e) => {
        const { name } = e.target;
        setServices(prev => ({ ...prev, [name]: !services[name] }));
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (input.clientName === '' || input.clientPhone === '' || input.clientEmail === '' || input.clientAddress === '') {
            alert('Please fill in all the required fields.');
            return;
        }

        const selectedServices = Object.keys(services).filter((key) => services[key]);
        setInput(prev => ({ ...prev, clientServices: selectedServices }));

        try {
            let innerPaymentTracker = [];

            // Function to add a new payment record
            function addPaymentRecord(serviceName, paidAmount, paymentDate) {
                // Create a new object with the provided data
                let paymentRecord = {
                    serviceName: serviceName,
                    paidAmount: paidAmount,
                    paymentDate: paymentDate
                };

                // Push the new object into the paymentTracker array
                innerPaymentTracker.push(paymentRecord);
            }

            input.serviceStates && Object.keys(input.serviceStates).forEach(service => {
                if (service.includes('PaidAmount')) {
                    const serviceName = service.split('PaidAmount')[0];
                    const paidAmount = input.serviceStates[`${serviceName}PaidAmount`];
                    const paymentDate = new Date();
                    addPaymentRecord(serviceName, paidAmount, paymentDate);
                }
            });

            // Update the paymentTracker array
            setInput(prev => ({ ...prev, clientServices: selectedServices, paymentTracker: innerPaymentTracker }));

            const updatedInput = {
                ...input,
                clientServices: selectedServices,
                paymentTracker: innerPaymentTracker
            };

            // const res = await createClient(updatedInput, token);
            // if (res.status === 200) {
            //     alert('Client added successfully.');
            // }
        } catch (err) {
            console.log(err);
        }
    };

    console.log(input, 'input')

    return (
        <>
            <Head>
                <title>{`${SITETITLE} | Add Client`}</title>
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
                            <CardHeader title="Add Client" />
                            <Divider sx={{ marginBottom: 2 }} />
                            <form onSubmit={handleSubmit}>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Name"
                                                name="clientName"
                                                onChange={(e) => handleChange(e, setInput)}
                                                required
                                                value={input.clientName}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Phone"
                                                name="clientPhone"
                                                onChange={(e) => handleChange(e, setInput)}
                                                required
                                                value={input.clientPhone}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Email Address"
                                                name="clientEmail"
                                                onChange={(e) => handleChange(e, setInput)}
                                                required
                                                value={input.clientEmail}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Address"
                                                name="clientAddress"
                                                onChange={(e) => handleChange(e, setInput)}
                                                required
                                                value={input.clientAddress}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Services"
                                                name="clientServices"
                                                onChange={(e) => handleChange(e, setInput)}
                                                value={input.clientServices}
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ marginBottom: 3, marginTop: 3 }} />

                                    <Grid container spacing={2} >
                                        {
                                            //    Looping through the services object to check if the
                                            //    service is selected or not
                                            Object.keys(services).map((key, index) => {
                                                return (
                                                    <Grid key={index} item xs={12} sm={4}>
                                                        <Button name={key} fullWidth className={services[key] ? styles.common_bg : styles.initial} onClick={togglService}>
                                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                                        </Button>
                                                    </Grid>
                                                );
                                            })
                                        }
                                    </Grid>

                                    <Divider sx={{ marginBottom: 3, marginTop: 3 }} />

                                    {/*----------------------> Services Section <------------------- */}
                                    {
                                        //    Looping through the services object to check if the service is true or false
                                        //    If true, then show the service section
                                        //    If false, then hide the service section

                                        Object.keys(services).map((key, index) => {
                                            if (services[key]) {
                                                return (
                                                    <Grid key={index} sx={{ marginBottom: 3 }} container spacing={2}>
                                                        <Grid item xs={12}>
                                                            <Typography className='visa_color' variant='body2' sx={{ fontWeight: 600 }}>
                                                                {key.charAt(0).toUpperCase() + key.slice(1)} Payment
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={4}>
                                                            <TextField disabled name={`${key}PaymentAmount`} value={input.serviceStates[`${key}PaymentAmount`]} fullWidth label='Payment Amount' placeholder='' />
                                                        </Grid>
                                                        <Grid item xs={12} sm={4}>
                                                            <TextField name={`${key}PaidAmount`} value={input.serviceStates[`${key}PaidAmount`]} onChange={(e) => handleChange(e, setInput, key)} fullWidth label='Paid Amount' placeholder='' />
                                                        </Grid>
                                                        <Grid item xs={12} sm={4}>
                                                            <TextField
                                                                value={Number(input.serviceStates[`${key}PaymentAmount`]) - Number(input.serviceStates[`${key}PaidAmount`])}
                                                                fullWidth
                                                                disabled
                                                                label='Due Amount'
                                                                placeholder=''
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                )
                                            }
                                        })
                                    }

                                    <Divider sx={{ marginBottom: 3, marginTop: 3 }} />

                                    {/* --------------------------> Account Payment Section <--------------------------- */}
                                    {Object.values(services).some(service => service) ? (
                                        <Grid sx={{ marginBottom: 5 }} container spacing={5}>
                                            <Grid item xs={12}>
                                                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                                    Account Information
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <TextField disabled value={input.totalPayment} fullWidth label='Total Payment' placeholder='BDT' />
                                            </Grid>
                                            <Grid item>
                                                <TextField disabled value={input.totalPaid} fullWidth label='Total Paid' placeholder='BDT' />
                                            </Grid>
                                            <Grid item>
                                                <TextField disabled value={input.currentlyDue} fullWidth label='Currently Due' placeholder='' />
                                            </Grid>
                                        </Grid>
                                    ) : null}

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

EditClient.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default EditClient;
