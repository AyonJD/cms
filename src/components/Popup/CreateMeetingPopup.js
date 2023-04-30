import React, { useEffect } from 'react';
import styles from '../../../styles/popup.module.css';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, TextField } from '@mui/material';
import { TextareaAutosize } from '@mui/base';
import { getCurrentUser, loadStorage } from '../../../utils/utils';
import { createMeeting } from '../../../apis/meeting.api';

const Popup = ({ setOpenPopup, clientId }) => {
    const [token, setToken] = React.useState(loadStorage('accessToken'))
    const [currentUser, setCurrentUser] = React.useState({});
    const [values, setValues] = React.useState({
        meetingDate: '',
        meetingTime: '',
        subject: '',
        message: '',
    });

    useEffect(() => {
        const token = loadStorage('accessToken')
        const getUser = getCurrentUser(token)
        getUser.then(user => {
            setCurrentUser(user)
        })
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // add the meetingData and meetingTime to the message
        const modifiedMessage = `${values.message}\n\n Meeting Date: ${values.meetingDate}\n Meeting Time: ${values.meetingTime}`;
        const modifiedDataForDb = {
            subject: values.subject,
            message: modifiedMessage,
            clientId: clientId,
            senderId: currentUser.user._id,
            meetingDate: values.meetingDate,
            meetingTime: values.meetingTime,
        }

        const meeting = await createMeeting(modifiedDataForDb, token);

        if (meeting.status === 200) {
            alert('Meeting Scheduled Successfully');
            setOpenPopup(false);
        } else {
            alert('Something went wrong');
        }
    };

    return (
        <Box className={styles.popup_wrapper}>
            <Box className={styles.popup_content}>
                <CloseIcon onClick={() => setOpenPopup(false)} className={styles.cross_icon} />
                <form onSubmit={handleSubmit}>
                    <h2 style={{ textAlign: 'center' }} className={styles.margin_bottom_16px}>Schedule Meeting</h2>
                    <Box className={styles.margin_bottom_16px}>
                        <TextField
                            label="Meeting Date"
                            variant="outlined"
                            focused
                            type='date'
                            sx={{ width: '48%', marginRight: '4%' }}
                            value={values.meetingDate}
                            onChange={handleChange}
                            name='meetingDate'
                        />
                        <TextField
                            label="Meeting Time"
                            variant="outlined"
                            sx={{ width: '48%' }}
                            value={values.meetingTime}
                            onChange={handleChange}
                            name='meetingTime'
                        />
                    </Box>
                    <Box className={styles.margin_bottom_16px}>
                        <TextField
                            label="Meeting Subject"
                            variant="outlined"
                            sx={{ width: '100%' }}
                            value={values.subject}
                            onChange={handleChange}
                            name='subject'
                        />
                    </Box>
                    <TextareaAutosize
                        aria-label="minimum height"
                        className={`${styles.margin_bottom_16px} custom_focus`}
                        minRows={3}
                        placeholder="Meeting Message"
                        value={values.message}
                        onChange={handleChange}
                        name='message'
                        style={{ width: '100%', height: 80, borderRadius: 6, border: '1px solid #ced0db', padding: 10 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{ width: '20%' }}>
                        Send
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default Popup;