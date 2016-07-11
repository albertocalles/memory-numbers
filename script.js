
/*
    Sistema de puntos (Aún no implementado) -> Hay que cambiar varias cosas
        * +1000 puntos por ganar
        * +100 puntos por cada pareja
        * +50 puntos por cada segundo que nos sobre si ganamos
        * -20 puntos por cada fallo
        * Cada racha de emparejamientos consecutivos recibe un bonus cada vez más grande
 */

document.querySelector("#start").addEventListener('click', function(){
    
  memoria({
    id: "#jugar",
    col: $("input[name='typeGame']:checked").val(),
    row: $("input[name='typeGame']:checked").val()
  });
  
  $("#config").hide();
  $("#jugar").show("slow");

})
function memoria(conf){

    if(conf.col % 2 > 0) {
        console.log('Error en el número de columnas. Sólo se puede incluir números pares');
        return;
    }
    
    if(conf.row % 2 > 0) {
        console.log('Error en el número de filas. Sólo se puede incluir números pares');
        return;
    }
    
    var d = document, // document
        c = d.querySelector(conf.id), // container
        t = d.createElement("table"), // table
        n = 0, // numbers as show
        p = { // play and game data
            points: 0, // puntos acumulados
            count: 0, // contador de casillas descubiertas
            limit: (conf.col*conf.row), // limite de casillas
            pGame: 1000, // puntos por ganar la partida
            pPerPair: 100, // puntos por pareja
            pPerSeconds: 50, // puntos por cada segundo sobrante
            pPerFault: 20, // puntos por fallo
            streak: 0, // racha - Numero de turnos por racha
            clicked: [],
            timeForPlay: Math.ceil((conf.col*conf.row)*2.85),
            gameOver: false,
            started: false
        },
        data = []; // numbers for the game order by rand
    
    // Numbers that going to play
    for(var i = 1; i <= (conf.col*conf.row) / 2; i++){
        data.push(i);
    }
    
    // Shuffle the numbers
    var data_a = shuffle(data);
    var data_b = shuffle(data);
    
    data = data_a.concat(data_b);
        
    for(var i = 0; i < conf.row; i++){
        var tr = d.createElement("tr");
        
        for(var j = 0; j < conf.col; j++){
            var td = d.createElement("td"),
                span = d.createElement("span");
            
            // inner Number
            span.innerHTML = data[n];
            
            // add event
            td.addEventListener('click', tdClick);
            
            // append to table
            tr.appendChild(td);
            td.appendChild(span);
            
            n++;
        }
        
        t.appendChild(tr);
    }

    // Append timer to dashboard
    var timer = d.createElement("div");
    timer.className = 'timer';
    timer.innerHTML = '<p>' + p.timeForPlay + '</p>';
    c.appendChild(timer);

    // Append dashboard to container
    var cpoints = d.createElement("div");
    cpoints.className = 'cpoints';
    c.appendChild(cpoints);

    // Append dashboard to container
    var dashboard = d.createElement("div");
    dashboard.className = 'game-dashboard';
    dashboard.innerHTML = "---";
    c.appendChild(dashboard);

    // Append table to container
    t.className = 'game-container';
    c.appendChild(t);
    
    // Append plays comments to container
    var comments = d.createElement("div");
    comments.className = 'game-comments';
    c.appendChild(comments);

    // Append go back button
    var goBackButton = d.createElement("button");
    goBackButton.id = 'goBackButton';
    goBackButton.innerHTML="Volver atrás";
    c.appendChild(goBackButton);

    document.getElementById("goBackButton").addEventListener("click", goBack);
    
    // Star game after 5 seconds ..
    start();
    
    function start(){
        var n = Math.ceil((conf.col * conf.row)*0.3);
        
        var interval = setInterval(function(){
            dashboard.innerHTML = 'El juego comenzará en ' + n + ' segundos ..';
            
            if(n === 0){
                cleansTds();
                timeElapsed();
                p.started = true;

                $(".timer").css("display","table");
                $(".cpoints").css("display","table");
                
                cpoints.innerHTML = '<p>' + 0 + '</p>';
                
                clearInterval(interval);
            } else n--;
        }, 1000);
    }
    
    function timeElapsed(){
        var interval = setInterval(function(){
            if(p.timeForPlay === 0 || p.limit === p.count) {
                clearInterval(interval);
                gameOver();
            } else {
                timer.innerHTML = '<p>' + p.timeForPlay-- + '</p>';
                dashboard.innerHTML = 'Tienes ' + (p.timeForPlay) + ' segundos para intentar ganar la partida :) ..';                
            }
        }, 1000);
    }
    
    function gameOver(){
        p.gameOver = true;
        if(p.limit === p.count){
            p.points += p.pGame;
            p.points += (p.timeForPlay - 1) * p.pPerSeconds;

            $(".timer").css("display","none");

            dashboard.innerHTML = '¡Has ganado la partida! Recibes ' + p.pGame + ' puntos por ganarla + ' + (p.timeForPlay * p.pPerSeconds) + ' puntos por el tiempo que te sobró (' + p.timeForPlay + 's). Total = ' + p.points + ' puntos :)';
            $(".game-dashboard").css("background", "#60F06A");
        }else{
            dashboard.innerHTML = 'Perdiste, lo siento.. Lo hiciste con ' + p.points + ' puntos :(';
            $(".game-dashboard").css("background", "#F92D2D");
        }

        cpoints.innerHTML = '<p>' + p.points + '</p>';

    }
    
    function cleansTds(){
        var spans = d.querySelectorAll(conf.id + " span");
        for(var i = 0; i < spans.length; i++){
            if(spans[i].className !== ("success")){
                spans[i].className = 'none';                
            }
        }
    }
    
    function tdClick(){
        var n = this.innerHTML;
        var span = this.childNodes[0];

        if(span.className === 'success' || span.className === 'select' || p.gameOver || !p.started) return;
        
        if(p.clicked.length === 0){
            p.clicked[0] = span;
            span.className = 'select';
        } else if(p.clicked.length === 1){
            p.clicked[1] = span;
            span.className = 'select';
            
            // Correctly
            if(p.clicked[0].innerHTML === p.clicked[1].innerHTML){
                p.clicked[0].className = 'success';
                p.clicked[1].className = 'success';
                
                p.count += 2;
                
                if(p.streak){
                    p.points += p.pPerPair * p.streak * 2;
                    comments.innerHTML = '¡Racha ' + (p.streak+1) + 'X! Ganas ' + (p.pPerPair*p.streak*2) + ' puntos.';
                }else{
                    p.streak = 1;
                    p.points += p.pPerPair;
                    comments.innerHTML = 'Ganas ' + p.pPerPair + ' puntos.';
                }

                cpoints.innerHTML = '<p>' + p.points + '</p>';


            } else{ // Fails
                p.started = false;
                setTimeout(function(){
                    p.started = true;
                    cleansTds();
                }, 1000);
                p.streak = 0;

                if(p.points > p.pPerFault){
                    p.points = p.points - p.pPerFault;
                }

                cpoints.innerHTML = '<p>' + p.points + '</p>';
                comments.innerHTML = '¡Has fallado! Pierdes ' + p.pPerFault + ' puntos :( ';
            }
        }
        
        if(p.clicked.length === 2) {
            p.clicked = [];
        }
        
        if(p.count === p.limit){
            gameOver();
        }
    }
    
    function shuffle(data) {
        var array_new = [],
            array_indexs = [];
        
        for(var i = 0; i < data.length; i++) 
            array_indexs.push(i);

        while(array_indexs.length > 0){
            var index_for_array_indexs = Math.floor((Math.random() * (array_indexs.length)) + 0),
                index = array_indexs[index_for_array_indexs];
            
            array_indexs.splice(index_for_array_indexs, 1);
            array_new.push(data[index]);
        }
        
        return array_new;
    }

    function goBack(){
        $("#jugar").hide();
        $("#config").show("slow");

        p.started = false;
        p.timeForPlay = 0;

        // Delete all my children (nodes)
        while (c.firstChild) {
            c.removeChild(c.firstChild);
        }
    }
}