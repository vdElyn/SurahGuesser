let socket = io();
let nick = "Elyn";

$("#createRoom").on("click", function (event) {
    console.log("createRoomPressed");
    $("#roomNameError").addClass("invisible");

    if ($("#roomName").val().length == 0) {
        $("#roomNameError").removeClass("invisible");
        return;
    }

    console.log($("#roomName").val());
    socket.emit('createRoom', {name:$("#roomName").val(), host:nick});
});

/* JS Functions */

class Room {
    constructor(id, name, host, players) {
        this.id = id;
        this.name = name;
        this.host = host;
        this.players = players;
    }
}

availableRooms = Array();

socket.on('newRoom', (room) => {
    availableRooms.push(room);
    renderRooms();
});

function renderRooms()  {
    $('#rooms-container-row').empty();
    if (availableRooms == 0) {
        $('#rooms-container-row').html(`
            <p class="text-primary fs-3 text-center">Aucune room active pour le moment.</p>
        `);
        return;
    }
    
    availableRooms.forEach(room => {
        $('#rooms-container-row').append(`
            <div id='room-${room.id}' class='room-card col-md-4'>
                <div class='card p-3'>
                    <div class='d-flex flex-row mb-3'>
                        <div class='d-flex flex-column ml-2'>
                            <span class='fw-bold fs-4'>${room.name}</span>
                            <span class='text-black-50'>${room.host}</span>
                        </div>
                    </div>
                    <div class='d-flex justify-content-between mt-3'>
                        <span>${room.players} joueur(s)</span>
                        <span class='text-primary'>Rejoindre&nbsp;<i class='fa fa-angle-right'></i></span>
                    </div>
                </div>
            </div>
        `);
    });

    // Ajout des évènements au clic sur une room
    availableRooms.forEach(room => {
        $(`#room-${room.id}`).on("click", function (event) {
            console.log("Join room pressed");
            console.log(event.currentTarget.id);
            
            // ToDo: check si l'utilisateur a entré un pseudo
            socket.emit('joinRoom', {nick:nick, roomId:event.currentTarget.id});
            // ToDo: Rediriger vers la room avec affichage des joueurs et attente que l'host lance la game
        });
    });
}

renderRooms();

