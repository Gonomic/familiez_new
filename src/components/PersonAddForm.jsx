import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import PropTypes from 'prop-types';
import { addPerson } from '../services/familyDataService';

/**
 * PersonAddForm Component
 * Form for adding a new person, with parent(s) pre-filled
 */
const PersonAddForm = ({ parentPerson, onAdd, onCancel }) => {
    const [formData, setFormData] = useState({
        PersonGivvenName: '',
        PersonFamilyName: '',
        PersonDateOfBirth: '',
        PersonDateOfDeath: '',
        PersonPlaceOfBirth: '',
        PersonPlaceOfDeath: '',
        FatherId: null,
        MotherId: null,
        PersonIsMale: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    // Determine if parent is father or mother based on gender
    const initializeFatherMother = () => {
        if (parentPerson) {
            if (parentPerson.PersonIsMale) {
                setFormData(prev => ({
                    ...prev,
                    FatherId: parentPerson.PersonID
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    MotherId: parentPerson.PersonID
                }));
            }
        }
    };

    // Initialize on component mount
    useEffect(() => {
        initializeFatherMother();
    }, [parentPerson]);

    const handleChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.PersonGivvenName || !formData.PersonGivvenName.trim()) {
            setError('Voornaam is verplicht.');
            return;
        }
        
        if (!formData.PersonFamilyName || !formData.PersonFamilyName.trim()) {
            setError('Achternaam is verplicht.');
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            // Prepare data with proper null handling for dates
            const personIsMaleValue = formData.PersonIsMale === '' ? null : Number(formData.PersonIsMale);
            const personData = {
                PersonGivvenName: formData.PersonGivvenName.trim(),
                PersonFamilyName: formData.PersonFamilyName.trim(),
                PersonDateOfBirth: formData.PersonDateOfBirth || null,
                PersonDateOfDeath: formData.PersonDateOfDeath || null,
                PersonPlaceOfBirth: formData.PersonPlaceOfBirth || null,
                PersonPlaceOfDeath: formData.PersonPlaceOfDeath || null,
                FatherId: formData.FatherId || null,
                MotherId: formData.MotherId || null,
                PersonIsMale: personIsMaleValue,
            };
            
            const result = await addPerson(personData);
            if (result?.success && result.person) {
                if (onAdd) {
                    onAdd(result.person);
                }
            } else {
                setError(result?.error || 'Toevoegen mislukt. Probeer het opnieuw.');
            }
        } catch (err) {
            setError('Er is een fout opgetreden bij het toevoegen.');
            console.error('Error adding person:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelClick = () => {
        if (onCancel) {
            onCancel();
        }
    };

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
                Persoon Toevoegen
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
                disabled={isSaving}
            />

            <TextField
                label="Achternaam"
                value={formData.PersonFamilyName}
                onChange={handleChange('PersonFamilyName')}
                fullWidth
                required
                disabled={isSaving}
            />

            <TextField
                label="Geboortedatum"
                type="date"
                value={formData.PersonDateOfBirth}
                onChange={handleChange('PersonDateOfBirth')}
                fullWidth
                disabled={isSaving}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: new Date().toISOString().split('T')[0] }}
            />

            <TextField
                label="Geboorteplaats"
                value={formData.PersonPlaceOfBirth}
                onChange={handleChange('PersonPlaceOfBirth')}
                fullWidth
                disabled={isSaving}
            />

            <TextField
                label="Overlijdensdatum"
                type="date"
                value={formData.PersonDateOfDeath}
                onChange={handleChange('PersonDateOfDeath')}
                fullWidth
                disabled={isSaving}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: new Date().toISOString().split('T')[0] }}
            />

            <TextField
                label="Plaats van overlijden"
                value={formData.PersonPlaceOfDeath}
                onChange={handleChange('PersonPlaceOfDeath')}
                fullWidth
                disabled={isSaving}
            />

            <FormControl component="fieldset" disabled={isSaving}>
                <FormLabel component="legend">Geslacht</FormLabel>
                <RadioGroup
                    row
                    value={formData.PersonIsMale}
                    onChange={handleChange('PersonIsMale')}
                >
                    <FormControlLabel value="" control={<Radio />} label="Onbekend" />
                    <FormControlLabel value="1" control={<Radio />} label="Man" />
                    <FormControlLabel value="0" control={<Radio />} label="Vrouw" />
                </RadioGroup>
            </FormControl>

            <TextField
                label="Vader ID"
                value={formData.FatherId || ''}
                type="number"
                fullWidth
                disabled
                helperText="Automatisch ingesteld"
            />

            <TextField
                label="Moeder ID"
                value={formData.MotherId || ''}
                type="number"
                fullWidth
                disabled
                helperText="Automatisch ingesteld"
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSaving}
                >
                    {isSaving ? 'Bewaren...' : 'Bewaren'}
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={handleCancelClick}
                    disabled={isSaving}
                >
                    Afbreken
                </Button>
            </Box>
        </Box>
    );
};

PersonAddForm.propTypes = {
    parentPerson: PropTypes.shape({
        PersonID: PropTypes.number.isRequired,
        PersonIsMale: PropTypes.bool,
    }),
    onAdd: PropTypes.func,
    onCancel: PropTypes.func,
};

export default PersonAddForm;
