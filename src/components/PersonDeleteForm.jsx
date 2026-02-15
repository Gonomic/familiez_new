import { useState } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import PropTypes from 'prop-types';
import { deletePerson } from '../services/familyDataService';

/**
 * PersonDeleteForm Component
 * Form for confirming and deleting a person
 */
const PersonDeleteForm = ({ person, onDelete, onCancel }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            const success = await deletePerson(person.PersonID);
            if (success) {
                if (onDelete) {
                    onDelete();
                }
            } else {
                setError('Verwijderen mislukt. Probeer het opnieuw.');
            }
        } catch (err) {
            setError('Er is een fout opgetreden bij het verwijderen.');
            console.error('Error deleting person:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelClick = () => {
        if (onCancel) {
            onCancel();
        }
    };

    if (!person) {
        return null;
    }

    const fullName = `${person.PersonGivvenName || ''} ${person.PersonFamilyName || ''}`.trim();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                padding: 3,
                width: '100%',
            }}
        >
            <Typography variant="h6" gutterBottom>
                Persoon Verwijderen
            </Typography>

            <Alert severity="warning">
                Let op: Dit zal de persoon en all zijn relaties verwijderen uit de database.
            </Alert>

            {error && (
                <Typography color="error" variant="body2">
                    {error}
                </Typography>
            )}

            <Typography variant="subtitle1">
                {fullName}
            </Typography>

            {person.PersonDateOfBirth && (
                <Typography variant="body2" color="textSecondary">
                    Geboortedatum: {person.PersonDateOfBirth}
                </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? 'Verwijderen...' : 'Verwijderen'}
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={handleCancelClick}
                    disabled={isDeleting}
                >
                    Afbreken
                </Button>
            </Box>
        </Box>
    );
};

PersonDeleteForm.propTypes = {
    person: PropTypes.shape({
        PersonID: PropTypes.number.isRequired,
        PersonGivvenName: PropTypes.string,
        PersonFamilyName: PropTypes.string,
        PersonDateOfBirth: PropTypes.string,
    }),
    onDelete: PropTypes.func,
    onCancel: PropTypes.func,
};

export default PersonDeleteForm;
