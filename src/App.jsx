import React, { useState, useMemo, useEffect, memo, createContext, useContext, useReducer } from 'react';
import {
    Box, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem,
    ListItemButton, ListItemIcon, ListItemText, Card, CardContent, Grid, TextField, InputAdornment,
    Chip, LinearProgress, Button, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Stack, Snackbar, Alert, Badge, useMediaQuery,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import {
    Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, Search as SearchIcon, Notifications as BellIcon,
    Dashboard as DashboardIcon, Storage as StorageIcon, People as UsersIcon, Build as BuildIcon,
    Security as ShieldIcon, Image as ImageIcon, AddCircle as PlusCircleIcon, Settings as SettingsIcon,
    HelpOutline as LifeBuoyIcon, Close as XIcon, CloudUpload as UploadCloudIcon,
    Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon, CameraAlt as CameraAltIcon,
    AllInbox as AllInboxIcon, BrokenImage as BrokenImageIcon, FileUpload as FileUploadIcon,
    ErrorOutline as ErrorIcon, WarningAmber as WarningIcon, InfoOutlined as InfoIcon, NotificationsActive as AlertsIcon,
    CheckCircleOutline as CheckCircleOutlineIcon, HighlightOff as HighlightOffIcon, Edit as EditIcon, Delete as DeleteIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';

// --- STATE MANAGEMENT with useReducer & useContext ---

// Mock Data (used only if localStorage is empty)
const initialDevices = [
    { id: 'DEV001', type: 'Ventilator', facility: 'Apollo Hospital, Hyderabad', status: 'Online', battery: 95, lastService: '2024-07-15', amcStatus: 'Active' },
    { id: 'DEV002', type: 'Defibrillator', facility: 'Yashoda Hospital, Secunderabad', status: 'Offline', battery: 0, lastService: '2024-06-22', amcStatus: 'Expired' },
    { id: 'DEV003', type: 'ECG Machine', facility: 'KIMS, Kondapur', status: 'Maintenance', battery: 50, lastService: '2024-07-25', amcStatus: 'Active' },
    { id: 'DEV004', type: 'X-Ray Machine', facility: 'Sunshine Hospitals, Gachibowli', status: 'Online', battery: 100, lastService: '2024-05-30', amcStatus: 'Active' },
    { id: 'DEV005', type: 'Ultrasound Scanner', facility: 'MaxCure Hospital, Madhapur', status: 'Online', battery: 80, lastService: '2024-07-10', amcStatus: 'Warning' },
    { id: 'DEV006', type: 'Infusion Pump', facility: 'Apollo Hospital, Hyderabad', status: 'Online', battery: 15, lastService: '2024-07-18', amcStatus: 'Active' },
    { id: 'DEV007', type: 'Patient Monitor', facility: 'Yashoda Hospital, Secunderabad', status: 'Online', battery: 88, lastService: '2024-07-20', amcStatus: 'Active' },
    { id: 'DEV008', type: 'Anesthesia Machine', facility: 'KIMS, Kondapur', status: 'Maintenance', battery: 40, lastService: '2024-07-22', amcStatus: 'Active' },
    { id: 'DEV009', type: 'CT Scanner', facility: 'Sunshine Hospitals, Gachibowli', status: 'Online', battery: 100, lastService: '2024-07-01', amcStatus: 'Active' },
    { id: 'DEV010', type: 'Surgical Light', facility: 'MaxCure Hospital, Madhapur', status: 'Online', battery: 98, lastService: '2024-06-15', amcStatus: 'Warning' },
    { id: 'DEV011', type: 'Dialysis Machine', facility: 'Apollo Hospital, Hyderabad', status: 'Online', battery: 92, lastService: '2024-07-11', amcStatus: 'Active' },
    { id: 'DEV012', type: 'Electrosurgical Unit', facility: 'Yashoda Hospital, Secunderabad', status: 'Offline', battery: 5, lastService: '2024-05-02', amcStatus: 'Expired' },
    { id: 'DEV013', type: 'Fetal Monitor', facility: 'KIMS, Kondapur', status: 'Online', battery: 78, lastService: '2024-07-05', amcStatus: 'Active' },
    { id: 'DEV014', type: 'Blood Gas Analyzer', facility: 'Sunshine Hospitals, Gachibowli', status: 'Maintenance', battery: 60, lastService: '2024-07-28', amcStatus: 'Active' },
    { id: 'DEV015', type: 'MRI Machine', facility: 'MaxCure Hospital, Madhapur', status: 'Online', battery: 100, lastService: '2024-06-18', amcStatus: 'Active' },
    { id: 'DEV016', type: 'Digital Radiography System', facility: 'Apollo Hospital, Hyderabad', status: 'Online', battery: 100, lastService: '2024-07-16', amcStatus: 'Warning' },
];
const initialServiceLogs = [
    { id: 'SL001', deviceId: 'DEV003', date: '2024-07-25', engineer: 'Rajesh Gupta', purpose: 'Preventive', notes: 'Routine checkup, cleaned filters.' },
    { id: 'SL002', deviceId: 'DEV008', date: '2024-07-22', engineer: 'Anita Desai', purpose: 'Breakdown', notes: 'Replaced faulty gas sensor.' },
    { id: 'SL003', deviceId: 'DEV014', date: '2024-07-28', engineer: 'Vikram Rathod', purpose: 'Preventive', notes: 'Calibrated readings and checked alarms.' },
];
const initialInstallations = [
    { id: 'INS001', deviceId: 'DEV006', facility: 'Apollo Hospital, Hyderabad', date: '2023-01-15', checklistCompleted: true, trainingStatus: 'Pending' },
    { id: 'INS002', deviceId: 'DEV001', facility: 'Apollo Hospital, Hyderabad', date: '2023-02-20', checklistCompleted: true, trainingStatus: 'Completed' },
];
const initialPhotoLogs = [
    { logId: 'PL001', deviceId: 'DEV005', facility: 'MaxCure Hospital, Madhapur', uploadDate: '2024-07-10', type: 'Maintenance', notes: 'Photo of sensor check.', fileName: 'sensor_check.jpg' },
];

const initialState = {
    devices: initialDevices,
    serviceLogs: initialServiceLogs,
    installations: initialInstallations,
    photoLogs: initialPhotoLogs,
};

// Reducer Function
function appReducer(state, action) {
    switch (action.type) {
        case 'ADD_DEVICE':
            const newDevice = { ...action.payload, id: `DEV${String(state.devices.length + 1).padStart(3, '0')}` };
            return { ...state, devices: [newDevice, ...state.devices] };
        case 'UPDATE_DEVICE':
            return { ...state, devices: state.devices.map(d => d.id === action.payload.id ? action.payload : d) };
        case 'DELETE_DEVICE':
            return { ...state, devices: state.devices.filter(d => d.id !== action.payload) };
        case 'ADD_INSTALLATION':
            const newInstallation = { ...action.payload, id: `INS${String(state.installations.length + 1).padStart(3, '0')}` };
            return { ...state, installations: [newInstallation, ...state.installations] };
        case 'ADD_SERVICE_LOG':
            const newLog = { ...action.payload, id: `SL${String(state.serviceLogs.length + 1).padStart(3, '0')}` };
            return { ...state, serviceLogs: [newLog, ...state.serviceLogs] };
        case 'ADD_PHOTO_LOG':
            const newPhotoLog = { ...action.payload, logId: `PL${String(state.photoLogs.length + 1).padStart(3, '0')}` };
            return { ...state, photoLogs: [newPhotoLog, ...state.photoLogs] };
        default:
            return state;
    }
}

// Context
const AppStateContext = createContext();
const AppDispatchContext = createContext();

const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState, (initial) => {
        try {
            const storedState = localStorage.getItem('deviceCrmState');
            return storedState ? JSON.parse(storedState) : initial;
        } catch (error) {
            console.error("Could not load state from localStorage", error);
            return initial;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('deviceCrmState', JSON.stringify(state));
        } catch (error) {
            console.error("Could not save state to localStorage", error);
        }
    }, [state]);

    return (
        <AppStateContext.Provider value={state}>
            <AppDispatchContext.Provider value={dispatch}>
                {children}
            </AppDispatchContext.Provider>
        </AppStateContext.Provider>
    );
};

