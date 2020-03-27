Shrnut� v�eho, co PIXIJS um� - hra Lovec Poklad�. (tutorial viz https://github.com/kittykatattack/learningPixi)

N�hodn� vygenerovan� blobov� se budou pohybovat nahoru a dol� v doup�ti a �kolem je dostat pr�zkumn�ka
k pokladu a poklad odn�st ke dve��m. Pokud blob zas�hne pr�zkumn�ka, pr�zkumn�k  zpr�hledn� a z health
bar se ode�te ��st �ivot�. Jakmile je health bar pr�zdn�, hra kon�� a na stage se objev� n�pis "Prohr�l jsi!".
Kdy� se pr�zkumn�kovi poda�� ve zdrav� poklad dot�hnout ke dve��m na stage se objev� n�pis "Vyhr�l jsi!".

Z�kladn� rozlo�en� k�du:

// Nastav Pixi a na�ti atlas textur. Zavolej funkci setup(), a� je v�e na�teno

function setup() {
  // Funkce setup se spust� pouze jednou, tak�e umo��uje prov�st v�echna z�kladn� nastaven� a jednor�zov� �koly.
  // Konkr�tn� �koly, kter� prov�d� funkce setup() v Lovci Poklad�:
	// Vytvo� skupinu 'herniScena'
	// Vytvo� sprite 'dvere'
	// Vytvo� sprite 'pruzkumnik'
	// Vytvo� sprite 'truhla'
	// Vytvo� nep��tele
	// Vytvo� health bar
	// Vytvo� skupinu 'herniScenaNaKonci'
	// P�idej n�jakou zpr�vu p�i proh�e
	// Naprogramuj kl�vesy, kter� budeme pot�ebovat (�ipky)

	// Nastav state na 'play'
	state = play;

	// Spus� hern� smy�ku 'gameLoop'
	app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  // Spust� aktu�ln� stav hry 'state' ve smy�ce, kter� se opakuje 60x za vte�inu
}

function play(delta) {
  // Ve�ker� hern� logika a pohyb sprit� se d�je uvnit� funkce 'play()', proto�e tato funkce b�� v nep�etr�it� smy�ce.
  // V�echny �koly, kter� m� zajistit tato funkce v Lovci Poklad�:
	// Pohyb pr�zkumn�ka a jeho um�st�n� v doup�ti (pomocn� funkce 'contain')
	// Pohyb blob�
	// Kontrola kolize mezi bloby a pr�zkumn�kem
	// Kontrola kolize mezi pr�zkumn�kem a pokladem
	// Kontrola kolize mezi pokladem a dve�mi
	// Rozhodnut�, zda byla hra vyhran� nebo prohran�
	// Po ukon�en� hry nastav�me state na 'end'
}

function end() {
  // K�d, kter� se spust� p�i ukon�en� hry (jedn� se o volbu stavu hry 'state')
}


// Pomocn� funkce:
//`keyboard`, `hitTestRectangle`, `contain` and `randomInt`