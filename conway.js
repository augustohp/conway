var Cell = function(alive) {
	this._alive = alive || false;
	
	this.live  = function() { this._alive = true; };
	this.die   = function() { this._alive = false; };
	this.alive = function() { return (this._alive === true); };
};

var Game = function(elementId, limitSize) {
	this._data = new Array();
	this._size = limitSize || 25;
	this._out  = document.getElementById(elementId);
	this._gen  = 0;
	
	this.iterator = function(callback, data) {
		data = data || this._data;
		size = this._size;
		for(x=0; x<size; x++)
			for(y=0; y<size; y++)
				callback(x,y, data);
	};
	
	this.add = function(x, y, data) {
		data = data || this._data;
		data[y-1][x-1].live();
		return this;
	};
	
	this.alive = function(x, y, data) {
		data = data || this._data;
		if (!data[y] || !data[y][x])
			return false;
		return data[y][x].alive();
	};
	
	this.generation = function() {
		// Sees how many living neighbor cells exist
		this.iterator(function(x,y, data) {
			cell             = data[y][x];
			livingNeightbour = 0
			// Coordenates of the neightbours
			coords = [[y-1,x-1] , [y-1,x] , [y-1,x+1],
			          [y, x-1]            , [y,x+1]  ,
					  [y+1, x-1], [y+1,x] , [y+1,x+1]];
		    // How many neighbours are alive?
			for (i=coords.length-1; i>=0; i--) {
				_y = coords[i][0];
				_x = coords[i][1];
				console.log(_x);
				if (_y >= 0 && _x >= 0 && data[_y] instanceof Array && data[_y][_x] instanceof Cell && data[_y][_x].alive()) { livingNeightbour++; }
			}
			console.log([x,y, livingNeightbour], cell);
			// Rule #4 - Reproduction
			if (!cell.alive() && livingNeightbour == 3) { return cell.live(); }
			/* Rules for a living cell */
			if (livingNeightbour < 2) { return cell.die(); } 	// Rule #1 - Underpopulation
			if (livingNeightbour <= 3) { return cell.live(); } 	// Rule #2 - Survives
			return cell.die() 									// Rule #3 - Overpopulation
		});
		this._gen++;
		return this;
	};
	
	this.render = function() {
		var l = new Array();  // output lines
		this.iterator(function(x, y, data) {
			if (!l[y]) { l[y] = new String() };
			l[x] += (data[y][x].alive()) ? '#' : ' ' ;
		});
		this._out.innerHTML = l.join("\n");
		return this;
	};
	
	this.tick = function() {
		//console.log('Ganeratiion: '+this._gen);
		this.generation();
		this.render();
	};
	
	/* Initializes the game */
	this.iterator(function(x, y, data) {
		if (!data[y]) 
			data[y] = [];
		data[y][x] = new Cell();
		data[y][x].x = x; 
		data[y][x].y = y;
	}, this._data);
};

board = new Game('container', 10);
board.add(1,2).add(2,3).add(3,1).add(3,2).add(3,3);
board.render().generation().render();
//setInterval(function() { board.tick() } , 100);

/**
 * TODO Save/Open Run Length Encoded file format (http://www.conwaylife.com/wiki/RLE)
 * TODO Separate "classes" into different files
 * TODO Better documentation
 */