var XHR = function(method, ad, params ) {
	var xhr = new XMLHttpRequest();
	xhr.onload = params.onload || null;
	xhr.open(method, ad);
	if(method == 'POST') {xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');}
	var variables   = params.variables || null
	  , str			= '';
	for(var i in variables) {
		 str += i + '=' + encodeURIComponent( variables[i] ) + '&';
		}
	xhr.send( str );
}

function init() {
	// Connect to the SocketIO server to retrieve ongoing games.
	socket = io.connect();
	socket.on('participants', function(data) {
		 var ul = document.getElementById('lesParticipants');
		 ul.innerHTML='';
		 for(p in data.participants) {
			 var li = document.createElement('li'); 
			 ul.appendChild( li );
			 li.appendChild( document.createTextNode( data.participants[p] ) );
			}
		});
	socket.on('FinalCountDown'	, function(data) {
		 var ms   = data.FinalCountDown;
		 var date = new Date();
		 RR.msStartFinalCountDown = date.getTime();
		 RR.ms = ms;
		 console.log("FinalCountDown : " + ms);
		 RR.p = document.createElement('p')
			RR.p.classList.add('FinalCountDown');
		 document.querySelector('body > section > nav').appendChild( RR.p );
		 RR.updateFinalCountDown();
		});
	socket.on('TerminateGame'	, function(data) {
		 h1 = document.querySelector('body > header > h1');
		 h1.innerHTML += ' est terminée !';
		 RR.Terminate();
		});
	socket.on('solutions'		, function(data) {
		 RR.solutions = data.solutions;
		 console.log("Solutions are :\n"+JSON.stringify(RR.solutions));
		});
	socket.emit ('identification', 	{ login	: document.getElementById('login').value
									, idGame: document.getElementById('idGame').value}
				);
	XHR	( "GET"
		, "/"+document.getElementById('idGame').value
		, {onload: function()  	{//console.log( JSON.parse(this.responseText) );
								 RR.init	( document.getElementById('partie')
											, JSON.parse(this.responseText) );
								}
		  }
		);
}

var RR =	{ table		: null
			, dataPlateau : null
			, robots	: null
			, originalPositionsOfRobots: null
			, proposition : []
			, lastMovedRobot : null
			, Terminate: function() {
				 // Display the different solutions
				 
				}
			, updateFinalCountDown: function() {
				 var date = new Date()
				   , ms = Math.max(0, Math.round((this.ms - (date.getTime() - this.msStartFinalCountDown))/1000));
				 RR.p.innerHTML = ms;
				 if(ms > 0) {setTimeout(function() {RR.updateFinalCountDown();}, 100);}
				}
			, resetDroppable: function() {
				 // console.log( "sending proposition :\n\t" + JSON.stringify( this.proposition ) );
				 var cells = this.table.querySelectorAll('td.droppable');
				 for(var c=0; c<cells.length; c++) {
					 cells.item(c).classList.remove('droppable');
					 cells.item(c).ondragover = null;
					}
				}
			, sendProposition : function(div) {
				 this.resetDroppable();
				 XHR( 'POST'
					, '/proposition'
					, { onload 		: function() {//console.log( "proposition : \n\t" + this.responseText );
												  var answer = JSON.parse( this.responseText );
												  RR.updateDroppable( div, answer.nextPositions );
												 }
					  , variables :	{ proposition: JSON.stringify( this.proposition )
									, login	: document.getElementById('login').value
									, idGame: document.getElementById('idGame').value
									}
					  }
					);
				}
			, updateDroppable: function(div, propositions) {
				 for(var p in propositions) {
					 // console.log( JSON.stringify(propositions[p]) );
					 var id = 'l'+propositions[p].l+'c'+propositions[p].c;
					 // console.log("id = " + id);
					 var cell = document.getElementById( id );
					 cell.classList.add('droppable');
					 cell.ondragover = function(div, td) {return function(e) {return RR.dragover(div, td, e);};}(div, cell);
					}
				}
			, dragstart : function(div, e) {
				 var robot = div.robot;
				 // console.log('Robot : ' + div.getAttribute('class') );
				 for(var a in robot) {console.log("\t"+a+' : '+robot[a]);}
				 this.proposition.push({command: 'select', robot: robot.color});
				 // console.log( "sending proposition :\n\t" + JSON.stringify( this.proposition ) );
				 this.sendProposition(div);
				}
			, dragover : function(div, td, e) {
				 var line   = td.line
				   , column = td.column ;
				 div.parentNode.removeChild(div);
				 td.appendChild(div);
				 this.proposition.push( {command: 'move', line:line , column:column} );
				 this.sendProposition(div);
				}
			, drop : function(div, td, e) {
				 
				}
			, init		: function(parentNode, game) {
							 document.body.ondragover = function() {return false;}
							 // Command panel
							 this.bt_reset = document.createElement('input');
								this.bt_reset.setAttribute('type', 'button');
								this.bt_reset.setAttribute('value', 'Reset');
								this.bt_reset.onclick = function() {
									 RR.proposition = [];
									 this.resetDroppable();
									 for(var r in RR.robots) {
										 var robot = RR.robots[r];
										 robot.div.parentNode.removeChild( robot.div );
										 document.getElementById('l'+robot.line+'c'+robot.column).appendChild( robot.div );
										}
									}
								parentNode.appendChild( this.bt_reset );
							 // Board
							 this.table = document.createElement('table');
								this.table.setAttribute('id', 'plateau');
								parentNode.appendChild( this.table );
							 this.dataPlateau = game.board;
							 for(var i=0; i<this.dataPlateau.length; i++) {
								 var tr = document.createElement('tr');
								 for(var j=0;j<this.dataPlateau[i].length; j++) {
									 var td = document.createElement('td');
									 td.line = i; td.column = j;
									 tr.appendChild(td);
									 // Coordonnées
									 td.setAttribute('id', 'l'+i+'c'+j);
									 td.classList.add('l'+i); td.classList.add('c'+j);
									 // Côtés
									 for(var cote in {g:1,h:1,d:1,b:1}) {
										 if(this.dataPlateau[i][j][cote]) {td.classList.add( cote );}
										}
									}
								 this.table.appendChild( tr );
								}
							 // Robots
							 this.robots = game.robots;
							 for(var r in this.robots) {
								 var div   = document.createElement('div')
								   , robot = this.robots[r];
									robot.div = div; div.robot = robot;
									div.classList.add('robot'); div.classList.add(robot.color);
									div.setAttribute('draggable', 'true');
									div.addEventListener	( 'dragstart'
															, function(div) {return function(e){RR.dragstart(div, e);};}(div)
															, false);
								 //console.log( 'l'+robot.line+'c'+robot.column );
								 document.getElementById('l'+robot.line+'c'+robot.column).appendChild( div );
								}
							 // Target
							 this.target = game.target;
							 document.getElementById('l'+this.target.l+'c'+this.target.c).classList.add( 'color_' + this.target.t );
							}
			};