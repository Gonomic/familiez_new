import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { updatePerson } from '../services/familyDataService';

/**
 * PersonEditForm Component
 * Form for editing person details in the right drawer
 */
const PersonEditForm = ({ person, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        PersonGivvenName: '',
        PersonFamilyName: '',
        PersonDateOfBirth: '',
        PersonDateOfDeath: '',
        PersonPlaceOfBirth: '',
        PersonPlaceOfDeath: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (person) {
            setFormData({
                PersonGivvenName: person.PersonGivvenName || '',
                PersonFamilyName: person.PersonFamilyName || '',
                PersonDateOfBirth: person.PersonDateOfBirth || '',
                PersonDateOfDeath: person.PersonDateOfDeath || '',
                PersonPlaceOfBirth: person.PersonPlaceOfBirth || '',
                PersonPlaceOfDeath: person.PersonPlaceOfDeath || '',
            });
        }
    }, [person]);

    const handleChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            const success = await updatePerson(person.PersonID, formData);
            if (success) {
                if (onSave) {
                    onSave({ ...person, ...formData });
                }
            } else {
                setError('Opslaan mislukt. Probeer het opnieuw.');
            }
        } catch (err) {
            setError('Er is een fout opgetreden bij het opslaan.');
            console.error('Error saving person:', err);
        } finally {
            setIsSaving(false);
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

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                padding: 3,
                width: '100%',
            }}
        >
            <Typography variant="h6" gutterBottom>
                Persoon Bewerken
            </Typography>

            {error && (
                <Typography color="error" variant="body2">
                    {error}
                </Typography>
            )}

            <TextField
                label="Voornaam"
                value={formData.PersonGivvenName}
                onChange={handleChange('PersonGivvenName')}
                fullWidth
                required
            />

            <TextField
                label="Achternaam"
                value={formData.PersonFamilyName}
                onChange={handleChange('PersonFamilyName')}
                fullWidth
                required
            />

            <TextField
                label="Geboortedatum"
                type="date"
                value={formData.PersonDateOfBirth}
                onChange={handleChange('PersonDateOfBirth')}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: new Date().toISOString().split('T')[0] }}
            />

            <TextField
                label="Geboorteplaats"
                value={formData.PersonPlaceOfBirth}
                onChange={handleChange('PersonPlaceOfBirth')}
                fullWidth
            />

            <TextField
                label="Overlijdensdatum"
                type="date"
                value={formData.PersonDateOfDeath}
                onChange={handleChange('PersonDateOfDeath')}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: new Date().toISOString().split('T')[0] }}
            />

            <TextField
                label="Plaats van overlijden"
                value={formData.PersonPlaceOfDeath}
                onChange={handleChange('PersonPlaceOfDeath')}
                fullWidth
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSaving}
                >
                    {isSaving ? 'Opslaan...' : 'Opslaan'}
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={handleCancelClick}
                    disabled={isSaving}
                >
                    Annuleren
                </Button>
            </Box>
        </Box>
    );
};

PersonEditForm.propTypes = {
    person: PropTypes.shape({
        PersonID: PropTypes.number.isRequired,
        PersonGivvenName: PropTypes.string,
        PersonFamilyName: PropTypes.string,
        PersonDateOfBirth: PropTypes.string,
        PersonDateOfDeath: PropTypes.string,
        PersonPlaceOfBirth: PropTypes.string,
        PersonPlaceOfDeath: PropTypes.string,
    }),
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
};

export default PersonEditForm;
