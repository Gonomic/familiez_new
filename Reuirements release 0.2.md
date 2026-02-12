# Genealogie Familiez app, first iteration SVG Interface - Requirements

1.  SVG Canvas in scherm FamiliezBewerken.
2.  Op dat SVG canvas geven driehoeken personen weer, waarbij telkens per driehoek twee hoeken boven, één hoek beneden.
3.  In de driekhoek staan naam en voornaam en geboortedatum van een persoon.
4.  Als iemand de vader is van een persoon, moet de onderpunt van de driehoek van de vader met een lijn verbonden worden met linker bovenpunt dan de driehoek van de zoon of dochter.
5.  Als iemand de moeder is van een persoon moet de onderpunt van de driehoek van de moeder met een lijn verbonden worden met de rechter bovenpunt van de driehoek van de zoon of dochter.
6.  Als twee personen partners zijn dienen hun driehoeken aan de bovenste twee punten die het dichts bij elkaar zijn aan elkaar te raken en dienen hun onderpunten middels een lijn met elkaar verbonden te zijn.
7.  De driehoeken moet sleepbaar zijn, waarbij partners meebewegen en verbonden lijnen (me elkaar en met kinderen) meebewegen.
8.  De driehoeken moeten klikbaar zijn waarbij in geval van een klik een menu moet verschijnen bij de aangeklikte driehoek en het menu de actie: "Persoon bewerken" moet bevatten (zonder de quotes).
9.  Wanneer op het menu item "Persoon bewerken" wordt geklikt moeten de gegvens van deze persoon in een formulier in de rifhtdrawer bewerkt kunnen worden, de bewerking moet afgebroken kunnen worden.
10. De gegevens moeten opgehaald worden via de MW (middleware) app en daarchter de sprocs welke de BE (backend) app (=MariaDB) al heeft.
11. De code moet modulair zijn (rendering, interactie, data).
12. Wanneer in de rightdrawer in de picklist een naam gekozen is, moet deze in een driehoek op het canvast getoond worden en dienen er net zo veel generaties personen boven als onder deze persoon in driehoeken getekend worden als in de velden nbrOfParentGenerations en nbrOfChildGenerations is aangegeven.
   