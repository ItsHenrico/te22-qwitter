# Dokumentation
## Generell skolgrejs
### Bra
Jag skulle säga att nästan allt gick bra. Jag skulle säga att jag förstår hur routes fungerar bättre än förut. Jag har också självklart lärt mig mer om forms så jag kan få sånt att fungera. 
### Dåligt
Det som gick lite sämre var att få SQL-frågorna att fungera. De känns mindre intuitiva än resten av kodningen. Alla SQL-frågor fungerar just nu men det tog längre tid än förväntat. 
### Lära mig mer
Jag måste lära mig mer om SQL-frågor så jag kan förstå dem bättre.
## Det som nästan är vettigt
### Mina Routes
#### /
Min rot get har en SQL-fråga som tar allt från tweet, och stoppar in användarnamnet från user. Den sorteras också efter när de blev utlagda. Den har också en post, där den tar värdena från /post och gör ett nytt tweet med dess varchar och användarnamn.
#### /post
/post är där det finns ett formulär var värden används i rotens post.
#### /edit
Den har en route som har en /:id/edit. Detta är var formuläret där man skriver in den nya texten är. Den skickar dig sedan till en post som skickar uppdaterar texten i tweeten, ändrar på edit tiden och sätter edited till sant.
#### /favorites
Den har också en /:id/favorites. Denna tar tweetens id och personen som är inloggads id (jag vet inte hur detta fungerar så den är hårdkodad till 1 just nu) och lägger detta i ett table. /favorites har samma uppgift som roten men ska bara visa de som är i favorites.
#### /delete
Den tar bara bort den från både favorites och tweet databasen.
#### /unfavorite
Det är samma som delete fast bara för favorites.
### Säkerhet
Alla mina SQL-frågor har en parametisering så det blir svårare att göra SQL injections och XSS. Jag ser också till att validera att användaren inte kan skicka fel sorts data, tom data eller för lång text i HTML formulären. 




# Slutprojekt Dokumentation
## 2025-04-28
Jag har fixat fina knappar till /post, /login och /signup som följer med när jag scrollar
## 2025-04-29
Idag har jag fixat så /edit och /post har samma njk fil eftersom de var nästan identiska. Sedan har jag fixat lite med hur de ser ut. Textlådan byter storlek utifrån hur mycket text som står i den. Jag fixade också att tiden ljög för mig och var i +0000 trots att den sa att den var +0200.
## 2025-04-30
Jag har fixat så att en grön kvadrat kommer fram när jag klickar på "mer" knappen. Detta fungerar genom att jag ger den en unik klass som varje mer knapp kommer att ändra display värde på.
## 2025-05-05
Nu fungerar popup saken när man klickar på "mer" knappen. Detta gjorde jag genom att göra så att mer knappen sätter display grid och sedan när man klickar utanför sätter den till display none. 
## 2025-05-06
All inloggning från inloggnings projektet har blivit portat till Qwitter. (Ctrl + C, Ctrl + V, plus lite omskrivning av databasen). Det finns även en logga ut knapp. Den sparar också vilken user som är inloggad, så jag kan använda mig av det för att kunna posta från rätt användare och bara visa mer alternativ på Qweets från den inloggade användaren. Den kollar också i /:id/delete och /:id/edit om du är samma användare som lade upp Qweeten även om du navigerar dit manuellt
## 2025-05-06
Enter fungerar och nästan tomma meddelanden också (trim() hatar mig)
## 2025-05-12
Trim() ohatar mig utan anledning. Singup och Login skickar nu med en error om man skriver fel. Den ser nu också bra ut på mobil, förutom att jag inte har en aning om var jag ska ha post knappen.
## 2025-05-13
Jag har lagt till validationResults(req) på alla mina .posts