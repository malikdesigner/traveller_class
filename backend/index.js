import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import cors from 'cors';


const app = express();
const port = 3304;

app.use(bodyParser.json());
// Increase the limit for URL-encoded payloads
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    // password: "QWERT!@#$%",
    password:"",
    database: "travel_appdb"
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1); // Exit the process on connection error
    } else {
        console.log('Connected to MySQL');
    }
});
app.use(cors({
    origin: ["http://192.168.100.123:3300"],
    methods: ["POST", "GET"],
    credentials: true
}))
app.post('/addUser', async (req, res) => {
    try {
        console.log("REQUEST");
        console.log(req.body);

        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            phoneCode,
            password,
        } = req.body;

        const fullnumber = phoneCode + phoneNumber;
        const currentDate = new Date().toISOString(); // Get current date in ISO format

        const sql = `INSERT INTO tbl_user (firstname, lastname, email, phone_number, password, date_added) 
                    VALUES (?, ?, ?, ?, ?, ?)`;

        const result = await query(sql, [firstName, lastName, email, fullnumber, password, currentDate]);

        console.log('Record inserted successfully');
        res.status(200).json({ ok: true, message: 'Record inserted successfully' });
    } catch (error) {
        console.error('Error inserting record:', error);
        res.status(500).json({ ok: false, message: 'Internal Server Error' });
    }
});
app.post('/addTravel', async (req, res) => {
    try {
        console.log("REQUEST");
        console.log(req.body);

        const {
            travellingTo,
            travellingFrom,
            seat,
            car,
            date,
            userId
        } = req.body;

        // First, retrieve user details from tbl_user
        const userQuery = 'SELECT firstname, lastname, email, phone_number FROM tbl_user WHERE id = ?';
        const userResult = await query(userQuery, [userId]);

        if (userResult.length === 0) {
            return res.status(404).json({ ok: false, message: 'User not found' });
        }
        // Destructure user details
        const { firstname, lastname, email, phone_number } = userResult[0];

        // Then, insert into tbl_travel
        const travelQuery = `
        INSERT INTO tbl_travel (first_name, last_name, email, phone_number, travelling_to, travelling_from, seats, car_type, date_added) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const travelResult = await query(travelQuery, [firstname, lastname, email, phone_number, travellingTo, travellingFrom, seat, car, date]);

        console.log('Record inserted successfully');
        res.status(200).json({ ok: true, message: 'Record inserted successfully' });
    } catch (error) {
        console.error('Error inserting record:', error);
        res.status(500).json({ ok: false, message: 'Internal Server Error' });
    }
});
app.post('/bookTravel', async (req, res) => {
    try {
        const { itemId, userId } = req.body;
        console.log(itemId);
        // Fetch the travel details
        const travelQuery = 'SELECT * FROM tbl_travel WHERE id = ?';
        const travelResult = await query(travelQuery, [itemId]);

        if (travelResult.length === 0) {
            return res.status(404).json({ ok: false, message: 'Travel not found' });
        }

        const { seats } = travelResult[0];

        if (seats <= 0) {
            return res.status(400).json({ ok: false, message: 'No available seats' });
        }

        // Update the tbl_travel table by decrementing the seat value
        const updateQuery = 'UPDATE tbl_travel SET seats = seats - 1 WHERE id = ?';
        await query(updateQuery, [itemId]);

        // Implement your logic for booking, such as saving the booking details in another table

        res.status(200).json({ ok: true, message: 'Booking successful' });
    } catch (error) {
        console.error('Error booking travel:', error);
        res.status(500).json({ ok: false, message: 'Internal Server Error' });
    }
});

app.get('/getTravelData', async (req, res) => {
    try {
        // Assuming you have a query function for executing SQL queries
        const travelDataQuery = 'SELECT * FROM tbl_travel WHERE seats > 0';
        const travelData = await query(travelDataQuery);

        // Send the fetched travel data as a response
        res.status(200).json({ ok: true, travelData });
    } catch (error) {
        console.error('Error fetching travel data:', error);
        res.status(500).json({ ok: false, message: 'Internal Server Error' });
    }
});
app.get('/getUser/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const userQuery = 'SELECT * FROM tbl_user WHERE id = ?';
        const userData = await query(userQuery, [userId]);

        if (userData.length === 0) {
            return res.status(404).json({ ok: false, message: 'User not found' });
        }

        res.status(200).json({ ok: true, userData: userData[0] });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ ok: false, message: 'Internal Server Error' });
    }
});
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Perform a query to check if the email and password match a user in the database
    const query = 'SELECT * FROM tbl_user WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            if (results.length > 0) {
                // Valid login credentials
                console.log(results[0].id)
                res.json({ message: 'Login successful', user: results[0].id });
            } else {
                // Invalid login credentials
                res.status(401).json({ message: 'Invalid email or password' });
            }
        }
    });
});

function query(sql, params) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});