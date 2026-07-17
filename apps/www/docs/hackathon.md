
# **Hackathon opdracht: Fotolocatie Game**

## **Doel**

Bouw een proof of concept voor een multiplayer fotolocatie game waarin teams in dezelfde ruimte tegen elkaar spelen. Elk team gebruikt een eigen laptop. Eén centraal hoofdscherm stuurt het spel aan en toont de foto’s, timer, reveals en scores.

Per ronde krijgen teams een foto te zien. Ze moeten raden waar deze foto is gemaakt door een locatie op een kaart aan te wijzen. Hoe dichter het antwoord bij de juiste locatie ligt, hoe meer punten het team krijgt.

In het verleden hebben we met de afdeling een soortgelijk spel al een keer gedaan, hier komen ook de locaties en afbeeldingen vandaan in de bijlage op Slack. Hier kun je de presentatie nog bekijken die gebruikt werd op groot scherm tijdens het spel: [TechDevPo Geoguessr](https://docs.google.com/presentation/d/1bZxSHCsJ9Ik8dgTF-0haLPGgJYIviwesOgQjrw9Q7dY/edit?usp=sharing)

## **Concept**

Teams melden zich aan met een teamnaam. Op het hoofdscherm verschijnt een overzicht van alle deelnemers. Zodra het spel wordt gestart, gaan alle teams automatisch mee in dezelfde spelstatus.

De game bestaat uit 10 rondes. Elke ronde duurt 15 minuten. Binnen die tijd mag een team research doen en één antwoord insturen. Na bevestiging kan het antwoord niet meer worden aangepast.

Wanneer de tijd bijna voorbij is, moet er een waarschuwing komen.

## **Rondeverloop**

1. Het hoofdscherm toont een foto.  
2. Teams zoeken uit waar de foto is gemaakt.  
3. Elk team selecteert een locatie op de kaart.  
4. Het antwoord wordt bevestigd en daarna geblokkeerd.  
5. Teams zonder antwoord krijgen 0 punten.  
6. Na afloop volgt een reveal van de juiste locatie.   
7. De scores van de ronde worden getoond.

## 

## **Puntentelling**

De score wordt bepaald op basis van afstand tot de juiste locatie. Hoe dichterbij, hoe hoger de score.

Een simpele formule mag gebruikt worden, bijvoorbeeld:

`score = max(0, 1000 - afstand_in_km * factor)`

Maar een uitgebreidere formule mag natuurlijk ook\! De exacte formule hoeft niet perfect te zijn, zolang deze logisch en leuk aanvoelt tijdens het spelen.

## **Tussenstand en einde**

Na ronde 5 wordt een tussenstand getoond.

Na ronde 10 is het spel klaar, maar de eindscore wordt niet direct getoond. Eerst volgt een kort spanningsmoment, waarna de einduitslag gefaseerd wordt onthuld.

## **Must-haves voor de POC**

* Teams kunnen zich aanmelden met een teamnaam  
* Het hoofdscherm toont alle aangemelde teams  
* Het spel kan centraal gestart worden  
* Teams krijgen per ronde een kaart om hun antwoord te kiezen  
* Een bevestigd antwoord kan niet meer gewijzigd worden  
* Teams zonder antwoord krijgen 0 punten  
* Er is realtime communicatie tussen hoofdscherm en teams  
* Ronde handmatig kunnen afronden zodra alle teams een antwoord hebben ingestuurd  
* Na elke ronde wordt de juiste locatie onthuld  
* Na ronde 5 verschijnt een tussenstand  
* Na ronde 10 volgt een eindonthulling

## **Nice-to-haves**

* Apart displayscherm zonder beheerfunctionaliteit  
* Inzoomen vanaf de wereldkaart naar de juiste locatie bij de reveal  
* Animaties bij score-reveals  
* Highlight voor het team dat het dichtstbij zat  
* Grootste misser van de ronde  
* Spannende eindscore-onthulling

## **Buiten scope**

Voor deze hackathon hoeft er geen uitgebreid beheer gebouwd te worden. Foto’s en juiste locaties mogen hardcoded zijn.

Ook niet nodig voor deze POC:

* Meerdere rooms  
* Gebruikersaccounts  
* Adminomgeving voor foto’s en rondes  
* Spellen opslaan of hervatten  
* Anti-cheat

## **Aandachtspunten**

* Dubbele teamnamen moeten voorkomen worden  
* Het hoofdscherm is leidend voor de spelstatus  
* Een refresh op een teamlaptop mag het spel niet breken  
* Antwoorden na afloop van de timer mogen niet meer geaccepteerd worden  
* Een team moet kunnen zien dat het antwoord succesvol is ingestuurd

## **Vrijheid in uitwerking**

Binnen de opdracht is er ruimte voor eigen invulling. De vormgeving, animaties, extra spelelementen en technische uitwerking mogen vrij worden bedacht, zolang de basis van de game goed speelbaar blijft.

Creatieve toevoegingen die de ervaring leuker, spannender of interactiever maken worden aangemoedigd.

## **Resultaat**

Aan het einde van de hackathon is er een speelbare POC waarin meerdere teams tegelijk kunnen meedoen aan een fotolocatie game. De focus ligt op een leuke gezamenlijke ervaring, realtime interactie, duidelijke reveals en een spannende score-opbouw.