// --- THEME ---
const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                background: { default: '#f4f6f8', paper: '#ffffff' },
                text: { primary: '#121212' },
              }
            : {
                background: { default: '#121212', paper: '#1e1e1e' },
                text: { primary: '#ffffff' },
              }),
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    transition: 'box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                    }
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                }
            }
        }
    }
});

// --- HELPER COMPONENTS (Memoized for performance) ---
const StatusChip = memo(({ status }) => {
    const statusConfig = {
        Online: { label: 'Online', color: 'success' },
        Offline: { label: 'Offline', color: 'error' },
        Maintenance: { label: 'Maintenance', color: 'warning' },
        Active: { label: 'Active', color: 'primary' },
        Warning: { label: 'Expires Soon', color: 'warning' },
        Expired: { label: 'Expired', color: 'default' },
        Completed: { label: 'Completed', color: 'success' },
        Pending: { label: 'Pending', color: 'warning' },
    };
    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" variant="outlined" />;
});

const BatteryIndicator = memo(({ value }) => {
    const getColor = (v) => {
        if (v > 20) return 'success';
        if (v > 10) return 'warning';
        return 'error';
    };
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 150 }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" value={value} color={getColor(value)} />
            </Box>
            <Typography variant="body2" color="text.secondary">{`${Math.round(value)}%`}</Typography>
        </Box>
    );
});

