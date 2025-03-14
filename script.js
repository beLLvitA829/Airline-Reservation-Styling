console.log("✅ JavaScript file loaded successfully!");

// ✅ Fetch all flights from backend API
async function getAllFlights() {
    try {
        const response = await fetch('https://airline-reservation-backend.onrender.com/api/flights');
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch flights. Status: ${response.status} - ${errorText}`);
        }
        
        const flights = await response.json();
        console.log("✅ Flights fetched successfully:", flights);
        
        return flights;
    } catch (error) {
        console.error("❌ Error fetching flights:", error);
        alert("⚠️ Unable to fetch flight data. Please check the API connection.");
        return [];
    }
}

// ✅ Extract date from departure_time (ISO format)
const extractDate = (dateTimeString) => {
    return new Date(dateTimeString).toISOString().split("T")[0]; // Extract YYYY-MM-DD
};

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ JavaScript Loaded");

    // ✅ Redirect to Login Page
    const loginButton = document.getElementById("login-btn");
    if (loginButton) {
        loginButton.addEventListener("click", function () {
            window.location.href = "login.html"; // ✅ Redirect to Login
        });
    }

    // ✅ Redirect to Sign-Up Page
    const signupPageButton = document.getElementById("signup-btn");
    if (signupPageButton) {
        signupPageButton.addEventListener("click", function () {
            window.location.href = "signup.html"; // ✅ Redirect to Sign-Up
        });
    }
    // ✅ Handle "Click here to login" Button on Sign-Up Page
    const loginPageButton = document.getElementById("login-page-btn");
    if (loginPageButton) {
        loginPageButton.addEventListener("click", function () {
            window.location.href = "login.html"; // ✅ Redirect to Login Page
        });
    }
    // ✅ Handle "Create Account" Button in Login Page
    const createAccountButton = document.getElementById("create-account-btn");
    if (createAccountButton) {
        createAccountButton.addEventListener("click", function () {
            window.location.href = "signup.html"; // ✅ Redirect to Sign-Up Page
        });
    }

    // ✅ Handle "Already have an account?" Button in Sign-Up Page
    const alreadyAccountButton = document.getElementById("already-account-btn");
    if (alreadyAccountButton) {
        alreadyAccountButton.addEventListener("click", function () {
            window.location.href = "login.html"; // ✅ Redirect to Login Page
        });
    }

    // ✅ Handle Sign-Up Form Submission
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const firstName = document.getElementById("first-name").value.trim();
            const lastName = document.getElementById("last-name").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!firstName || !lastName || !phone || !email || !password) {
                alert("❌ All fields are required.");
                return;
            }

            try {
                const response = await fetch("https://airline-reservation-backend.onrender.com/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        first_name: firstName,
                        last_name: lastName,
                        phone: phone,
                        email: email,
                        password: password
                    })
                });

                const data = await response.json();
                console.log("📦 Register Response:", data);

                if (response.ok) {
                    alert("✅ Registration successful! Redirecting to login...");
                    window.location.href = "login.html"; // ✅ Redirect to login
                } else {
                    alert(`❌ Error: ${data.message || "Registration failed."}`);
                }
            } catch (error) {
                alert("❌ Registration failed. Check your internet connection.");
                console.error("❌ Registration error:", error);
            }
        });
    }

    // ✅ Password Visibility Toggle Function
    function togglePassword(event) {
        const passwordField = event.target.previousElementSibling;
        const toggleIcon = event.target;

        if (passwordField.type === "password") {
            passwordField.type = "text";
            toggleIcon.classList.remove("fa-eye");
            toggleIcon.classList.add("fa-eye-slash"); // Show eye with slash
        } else {
            passwordField.type = "password";
            toggleIcon.classList.remove("fa-eye-slash");
            toggleIcon.classList.add("fa-eye"); // Show open eye
        }
    }

    // ✅ Attach toggle function to all password toggle icons (Works for both login & sign-up)
    document.querySelectorAll(".toggle-password").forEach(icon => {
        icon.addEventListener("click", togglePassword);
    });


    // ✅ Handle Login Form Submission
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!email || !password) {
                alert("❌ Both email and password are required.");
                return;
            }

            try {
                const response = await fetch("https://airline-reservation-backend.onrender.com/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                console.log(data.token);

                if (response.ok) {
                    localStorage.setItem("token", data.token);
                    alert("✅ Login successful! Redirecting to dashboard...");
                    window.location.href = "dashboard.html"; // ✅ Redirect to dashboard
                } else {
                    console.error("❌ API Error:", data);
                    alert(`❌ Error: ${data.message || "Invalid credentials."}`);
                }
            } catch (error) {
                alert("❌ Login failed. Check your internet connection.");
                console.error("❌ Login error:", error);
            }
        });
    }

    // ✅ Fetch Customer Data for Dashboard
    async function fetchCustomerInfo() {
        const token = localStorage.getItem("token");
        console.log("🔑 Token:", token);
        if (!token) {
            alert("⚠️ Please log in first.");
            window.location.href = "login.html"; // ✅ Redirect if not logged in
            return;            
        }

        try {
            const response = await fetch("https://airline-reservation-backend.onrender.com/api/customers/me", {
                method: "GET",
                headers: {"Content-Type": "application/json", "Authorization": `${token}` }
                });

            const customer = await response.json();
            console.log("📦 Customer Data:", customer);
            if (response.ok) {
                document.getElementById("customer-info").innerHTML = `
                    <h2>Welcome, ${customer.first_name} ${customer.last_name}!</h2>
                    <p><strong>Email:</strong> ${customer.email}</p>
                    <p><strong>Phone:</strong> ${customer.phone}</p>
                `;
            } else {
                alert("❌ Unable to fetch customer info.");
                console.error("❌ API Error:", customer);
            }
        } catch (error) {
            alert("❌ Error loading dashboard.");
            console.error("❌ Dashboard error:", error);
        }
    }

    // ✅ Fetch user data only when dashboard.html is loaded
    if (window.location.pathname.includes("dashboard.html")) {
        fetchCustomerInfo();
    }

    // ✅ Handle Logout (Remove JWT Token & Redirect to Login)
    const logoutButton = document.getElementById("logout-btn");
    if (logoutButton) {
        logoutButton.addEventListener("click", async function () {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("⚠️ You are not logged in.");
                    return;
                }

                await fetch("https://airline-reservation-backend.onrender.com/api/auth/logout", {
                    method: "POST",
                    headers: { "Authorization": `${token}` }
                });

                // ✅ Remove token and redirect to login
                localStorage.removeItem("token");
                alert("🔓 Logout successful. Redirecting to login...");
                window.location.href = "login.html";
            } catch (error) {
                alert("❌ Logout failed.");
                console.error("❌ Logout error:", error);
            }
        });
    }
});

    const today = new Date().toISOString().split("T")[0];
    const departureDateInput = document.getElementById("date");
    const returnDateInput = document.getElementById("returnDate");
    const roundTripCheckbox = document.getElementById("roundTrip");
    const returnDateContainer = document.getElementById("returnDateContainer");

    // ✅ Set min date for departure and return dates
    departureDateInput.setAttribute("min", today);
    returnDateInput.setAttribute("min", today);
    
    // Initially disable return date selection and hide it
    returnDateContainer.style.display = "none";
    returnDateInput.disabled = true;

    // ✅ Clicking anywhere in date input opens the calendar
    departureDateInput.addEventListener("click", function () {
        this.showPicker ? this.showPicker() : this.focus();
    });

    returnDateInput.addEventListener("click", function () {
        this.showPicker ? this.showPicker() : this.focus();
    });

    // ✅ Ensure return date is always after the departure date
    departureDateInput.addEventListener("change", function () {
        returnDateInput.setAttribute("min", this.value);
    });

    // ✅ Enable/disable return date when round-trip is checked
    roundTripCheckbox.addEventListener("change", function () {
        if (this.checked) {
            returnDateContainer.style.display = "block"; // Show return date field
            returnDateInput.disabled = false; // Enable return date selection
        } else {
            returnDateContainer.style.display = "none"; // Hide return date field
            returnDateInput.value = ""; // Clear return date value
            returnDateInput.disabled = true; // Disable return date selection
        }
    });

    // ✅ Handle flight search
    document.getElementById("flightForm").addEventListener("submit", async function (event) {
        event.preventDefault();
        console.log("✅ Search button clicked!");

        const originInput = document.getElementById("origin").value.trim();
        const destinationInput = document.getElementById("destination").value.trim();
        const departureDate = departureDateInput.value;
        const returnDate = returnDateInput.value;
        const isRoundTrip = roundTripCheckbox.checked;

        const originCode = originInput ? originInput.toUpperCase() : null;
        const destinationCode = destinationInput ? destinationInput.toUpperCase() : null;

        try {
            document.getElementById("flightResults").innerHTML = `<p>⏳ Searching for flights...</p>`;

            const allFlights = await getAllFlights();
            console.log("📦 API Response:", allFlights);

            // ✅ Extract departure date correctly from API data
            const matchingFlights = allFlights.filter(flight => {
                const flightDateFormatted = extractDate(flight.departure_time);
                console.log(`🔎 Checking: ${flight.origin} → ${flight.destination} on ${flightDateFormatted}`);

                return (!originCode || flight.origin.toUpperCase() === originCode) &&
                       (!destinationCode || flight.destination.toUpperCase() === destinationCode) &&
                       (!departureDate || flightDateFormatted === departureDate);
            });

            let roundTripFlights = [];
            if (isRoundTrip && returnDate) {
                roundTripFlights = allFlights.filter(flight => {
                    const flightDateFormatted = extractDate(flight.departure_time);
                    return (!destinationCode || flight.origin.toUpperCase() === destinationCode) &&
                           (!originCode || flight.destination.toUpperCase() === originCode) &&
                           (!returnDate || flightDateFormatted === returnDate);
                });
            }

            console.log("✈️ Matching Departure Flights:", matchingFlights);
            console.log("🔄 Matching Return Flights:", roundTripFlights);

            displayResults(matchingFlights, roundTripFlights, originInput, destinationInput, departureDate, returnDate, isRoundTrip);
        } catch (error) {
            console.error("❌ Error displaying flights:", error);
        }
    });

// ✅ Function to display flights in HTML
function displayResults(departureFlights, returnFlights, origin, destination, departureDate, returnDate, isRoundTrip) {
    let resultsHTML = `<h2>Flight Search Results</h2>`;

    if (departureFlights.length === 0 && (!isRoundTrip || returnFlights.length === 0)) {
        resultsHTML += `<p>⚠️ No flights found matching your criteria.</p>`;
    } else {
        if (departureFlights.length > 0) {
            resultsHTML += `<h3>Departure Flights</h3>`;
            departureFlights.forEach(flight => {
                resultsHTML += generateFlightHTML(flight);
            });
        }

        if (isRoundTrip && returnFlights.length > 0) {
            resultsHTML += `<h3>Return Flights</h3>`;
            returnFlights.forEach(flight => {
                resultsHTML += generateFlightHTML(flight);
            });
        }
    }

    document.getElementById("flightResults").innerHTML = resultsHTML;
}

// ✅ Helper function to generate flight HTML with "Reserve" button
function generateFlightHTML(flight) {
    return `
        <div class="flight-card">
            <p><strong>Flight Number:</strong> ${flight.flight_number}</p>
            <p><strong>Airline:</strong> ${flight.airline}</p>
            <p><strong>Departure:</strong> ${new Date(flight.departure_time).toLocaleString()}</p>
            <p><strong>Departure Airport:</strong> ${flight.origin}</p>
            <p><strong>Destination Airport:</strong> ${flight.destination}</p>
            <p><strong>Arrival Time:</strong> ${flight.arrival_time}</p>
            <p><strong>Duration:</strong> ${flight.duration} hours</p>
            <p><strong>Seats Available:</strong> <span class="${flight.seat_availability <= 5 ? 'flashing-red' : ''}">${flight.seat_availability}</span></p>
            <p><strong>Cost:</strong> $${flight.price}</p>
            <button class="btn" data-flight-number="${flight.flight_number}">Reserve</button>
        </div>
    `;
}

// ✅ Event listener to handle reservations
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("reserve-btn")) {
        const flightNumber = event.target.getAttribute("data-flight-number");

        // ✅ Check if user is logged in (assuming login status is stored in localStorage)
        const isLoggedIn = localStorage.getItem("userLoggedIn");

        if (!isLoggedIn) {
            alert("🔐 You must be logged in to reserve a flight.");
            window.location.href = "login.html"; // Redirect to login page
        } else {
            alert(`🎟️ Flight ${flightNumber} reserved successfully!`);
            console.log(`✅ Flight ${flightNumber} reservation processed.`);
        }
    }
});
