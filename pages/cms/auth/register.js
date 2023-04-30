import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Card,
    CardContent,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    FormControl,
    MenuItem,
    Select,
    InputLabel,
} from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import { useSpring, animated } from 'react-spring';
import Head from 'next/head';

const RegisterCard = styled(Card)({
    maxWidth: 500, // Adjust the width here
    width: '100%',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.16)',
    borderRadius: '10px',
    height: '430px',
    margin: 'auto',
    marginTop: '100px',
    backgroundColor: '#f5f5f5',
});

const RegisterCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '40px', // Adjust the margin top here
});

const RegisterForm = styled('form')({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: '12px',
    height: '100%',
    '& .MuiFormControl-root': {
        marginBottom: '16px', // Add spacing to the bottom of the Select component
    },
});

const RegisterButton = styled(Button)({
    margin: '16px 0',
    height: '70%', // Adjust the height here
    width: '100%',
    borderRadius: '5px',
    backgroundColor: '#1976d2',
    color: 'white',
    '&:hover': {
        backgroundColor: '#115293',
    },
});

const LockContainer = styled('div')({
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '3px solid white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1976d2',
    position: 'absolute',
    top: '-40px',
    left: 'calc(50% - 40px)',
    zIndex: 100,
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.3)',
});

const LockIcon = styled(Lock)({
    fontSize: '40px',
    color: 'white',
});

const useStyles = () => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    },
    textField: {
        marginBottom: '16px', // Increase the margin bottom to add spacing
        borderRadius: '4px',
    },
    inputContainer: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: '16px', // Increase the margin bottom to add spacing
    },
    form: {
        height: '450px', // Increase the height of the form
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
});

const Register = () => {
    const classes = useStyles();

    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: '',
        showPassword: false,
    });

    const userRoleList = [
        { title: 'Admin', value: 'admin' },
        { title: 'Manager', value: 'manager' },
        { title: 'Communication Executive', value: 'communication executive' },
        { title: 'Sales Executive', value: 'sales executive' },
        { title: 'Office Executive', value: 'office executive' },
        { title: 'Accountant', value: 'accountant' },
        { title: 'Client', value: 'client' },
    ]

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    /**
     * This function handles form submission, signs up a user, and sets their access token to local
     * storage.
     * @param event - The event parameter is an object that represents the event that triggered the
     * function. In this case, it is the form submission event.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        const { firstName, lastName, email, password } = values;
        const accessToken = await signUpUser({ firstName, lastName, email, password });

        // Set the access token to local storage
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
        }

        // reset form
        setValues({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            showPassword: false,
        });
    };

    const cardAnimation = useSpring({
        from: { opacity: 0, transform: 'scale(0.8)' },
        to: { opacity: 1, transform: 'scale(1)' },
    });

    const inputAnimation = useSpring({
        from: { opacity: 0, transform: 'translateY(-50px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
        delay: 500,
    });

    const buttonAnimation = useSpring({
        from: { opacity: 0, transform: 'translateY(50px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
        delay: 800,
    });

    console.log('values', values)

    return (
        <div className={classes.root}>
            <Head key={new Date().getTime()}>
                <title>Signup</title>
                <meta name="description" content="Signup page" />
                <link rel="icon" href="/favicon.ico" />
                <style>{`
                    body {
                        margin: 0;
                        padding: 0;
                    }
                `}</style>
            </Head>

            <animated.div style={cardAnimation}>
                <RegisterCard>
                    <LockContainer>
                        <LockIcon />
                    </LockContainer>
                    <RegisterCardContent>
                        <animated.div style={inputAnimation}>
                            <RegisterForm noValidate autoComplete="off" onSubmit={handleSubmit}>
                                <div className={classes.inputContainer}>
                                    <TextField
                                        label="First Name"
                                        variant="outlined"
                                        sx={{ width: '48%', marginRight: '4%' }}
                                        value={values.firstName}
                                        onChange={handleChange('firstName')}
                                    />
                                    <TextField
                                        label="Last Name"
                                        variant="outlined"
                                        sx={{ width: '48%' }}
                                        value={values.lastName}
                                        onChange={handleChange('lastName')}
                                    />
                                </div>
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    className={classes.textField}
                                    sx={{ width: '100%' }}
                                    value={values.email}
                                    onChange={handleChange('email')}
                                />
                                <TextField
                                    label="Password"
                                    variant="outlined"
                                    className={classes.textField}
                                    type={values.showPassword ? 'text' : 'password'}
                                    value={values.password}
                                    onChange={handleChange('password')}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ width: '100%' }}
                                />
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">User Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={values.role}
                                        label="User Type"
                                        onChange={handleChange('role')}
                                        displayEmpty
                                    >
                                        {
                                            userRoleList.map((user, index) => {
                                                return (
                                                    <MenuItem key={index} value={user.value}>{user.title}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                                <animated.div style={buttonAnimation}>
                                    <RegisterButton variant="contained" color="primary" type="submit">
                                        Signup
                                    </RegisterButton>
                                </animated.div>
                            </RegisterForm>
                        </animated.div>
                    </RegisterCardContent>
                </RegisterCard>
            </animated.div>
        </div>
    );
};

export default Register;