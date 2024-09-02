import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

function LeftMenuBar() {
    return (
        <Drawer variant="permanent" anchor="left">
            <List>
                {['Item 1', 'Item 2', 'Item 3'].map((text) => (
                    <ListItem key={text}>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}

export default LeftMenuBar;