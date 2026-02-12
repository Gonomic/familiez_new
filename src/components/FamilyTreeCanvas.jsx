import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import PersonTriangle from './PersonTriangle';
import PersonContextMenu from './PersonContextMenu';
import { getPersonDetails, getFather, getMother, getChildren, getPartners } from '../services/familyDataService';

/**
 * FamilyTreeCanvas Component
 * Main component for rendering the family tree with SVG
 */
const FamilyTreeCanvas = ({ 
    rootPerson, 
    nbrOfParentGenerations = 1, 
    nbrOfChildGenerations = 1,
    onEditPerson 
}) => {
    const [familyData, setFamilyData] = useState(new Map()); // Map of PersonID -> person data
    const [positions, setPositions] = useState(new Map()); // Map of PersonID -> {x, y}
    const [parentsMap, setParentsMap] = useState(new Map()); // childID -> {fatherId, motherId}
    const [partnersMap, setPartnersMap] = useState(new Map()); // personID -> [partnerIDs]
    const [childrenMap, setChildrenMap] = useState(new Map()); // parentID -> [childIDs]
    const [contextMenu, setContextMenu] = useState(null);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [draggingPersonId, setDraggingPersonId] = useState(null);

    // Layout constants
    const TRIANGLE_WIDTH = 120;
    const TRIANGLE_HEIGHT = 100;
    const HORIZONTAL_GAP = 160;
    const VERTICAL_GAP = 150;

    /**
     * Build the family tree data structure
     */
    const buildFamilyTree = useCallback(async () => {
        if (!rootPerson) return;

        console.log('=== Building Family Tree ===');
        console.log('Root Person:', rootPerson);
        console.log('Parent Generations:', nbrOfParentGenerations);
        console.log('Child Generations:', nbrOfChildGenerations);

        const newFamilyData = new Map();
        const newPositions = new Map();
        const newParentsMap = new Map();
        const newPartnersMap = new Map();
        const newChildrenMap = new Map();

        // Helper to add person to data
        const addPerson = async (personId, generation) => {
            if (!personId || newFamilyData.has(personId)) return null;
            
            console.log(`Fetching person details for ID: ${personId}, generation: ${generation}`);
            const personData = await getPersonDetails(personId);
            if (!personData) {
                console.log(`No data found for person ID: ${personId}`);
                return null;
            }
            
            console.log(`Added person:`, personData);
            newFamilyData.set(personId, { ...personData, generation });
            return personData;
        };

        // Start with root person
        await addPerson(rootPerson.PersonID, 0);
        
        // Build upward (parents)
        const buildUpward = async (personId, currentGen) => {
            if (currentGen >= nbrOfParentGenerations) return;
            
            console.log(`Building upward from person ${personId}, generation ${currentGen}`);
            const fatherId = await getFather(personId);
            const motherId = await getMother(personId);
            
            console.log(`Father: ${fatherId}, Mother: ${motherId} for child ${personId}`);
            
            if (fatherId || motherId) {
                newParentsMap.set(personId, { 
                    fatherId: fatherId || null, 
                    motherId: motherId || null 
                });
                console.log(`Set parent relationship for child ${personId}:`, newParentsMap.get(personId));
                
                if (fatherId) {
                    await addPerson(fatherId, currentGen + 1);
                    await buildUpward(fatherId, currentGen + 1);
                }
                
                if (motherId) {
                    await addPerson(motherId, currentGen + 1);
                    await buildUpward(motherId, currentGen + 1);
                }
                
                // If both parents exist, they are partners
                if (fatherId && motherId) {
                    if (!newPartnersMap.has(fatherId)) {
                        newPartnersMap.set(fatherId, []);
                    }
                    if (!newPartnersMap.get(fatherId).includes(motherId)) {
                        newPartnersMap.get(fatherId).push(motherId);
                    }
                    
                    if (!newPartnersMap.has(motherId)) {
                        newPartnersMap.set(motherId, []);
                    }
                    if (!newPartnersMap.get(motherId).includes(fatherId)) {
                        newPartnersMap.get(motherId).push(fatherId);
                    }
                    console.log(`Set partner relationship between ${fatherId} and ${motherId}`);
                }
            }
        };

        // Build downward (children)
        const buildDownward = async (personId, currentGen) => {
            if (currentGen >= nbrOfChildGenerations) return;
            
            const childrenData = await getChildren(personId);
            
            if (childrenData && childrenData.length > 0) {
                const childIds = childrenData.map(child => child.PersonID);
                newChildrenMap.set(personId, childIds);
                
                for (const child of childrenData) {
                    await addPerson(child.PersonID, currentGen - 1);
                    
                    // Also check for the other parent
                    const existingRelation = newParentsMap.get(child.PersonID);
                    if (!existingRelation) {
                        newParentsMap.set(child.PersonID, {
                            fatherId: null,
                            motherId: null
                        });
                    }
                    
                    await buildDownward(child.PersonID, currentGen - 1);
                }
            }
        };

        // Build the tree
        await buildUpward(rootPerson.PersonID, 0);
        await buildDownward(rootPerson.PersonID, 0);

        console.log('Family data collected:', newFamilyData.size, 'persons');
        console.log('Relationships parents:', Array.from(newParentsMap.entries()));
        console.log('Relationships partners:', Array.from(newPartnersMap.entries()));

        // Calculate positions
        calculatePositions(newFamilyData, newParentsMap, newPartnersMap, newPositions);

        console.log('Positions calculated:', newPositions.size, 'positions');
        console.log('=== Family Tree Built Successfully ===');

        setFamilyData(newFamilyData);
        setParentsMap(newParentsMap);
        setPartnersMap(newPartnersMap);
        setChildrenMap(newChildrenMap);
        setPositions(newPositions);
    }, [rootPerson, nbrOfParentGenerations, nbrOfChildGenerations]);

    /**
     * Calculate positions for all persons
     */
    const calculatePositions = (familyData, parentsMap, partnersMap, positions) => {
        const centerX = 500;
        const centerY = 400;
        
        // Group persons by generation
        const generations = new Map();
        familyData.forEach((person, personId) => {
            const gen = person.generation;
            if (!generations.has(gen)) {
                generations.set(gen, []);
            }
            generations.get(gen).push(personId);
        });

        // Position each generation
        const sortedGenerations = Array.from(generations.keys()).sort((a, b) => b - a);
        
        sortedGenerations.forEach((gen, genIndex) => {
            const personsInGen = generations.get(gen);
            const y = centerY - (gen * VERTICAL_GAP);
            
            // Check for partner pairs
            const positioned = new Set();
            let currentX = centerX - ((personsInGen.length - 1) * HORIZONTAL_GAP) / 2;
            
            personsInGen.forEach((personId) => {
                if (positioned.has(personId)) return;
                
                // Check if this person has a partner in the same generation
                const partners = partnersMap.get(personId) || [];
                const partnerInGen = partners.find(partnerId => 
                    generations.get(gen)?.includes(partnerId)
                );
                
                if (partnerInGen && !positioned.has(partnerInGen)) {
                    // Position as couple - bovenpunten moeten tegen elkaar aan liggen
                    // Persoon 1 op currentX, persoon 2 op currentX + TRIANGLE_WIDTH
                    // Zo raakt rechter bovenpunt van persoon 1 het linker bovenpunt van persoon 2
                    positions.set(personId, { x: currentX, y });
                    positions.set(partnerInGen, { x: currentX + TRIANGLE_WIDTH, y });
                    positioned.add(personId);
                    positioned.add(partnerInGen);
                    // Verhoog currentX met breedte van beide driehoeken plus gap naar volgende persoon
                    currentX += (TRIANGLE_WIDTH * 2) + HORIZONTAL_GAP;
                } else if (!positioned.has(personId)) {
                    // Position alone
                    positions.set(personId, { x: currentX, y });
                    positioned.add(personId);
                    currentX += HORIZONTAL_GAP;
                }
            });
        });
    };

    /**
     * Handle dragging of triangles
     */
    const handleDrag = useCallback((personId, newX, newY) => {
        setPositions(prev => {
            const newPositions = new Map(prev);
            newPositions.set(personId, { x: newX, y: newY });
            
            // Move partners with the person
            const partners = partnersMap.get(personId) || [];
            partners.forEach(partnerId => {
                const partnerPos = prev.get(partnerId);
                if (partnerPos) {
                    const offsetX = newX - prev.get(personId).x;
                    const offsetY = newY - prev.get(personId).y;
                    newPositions.set(partnerId, {
                        x: partnerPos.x + offsetX,
                        y: partnerPos.y + offsetY
                    });
                }
            });
            
            return newPositions;
        });
    }, [partnersMap]);

    /**
     * Handle triangle click
     */
    const handleTriangleClick = (person, clientX, clientY) => {
        setSelectedPerson(person);
        setContextMenu({ x: clientX, y: clientY });
    };

    /**
     * Close context menu
     */
    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    /**
     * Handle edit person
     */
    const handleEditPerson = (person) => {
        if (onEditPerson) {
            onEditPerson(person);
        }
    };

    /**
     * Draw connection lines
     */
    const renderConnectionLines = () => {
        const lines = [];
        
        console.log('=== Rendering Connection Lines ===');
        console.log('Parents relationships:', parentsMap);
        console.log('Partners relationships:', partnersMap);
        console.log('Positions:', positions);
        
        // Parent-child connections
        parentsMap.forEach((parents, childId) => {
            console.log(`Processing child ${childId}:`, parents);
            const childPos = positions.get(childId);
            if (!childPos) {
                console.log(`No position for child ${childId}`);
                return;
            }
            
            const childTopY = childPos.y;
            const childLeftX = childPos.x - TRIANGLE_WIDTH / 2;
            const childRightX = childPos.x + TRIANGLE_WIDTH / 2;
            
            // Father connection (to left top point)
            if (parents.fatherId) {
                const fatherPos = positions.get(parents.fatherId);
                console.log(`Father ${parents.fatherId} position:`, fatherPos);
                if (fatherPos) {
                    const fatherBottomX = fatherPos.x;
                    const fatherBottomY = fatherPos.y + TRIANGLE_HEIGHT;
                    console.log(`Drawing father line from (${fatherBottomX},${fatherBottomY}) to (${childLeftX},${childTopY})`);
                    lines.push(
                        <line
                            key={`father-${parents.fatherId}-${childId}`}
                            x1={fatherBottomX}
                            y1={fatherBottomY}
                            x2={childLeftX}
                            y2={childTopY}
                            stroke="#1976d2"
                            strokeWidth="2"
                        />
                    );
                }
            }
            
            // Mother connection (to right top point)
            if (parents.motherId) {
                const motherPos = positions.get(parents.motherId);
                console.log(`Mother ${parents.motherId} position:`, motherPos);
                if (motherPos) {
                    const motherBottomX = motherPos.x;
                    const motherBottomY = motherPos.y + TRIANGLE_HEIGHT;
                    console.log(`Drawing mother line from (${motherBottomX},${motherBottomY}) to (${childRightX},${childTopY})`);
                    lines.push(
                        <line
                            key={`mother-${parents.motherId}-${childId}`}
                            x1={motherBottomX}
                            y1={motherBottomY}
                            x2={childRightX}
                            y2={childTopY}
                            stroke="#1976d2"
                            strokeWidth="2"
                        />
                    );
                }
            }
        });
        
        // Partner connections (bottom points connected)
        partnersMap.forEach((partners, personId) => {
            const person1Pos = positions.get(personId);
            if (!person1Pos) return;
            
            partners.forEach(partnerId => {
                const person2Pos = positions.get(partnerId);
                if (!person2Pos) return;
                
                // Only draw once per pair
                if (personId < partnerId) {
                    const person1BottomX = person1Pos.x;
                    const person1BottomY = person1Pos.y + TRIANGLE_HEIGHT;
                    const person2BottomX = person2Pos.x;
                    const person2BottomY = person2Pos.y + TRIANGLE_HEIGHT;
                    
                    console.log(`Drawing partner line between ${personId} and ${partnerId}`);
                    lines.push(
                        <line
                            key={`partner-${personId}-${partnerId}`}
                            x1={person1BottomX}
                            y1={person1BottomY}
                            x2={person2BottomX}
                            y2={person2BottomY}
                            stroke="#d32f2f"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                        />
                    );
                }
            });
        });
        
        console.log(`Total lines to render: ${lines.length}`);
        console.log('=== End Connection Lines ===');
        return lines;
    };

    // Build tree when rootPerson or generations change
    useEffect(() => {
        buildFamilyTree();
    }, [buildFamilyTree]);

    if (!rootPerson) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                Selecteer een persoon in de rechterdrawer om de stamboom te tonen
            </div>
        );
    }

    console.log('Rendering family tree:', {
        personsCount: familyData.size,
        positionsCount: positions.size,
        parentsCount: parentsMap.size,
        partnersCount: partnersMap.size
    });
    
    console.log('Relationships state:', {
        parents: Array.from(parentsMap.entries()),
        partners: Array.from(partnersMap.entries())
    });

    return (
        <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
            <svg 
                style={{ 
                    width: '2000px', 
                    height: '2000px',
                    minWidth: '100%',
                    minHeight: '100%'
                }}
            >
                {/* Connection lines (drawn first, so they appear behind triangles) */}
                {renderConnectionLines()}
                
                {/* Person triangles */}
                {Array.from(familyData.entries()).map(([personId, person]) => {
                    const pos = positions.get(personId);
                    if (!pos) return null;
                    
                    return (
                        <PersonTriangle
                            key={personId}
                            person={person}
                            x={pos.x}
                            y={pos.y}
                            width={TRIANGLE_WIDTH}
                            height={TRIANGLE_HEIGHT}
                            onDragStart={setDraggingPersonId}
                            onDrag={handleDrag}
                            onDragEnd={() => setDraggingPersonId(null)}
                            onClick={handleTriangleClick}
                            partners={partnersMap.get(personId) || []}
                            isPartnerDragging={
                                draggingPersonId && 
                                partnersMap.get(draggingPersonId)?.includes(personId)
                            }
                        />
                    );
                })}
            </svg>
            
            {/* Context menu */}
            <PersonContextMenu
                anchorPosition={contextMenu}
                onClose={handleCloseContextMenu}
                onEditPerson={handleEditPerson}
                person={selectedPerson}
            />
        </div>
    );
};

FamilyTreeCanvas.propTypes = {
    rootPerson: PropTypes.shape({
        PersonID: PropTypes.number.isRequired,
        PersonGivvenName: PropTypes.string,
        PersonFamilyName: PropTypes.string,
        PersonDateOfBirth: PropTypes.string,
    }),
    nbrOfParentGenerations: PropTypes.number,
    nbrOfChildGenerations: PropTypes.number,
    onEditPerson: PropTypes.func,
};

export default FamilyTreeCanvas;
