Shrnutí všeho, co PIXIJS umí - hra Lovec Pokladù. (tutorial viz https://github.com/kittykatattack/learningPixi)

Náhodnì vygenerovaní blobové se budou pohybovat nahoru a dolù v doupìti a úkolem je dostat prùzkumníka
k pokladu a poklad odnést ke dveøím. Pokud blob zasáhne prùzkumníka, prùzkumník  zprùhlední a z health
bar se odeète èást životù. Jakmile je health bar prázdný, hra konèí a na stage se objeví nápis "Prohrál jsi!".
Když se prùzkumníkovi podaøí ve zdraví poklad dotáhnout ke dveøím na stage se objeví nápis "Vyhrál jsi!".

Základní rozložení kódu:

// Nastav Pixi a naèti atlas textur. Zavolej funkci setup(), až je vše naèteno

function setup() {
  // Funkce setup se spustí pouze jednou, takže umožòuje provést všechna základní nastavení a jednorázové úkoly.
  // Konkrétní úkoly, které provádí funkce setup() v Lovci Pokladù:
	// Vytvoø skupinu 'herniScena'
	// Vytvoø sprite 'dvere'
	// Vytvoø sprite 'pruzkumnik'
	// Vytvoø sprite 'truhla'
	// Vytvoø nepøátele
	// Vytvoø health bar
	// Vytvoø skupinu 'herniScenaNaKonci'
	// Pøidej nìjakou zprávu pøi prohøe
	// Naprogramuj klávesy, které budeme potøebovat (šipky)

	// Nastav state na 'play'
	state = play;

	// Spus herní smyèku 'gameLoop'
	app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  // Spustí aktuální stav hry 'state' ve smyèce, která se opakuje 60x za vteøinu
}

function play(delta) {
  // Veškerá herní logika a pohyb spritù se dìje uvnitø funkce 'play()', protože tato funkce bìží v nepøetržité smyèce.
  // Všechny úkoly, které má zajistit tato funkce v Lovci Pokladù:
	// Pohyb prùzkumníka a jeho umístìní v doupìti (pomocná funkce 'contain')
	// Pohyb blobù
	// Kontrola kolize mezi bloby a prùzkumníkem
	// Kontrola kolize mezi prùzkumníkem a pokladem
	// Kontrola kolize mezi pokladem a dveømi
	// Rozhodnutí, zda byla hra vyhraná nebo prohraná
	// Po ukonèení hry nastavíme state na 'end'
}

function end() {
  // Kód, který se spustí pøi ukonèení hry (jedná se o volbu stavu hry 'state')
}


// Pomocné funkce:
//`keyboard`, `hitTestRectangle`, `contain` and `randomInt`