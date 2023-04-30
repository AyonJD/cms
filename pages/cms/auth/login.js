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
    Grid
} from '@mui/material';
import { Visibility, VisibilityOff, LockOpen } from '@material-ui/icons';
import { useSpring, animated } from 'react-spring';
import Head from 'next/head';
import ClientOnly from '../../ClientOnly';
import { loginUser } from '../../../apis/auth.api';

const RegisterCard = styled(Card)({
    maxWidth: 400, // Adjust the width here
    width: '100%',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.16)',
    borderRadius: '10px',
    height: '360px',
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
    width: '100%',
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
    '& .MuiTextField-root': {
        width: '100%', // Make the text fields full width
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

const LockOpenIcon = styled(LockOpen)({
    fontSize: '40px',
    color: 'white',
});

const useStyles = () => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#1976d2 !important',
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

export default function Login() {
    const classes = useStyles();

    const [values, setValues] = useState({
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
     * This function handles user login by calling an asynchronous function to retrieve an access token
     * and storing it in local storage if it exists.
     * @param e - The "e" parameter is an event object that is passed to the function when it is
     * triggered by an event, such as a form submission or a button click. In this case, it is used to
     * prevent the default behavior of the form submission, which would cause the page to reload.
     */
    const handleLogin = async (e) => {
        e.preventDefault();
        const accessToken = await loginUser({ email: values.email, password: values.password, role: values.role });

        // Set the access token to local storage
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
        }
        // reset the form
        setValues({
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

    return (
        <ClientOnly>
            <div className={classes.root}>
                <Head key={new Date().getTime()}>
                    <title>Login</title>
                    <meta name="description" content="Login page" />
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
                            <LockOpenIcon />
                        </LockContainer>
                        <RegisterCardContent>
                            <animated.div style={inputAnimation}>
                                <RegisterForm noValidate autoComplete="off" onSubmit={handleLogin}>
                                    <div className={classes.inputContainer}>
                                        <TextField
                                            label="Email"
                                            variant="outlined"
                                            className={classes.textField}
                                            value={values.email}
                                            onChange={handleChange('email')}
                                            sx={{ width: '100%' }} // Add this line
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
                                            sx={{ width: '100%' }} // Add this line
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
                                                sx={{ width: '100%' }} // Add this line
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
                                    </div>
                                    <animated.div style={buttonAnimation}>
                                        <RegisterButton variant="contained" color="primary" type="submit" sx={{ width: '100%' }}>
                                            Login
                                        </RegisterButton>
                                    </animated.div>
                                </RegisterForm>
                            </animated.div>
                        </RegisterCardContent>
                    </RegisterCard>
                </animated.div>
            </div>
        </ClientOnly>
    );
}