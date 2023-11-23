// Import required modules
const express = require('express');
const bodyParser = require('body-parser');

// Create an Express app
const app = express();

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());


// Define data structure to store rooms
const rooms = [
    {
      roomId: 1,
      roomName: 'Room A',
      seats: 50,
      amenities: ['Projector', 'Refrigerator',' Air Conditioner'],
      pricePerHour: 100,
    },
    {
      roomId: 2,
      roomName: 'Room B',
      seats: 30,
      amenities: ['TV', 'Conference Phone'],
      pricePerHour: 80,
    },
    {
      roomId: 3,
      roomName: 'Room C',
      seats: 20,
      amenities: ['Whiteboard', 'Coffee Machine'],
      pricePerHour: 60,
    },
    {
      roomId: 4,
      roomName: 'Room D',
      seats: 40,
      amenities: ['Projector', 'Coffee Machine'],
      pricePerHour: 90,
    },
    {
      roomId: 5,
      roomName: 'Room E',
      seats: 35,
      amenities: ['Projector', 'Printer'],
      pricePerHour: 75,
    },
    {
      roomId: 6,
      roomName: 'Room F',
      seats: 25,
      amenities: ['Whiteboard', 'Microphone'],
      pricePerHour: 70,
    },
    // Add more rooms if needed
  ];
  
  
  
// Define data structure to store bookings
const bookings = [
    {
      bookingId: 101,
      customerName: 'Vijay',
      
      date: '2023-11-22',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      roomId: 1,
    },
    {
      bookingId: 102,
      customerName: 'Ajith',
      date: '2023-11-23',
      startTime: '02:00 PM',
      endTime: '04:00 PM',
      roomId: 2,
    },
    {
      bookingId: 103,
      customerName: 'Surya',
      date: '2023-11-24',
      startTime: '09:00 AM',
      endTime: '11:00 AM',
      roomId: 3,
    },
    {
      bookingId: 104,
      customerName: 'Rajini',
      date: '2023-11-25',
      startTime: '01:00 PM',
      endTime: '03:00 PM',
      roomId: 4,
    },
    {
      bookingId: 105,
      customerName: 'Kamal',
      date: '2023-11-26',
      startTime: '03:30 PM',
      endTime: '05:30 PM',
      roomId: 5,
    },
    {
      bookingId: 106,
      customerName: 'Vikram',
      date: '2023-11-27',
      startTime: '11:00 AM',
      endTime: '01:00 PM',
      roomId: 6,
    },
    // Add more bookings if needed
  ];

// Define endpoint to create a room
app.post('/create-room', (req, res) => {
  // Extract data from the request body
  const { roomName, seats, amenities, pricePerHour } = req.body;

  // Create a new room object
  const newRoom = {
    roomName,
    seats,
    amenities,
    pricePerHour,
  };

  // Add the room to the rooms array
  rooms.push(newRoom);

  // Return success response
  res.json({ message: 'Room created successfully', room: newRoom });
});

// Define endpoint to book a room
app.post('/book-room', (req, res) => {
  // Extract data from the request body
  const { customerName, date, startTime, endTime, roomId } = req.body;

  // Check if the room is already booked for the given date and time
  const isRoomBooked = bookings.some(
    (booking) =>
      booking.roomId === roomId &&
      booking.date === date &&
      ((startTime >= booking.startTime && startTime < booking.endTime) ||
        (endTime > booking.startTime && endTime <= booking.endTime) ||
        (startTime <= booking.startTime && endTime >= booking.endTime))
  );

  if (isRoomBooked) {
    // Return error response if the room is already booked
    res.status(400).json({ message: 'Room already booked for the given date and time' });
  } else {
    // Create a new booking object
    const newBooking = {
      customerName,
      date,
      startTime,
      endTime,
      roomId,
    };

    // Add the booking to the bookings array
    bookings.push(newBooking);

    // Return success response
    res.json({ message: 'Room booked successfully', booking: newBooking });
  }
});
//Define welcome Hotel
app.get('/',(req,res) => {
   
    res.send('<h1>WELCOME TO MY HOTEL</h1>');
})

  // Define endpoint to list all rooms with booked data
app.get('/list-rooms', (req, res) => {
    // Initialize an array to store rooms with booked data
    const roomsWithBookings = [];

    // Iterate through each room
    rooms.forEach((room) => {
      // Find bookings for the current room
      const roomBookings = bookings.filter((booking) => booking.roomId === room.roomId);
  
      // If the room has bookings, include booking data in the response
      if (roomBookings.length > 0) {
        const roomWithBookings = {
          roomName: room.roomName,
          bookedStatus: true,
          bookings: roomBookings,
        };
  
        roomsWithBookings.push(roomWithBookings);
      } else {
        // If the room has no bookings, include basic room data in the response
        const roomWithoutBookings = {
          roomName: room.roomName,
          bookedStatus: false,
        };
  
        roomsWithBookings.push(roomWithoutBookings);
      }
    });
  
    // Return the list of rooms with booked data as a response
    res.json({ rooms: roomsWithBookings });
  });
  

  


  // Define endpoint to list all customers with booked data
app.get('/list-customers', (req, res) => {
    // Initialize an object to store customers with their bookings
    const customersWithBookings = {};
  
    // Iterate through each booking
    bookings.forEach((booking) => {
      // If the customer is not already in the object, add them
      if (!customersWithBookings[booking.customerName]) {
        customersWithBookings[booking.customerName] = {
          customerName: booking.customerName,
          bookings: [],
        };
      }
  
      // Add the booking to the customer's bookings array
      customersWithBookings[booking.customerName].bookings.push({
        roomName: getRoomNameById(booking.roomId), // Assuming there's a function to get room name by ID
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
      });
    });
  
    // Convert the object values to an array
    const customersWithBookingsArray = Object.values(customersWithBookings);
  
    // Return the list of customers with booked data as a response
    res.json({ customers: customersWithBookingsArray });
  });
  
  // Helper function to get room name by ID
  function getRoomNameById(roomId) {
    const room = rooms.find((room) => room.roomId === roomId);
    return room ? room.roomName : 'Room not found';
  }
  

  

  // Define endpoint to list booking details for a customer
app.get('/customer-booking-details/:customerName', (req, res) => {
    // Extract the customer name from the request parameters
    const customerName = req.params.customerName;
  
    // Filter bookings for the specified customer
    const customerBookings = bookings.filter((booking) => booking.customerName === customerName);
  
    // Return the list of booking details for the customer as a response
    res.json({ customerName, bookings: customerBookings });
  });
  

// Start the Express server on port 3000
const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