const FileUploadArea = ({ file, onFileSelect }) => {
    return (
        <Box
            sx={{ p: 3, textAlign: 'center', border: (theme) => `2px dashed ${theme.palette.divider}`, borderRadius: 1, bgcolor: (theme) => alpha(theme.palette.action.hover, 0.02), cursor: 'pointer', '&:hover': { borderColor: 'primary.main', bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05) } }}
            component="label"
        >
            <input type="file" hidden onChange={(e) => onFileSelect(e.target.files[0])} />
            <UploadCloudIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="h6">{file ? 'File Selected' : 'Select or Drop a File'}</Typography>
            <Typography variant="body2" color="text.secondary">{file?.name || 'Drag and drop a file here, or click to browse.'}</Typography>
        </Box>
    );
};

// --- MODAL & FORM COMPONENTS ---
const BaseFormModal = ({ open, onClose, title, children }) => (
    <Modal open={open} onClose={onClose}>
        <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 600 }, p: {xs: 2, sm: 3, md: 4} }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">{title}</Typography>
                <IconButton onClick={onClose}><XIcon /></IconButton>
            </Box>
            {children}
        </Paper>
    </Modal>
);

const DeviceFormModal = ({ open, onClose, triggerAlert, deviceToEdit }) => {
    const dispatch = useContext(AppDispatchContext);
    const [formData, setFormData] = useState({ type: '', facility: '', status: 'Online' });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (deviceToEdit) {
            setFormData(deviceToEdit);
        } else {
            setFormData({ type: '', facility: '', status: 'Online', battery: 100, lastService: new Date().toISOString().slice(0,10), amcStatus: 'Active' });
        }
    }, [deviceToEdit, open]);

    const validate = () => {
        let tempErrors = {};
        if (!formData.type) tempErrors.type = "Device type is required.";
        if (!formData.facility) tempErrors.facility = "Facility is required.";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            if (deviceToEdit) {
                dispatch({ type: 'UPDATE_DEVICE', payload: formData });
                triggerAlert('success', 'Device updated successfully!');
            } else {
                dispatch({ type: 'ADD_DEVICE', payload: formData });
                triggerAlert('success', 'Device added successfully!');
            }
            onClose();
        } else {
            triggerAlert('error', 'Please fill all required fields.');
        }
    };

    return (
        <BaseFormModal open={open} onClose={onClose} title={deviceToEdit ? "Edit Device" : "Add New Device"}>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }} noValidate>
                <Stack spacing={2}>
                    <TextField name="type" label="Device Type" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} required error={!!errors.type} helperText={errors.type} />
                    <TextField name="facility" label="Facility" value={formData.facility} onChange={(e) => setFormData({...formData, facility: e.target.value})} required error={!!errors.facility} helperText={errors.facility} />
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select name="status" value={formData.status} label="Status" onChange={(e) => setFormData({...formData, status: e.target.value})}>
                            <MenuItem value="Online">Online</MenuItem>
                            <MenuItem value="Offline">Offline</MenuItem>
                            <MenuItem value="Maintenance">Maintenance</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="text" onClick={onClose}>Cancel</Button>
                    <Button variant="contained" type="submit">Save Device</Button>
                </Box>
            </Box>
        </BaseFormModal>
    );
};

const InstallationFormModal = ({ open, onClose, triggerAlert }) => {
    const { devices } = useContext(AppStateContext);
    const dispatch = useContext(AppDispatchContext);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({ deviceId: '', date: '', checklistCompleted: false });
    const [errors, setErrors] = useState({});

    const validate = () => {
        let tempErrors = {};
        if (!formData.deviceId) tempErrors.deviceId = "Device is required.";
        if (!formData.date) tempErrors.date = "Installation date is required.";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const device = devices.find(d => d.id === formData.deviceId);
            dispatch({ type: 'ADD_INSTALLATION', payload: {...formData, facility: device.facility} });
            triggerAlert('success', 'Installation logged successfully!');
            onClose();
        } else {
            triggerAlert('error', 'Please fill all required fields.');
        }
    };
    
    return (
        <BaseFormModal open={open} onClose={onClose} title="Log New Installation">
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Stack spacing={2}>
                    <FormControl fullWidth error={!!errors.deviceId}>
                        <InputLabel>Device</InputLabel>
                        <Select name="deviceId" value={formData.deviceId} label="Device" onChange={(e) => setFormData({...formData, deviceId: e.target.value})} required>
                            {devices.map(d => <MenuItem key={d.id} value={d.id}>{d.id} - {d.type}</MenuItem>)}
                        </Select>
                         {errors.deviceId && <Typography color="error" variant="caption">{errors.deviceId}</Typography>}
                    </FormControl>
                    <TextField fullWidth name="date" label="Installation Date" type="date" InputLabelProps={{ shrink: true }} value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required error={!!errors.date} helperText={errors.date} />
                    <FormControlLabel control={<Checkbox checked={formData.checklistCompleted} onChange={(e) => setFormData({...formData, checklistCompleted: e.target.checked})} />} label="Installation Checklist Completed" />
                    <FileUploadArea file={file} onFileSelect={setFile} />
                </Stack>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="text" onClick={onClose}>Cancel</Button>
                    <Button variant="contained" type="submit">Save Installation</Button>
                </Box>
            </Box>
        </BaseFormModal>
    );
};

