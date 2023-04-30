import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import {
    Tooltip,
    Divider,
    Box,
    FormControl,
    InputLabel,
    Card,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TableContainer,
    Select,
    MenuItem,
    Typography,
    useTheme,
    CardHeader,
} from '@mui/material';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CommentIcon from '@mui/icons-material/Comment';
import { generateInvoice } from 'utils/functions/addclient.function';
import Popup from 'src/components/Popup/CreateMeetingPopup';

const applyFilters = (clients, filters) => {
    return clients.filter((client) => {
        let matches = true;

        if (filters.status && client.status !== filters.status) {
            matches = false;
        }

        return matches;
    });
};

const applyPagination = (clients, page, limit) => {
    return clients.slice(page * limit, page * limit + limit);
};

const ClientListTable = ({ clients }) => {
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [filters, setFilters] = useState({
        status: null
    });

    const clientOptions = [
        {
            id: 'all',
            name: 'All'
        },
        {
            id: 'Active',
            name: 'Active Client'
        },
        {
            id: 'Inactive',
            name: 'Inactive Client'
        }
    ];

    const ref = useRef(null);
    const [isOpen, setOpen] = useState(false);
    const [clientId, setClientId] = useState(null);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleStatusChange = (e) => {
        let value = null;

        if (e.target.value !== 'all') {
            value = e.target.value;
        }

        setFilters((prevFilters) => ({
            ...prevFilters,
            status: value
        }));
    };

    const handlePageChange = (_event, newPage) => {
        setPage(newPage);
    };

    const handleLimitChange = (event) => {
        setLimit(parseInt(event.target.value));
    };

    const filteredclients = applyFilters(clients, filters);
    const paginatedclients = applyPagination(
        filteredclients,
        page,
        limit
    );
    const theme = useTheme();

    return (
        <>
            <Card>
                <CardHeader
                    action={
                        <Box width={150}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Users</InputLabel>
                                <Select
                                    value={filters.status || 'all'}
                                    onChange={handleStatusChange}
                                    label="Status"
                                    autoWidth
                                >
                                    {clientOptions.map((statusOption) => (
                                        <MenuItem key={statusOption.id} value={statusOption.id}>
                                            {statusOption.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    }
                    title="Client List"
                />
                <Divider />
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Client Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell align="right">Address</TableCell>
                                <TableCell align="right">Services</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedclients.map((client) => {
                                return (
                                    <TableRow hover key={client._id}>
                                        <TableCell>
                                            <Typography
                                                variant="body1"
                                                fontWeight="bold"
                                                color="text.primary"
                                                gutterBottom
                                                noWrap
                                            >
                                                {client.clientName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {new Date(client.createdAt).toLocaleDateString(undefined, { month: 'long', day: '2-digit', year: 'numeric' })}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body1"
                                                fontWeight="bold"
                                                color="text.primary"
                                                gutterBottom
                                                noWrap
                                            >
                                                {client.clientEmail}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body1"
                                                fontWeight="bold"
                                                color="text.primary"
                                                gutterBottom
                                                noWrap
                                            >
                                                {client.clientPhone}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography
                                                variant="body1"
                                                fontWeight="bold"
                                                color="text.primary"
                                                gutterBottom
                                                noWrap
                                            >
                                                {client.clientAddress}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            {
                                                client.clientServices.map((service, index) => {
                                                    return (
                                                        <Typography key={index} variant="body2" color="text.secondary" noWrap>
                                                            {service}
                                                        </Typography>
                                                    )
                                                })
                                            }
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Set meeting with this client" arrow>
                                                <IconButton
                                                    ref={ref}
                                                    onClick={() => {
                                                        handleOpen();
                                                        setClientId(client._id);
                                                    }}
                                                    sx={{
                                                        '&:hover': {
                                                            background: theme.colors.primary.lighter
                                                        },
                                                        color: theme.palette.primary.main
                                                    }}
                                                    color="inherit"
                                                    size="small"
                                                >
                                                    <CommentIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Download Invoice" arrow>
                                                <IconButton
                                                    onClick={() => generateInvoice(client)}
                                                    sx={{
                                                        '&:hover': {
                                                            background: theme.colors.primary.lighter
                                                        },
                                                        color: theme.palette.error.main
                                                    }}
                                                    color="inherit"
                                                    size="small"
                                                >
                                                    <CloudDownloadIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit Order" arrow>
                                                <IconButton
                                                    onClick={() => router.push(`/cms/client/edit/${client._id}`)}
                                                    sx={{
                                                        '&:hover': {
                                                            background: theme.colors.primary.lighter
                                                        },
                                                        color: theme.palette.primary.main
                                                    }}
                                                    color="inherit"
                                                    size="small"
                                                >
                                                    <EditTwoToneIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete Order" arrow>
                                                <IconButton
                                                    sx={{
                                                        '&:hover': { background: theme.colors.error.lighter },
                                                        color: theme.palette.error.main
                                                    }}
                                                    color="inherit"
                                                    size="small"
                                                >
                                                    <DeleteTwoToneIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box p={2}>
                    <TablePagination
                        component="div"
                        count={filteredclients.length}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleLimitChange}
                        page={page}
                        rowsPerPage={limit}
                        rowsPerPageOptions={[5, 10, 25, 30]}
                    />
                </Box>
            </Card>

            {
                isOpen && (
                    <Popup setOpenPopup={setOpen} clientId={clientId} />
                )
            }
        </>
    );
};

ClientListTable.propTypes = {
    clients: PropTypes.array.isRequired
};

ClientListTable.defaultProps = {
    clients: []
};

export default ClientListTable;
