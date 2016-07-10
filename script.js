
/*
    FUTURO Sistema de puntos (Aún no implementado) -> Hay que cambiar varias cosas
        * Cada emparejamiento = +100 puntos
        * Cada emparejamiento consecutivo = se dobla la cantidad de puntos de la jugada anterior
        * Emparejar todos = +1000 puntos
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
            points: 0,
            rounds: 0,
            count: 0,
            limit: (conf.col*conf.row),
            perSuccess: 1000,
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
    
    // Append dashboard to container
    var dashboard = d.createElement("div");
    dashboard.className = 'game-dashboard';
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
                dashboard.innerHTML = 'Tienes ' + (p.timeForPlay--) + ' segundos para intentar ganar la partida :) ..';                
            }
        }, 1000);
    }
    
    function gameOver(){
        p.gameOver = true;
        if(p.limit === p.count){
            dashboard.innerHTML = '¡Has ganado la partida! Lo hiciste con ' + p.points + ' puntos :)';
            $(".game-dashboard").css("background", "#60F06A");
        }else{
            dashboard.innerHTML = 'Perdiste, lo siento.. Lo hiciste con ' + p.points + ' puntos :(';
            $(".game-dashboard").css("background", "#F92D2D");
        }

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
                p.points += p.perSuccess;
                p.count += 2;
                
                comments.innerHTML = 'Ganas ' + p.perSuccess + ' puntos. Ahora tienes ' + p.points + ' puntos ...';
            } else{ // Fails
                p.started = false;
                setTimeout(function(){
                    p.started = true;
                    cleansTds();
                }, 1000);
                comments.innerHTML = '¡Has fallado!, inténtalo de nuevo ...';
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

        // Delete all my children (nodes)
        while (c.firstChild) {
            c.removeChild(c.firstChild);
        }
    }
}