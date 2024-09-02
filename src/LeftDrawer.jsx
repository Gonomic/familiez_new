import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CreateIcon from '@mui/icons-material/Create';
import PermDeviceInformationIcon from '@mui/icons-material/PermDeviceInformation';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import PropTypes from 'prop-types';

const icons = [<CreateIcon key="create" />, <PermDeviceInformationIcon key="info" />, <SettingsSuggestIcon key="settings" />];

function LeftDrawer({ open, onClose }) {
    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={onClose}>
            <List>
                {['Familiez bewerken', 'Familiez info', 'Familiez systeem'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton component={Link} to={`/${text.toLowerCase().replace(' ', '-')}`}>
                            <ListItemIcon>
                                {icons[index]}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <div>
            <Drawer open={open} onClose={onClose}>
                {DrawerList}
            </Drawer>
        </div>
    );
}

LeftDrawer.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default LeftDrawer;

