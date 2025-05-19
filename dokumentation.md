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
Jag har fixat fina knappar till /post, /login och /signup som följer med när jag scrollar. 
## 2025-04-29
Idag har jag fixat så /edit och /post har samma njk fil eftersom de var nästan identiska. Sedan har jag fixat lite med hur de ser ut. Textlådan byter storlek utifrån hur mycket text som står i den. Jag fixade också att tiden ljög för mig och var i +0000 trots att den sa att den var +0200.
## 2025-04-30
Jag har fixat så att en grön kvadrat kommer fram när jag klickar på "mer" knappen. Detta fungerar genom att jag ger den en unik klass som varje mer knapp kommer att ändra display värde på.
## 2025-05-05
Nu fungerar popup saken när man klickar på "mer" knappen. Detta gjorde jag genom att göra så att mer knappen sätter display grid och sedan när man klickar utanför sätter den till display none. 
## 2025-05-06
All inloggning från inloggnings projektet har blivit portat till Qwitter. (Ctrl + C, Ctrl + V, plus lite omskrivning av databasen). Det finns även en logga ut knapp. Den sparar också vilken user som är inloggad, så jag kan använda mig av det för att kunna posta från rätt användare och bara visa mer alternativ på Qweets från den inloggade användaren. Den kollar också i /:id/delete och /:id/edit om du är samma användare som lade upp Qweeten även om du navigerar dit manuellt. 
## 2025-05-06
Enter fungerar och nästan tomma meddelanden också (trim() hatar mig). 
## 2025-05-12
Trim() ohatar mig utan anledning. Singup och Login skickar nu med en error om man skriver fel. Den ser nu också bra ut på mobil, förutom att jag inte har en aning om var jag ska ha post knappen.
## 2025-05-13
Jag har lagt till validationResults(req) på alla mina .posts. 
## 2025-05-16
Vem hade kunnat tro att få en font att fungera skulle vara det svåraste problemet att lösa? Den är sämre än default sans-serifen.

# Otrolig titel för det Jens vill ha
## Instruktioner
Jag hoppas du kan använda en hemsida, det enda kanske är att post knappen försvinner om den inte är bred nog.

## Uppföljning på planering
Jag har en knapp till alla mina sidor, förutom att post knappen försvinner när den inte är bred nog. Jag tänkte på att flytta in, login, singup, logout och post i en hamburgermeny när den blir för tunn men jag hade inte tid. I övrigt har jag all design som planerat. Jag har gjort så att alla routes från min login finns i mitt Qwitter och fungerar som de ska. Jag har sparat att man är inloggad och vem man är inloggad som i en session och ändrat hårdkodade värden av vem man är inloggad som till att använda värdet i sessionen. Dessa värden används också i nunjucks för att bestämma om det ska vara en login eller logout knapp samt om man ska ha de extra alternativen på ett Qweet. Sedan har jag if-satser som kollar om man är rätt användare om man manuellt navigerar till /:id/delete och /:id/edit. Det finns också linkande kollar för att se till att man är inloggad när man ska posta saker. Jag har inte ändrat min databas och den ser ut exakt som jag sa i planeringen.

Min säkerhet är inte exakt som jag sa i min planering. Jag har det jag sa att jag skulle lägga till i planeringen med att se till att min HTML form inte kan bli för lång. Jag har dock inget som kollar om den är för lång om man bypassar formen och postar utan att gå dit (som Josua fånar sig med). Jag hoppas att det fungerar ändå. Jag har också ? i mina SQL-frågor för att minska risken för SQL-injections. Sedan har jag också använt express validator för att se till att värdena inte är tomma.

## Vad, Hur, Varför
Jag har gjort Qwitter.
Jag kodade med kod.
Det var det jag hade gjort innan och orkade inte komma på något nytt.

## HuR hAr Du TeStAt DiN pRoDuKt?
Josua sa att den sög, så jag fixade det han sa sög, nu suger den mindre. Jag har också självklart verifierat att funktionerna fungerar när jag gör dem. 