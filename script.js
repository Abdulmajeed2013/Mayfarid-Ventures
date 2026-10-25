const products = [
    {
        name: "Hot-Melt Glue",
        category: "Accessories",
        description: "High-performance adhesive for packaging and finishing work.",
        image: "Images/Accessories/HotGlue.jpeg"
    },
    {
        name: "Bopp Gloss Film",
        category: "Laminating Films",
        description: "Clear glossy finish for durable print protection and visual appeal.",
        image: "Images/LaminatingFilm/BoppGloss.jpg"
    },
    {
        name: "Bopp Thermal Film",
        category: "Laminating Films",
        description: "Excellent heat-activated coverage for everyday lamination jobs.",
        image: "Images/LaminatingFilm/BoppThermal.jpg"
    },
    {
        name: "Gloss Film",
        category: "Specialty Films",
        description: "Smooth, bright finish for presentation and product packaging needs.",
        image: "Images/LaminatingFilm/GlossFilm.jpeg"
    },
    {
        name: "Holographic Film",
        category: "Specialty Films",
        description: "Eye-catching metallic finish designed for premium promotional work.",
        image: "Images/LaminatingFilm/Holographic.jpg"
    },
    {
        name: "Punching Machine",
        category: "Manufacturing Products",
        description: "Reliable punching and binding equipment for efficient production.",
        image: "Images/Machines/punchingMachine.jpg"
    }
];

const productGrid = document.getElementById("productGrid");
const productModal = document.getElementById("productModal");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");

function openProductModal(product) {
    if (!productModal || !modalImage || !modalCategory || !modalTitle || !modalDescription) {
        return;
    }

    modalImage.src = product.image;
    modalImage.alt = product.name;
    modalCategory.textContent = product.category;
    modalTitle.textContent = product.name;
    modalDescription.textContent = product.description + " Ideal for businesses looking for dependable output, strong finish quality, and consistent performance.";
    productModal.classList.add("is-open");
    productModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
}

function closeProductModal() {
    if (!productModal) {
        return;
    }

    productModal.classList.remove("is-open");
    productModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
}

if (productGrid) {
    productGrid.innerHTML = products
        .map(
            (product, index) => `
                <article class="product-card" data-index="${index}" tabindex="0" aria-label="View details for ${product.name}">
                    <img src="${product.image}" alt="${product.name}" class="product-card-image" />
                    <div class="product-card-content">
                        <span class="product-tag">${product.category}</span>
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <div class="product-card-actions">
                            <a href="#Contact" class="product-link">Request Quote</a>
                            <button type="button" class="product-view-btn">Quick View</button>
                        </div>
                    </div>
                </article>
            `
        )
        .join("");

    productGrid.addEventListener("click", (event) => {
        const card = event.target.closest(".product-card");
        const viewButton = event.target.closest(".product-view-btn");
        const quoteLink = event.target.closest(".product-link");

        if (quoteLink) {
            return;
        }

        if (viewButton && card) {
            openProductModal(products[Number(card.dataset.index)]);
            return;
        }

        if (card) {
            openProductModal(products[Number(card.dataset.index)]);
        }
    });

    productGrid.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }

        const card = event.target.closest(".product-card");
        if (card) {
            event.preventDefault();
            openProductModal(products[Number(card.dataset.index)]);
        }
    });
}

const modalCloseButtons = document.querySelectorAll("[data-close='true'], .modal-close, .modal-dismiss");
modalCloseButtons.forEach((button) => {
    button.addEventListener("click", closeProductModal);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && productModal && productModal.classList.contains("is-open")) {
        closeProductModal();
    }
});

const quoteForm = document.getElementById("quoteForm");
const formStatus = document.getElementById("formStatus");

if (quoteForm) {
    quoteForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(quoteForm);
        const fullName = formData.get("fullName");
        const businessName = formData.get("businessName");
        const email = formData.get("email");
        const phone = formData.get("phone");
        const product = formData.get("product");
        const details = formData.get("details");

        const subject = `Quote Request - ${product || "General Enquiry"}`;
        const body = [
            `Full name: ${fullName}`,
            `Business name: ${businessName}`,
            `Email: ${email}`,
            `Phone: ${phone}`,
            `Product interest: ${product}`,
            "",
            "Project details:",
            details
        ].join("\n");

        const mailtoLink = `mailto:sales@mayfaridventures.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        if (formStatus) {
            formStatus.textContent = "Opening your email app with the quote request…";
            formStatus.classList.add("is-visible");
        }

        window.location.href = mailtoLink;
        quoteForm.reset();
    });
}