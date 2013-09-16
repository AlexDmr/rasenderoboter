var RasendeRoboter = {
	  table : null
	, dataPlateau : [ [{g:1, h:1}, {h:1}, {h:1}, {h:1}	, {h:1}	, {h:1,d:1}	, {h:1}		, {h:1}	, {h:1,d:1}	, {h:1}	, {h:1}		, {h:1}	, {h:1}	, {h:1}		, {h:1} , {h:1,d:1}]
					, [{g:1}	 , {}	, {}	, {}	, {}	, {}		, {}		, {}	, {}		, {d:1}	, {b:1}		, {}	, {}	, {}		, {} 	, {d:1}]
					, [{g:1}	 , {b:1}, {}	, {}	, {}	, {}		, {}		, {}	, {}		, {}	, {}		, {}	, {}	, {g:1}		, {} 	, {d:1}]
					, [{g:1}	 , {g:1}, {}	, {}	, {}	, {}		, {}		, {}	, {}		, {}	, {}		, {d:1}	, {h:1}	, {}		, {} 	, {d:1}]
					, [{g:1}	 , {}	, {}	, {}	, {}	, {}		, {b:1,d:1}	, {}	, {}		, {}	, {}		, {}	, {}	, {}		, {} 	, {d:1,b:1}]
					, [{g:1,b:1} , {}	, {b:1}	, {}	, {}	, {}		, {}		, {d:1}	, {b:1}		, {}	, {}		, {}	, {}	, {b:1}		, {} 	, {d:1}]
					, [{g:1}	 , {}	, {d:1}	, {b:1}	, {}	, {}		, {}		, {}	, {}		, {}	, {}		, {}	, {}	, {d:1}		, {} 	, {d:1}]
					, [{g:1}	 , {}	, {}	, {}	, {}	, {}		, {d:1}		, {h:1}	, {h:1,d:1}	, {}	, {}		, {}	, {}	, {}		, {} 	, {d:1}]
					, [{g:1}	 , {}	, {}	, {}	, {}	, {}		, {d:1}		, {b:1}	, {b:1,d:1}	, {}	, {}		, {}	, {}	, {}		, {} 	, {d:1}]
					, [{g:1}	 , {d:1}, {b:1}	, {}	, {}	, {}		, {}		, {}	, {}		, {}	, {b:1,d:1}	, {}	, {}	, {}		, {} 	, {d:1}]
					, [{g:1}	 , {}	, {d:1}	, {}	, {}	, {}		, {}		, {}	, {}		, {}	, {}		, {}	, {}	, {}		, {} 	, {d:1}]
					, [{g:1}	 , {}	, {}	, {}	, {}	, {}		, {d:1}		, {h:1}	, {}		, {}	, {}		, {}	, {h:1}	, {g:1,b:1}	, {} 	, {d:1}]
					, [{g:1}	 , {}	, {}	, {}	, {}	, {}		, {}		, {}	, {}		, {}	, {}		, {}	, {}	, {}		, {} 	, {d:1}]
					, [{g:1,h:1} , {}	, {}	, {}	, {}	, {}		, {}		, {}	, {d:1}		, {h:1}	, {}		, {}	, {}	, {}		, {} 	, {d:1,h:1}]
					, [{g:1}	 , {}	, {}	, {}	, {}	, {b:1,d:1}	, {}		, {}	, {}		, {}	, {}		, {}	, {}	, {}		, {} 	, {d:1}]
					, [{g:1,b:1}, {b:1}	, {b:1}	, {b:1}	, {b:1}	, {b:1}		, {b:1,d:1}	, {b:1}	, {b:1}		, {b:1}	, {b:1,d:1}	, {b:1}	, {b:1}	, {b:1}		, {b:1} , {d:1,b:1}]
					]
	, cibles: 	[ {l:1,c:10,t:'r'}
				, {l:2,c:12,t:'b'}
				, {l:3,c:1,t:'r'}
				, {l:3,c:12,t:'v'}
				, {l:4,c:6,t:'j'}
				, {l:5,c:8,t:'*'}
				, {l:6,c:2,t:'v'}
				, {l:6,c:3,t:'b'}
				, {l:6,c:13,t:'j'}
				, {l:9,c:2,t:'j'}
				, {l:9,c:10,t:'j'}
				, {l:10,c:2,t:'v'}
				, {l:11,c:7,t:'b'}
				, {l:11,c:12,t:'r'}
				, {l:11,c:13,t:'v'}
				, {l:13,c:9,t:'b'}
				, {l:14,c:5,t:'r'}
				]
	, init: function(idTable) {
		 this.table = document.getElementById( idTable );
		 this.table.innerHTML = '';
		 for(var i=0; i<this.dataPlateau.length; i++) {
			 var tr = document.createElement('tr');
			 for(var j=0;j<this.dataPlateau[i].length; j++) {
				 var td = document.createElement('td');
				 tr.appendChild(td);
				 // Coordonnées
				 td.setAttribute('id', 'l'+i+'c'+j);
				 td.classList.add('l'+i, 'c'+j);
				 // Côtés
				 for(var cote in {g:1,h:1,d:1,b:1}) {
					 if(this.dataPlateau[i][j][cote]) {td.classList.add( cote );}
					}
				 // Cibles
				 for(var i_cible=0; i_cible<this.cibles.length; i_cible++) {
					 if( this.cibles[i_cible].l == i
					   &&this.cibles[i_cible].c == j ) {
							 td.classList.add('color_'+this.cibles[i_cible].t);
							}
					}
				}
			 this.table.appendChild( tr );
			}
			
		 // Placer les robots au hasard
		 var robots = ['bleu', 'rouge', 'vert', 'jaune'];
		 for(var i in robots) {
			 var div = document.createElement('div');
			 div.classList.add('robot', 'robot_' + robots[i]);
			 var l = c = 7;
			 while(l>=7 && l<=8 && c>=7 && c<=8) {
				 l = Math.round( Math.random()*15 )
				 c = Math.round( Math.random()*15 );
				}
			 console.log(l + ';' + c);
			 document.getElementById('l'+l+'c'+c).appendChild( div );
			}
		}
};

function init() {
	// Initialiser le plateau de jeu
	RasendeRoboter.init( 'plateau' );
}