const ServiceLogFormModal = ({ open, onClose, triggerAlert }) => {
    const { devices } = useContext(AppStateContext);
    const dispatch = useContext(AppDispatchContext);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({ deviceId: '', engineer: '', date: '', purpose: 'Preventive', notes: '' });
    const [errors, setErrors] = useState({});

     const validate = () => {
        let tempErrors = {};
        if (!formData.deviceId) tempErrors.deviceId = "Device is required.";
        if (!formData.engineer) tempErrors.engineer = "Engineer name is required.";
        if (!formData.date) tempErrors.date = "Visit date is required.";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            dispatch({ type: 'ADD_SERVICE_LOG', payload: formData });
            triggerAlert('success', 'Service log saved successfully!');
            onClose();
        } else {
            triggerAlert('error', 'Please fill all required fields.');
        }
    };

    return (
        <BaseFormModal open={open} onClose={onClose} title="Log Service Visit">
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Stack spacing={2}>
                    <FormControl fullWidth error={!!errors.deviceId}>
                        <InputLabel>Device</InputLabel>
                        <Select name="deviceId" value={formData.deviceId} label="Device" onChange={(e) => setFormData({...formData, deviceId: e.target.value})} required>
                           {devices.map(d => <MenuItem key={d.id} value={d.id}>{d.id} - {d.type}</MenuItem>)}
                        </Select>
                        {errors.deviceId && <Typography color="error" variant="caption">{errors.deviceId}</Typography>}
                    </FormControl>
                    <TextField fullWidth name="engineer" label="Responsible Engineer" value={formData.engineer} onChange={(e) => setFormData({...formData, engineer: e.target.value})} required error={!!errors.engineer} helperText={errors.engineer} />
                    <TextField fullWidth name="date" label="Visit Date" type="date" InputLabelProps={{ shrink: true }} value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required error={!!errors.date} helperText={errors.date} />
                    <FormControl fullWidth>
                        <InputLabel>Purpose</InputLabel>
                        <Select name="purpose" label="Purpose" value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})}>
                            <MenuItem value="Preventive">Preventive</MenuItem>
                            <MenuItem value="Breakdown">Breakdown</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField fullWidth name="notes" label="Notes" multiline rows={3} value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
                    <FileUploadArea file={file} onFileSelect={setFile} />
                </Stack>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="text" onClick={onClose}>Cancel</Button>
                    <Button variant="contained" type="submit">Save Log</Button>
                </Box>
            </Box>
        </BaseFormModal>
    );
};

const PhotoLogFormModal = ({ open, onClose, triggerAlert }) => {
    const { devices } = useContext(AppStateContext);
    const dispatch = useContext(AppDispatchContext);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({ deviceId: '', type: 'Other', notes: '' });
    const [errors, setErrors] = useState({});

    const validate = () => {
        let tempErrors = {};
        if (!formData.deviceId) tempErrors.deviceId = "Device is required.";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const device = devices.find(d => d.id === formData.deviceId);
            dispatch({ type: 'ADD_PHOTO_LOG', payload: { ...formData, fileName: file?.name, facility: device.facility, uploadDate: new Date().toISOString().slice(0,10) } });
            triggerAlert('success', 'Photo log added successfully!');
            onClose();
        } else {
            triggerAlert('error', 'Please select a device.');
        }
    };

    return (
        <BaseFormModal open={open} onClose={onClose} title="Upload New Photo Log">
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Stack spacing={2}>
                    <FormControl fullWidth error={!!errors.deviceId}>
                        <InputLabel>Device</InputLabel>
                        <Select name="deviceId" value={formData.deviceId} label="Device" onChange={(e) => setFormData({...formData, deviceId: e.target.value})} required>
                            {devices.map(d => <MenuItem key={d.id} value={d.id}>{d.id} - {d.type}</MenuItem>)}
                        </Select>
                        {errors.deviceId && <Typography color="error" variant="caption">{errors.deviceId}</Typography>}
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Photo Type</InputLabel>
                        <Select name="type" value={formData.type} label="Photo Type" onChange={(e) => setFormData({...formData, type: e.target.value})}>
                            <MenuItem value="Installation">Installation</MenuItem>
                            <MenuItem value="Maintenance">Maintenance</MenuItem>
                            <MenuItem value="Damage">Damage</MenuItem>
                            <MenuItem value="Unboxing">Unboxing</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField fullWidth name="notes" label="Notes" multiline rows={3} value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
                    <FileUploadArea file={file} onFileSelect={setFile} />
                </Stack>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="text" onClick={onClose}>Cancel</Button>
                    <Button variant="contained" type="submit">Upload Log</Button>
                </Box>
            </Box>
        </BaseFormModal>
    );
};


