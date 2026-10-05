/* =========================================================
   WORLD PULSE NEWS ENGINE
========================================================= */

const API_KEY = "YOUR_GNEWS_API_KEY";

const API_KEY =
    "YOUR_GNEWS_API_KEY";

const MAX_ARTICLES = 12;

const PLACEHOLDER_IMAGE =
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80";


/* =========================================================
   PAGE CATEGORY
========================================================= */

const pageCategory =
    document.body.dataset.category || "world";


/* =========================================================
   CATEGORY SETTINGS
========================================================= */

const categories = {

    world: {
        type: "top",
        category: "world",
        title: "World News"
    },

    technology: {
        type: "top",
        category: "technology",
        title: "Technology News"
    },

    business: {
        type: "top",
        category: "business",
        title: "Business News"
    },

    sports: {
        type: "top",
        category: "sports",
        title: "Sports News"
    },

    science: {
        type: "top",
        category: "science",
        title: "Science News"
    },

    health: {
        type: "top",
        category: "health",
        title: "Health News"
    },

    africa: {
        type: "search",
        query: "Africa",
        title: "Africa News"
    },

    ghana: {
        type: "search",
        query: "Ghana",
        title: "Ghana News"
    }

};


/* =========================================================
   FETCH NEWS
========================================================= */

async function fetchNews(category = "world") {

    if (API_KEY === "YOUR_GNEWS_API_KEY") {

        console.warn(
            "Please add your GNews API key."
        );

        return [];

    }


    const settings =
        categories[category] ||
        categories.world;


    let url;


    /* -----------------------------------------
       TOP HEADLINES
    ----------------------------------------- */

    if (settings.type === "top") {

        url =
            "https://gnews.io/api/v4/top-headlines" +
            `?category=${encodeURIComponent(settings.category)}` +
            "&lang=en" +
            `&max=${MAX_ARTICLES}` +
            `&apikey=${encodeURIComponent(API_KEY)}`;

    }


    /* -----------------------------------------
       SEARCH
    ----------------------------------------- */

    else {

        url =
            "https://gnews.io/api/v4/search" +
            `?q=${encodeURIComponent(settings.query)}` +
            "&lang=en" +
            `&sortby=publishedAt" +
            `&max=${MAX_ARTICLES}` +
            `&apikey=${encodeURIComponent(API_KEY)}`;

    }


    try {

        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                `Request failed: ${response.status}`
            );

        }


        const data =
            await response.json();


        if (!data.articles) {

            console.error(data);

            return [];

        }


        return data.articles;

    }

    catch (error) {

        console.error(
            "News loading error:",
            error
        );

        return [];

    }

}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "Unknown date";
    }


    const date =
        new Date(dateString);


    if (Number.isNaN(date.getTime())) {
        return "Unknown date";
    }


    return date.toLocaleString(
        "en-US",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );

}


/* =========================================================
   HTML SECURITY
========================================================= */

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   CREATE NEWS CARD
========================================================= */

function createNewsCard(article) {

    const card =
        document.createElement("article");


    card.className =
        "news-card";


    const image =
        article.image ||
        PLACEHOLDER_IMAGE;


    const title =
        article.title ||
        "Untitled story";


    const description =
        article.description ||
        "Read the latest developments in this story.";


    const source =
        article.source?.name ||
        "World Pulse";


    const published =
        formatDate(article.publishedAt);


    const articleURL =
        article.url ||
        "#";


    card.innerHTML = `

        <div class="card-image">

            <img
                src="${escapeHTML(image)}"
                alt="${escapeHTML(title)}"
                loading="lazy"
            >

            <span class="card-category">
                NEWS
            </span>

        </div>


        <div class="card-content">

            <h3>
                ${escapeHTML(title)}
            </h3>


            <p>
                ${escapeHTML(description)}
            </p>


            <div class="card-meta">

                <span>
                    ${escapeHTML(source)}
                </span>

                <span>
                    ${escapeHTML(published)}
                </span>

            </div>


            <a
                href="${escapeHTML(articleURL)}"
                target="_blank"
                rel="noopener noreferrer"
                class="read-story"
            >
                Read Full Story →
            </a>

        </div>

    `;


    return card;

}


/* =========================================================
   DISPLAY NEWS
========================================================= */

async function displayNews() {

    const grid =
        document.querySelector(".news-grid");


    if (!grid) {
        return;
    }


    grid.innerHTML = `

        <div class="loading">

            <div class="spinner"></div>

            <p>
                Loading latest news...
            </p>

        </div>

    `;


    const articles =
        await fetchNews(pageCategory);


    if (!articles.length) {

        grid.innerHTML = `

            <div class="news-error">

                <h3>
                    News could not be loaded
                </h3>

                <p>
                    Check your API key and internet connection.
                </p>

            </div>

        `;

        return;

    }


    grid.innerHTML = "";


    articles.forEach(article => {

        grid.appendChild(
            createNewsCard(article)
        );

    });

}


/* =========================================================
   BREAKING NEWS
========================================================= */

async function updateBreakingNews() {

    const ticker =
        document.querySelector(".ticker-text");


    if (!ticker) {
        return;
    }


    const articles =
        await fetchNews("world");


    if (!articles.length) {

        ticker.textContent =
            "World Pulse — Latest global news and developments.";

        return;

    }


    const headlines =
        articles
            .slice(0, 6)
            .map(article => article.title)
            .filter(Boolean);


    ticker.textContent =
        headlines.join("   •   ");

}


/* =========================================================
   PAGE TITLE
========================================================= */

function updatePageTitle() {

    const pageTitle =
        document.querySelector(".page-title");


    const category =
        categories[pageCategory];


    if (
        pageTitle &&
        category
    ) {

        pageTitle.textContent =
            category.title;

    }


    document.title =
        `${category?.title || "World News"} | World Pulse`;

}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        updatePageTitle();

        await displayNews();

        await updateBreakingNews();

    }
);