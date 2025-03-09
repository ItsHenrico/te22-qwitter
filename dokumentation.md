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