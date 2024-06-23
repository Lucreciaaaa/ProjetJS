import * as R from 'ramda';


// initialHotel pour représenter 3 chambres d'hôtel avec un identifiant et des dates de réservation (tableau de 3 objets)
const initialHotel = {
  rooms: [
    { id: 1, name: 'Room 101', reservedDates: [] },
    { id: 2, name: 'Room 102', reservedDates: [] },
    { id: 3, name: 'Room 103', reservedDates: [] },
  ]
};


// fonction pour réserver une chambre
const reserveRoom = (hotel, roomId, startDate, endDate) => {
  // Update reserved dates
  const updateReservedDates = R.pipe(
    R.find(R.propEq('id', roomId)),
    R.over(R.lensProp('reservedDates'), R.append({ startDate, endDate }))
  );


  const updatedHotel = R.over(R.lensProp('rooms'), R.map(room => room.id === roomId ? updateReservedDates(room) : room), hotel);


  const reservedRoom = R.find(R.propEq('id', roomId), updatedHotel.rooms);


  return { hotel: updatedHotel, reservedRoom };
};


// fonction pour vérifier si une chambre est dispo
const isRoomAvailable = (room, checkStartDate, checkEndDate) => {
  if (!room) return false; // Check if room exists before accessing properties

  const isDateOverlap = ({ startDate, endDate }) =>
    !(checkEndDate < startDate || checkStartDate > endDate);

  return !R.any(isDateOverlap, room.reservedDates);
};



const getAvailableRooms = (hotel, checkStartDate, checkEndDate) => {
  const availableRooms = room => room && isRoomAvailable(room, checkStartDate, checkEndDate); // Check if room exists before calling isRoomAvailable
  return R.filter(availableRooms, hotel.rooms);
};

let hotel = initialHotel;

console.log("Chambres disponibles au début :", getAvailableRooms(hotel, '2024-04-01', '2024-04-05'));

// réserver une chambre
const { hotel: updatedHotel, reservedRoom } = reserveRoom(hotel, 1, '2024-01-01', '2024-01-10');
console.log("Chambre réservée :", reservedRoom); // Displays reserved room
console.log("Chambres disponibles après réservation :", getAvailableRooms(updatedHotel, '2024-01-01', '2024-01-10'));


const available = isRoomAvailable(reservedRoom, '2024-01-01', '2024-01-10');
console.log("La chambre 101 est-elle disponible du 1 au 10 janvier 2024 ?", available ? "Oui" : "Non");
