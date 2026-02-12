document.addEventListener("DOMContentLoaded", () => {

    // Mobile Menu
    const menuIcon = document.getElementById("menu-icon");
    const navbar = document.querySelector(".navbar");

    menuIcon.addEventListener("click", () => {
        menuIcon.classList.toggle("bx-x");
        navbar.classList.toggle("active");
    });

    // Contact Form
    const form = document.getElementById("contact-form");

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("gmail").value;
        const subject = document.getElementById("subject").value;
        const message = document.getElementById("msg").value;

        const body = `Hey Hudson,

I'm ${name}.
Email: ${email}

${message}

Regards,
${name}`;

        window.location.href =
            `mailto:hudsonmathew2004@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });

    // Read more btn
    const readbtn = document.getElementById("read-more-btn");
    const moretxt = document.getElementById("more-text");

    readbtn.addEventListener("click", function(e){
        e.preventDefault();
        if (moretxt.style.display === "none"){
            moretxt.style.display = "block";
            readbtn.textContent = "Read less";
        } else {
            moretxt.style.display = "none";
            readbtn.textContent = "Read More";
        }
    });
    
    // Auto Close Navbar
    const navlink = document.querySelectorAll(".navbar a");

    navlink.forEach(link => {
        link.addEventListener("click", () => {
            navbar.classList.remove("active");
            menuIcon.classList.remove("bx-x");
        });
    });

});