Rules:
	1. It's a 2 player game.
	2. Each player will have a initial power and set to a random location on the circle road.
		2.1. Player1 could move 1 distance each step, but Player2 will skip the first location and jump to the place that 2 distance away.
		2.2. Player1 move first.
		2.3. Player could only see what's in this location.
	3. There are total L locations, each with a child.
		3.1. Each child have a random power and money
	4. For each round, player could bully the child, cooperate with this child, or pass by(move to next position).
		4.1. cooperate, bully, or move take 1 unit of time.
		4.2. cooperate means your power will be sum up, but all future revenue should share base on power.
		4.3. bully this child will take all his money
		4.4. bully is avaliable only if you power is larger than him.
	5. Player could know the power, money, and the times of he/she ever seen players upon seeing a child.
		5.1 If this child has cooperated with player, you will only see a empty location. 
	6. If 2 player meet before end, the player will higher power will win.
		6.1. If they have same power, they could continue the game as nothing happen.
	7. If they never meet, the player with higher money win.
		7.1. If they have same money, higher power win
		7.2. If they are both equal, P2 wins (because second mover have disadvantage).
Variable Setting:
	1. Total round = 3L ~5L
	2. The initial locations of 2 players are at least 4 unit from each other.
		2.1. Thus the length of road is at least 8.
	3. Use standard distribution to generate power and money.
		3.1. The power of each unit is at least 1 and at most 10*Exp(P)
		3.2. The money of each child is at least 1 and at most 10*Exp(M)