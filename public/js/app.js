let socket = io();
let nick = "undefined";

$("#createRoom").on("click", function (event) {
    event.preventDefault();
    $("#errorPlaceHolder").addClass("invisible");

    // Errors check: blank or too long roomname
    if ($("#roomName").val().length == 0 || $("#roomName").val().length > 15) {
        $("#errorPlaceHolder").text("Un nom de moins de 15 caractères est requis pour créer une room.");
        $("#errorPlaceHolder").removeClass("invisible");
        return;
    }

    // Errors check: blank or too long nickname
    if ($("#nicknameCreate").val().length == 0 || $("#nicknameCreate").val().length > 15) {
        $("#errorPlaceHolder").text("Un pseudo de moins de 15 caractères est requis pour créer une room.");
        $("#errorPlaceHolder").removeClass("invisible");
        return;
    }
    
    socket.emit('createRoom', {name:$("#roomName").val(), host:$("#nicknameCreate").val()});
    $("#roomName").val("");
    $("#nicknameCreate").val("");
});

/* JS Functions */

availableRooms = Array();

socket.on('updatedRooms', (rooms) => {
    availableRooms = rooms;
    renderRooms();
});

function renderRooms()  {
    $('#rooms-container-row').empty();
    if (availableRooms == 0) {
        $('#rooms-container-row').html(`
            <p class="text-muted fs-5 text-center pt-3">Aucune room active pour le moment.</p>
        `);
        return;
    }
    
    availableRooms.forEach(room => {
        $('#rooms-container-row').append(`
            <div id='room-${room.id}' class='room-card col-md-4'>
                <div class='card p-3'>
                    <div class='d-flex flex-row mb-3'>
                        <div class='d-flex flex-column ml-2'>
                            <span id="room-${room.id}-name" class='fw-bold fs-4'>NAME PLACEHOLDER<a id="#room-${room.id}-id" class="fw-normal text-muted">ID PLACEHOLDER</a></span>
                            <span id="room-${room.id}-host" class='text-black-50'></span>
                        </div>
                    </div>
                    <div class='d-flex justify-content-between mt-3'>
                        <span>${room.players.length} joueur(s)</span>
                        <span class='text-primary'>Rejoindre&nbsp;<i class='fa fa-angle-right'></i></span>
                    </div>
                </div>
            </div>
        `);

        // Ajouter les entrées utilisateurs XSS-safe
        $(`#room-${room.id}-name`).text(`Rejoindre ${room.name}`);
        $(`#room-${room.id}-id`).text(`#${room.id}`);
        $(`#room-${room.id}-host`).text(room.host);
    });

    // Ajout des évènements au clic sur une room
    availableRooms.forEach(room => {
        $(`#room-${room.id}`).on("click", function (event) {
            let roomId = event.currentTarget.id.split('-')[1];
            
            // ToDo: arranger la façon de récupérer les infos de la room
            let activeRoom = null;
            for (let room of availableRooms) {
                if (room.id == roomId) {
                    activeRoom = room;
                    break;
                }
            }
            

            $('#joinRoomPopup').modal('show');
            $("#JoinRoomError").addClass("invisible");
            // $('#joinRoomPopupLabel').html(`${activeRoom.name} <a class="fw-normal text-muted">#${roomId}</a>`) // Not XSS Safe
            $('#joinRoomPopupLabel').text(`Rejoindre ${activeRoom.name}`)

            $('#confirmJoinRoom').on("click", function (e) {
                e.preventDefault();

                // Check si l'utilisateur a entré un pseudo
                if ($("#joinRoomNick").val().length == 0 || $("#joinRoomNick").val().length > 15) {
                    $("#JoinRoomError").text("Un pseudo de moins de 15 caractères est requis pour rejoindre une room.");
                    $("#JoinRoomError").removeClass("invisible");
                    return;
                }

                // Check si le pseudo n'est pas déjà dans la room
                if (activeRoom.players.includes($("#joinRoomNick").val())) {
                    $("#JoinRoomError").text("Ce pseudo est déjà utilisé dans la room.");
                    $("#JoinRoomError").removeClass("invisible");
                    return;
                }
                
                $('#joinRoomPopup').modal('hide');
                socket.emit('joinRoom', {nick:$('#joinRoomNick').val(), roomId:roomId});
                $("#joinRoomNick").val("");
                // ToDo: Rediriger vers la room avec affichage des joueurs et attente que l'host lance la game
            });
        });
    });
}

renderRooms();

