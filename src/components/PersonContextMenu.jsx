import { Menu, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * PersonContextMenu Component
 * Shows a context menu when a person triangle is clicked
 */
const PersonContextMenu = ({ anchorPosition, onClose, onEditPerson, person }) => {
    const handleEditClick = () => {
        if (onEditPerson && person) {
            onEditPerson(person);
        }
        onClose();
    };

    return (
        <Menu
            open={Boolean(anchorPosition)}
            onClose={onClose}
            anchorReference="anchorPosition"
            anchorPosition={
                anchorPosition
                    ? { top: anchorPosition.y, left: anchorPosition.x }
                    : undefined
            }
        >
            <MenuItem onClick={handleEditClick}>
                Persoon bewerken
            </MenuItem>
        </Menu>
    );
};

PersonContextMenu.propTypes = {
    anchorPosition: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
    }),
    onClose: PropTypes.func.isRequired,
    onEditPerson: PropTypes.func.isRequired,
    person: PropTypes.object,
};

export default PersonContextMenu;
