import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'

const FamiliezInfo = () => {
    return (
        <Box sx={{ position: 'absolute', top: '64px', bottom: '72px', height: 'calc(100% - 136px)', width: '100%', overflow: 'auto', p: 3 }}>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom color="primary">
                    Familiez
                </Typography>
                <Typography variant="h6" gutterBottom color="text.secondary">
                    Genealogie Applicatie
                </Typography>
                
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ my: 2 }}>
                    <Typography variant="body1" gutterBottom>
                        <strong>Versie:</strong> 01z beta
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Auteur:</strong> Frans Dekkers
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Copyright:</strong> © GoNomics 2026
                    </Typography>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                    Een applicatie voor het beheren en visualiseren van genealogische gegevens.
                </Typography>
            </Paper>
        </Box>
    );
};

export default FamiliezInfo;