// --- PAGE COMPONENTS ---
const DeviceInventory = memo(({ triggerAlert }) => {
    const { devices } = useContext(AppStateContext);
    const dispatch = useContext(AppDispatchContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeviceModal, setShowDeviceModal] = useState(false);
    const [deviceToEdit, setDeviceToEdit] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deviceToDelete, setDeviceToDelete] = useState(null);

    const handleOpenEdit = (device) => {
        setDeviceToEdit(device);
        setShowDeviceModal(true);
    };

    const handleOpenDelete = (device) => {
        setDeviceToDelete(device);
        setShowDeleteConfirm(true);
    };

    const handleDelete = () => {
        dispatch({ type: 'DELETE_DEVICE', payload: deviceToDelete.id });
        triggerAlert('info', `Device ${deviceToDelete.id} deleted.`);
        setShowDeleteConfirm(false);
        setDeviceToDelete(null);
    };

    const filteredDevices = devices.filter(d =>
        Object.values(d).some(val => 
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <>
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
                        <Typography variant="h5" component="h2">Device Inventory</Typography>
                        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
                            <TextField 
                                size="small" 
                                variant="outlined" 
                                placeholder="Search..." 
                                sx={{width: '100%'}} 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <Button variant="contained" startIcon={<PlusCircleIcon />} onClick={() => { setDeviceToEdit(null); setShowDeviceModal(true); }} sx={{ flexShrink: 0 }}>Add New</Button>
                        </Box>
                    </Box>
                    <TableContainer component={Paper} variant="outlined">
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Device ID</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Facility</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Battery</TableCell>
                                    <TableCell>AMC/CMC</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredDevices.map((device) => (
                                    <TableRow key={device.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">{device.id}</TableCell>
                                        <TableCell>{device.type}</TableCell>
                                        <TableCell>{device.facility}</TableCell>
                                        <TableCell><StatusChip status={device.status} /></TableCell>
                                        <TableCell><BatteryIndicator value={device.battery} /></TableCell>
                                        <TableCell><StatusChip status={device.amcStatus} /></TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={() => handleOpenEdit(device)}><EditIcon /></IconButton>
                                            <IconButton size="small" onClick={() => handleOpenDelete(device)}><DeleteIcon /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
            <DeviceFormModal open={showDeviceModal} onClose={() => setShowDeviceModal(false)} triggerAlert={triggerAlert} deviceToEdit={deviceToEdit} />
            <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete device {deviceToDelete?.id}? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
});

const InstallationTraining = memo(({ onAddNew }) => {
    const { installations } = useContext(AppStateContext);
    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" component="h2">Installation & Training</Typography>
                    <Button variant="contained" startIcon={<PlusCircleIcon />} onClick={onAddNew}>Log Installation</Button>
                </Box>
                <Grid container spacing={2}>
                    {installations.map(inst => (
                        <Grid item xs={12} key={inst.id}>
                            <Paper variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold">{inst.deviceId} - {inst.facility}</Typography>
                                <Typography variant="body2" color="text.secondary">Installed on: {inst.date}</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                                    <Typography variant="body2">Checklist: {inst.checklistCompleted ? '✔️' : '❌'}</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Typography variant="body2">Training:</Typography>
                                        <StatusChip status={inst.trainingStatus} />
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
});

const ServiceVisitLogs = memo(({ onAddNew }) => {
    const { serviceLogs } = useContext(AppStateContext);
    return (
         <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" component="h2">Service Visit Logs</Typography>
                    <Button variant="contained" startIcon={<PlusCircleIcon />} onClick={onAddNew}>Log Visit</Button>
                </Box>
                <Grid container spacing={2}>
                    {serviceLogs.map(log => (
                        <Grid item xs={12} key={log.id}>
                            <Paper variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold">{log.deviceId} - <Box component="span" sx={{fontWeight: 'normal'}}>{log.date}</Box></Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Engineer: {log.engineer} | Purpose: <Box component="span" sx={{ fontWeight: 'medium' }}>{log.purpose}</Box>
                                </Typography>
                                <Paper sx={{p: 1, mt: 1, bgcolor: (theme) => alpha(theme.palette.text.primary, 0.05)}} variant="elevation" elevation={0}><Typography variant="body2">{log.notes}</Typography></Paper>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
});

const AmcTracker = memo(() => {
    const { devices } = useContext(AppStateContext);
    const handleExport = () => {
        const headers = "Device ID,Type,Facility,AMC Status,Last Service\n";
        const csvContent = devices.map(d => 
            `${d.id},${d.type},"${d.facility}",${d.amcStatus},${d.lastService}`
        ).join("\n");

        const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.href) {
            URL.revokeObjectURL(link.href);
        }
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "amc_cmc_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const expiringSoon = devices.filter(d => d.amcStatus === 'Warning');
    const expired = devices.filter(d => d.amcStatus === 'Expired');

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2" mb={2}>AMC/CMC Tracker</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" color="warning.dark">Expiring Soon ({expiringSoon.length})</Typography>
                        <Paper sx={{ maxHeight: 200, overflow: 'auto', p: 1, mt: 1 }} variant="outlined">
                            {expiringSoon.map(d => <Typography key={d.id} variant="body2" sx={{p:0.5}}>{d.id} - {d.facility}</Typography>)}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" color="error.dark">Expired ({expired.length})</Typography>
                        <Paper sx={{ maxHeight: 200, overflow: 'auto', p: 1, mt: 1 }} variant="outlined">
                             {expired.map(d => <Typography key={d.id} variant="body2" sx={{p:0.5}}>{d.id} - {d.facility}</Typography>)}
                        </Paper>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 3, textAlign: 'right' }}>
                    <Button variant="contained" color="secondary" onClick={handleExport}>Export Report</Button>
                </Box>
            </CardContent>
        </Card>
    );
});

const PhotoLogs = memo(({ onAddNew }) => {
    const { photoLogs } = useContext(AppStateContext);
    const getIconForType = (type) => {
        switch(type) {
            case 'Unboxing': return <AllInboxIcon />;
            case 'Installation': return <BuildIcon />;
            case 'Maintenance': return <BuildIcon />;
            case 'Damage': return <BrokenImageIcon />;
            default: return <CameraAltIcon />;
        }
    }

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" component="h2">Photo Logs</Typography>
                    <Button variant="contained" startIcon={<PlusCircleIcon />} onClick={onAddNew}>Upload Photo</Button>
                </Box>
                <Grid container spacing={2}>
                    {photoLogs.map(log => (
                        <Grid item xs={12} sm={6} md={4} key={log.logId} sx={{ display: 'flex' }}>
                            <Paper variant="outlined" sx={{ p: 2, width: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1}}>
                                    <Box sx={{color: 'text.secondary'}}>
                                        {getIconForType(log.type)}
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">{log.deviceId} - {log.type}</Typography>
                                        <Typography variant="body2" color="text.secondary">{log.facility}</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="caption" display="block" color="text.secondary" sx={{mb: 1}}>{log.uploadDate}</Typography>
                                <Typography variant="body2" sx={{flexGrow: 1}}>{log.notes}</Typography>
                                {log.fileName && <Chip icon={<ImageIcon/>} label={log.fileName} size="small" sx={{mt: 2, alignSelf: 'flex-start'}} />}
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
});

const Dashboard = memo(() => {
    const { devices, serviceLogs, installations } = useContext(AppStateContext);

    const stats = useMemo(() => ({
        total: devices.length,
        online: devices.filter(d => d.status === 'Online').length,
        offline: devices.filter(d => d.status === 'Offline').length,
        maintenance: devices.filter(d => d.status === 'Maintenance').length,
    }), [devices]);

    const devicesRequiringAttention = useMemo(() => {
        return devices.filter(d => d.status !== 'Online' || d.battery < 20 || d.amcStatus === 'Expired' || d.amcStatus === 'Warning');
    }, [devices]);

    const recentActivity = useMemo(() => {
        const combined = [
            ...serviceLogs.map(log => ({...log, type: 'Service', icon: <BuildIcon />})),
            ...installations.map(inst => ({...inst, type: 'Installation', icon: <AllInboxIcon />}))
        ];
        return combined.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    }, [serviceLogs, installations]);

    const StatCard = ({ title, value, icon, color, total, hidePercent = false }) => {
        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
        return (
            <Card sx={{ height: '100%' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                        height: 56, width: 56, borderRadius: 1.5, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        bgcolor: (theme) => alpha(theme.palette[color].main, 0.1),
                        color: (theme) => theme.palette[color].main
                    }}>
                        {icon}
                    </Box>
                    <Box>
                        <Typography color="text.secondary">{title}</Typography>
                        <Typography variant="h4" component="div" fontWeight="bold">{value}</Typography>
                        {!hidePercent && total > 0 && <Typography variant="caption" color="text.secondary">{`${percentage}% of total`}</Typography>}
                    </Box>
                </CardContent>
            </Card>
        );
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}><StatCard title="Total Devices" value={stats.total} icon={<StorageIcon />} color="primary" hidePercent={true} /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCard title="Online" value={stats.online} icon={<CheckCircleOutlineIcon />} color="success" total={stats.total} /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCard title="Offline" value={stats.offline} icon={<HighlightOffIcon />} color="error" total={stats.total} /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCard title="Maintenance" value={stats.maintenance} icon={<BuildIcon />} color="warning" total={stats.total} /></Grid>
            
            <Grid item xs={12} lg={8}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Devices Requiring Attention</Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Device ID</TableCell>
                                        <TableCell>Facility</TableCell>
                                        <TableCell>Issue</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {devicesRequiringAttention.map(d => (
                                        <TableRow key={d.id}>
                                            <TableCell>{d.id}</TableCell>
                                            <TableCell>{d.facility}</TableCell>
                                            <TableCell>
                                                {d.status !== 'Online' && <StatusChip status={d.status} />}
                                                {d.battery < 20 && <Chip label={`Battery: ${d.battery}%`} color="warning" size="small" variant="outlined" sx={{ml:1}}/>}
                                                {(d.amcStatus === 'Expired' || d.amcStatus === 'Warning') && <StatusChip status={d.amcStatus} />}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} lg={4}>
                <Card>
                    <CardContent>
                         <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                         <Stack spacing={2}>
                            {recentActivity.map(activity => (
                                <Paper key={activity.id} variant="outlined" sx={{p:1.5, display: 'flex', alignItems: 'center', gap: 2}}>
                                    {activity.icon}
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold">{activity.deviceId}</Typography>
                                        <Typography variant="caption" color="text.secondary">{activity.type} on {activity.date}</Typography>
                                    </Box>
                                </Paper>
                            ))}
                         </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
});

const AlertsDashboard = memo(() => {
    const { devices, installations } = useContext(AppStateContext);
    const alerts = useMemo(() => {
        const newAlerts = [];
        devices.forEach(d => {
            if (d.battery < 20) newAlerts.push({ type: 'Low Battery Alert', condition: `${d.id} battery is at ${d.battery}%.`, severity: 'Warning' });
            if (d.status === 'Offline') newAlerts.push({ type: 'Offline Alert', condition: `${d.id} is offline.`, severity: 'Critical' });
            if (d.status === 'Maintenance') newAlerts.push({ type: 'Maintenance Needed', condition: `${d.id} requires maintenance.`, severity: 'Warning' });
            if (d.amcStatus === 'Expired') newAlerts.push({ type: 'Contract Expired', condition: `AMC/CMC for ${d.id} has expired.`, severity: 'Critical' });
            if (d.amcStatus === 'Warning') newAlerts.push({ type: 'Upcoming Expiry', condition: `AMC/CMC for ${d.id} is expiring soon.`, severity: 'Warning' });
        });
        installations.forEach(i => {
            if (i.trainingStatus === 'Pending') newAlerts.push({ type: 'Training Pending', condition: `Training for ${i.deviceId} is pending.`, severity: 'Warning' });
        });
        return newAlerts;
    }, [devices, installations]);

    const groupedAlerts = useMemo(() => {
        return alerts.reduce((acc, alert) => {
            const { severity } = alert;
            if (!acc[severity]) {
                acc[severity] = [];
            }
            acc[severity].push(alert);
            return acc;
        }, {});
    }, [alerts]);

    const severityOrder = ['Critical', 'Warning', 'Info'];

    const getIconForSeverity = (severity) => {
        switch (severity) {
            case 'Critical': return <ErrorIcon color="error" />;
            case 'Warning': return <WarningIcon color="warning" />;
            case 'Info': return <InfoIcon color="info" />;
            default: return <InfoIcon />;
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2" mb={2}>Active Alerts</Typography>
                {alerts.length === 0 ? (
                    <Typography color="text.secondary">No active alerts. System is healthy.</Typography>
                ) : (
                    <Stack spacing={3}>
                        {severityOrder.map(severity => (
                            groupedAlerts[severity] && (
                                <Box key={severity}>
                                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        {getIconForSeverity(severity)}
                                        {severity} ({groupedAlerts[severity].length})
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {groupedAlerts[severity].map((alert, index) => (
                                            <Grid item xs={12} md={6} key={index}>
                                                <Paper variant="outlined" sx={{ p: 2 }}>
                                                    <Typography variant="subtitle1" fontWeight="bold">{alert.type}</Typography>
                                                    <Typography variant="body2">{alert.condition}</Typography>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )
                        ))}
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
});

// --- MAIN APP COMPONENT ---
const drawerWidth = 240;

function AppContent() {
    const state = useContext(AppStateContext);
    const [mode, setMode] = useState('light');
    const [open, setOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activePage, setActivePage] = useState('Dashboard');
    
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    
    const [showDeviceModal, setShowDeviceModal] = useState(false);
    const [showInstallModal, setShowInstallModal] = useState(false);
    const [showServiceLogModal, setShowServiceLogModal] = useState(false);
    const [showPhotoLogModal, setShowPhotoLogModal] = useState(false);
    
    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleDrawerToggle = () => {
        if (isMobile) {
            setMobileOpen(!mobileOpen);
        } else {
            setOpen(!open);
        }
    };
    

    const alerts = useMemo(() => {
        const newAlerts = [];
        state.devices.forEach(d => {
            if (d.battery < 20) newAlerts.push({ type: 'Low Battery Alert', condition: `${d.id} battery is at ${d.battery}%.`, severity: 'Warning' });
            if (d.status === 'Offline') newAlerts.push({ type: 'Offline Alert', condition: `${d.id} is offline.`, severity: 'Critical' });
            if (d.status === 'Maintenance') newAlerts.push({ type: 'Maintenance Needed', condition: `${d.id} requires maintenance.`, severity: 'Warning' });
            if (d.amcStatus === 'Expired') newAlerts.push({ type: 'Contract Expired', condition: `AMC/CMC for ${d.id} has expired.`, severity: 'Critical' });
            if (d.amcStatus === 'Warning') newAlerts.push({ type: 'Upcoming Expiry', condition: `AMC/CMC for ${d.id} is expiring soon.`, severity: 'Warning' });
        });
        state.installations.forEach(i => {
            if (i.trainingStatus === 'Pending') newAlerts.push({ type: 'Training Pending', condition: `Training for ${i.deviceId} is pending.`, severity: 'Warning' });
        });
        return newAlerts;
    }, [state.devices, state.installations]);

    const triggerAlert = (severity, message) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };
    
    const renderPage = () => {
        switch (activePage) {
            case 'Dashboard': return <Dashboard />;
            case 'Device Inventory': return <DeviceInventory triggerAlert={triggerAlert} />;
            case 'Installation & Training': return <InstallationTraining onAddNew={() => setShowInstallModal(true)} />;
            case 'Service Visit Logs': return <ServiceVisitLogs onAddNew={() => setShowServiceLogModal(true)} />;
            case 'AMC/CMC Tracker': return <AmcTracker />;
            case 'Photo Logs': return <PhotoLogs onAddNew={() => setShowPhotoLogModal(true)} />;
            case 'Alerts': return <AlertsDashboard alerts={alerts} />;
            default: return <Typography>Page not found</Typography>;
        }
    };

    const menuItems = [
        { label: 'Dashboard', icon: <DashboardIcon />, page: 'Dashboard' },
        { label: 'Device Inventory', icon: <StorageIcon />, page: 'Device Inventory' },
        { label: 'Installation & Training', icon: <UsersIcon />, page: 'Installation & Training' },
        { label: 'Service Visit Logs', icon: <BuildIcon />, page: 'Service Visit Logs' },
        { label: 'AMC/CMC Tracker', icon: <ShieldIcon />, page: 'AMC/CMC Tracker' },
        { label: 'Photo Logs', icon: <ImageIcon />, page: 'Photo Logs' },
        { label: 'Alerts', icon: <AlertsIcon />, page: 'Alerts' },
    ];

    const criticalAlertCount = alerts.filter(a => a.severity === 'Critical').length;
    
    const drawerContent = (
        <>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: [1] }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                    <StorageIcon color="primary" fontSize="large" />
                    <Typography variant="h6">DeviceCRM</Typography>
                </Box>
                {!isMobile && (
                    <IconButton onClick={() => setOpen(false)}><ChevronLeftIcon /></IconButton>
                )}
            </Toolbar>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton selected={activePage === item.page} onClick={() => { setActivePage(item.page); if(isMobile) setMobileOpen(false); }}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </>
    );

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" sx={{
                    width: { md: `calc(100% - ${open && !isMobile ? drawerWidth : 0}px)` },
                    ml: { md: `${open && !isMobile ? drawerWidth : 0}px` },
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}>
                    <Toolbar>
                        <IconButton color="inherit" onClick={handleDrawerToggle} edge="start" sx={{ mr: 2 }}><MenuIcon /></IconButton>
                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>{activePage}</Typography>
                        <IconButton sx={{ ml: 1 }} onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} color="inherit">
                            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                        <IconButton color="inherit" onClick={() => setActivePage('Alerts')}>
                            <Badge badgeContent={criticalAlertCount} color="error">
                                <BellIcon />
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
                    <Drawer 
                        variant={isMobile ? 'temporary' : 'persistent'} 
                        open={isMobile ? mobileOpen : open} 
                        onClose={() => setMobileOpen(false)}
                        sx={{ '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}
                    >
                        {drawerContent}
                    </Drawer>
                </Box>
                <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, width: { md: `calc(100% - ${drawerWidth}px)` }, ml: {md: open && !isMobile ? 0 : `-${drawerWidth}px`}, transition: theme.transitions.create('margin', {easing: theme.transitions.easing.easeOut, duration: theme.transitions.duration.enteringScreen}) }}>
                    <Toolbar />
                    {renderPage()}
                </Box>
                <DeviceFormModal open={showDeviceModal} onClose={() => setShowDeviceModal(false)} triggerAlert={triggerAlert} />
                <InstallationFormModal open={showInstallModal} onClose={() => setShowInstallModal(false)} triggerAlert={triggerAlert} />
                <ServiceLogFormModal open={showServiceLogModal} onClose={() => setShowServiceLogModal(false)} triggerAlert={triggerAlert} />
                <PhotoLogFormModal open={showPhotoLogModal} onClose={() => setShowPhotoLogModal(false)} triggerAlert={triggerAlert} />
                <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
}

export default function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    )
}
