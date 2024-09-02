import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Footer() {
    return (
        <Box sx={{ p: 3, backgroundColor: '#1976d2', textAlign: 'center', position: 'fixed', bottom: 0, width: '100%', zIndex: 1 }}>
            <Typography variant="body1">
                © 2024 GoNomics
            </Typography>
        </Box>
    );
}

export default Footer;