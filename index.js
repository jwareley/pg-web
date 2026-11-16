(function () {
    "use strict";

    function validText(value) {
        return /^[^\r\n]{1,200}$/.test(value.trim());
    }

    function validMessage(value) {
        return /^[\s\S]{1,5000}$/.test(value.trim());
    }

    function setupContactForms() {
        document.querySelectorAll('form[data-action="infoEmail"]').forEach(function (form) {
            form.addEventListener("submit", async function (event) {
                event.preventDefault();

                var name = form.elements.name.value;
                var email = form.elements.email.value;
                var subject = form.elements.subject.value;
                var message = form.elements.message.value;
                var button = form.querySelector('button[type="submit"]');
                var originalText = button ? button.textContent : "Send Message";

                if (!validText(name) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !validText(subject) || !validMessage(message)) {
                    alert("Please check the form fields and try again.");
                    return;
                }

                var apiBaseUrl = getApiBaseUrl();
                if (!apiBaseUrl) {
                    alert("The contact service is currently unavailable.");
                    return;
                }

                if (button) {
                    button.disabled = true;
                    button.textContent = "Sending...";
                }

                try {
                    var response = await fetch(apiBaseUrl.replace(/\/$/, "") + "/support/query", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            support: {
                                "customer.name": name.trim(),
                                "customer.email.address": email.trim(),
                                subject: subject.trim(),
                                query: message.trim()
                            }
                        })
                    });

                    if (!response.ok) throw new Error("Contact service returned " + response.status);
                    form.reset();
                    alert("Your message has been sent successfully. We will get back to you soon.");
                    if (button) button.textContent = "Message Sent!";
                } catch (error) {
                    console.error("Contact form submission failed:", error);
                    alert("We could not send your message. Please try again.");
                    if (button) button.textContent = "Try Again";
                } finally {
                    if (button) {
                        setTimeout(function () {
                            button.disabled = false;
                            button.textContent = originalText;
                        }, 3000);
                    }
                }
            });
        });
    }

    function setupConfiguredLinks() {
        var urls = window.APP_CONFIG && window.APP_CONFIG.urls ? window.APP_CONFIG.urls : {};
        document.querySelectorAll("[data-href]").forEach(function (element) {
            var key = element.getAttribute("data-href");
            if (urls[key]) element.href = urls[key];
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            setupConfiguredLinks();
            setupContactForms();
        }, { once: true });
    } else {
        setupConfiguredLinks();
        setupContactForms();
    }
})();
    function getApiBaseUrl() {
        return window.APP_CONFIG && window.APP_CONFIG.urls
            ? window.APP_CONFIG.urls.finApiBaseUrl
            : "";
    }

